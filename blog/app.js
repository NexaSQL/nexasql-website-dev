// --------------------
// NexaSQL Blog Config
// --------------------
const blogData = {
    company: {
        name: "NexaSQL",
        tagline: "Expert SQL Server solutions from ex-Microsoft engineers",
        description: "NexaSQL helps businesses scale with secure, fast, and reliable database management, optimization, and consulting services.",
        domain: "blog.nexasql.com",
        services: [
            "SQL Server Performance Tuning",
            "Database Administration",
            "Cloud Migration",
            "Query Optimization",
            "24/7 Support"
        ]
    },
    blogPosts: [],
    categories: [
        { name: "SQL Server Performance", description: "Performance tuning, query optimization, and system monitoring", count: 25 },
        { name: "Database Administration", description: "DBA best practices, maintenance, and troubleshooting", count: 18 },
        { name: "Cloud Migration", description: "Azure SQL, AWS RDS, and hybrid cloud strategies", count: 12 },
        { name: "Security & Compliance", description: "Database security, encryption, and compliance frameworks", count: 8 }
    ]
};

// --------------------
// Utility Functions
// --------------------
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function parseHTMLPost(htmlContent, filename) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const getMetaContent = (name) => {
        const meta = doc.querySelector(`meta[name="post:${name}"]`);
        return meta ? meta.getAttribute('content') : '';
    };

    const slugFromFile = filename.replace('.html', '');
    const slug = getMetaContent('slug') || slugFromFile;

    const tagsString = getMetaContent('tags');
    const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : [];

    return {
        title: getMetaContent('title') || 'Untitled Post',
        slug,
        excerpt: getMetaContent('excerpt') || '',
        author: getMetaContent('author') || 'Unknown Author',
        date: getMetaContent('date') || new Date().toISOString().split('T')[0],
        readTime: getMetaContent('readTime') || '5 min read',
        category: getMetaContent('category') || 'General',
        tags: tags,
        featured: (getMetaContent('featured') || '').toLowerCase() === 'true',
        content: doc.body ? doc.body.innerHTML : ''
    };
}

// --------------------
// DOM Builders
// --------------------
function createPostCard(post, featured = false) {
    const postCard = document.createElement('article');
    postCard.className = `post-card ${featured ? 'post-card--featured' : ''}`;
    const postSlug = post.slug || createSlug(post.title);

    postCard.innerHTML = `
        <a href="post.html?slug=${postSlug}" class="post-card__image-link">
            <div class="post-card__image-placeholder"></div>
        </a>
        <div class="post-card__content">
            <h2><a href="post.html?slug=${postSlug}">${post.title}</a></h2>
            <p class="post-card__meta">${formatDate(post.date)} • ${post.readTime}</p>
            <p class="post-card__excerpt">${post.excerpt}</p>
            <p class="post-card__tags">${post.tags.map(tag => `<span>${tag}</span>`).join(' ')}</p>
        </div>
    `;
    return postCard;
}

function createCategoryCard(category) {
    const categoryCard = document.createElement('article');
    categoryCard.className = 'category-card';
    categoryCard.innerHTML = `
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <span>${category.count} articles</span>
    `;
    return categoryCard;
}

// --------------------
// Post Loading Logic
// --------------------
async function discoverPosts() {
    try {
        const response = await fetch('posts/index.json');
        if (response.ok) {
            const index = await response.json();
            return index.posts || [];
        }
    } catch (err) {
        console.warn('Error loading index.json', err);
    }
    return [];
}

async function loadPosts() {
    const postSlugs = await discoverPosts();
    const posts = [];

    for (const slug of postSlugs) {
        try {
            const response = await fetch(`posts/${slug}.html`);
            if (response.ok) {
                const htmlContent = await response.text();
                const post = parseHTMLPost(htmlContent, `${slug}.html`);
                posts.push(post);
            } else {
                console.warn(`Missing file: posts/${slug}.html`);
            }
        } catch (err) {
            console.error(`Error loading post ${slug}:`, err);
        }
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    blogData.blogPosts = posts;
    return posts;
}

async function loadSinglePost(slug) {
    try {
        const response = await fetch(`posts/${slug}.html`);
        if (response.ok) {
            const htmlContent = await response.text();
            return parseHTMLPost(htmlContent, `${slug}.html`);
        }
    } catch (err) {
        console.error(`Error loading single post: ${slug}`, err);
    }
    return null;
}

// --------------------
// Rendering Functions
// --------------------
function populateFeaturedPosts() {
    const container = document.getElementById('featuredPosts');
    if (!container) return;
    container.innerHTML = '';
    blogData.blogPosts.filter(p => p.featured).forEach(post => {
        container.appendChild(createPostCard(post, true));
    });
}

function populateRecentPosts() {
    const container = document.getElementById('recentPosts');
    if (!container) return;
    container.innerHTML = '';
    blogData.blogPosts.filter(p => !p.featured).forEach(post => {
        container.appendChild(createPostCard(post, false));
    });
}

function populateCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    container.innerHTML = '';
    blogData.categories.forEach(cat => {
        container.appendChild(createCategoryCard(cat));
    });
}

function showArticleNotFound() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('articleWrapper').style.display = 'none';
    document.getElementById('postError').style.display = 'block';
}

// --------------------
// Search
// --------------------
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (!searchInput || !searchBtn) return;

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const results = query === ''
            ? blogData.blogPosts
            : blogData.blogPosts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query)) ||
                post.category.toLowerCase().includes(query)
            );
        displaySearchResults(results, query);
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });
}

function displaySearchResults(posts, query) {
    const featuredContainer = document.getElementById('featuredPosts');
    const recentContainer = document.getElementById('recentPosts');
    if (!featuredContainer || !recentContainer) return;
    featuredContainer.innerHTML = '';
    recentContainer.innerHTML = '';
    if (posts.length === 0) {
        featuredContainer.innerHTML = `<p>No articles found for "${query}".</p>`;
        return;
    }
    posts.forEach(p => {
        recentContainer.appendChild(createPostCard(p, false));
    });
}

// --------------------
// Page Initializer
// --------------------
document.addEventListener('DOMContentLoaded', async () => {
    const isPostPage = window.location.pathname.endsWith('post.html');

    if (isPostPage) {
        const slug = new URLSearchParams(window.location.search).get('slug');
        if (!slug) { showArticleNotFound(); return; }

        const post = await loadSinglePost(slug);
        if (!post) { showArticleNotFound(); return; }

        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postMeta').textContent =
            `${formatDate(post.date)} • ${post.readTime} • By ${post.author}`;
        document.getElementById('postContent').innerHTML = post.content;
        document.title = `${post.title} - NexaSQL Blog`;

        // Toggle visibility
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('postError').style.display = 'none';
        document.getElementById('articleWrapper').style.display = 'block';
    } else {
        await loadPosts();
        populateFeaturedPosts();
        populateRecentPosts();
        populateCategories();
        initializeSearch();
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('newsletterForm');
    const successMessage = document.getElementById('newsletterSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // stop default submit + scrolling

            const formData = new FormData(form);

            fetch('https://formsubmit.co/ajax/info@nexasql.com', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    successMessage.style.display = 'block';
                    form.reset();
                } else {
                    alert('Something went wrong. Please try again.');
                }
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
        });
    }
});

function searchCategory(category) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = category; // Fill the search box
    document.getElementById('searchBtn').click(); // Trigger the search

    // Delay scroll so it happens after DOM updates
    setTimeout(() => {
        document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
    }, 100); // 100ms is usually enough for the render
}

document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav__toggle");
    const navList = document.querySelector(".nav__list");
    const navLinks = document.querySelectorAll(".nav__list a");

    navToggle.addEventListener("click", () => {
        navList.classList.toggle("nav__list--open");
    });

    // Close menu when any link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navList.classList.remove("nav__list--open");
        });
    });
});
