# NexaSQL Blog

A modern, responsive blog for SQL Server expertise and solutions.

## Features

- 🚀 **Dynamic Post Loading**: Posts are automatically loaded from individual JSON files
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🔍 **Search & Filter**: Search articles by title, content, tags, or category
- 🎨 **Modern UI**: Clean, professional design with dark/light mode support
- ⚡ **Performance Optimized**: Fast loading and smooth interactions

## File Structure

```
├── index.html          # Main blog homepage
├── post.html           # Individual article page template
├── app.js              # Main JavaScript functionality
├── style.css           # All styling (do not modify)
├── README.md           # This file
└── posts/              # All blog posts (JSON files)
    ├── index.json      # Post discovery index
    ├── sql-server-performance-tuning-techniques.json
    ├── sql-server-index-optimization-guide.json
    ├── azure-sql-migration-lessons.json
    ├── database-security-best-practices-2024.json
    ├── troubleshooting-sql-server-performance-issues.json
    └── backup-recovery-strategies-businesses.json
```

## Adding New Articles

To add a new article to the blog, follow these simple steps:

### 1. Create a JSON File

Create a new JSON file in the `posts/` directory with your article slug as the filename:

```
posts/your-article-slug.json
```

### 2. JSON File Structure

Use this template for your article JSON file:

```json
{
  "title": "Your Article Title",
  "slug": "your-article-slug",
  "excerpt": "A compelling excerpt that describes what the article covers...",
  "author": "Author Name",
  "date": "2024-01-15",
  "readTime": "8 min read",
  "category": "Performance",
  "tags": ["Performance", "Optimization", "SQL Server"],
  "featured": false,
  "content": "<h2>Introduction</h2><p>Your HTML content goes here...</p>"
}
```

### 3. Content Guidelines

- **Title**: Keep it descriptive and SEO-friendly
- **Slug**: Use lowercase, hyphens instead of spaces, no special characters
- **Excerpt**: 1-2 sentences summarizing the article
- **Author**: Your name or the article author
- **Date**: Use YYYY-MM-DD format
- **Read Time**: Estimate based on content length (200 words per minute)
- **Category**: Choose from existing categories or create new ones
- **Tags**: 3-5 relevant tags for better discoverability
- **Featured**: Set to `true` for featured articles (limit to 3-4)
- **Content**: HTML content of your article

### 4. Content Formatting

The content field supports HTML. Use these tags for best results:

```html
<h2>Main Section Heading</h2>
<h3>Subsection Heading</h3>
<p>Regular paragraph text</p>
<ul><li>Bullet points</li></ul>
<ol><li>Numbered lists</li></ol>
<blockquote>Important quotes or callouts</blockquote>
<pre><code>Code examples</code></pre>
<strong>Bold text</strong>
<em>Italic text</em>
```

### 5. Update Post Index

Add your new post slug to `posts/index.json`:

```json
{
  "posts": [
    "your-new-article-slug",
    "existing-article-slug",
    "..."
  ]
}
```

### 6. Test Your Article

1. Open `index.html` in your browser
2. Your new article should appear in the recent posts
3. Click on it to test the individual article page
4. Verify all content displays correctly

## Categories

Current blog categories:
- **Performance**: SQL Server performance tuning and optimization
- **Database Administration**: DBA best practices and maintenance
- **Cloud Migration**: Azure SQL and cloud migration strategies  
- **Security**: Database security and compliance

## GitHub Pages Deployment

This blog is designed to work seamlessly with GitHub Pages:

1. Push your changes to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Your blog will be automatically deployed

## URL Structure

- Homepage: `https://yourusername.github.io/repository-name/`
- Individual articles: `https://yourusername.github.io/repository-name/post.html?slug=article-slug`

## Best Practices

1. **Keep JSON files organized**: Use clear, descriptive slugs
2. **Optimize images**: If using images, keep them under 1MB
3. **Test content**: Always preview articles before publishing
4. **SEO friendly**: Use descriptive titles and good excerpts
5. **Consistent formatting**: Follow the established content structure
6. **Regular updates**: Keep content fresh and relevant

## Troubleshooting

**Article not showing up?**
- Check that the JSON file is valid (use a JSON validator)
- Ensure the slug is added to `posts/index.json`
- Verify the filename matches the slug

**Styling issues?**
- Do not modify `style.css` unless absolutely necessary
- Use standard HTML tags in your content
- Test on different screen sizes

**Links not working?**
- Use relative paths for internal links
- Test all external links

## Support

For issues or questions, please check the existing articles for examples and formatting guidelines.
