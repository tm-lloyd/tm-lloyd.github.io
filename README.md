# Thomas Lloyd - Academic Website

A clean, responsive academic website built with HTML, CSS, and JavaScript. This website features dynamic content loading, modular design, and easy content management.

## 🌟 Features

- **Dynamic Content System**: Research publications, working papers, and work-in-progress automatically rendered from a single JSON content file
- **Responsive Design**: Mobile-friendly layout that works across all devices
- **Modular Architecture**: Navbar and sidebar are separate components loaded dynamically with sessionStorage caching
- **Performance Optimized**: Components cached per session to eliminate reload flicker between pages
- **Mobile Navigation**: Hamburger menu with smooth animations for mobile/tablet devices
- **Academic Icons**: Support for Google Scholar, ORCID, and other academic platforms
- **PDF Integration**: Easy CV and paper linking system
- **GitHub Pages Ready**: Deployed directly from the repository

## 📁 Project Structure

```
docs/
├── index.html              # Homepage with bio and research overview
├── research.html           # Detailed research page with images and expanded abstracts
├── teaching.html           # Teaching experience and courses
├── teaching_evals.html     # Teaching evaluation comments and charts
├── navbar.html             # Navigation bar component
├── sidebar.html            # Sidebar with contact info and links
├── js/
│   ├── content.json        # Main research content database
│   ├── content.js          # Renders research content from content.json
│   ├── component-loader.js # Loads navbar/sidebar with sessionStorage caching
│   ├── navbar.js           # Hamburger menu functionality for mobile navigation
│   └── teaching-evals.js   # Teaching evaluation chart rendering
├── css/                    # Stylesheets
├── pdf/                    # CV and paper PDFs
├── jpg/                    # Images and figures
├── icons/                  # Website icons and logos
└── fonts/                  # Custom fonts
```

## ✏️ How to Edit Content

### 📚 Adding/Editing Research Content

The research content (publications, working papers, work in progress) is managed through a single file:

**File to edit: `docs/js/content.json`**

This file contains a JSON object with three main sections:

#### 1. Publications
```json
"publications": [
  {
    "id": "pub1",
    "title": "Your Paper Title",
    "authors": [
      {
        "name": "Thomas Lloyd",
        "url": null
      },
      {
        "name": "Co-Author Name",
        "url": "https://coauthor-website.com/"
      }
    ],
    "journal": "Journal Name",
    "year": "2025",
    "url": "https://journal-link.com",
    "workingPaperUrl": "./pdf/paper.pdf",
    "workingPaperText": "Working Paper Version, Date",
    "abstract": "Your abstract text here...",
    "image": "./jpg/your-figure.png"
  }
]
```

#### 2. Working Papers
```json
"workingPapers": [
  {
    "id": "wp1",
    "title": "Working Paper Title",
    "authors": [],
    "url": "./pdf/working-paper.pdf",
    "wpSeriesUrl": "https://www.nber.org/papers/w12345",
    "wpSeriesText": "NBER Working Paper No. 12345",
    "date": "Month Year",
    "isNew": true,
    "presentations": [
      {
        "text": "Conference Abbreviation 2026",
        "url": "https://conference.example.com",
        "byCoauthor": false
      }
    ],
    "news": [
      {
        "text": "Prize or other paper news",
        "url": "https://award.example.com"
      }
    ],
    "abstract": "Abstract text...",
    "image": "./jpg/figure.png"
  }
]
```

#### 3. Work in Progress
```json
"workInProgress": [
  {
    "id": "wip1",
    "title": "Work in Progress Title",
    "authors": [],
    "abstract": "Abstract or description..."
  }
]
```

**Important Notes:**
- Thomas Lloyd is automatically filtered out of the "(with ...)" display
- Co-authors without URLs will still display correctly
- `presentations` and `news` accept multiple entries; presentations are combined into one line and each optional `url` turns its text into a link
- Set `byCoauthor` to `true` to add an asterisk and display the co-author presentation footnote
- The legacy singular `presentation` string is still supported
- The content automatically appears on both index.html and research.html
- Research page shows images and expanded abstracts, index page shows collapsed abstracts

### 🏠 Editing Bio and Homepage

**File to edit: `docs/index.html`**

Look for the bio section in `docs/index.html`:
```html
<p id="bio">
  I am an Assistant Professor in the Department of Quantitative Finance &amp; Economics at
  <a href="https://em-lyon.com/en">emlyon business school</a>.
</p>
```

### 🎓 Editing Teaching Page

**File to edit: `docs/teaching.html`**

The teaching page uses HTML tables. To add a new course:

1. Find the appropriate table (GSI or TA positions)
2. Add a new row:
```html
<tr>
  <td data-label="Term">Fall 2025</td>
  <td data-label="Course">Course Name (COURSE 123). Instructor: <a
    href="https://instructor-website.com/" target="_blank" rel="noopener">Instructor Name</a></td>
</tr>
```

### 📇 Editing Contact Information

**File to edit: `docs/sidebar.html`**

Update your contact information, social media links, and profile picture:
```html
<img src="jpg/your-photo.jpg" alt="Your Name" id="profile-pic" loading="lazy" />
<h1>Your Name</h1>
<p>Your Title<br><i class="fa-solid fa-building-columns"></i> Your Institution</p>
<p class="contactinfo">your-email@institution.edu</p>
```

Update social media links in the contact-container div.

### 🧭 Editing Navigation

**File to edit: `docs/navbar.html`**

Update the site title and navigation links:
```html
<h3><a href="index.html">Your Name</a></h3>
<ul id="navbar">
  <li><a href="https://yourwebsite.com/">Home</a></li>
  <li><a href="./research.html">Research</a></li>
  <li><a href="./teaching.html">Teaching</a></li>
  <li><a href="./pdf/CV_current.pdf" target="_blank" rel="noopener">CV</a></li>
</ul>
```

## 📄 Managing PDFs and Files

### CV Updates
1. Add your new CV to `docs/pdf/` folder
2. Update the link in `docs/navbar.html`:
   ```html
   <a href="./pdf/CV_MMDDYYYY.pdf" target="_blank" rel="noopener">CV</a>
   ```
3. Update the CV link on homepage in `docs/index.html`:
   ```html
   <a class="button-2" href="./pdf/CV_MMDDYYYY.pdf" target="_blank" rel="noopener">
   ```

### Paper PDFs
- Add paper PDFs to `docs/pdf/` folder
- Reference them in `content.json` using relative paths: `./pdf/paper-name.pdf`
- Working paper versions and published versions can both be linked

### Images and Figures
- Add images to `docs/jpg/` folder
- Reference in `content.json`: `./jpg/figure-name.png`
- Supported formats: PNG, JPG, JPEG
- Images show on research page but not on index page

## 🎨 Styling and Customization

### Colors and Fonts
- Main stylesheet: `docs/css/style.css`
- Modern layout: `docs/css/modern-layout.css`
- Custom fonts in `docs/fonts/` folder (Adobe Caslon Pro, Noto Sans)

### Responsive Design
- The site is fully responsive and mobile-friendly
- Uses CSS Grid and Flexbox for layout
- Mobile-first design approach with breakpoints at 768px and 1024px
- Hamburger menu navigation for mobile/tablet screens
- Mobile-specific styling for tables, navigation, and content cards
- Optimized typography with Noto Sans (buttons, UI) and Adobe Caslon Pro (content)

## 🚀 Deployment and Forking

### GitHub Pages Deployment
This site is designed for GitHub Pages deployment:

1. Fork this repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/docs" folder
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Custom Domain (Optional)
- Add your domain to `docs/CNAME` file
- Configure DNS settings with your domain provider

### How to Fork This Website

1. **Fork the Repository**
   - Click "Fork" button on the GitHub repository
   - Clone your fork: `git clone https://github.com/yourusername/repository-name.git`

2. **Customize Your Content**
   - Edit `docs/js/content.json` for research content
   - Update `docs/index.html` for bio
   - Modify `docs/teaching.html` for teaching experience
   - Update `docs/sidebar.html` for contact info
   - Replace `docs/jpg/pfp_Thomas_Lloyd.jpg` with your photo

3. **Update PDFs and Files**
   - Add your CV to `docs/pdf/`
   - Add your papers and figures
   - Update all links in the HTML files

4. **Deploy**
   - Push changes to your repository
   - Enable GitHub Pages in repository settings
   - Your site will be live!

## 🛠️ Technical Details

### Local Preview

Because the site fetches `navbar.html`, `sidebar.html`, and `js/content.json`, preview it through a local HTTP server rather than opening `index.html` directly from the filesystem:

```bash
cd docs
python -m http.server 3000
```

Then open `http://127.0.0.1:3000/`.

### Performance Features
- **Component Caching**: Navbar and sidebar HTML is cached in sessionStorage after first load
- **Static Loading**: Components persist across page navigation without re-fetching
- **Efficient Rendering**: Research content renders conditionally based on page context
- **Optimized Assets**: Card layout with minimal padding and efficient hover states

### JavaScript Functionality
- **Dynamic Content Rendering**: The `AcademicContentRenderer` class in `content.js` automatically generates HTML from `content.json`
- **Abstract Toggling**: Click "Abstract" links to expand/collapse paper abstracts
- **Cached Component Loading**: Navbar and sidebar use sessionStorage caching for instant page transitions
- **Mobile Navigation**: Hamburger menu with event management and bfcache support
- **Responsive Rendering**: Content adapts based on page context (index vs research pages)

### SEO and Accessibility
- Semantic HTML structure
- Proper meta tags and descriptions
- Alt text for images
- ARIA labels for navigation
- Skip links for screen readers

## 🙏 Credits and Attribution

### Original Design Inspiration
Much of the website design is taken from [Afras Sial's website](https://github.com/afras-sial) which itself is inspired from [Gautam Rao's website](https://github.com/gautamrao/gautamrao.github.io).

### Development Tools
- **Claude Code**: AI-assisted development and refactoring
- **GitHub Pages**: Free static site hosting
- **Font Awesome**: Icons for social media and contact info
- **Academicons**: Academic-specific icons (Google Scholar, ORCID, etc.)

### Fonts and Assets
- **Adobe Caslon Pro**: Main typography
- **Noto Sans**: Secondary font family
- **University of Michigan**: Logo and branding elements

## 📝 License

This website template is open source. Feel free to fork, modify, and use for your own academic website.

---

For questions or issues, please open an issue on the GitHub repository.
