# Product Designer Portfolio Website

A modern, responsive portfolio website for Product Designers and UX Designers, inspired by the clean, professional design aesthetic of Digital Hub.

## 🎨 Design Features

- **Vibrant Orange Primary Color** (#FF6B35) - Modern, energetic accent color
- **Clean Minimalist Design** - Professional aesthetic with strong visual hierarchy
- **Large Typography** - Bold headings and readable body text
- **Smooth Animations** - Subtle microinteractions and scroll-triggered animations
- **Fully Responsive** - Mobile-first design that works on all devices

## 📁 Project Structure

```
portfolio-designer/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css     # Complete design system
│   ├── js/
│   │   └── main.js        # Interactive functionality
│   └── images/            # Image assets
└── README.md              # This file
```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Local Server (Recommended)
For the best experience, use a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

**Using PHP:**
```bash
php -S localhost:8000

# Then visit: http://localhost:8000
```

**Using VS Code Live Server:**
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📝 Customization Guide

### 1. Personal Information
Edit `index.html` and replace:
- `YourName` - Your actual name
- Meta descriptions and titles
- Social media links in the Contact and Footer sections

### 2. Portfolio Projects
Edit the `portfolioData` array in `assets/js/main.js`:
```javascript
const portfolioData = [
    {
        title: "Your Project Title",
        description: "Project description...",
        role: "Your Role",
        impact: "Key Metric",
        image: "path/to/image.jpg",
        tags: ["Tag1", "Tag2"]
    }
];
```

### 3. Testimonials
Edit the `testimonialsData` array in `assets/js/main.js`:
```javascript
const testimonialsData = [
    {
        name: "Client Name",
        role: "Their Role",
        company: "Company Name",
        text: "Testimonial text...",
        avatar: "path/to/avatar.jpg"
    }
];
```

### 4. Blog Posts
Edit the `insightsData` array in `assets/js/main.js`:
```javascript
const insightsData = [
    {
        title: "Article Title",
        category: "Category",
        excerpt: "Brief excerpt...",
        image: "path/to/image.jpg",
        date: "Date"
    }
];
```

### 5. Colors
To change the primary color, edit `assets/css/styles.css`:
```css
:root {
  --color-primary: #FF6B35;        /* Change this */
  --color-primary-dark: #E85A28;   /* Darker shade */
  --color-primary-light: #FF8A5C;  /* Lighter shade */
}
```

### 6. About Section Stats
Edit the stats in `index.html` (search for "stats" section):
```html
<span class="stat-number">5+</span>
<span class="stat-label">Years Experience</span>
```

## 🎯 Sections Overview

1. **Hero** - Eye-catching introduction with CTA buttons
2. **About** - Personal bio and key statistics
3. **Services** - 6 service offerings with icons
4. **Portfolio** - Featured case studies with images
5. **Testimonials** - Client feedback and reviews
6. **Insights** - Blog posts and articles
7. **Contact** - Contact form and social links
8. **Footer** - Navigation and additional links

## 🔧 Technical Details

- **No Build Process Required** - Pure HTML, CSS, and JavaScript
- **No Dependencies** - Works without npm or node_modules
- **SEO Optimized** - Semantic HTML and meta tags
- **Accessible** - ARIA labels and keyboard navigation
- **Performance** - Optimized animations using CSS transforms
- **Modern Browsers** - Uses ES6+ JavaScript features

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📧 Contact Form

The contact form currently logs to console. To make it functional:

1. **Using a Backend Service:**
   - Formspree: https://formspree.io/
   - EmailJS: https://www.emailjs.com/
   - Netlify Forms: https://www.netlify.com/products/forms/

2. **Example with Formspree:**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## 🎨 Design System

### Colors
- Primary: Orange (#FF6B35)
- Neutrals: Black, White, Grays
- Semantic: Success, Error states

### Typography
- Font: Inter (Google Fonts)
- Scale: 12px - 72px
- Weights: 300, 400, 500, 600, 700, 800

### Spacing
- Base: 8px
- Scale: 8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px, 160px

## 📄 License

This template is free to use for personal and commercial projects.

## 🙏 Credits

- Design inspiration: Digital Hub (digitalhub.com.br)
- Fonts: Google Fonts (Inter)
- Icons: Custom SVG icons
- Images: Unsplash (placeholder images)

---

**Built with ❤️ for Product Designers**
