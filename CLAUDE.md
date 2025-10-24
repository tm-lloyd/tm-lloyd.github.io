# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static academic website for Thomas Lloyd built with vanilla HTML, CSS, and JavaScript. The site is deployed via GitHub Pages from the `docs/` directory. The website features a dynamic content management system where research publications, working papers, and work-in-progress projects are defined in a single JavaScript file and automatically rendered across multiple pages.

## Architecture

### Content Management System

The core architecture revolves around a **single source of truth** pattern for academic content:

- **Central content database**: `docs/js/content.js` contains the `academicContent` object with three arrays: `publications`, `workingPapers`, and `workInProgress`
- **Rendering system**: The `AcademicContentRenderer` class dynamically generates HTML from the content database
- **Multi-page rendering**: The same content renders differently on `index.html` (collapsed abstracts, no images) vs `research.html` (expanded abstracts, with images)
- **Toggle functionality**: JavaScript-based abstract expansion/collapse with unique IDs for each paper

### Component Loading Pattern

The site uses a modular component system with dynamic loading:

- **Navbar** (`docs/navbar.html`): Navigation bar loaded into `#navbar-placeholder`
- **Sidebar** (`docs/sidebar.html`): Contact info and profile loaded into `#sidebar-placeholder`
- Both components are loaded asynchronously via JavaScript on each page

### File Organization

```
docs/                    # GitHub Pages root (all deployable content)
├── index.html          # Homepage
├── research.html       # Detailed research page
├── teaching.html       # Teaching experience
├── navbar.html         # Reusable navigation component
├── sidebar.html        # Reusable sidebar component
├── js/
│   ├── content.js      # SINGLE SOURCE OF TRUTH for all research content
│   └── scale.fix.js    # Mobile viewport fixes
├── css/                # Stylesheets
├── pdf/                # CV and paper PDFs
├── jpg/                # Research figures and images
├── fonts/              # Adobe Caslon Pro, Noto Sans
└── icons/              # Favicons and UI icons
```

## Key Development Workflows

### Editing Research Content

**ALL research content edits must be made in `docs/js/content.js`**. This is the only file you should modify for publications, working papers, or work-in-progress. The content automatically renders on both homepage and research page.

Structure of content objects:
```javascript
{
  id: 'unique_id',
  title: 'Paper Title',
  authors: [{name: 'Author', url: 'https://...'}],  // Thomas Lloyd filtered out automatically
  abstract: 'Text...',
  image: './jpg/figure.png',  // Optional, shows only on research.html
  imageWidth: '80%',          // Optional, defaults to '100%'
  // Additional fields vary by section (journal, year, nberUrl, presentation, etc.)
}
```

### Adding New Papers

1. Edit `docs/js/content.js` and add to appropriate array
2. Add PDF to `docs/pdf/` if available
3. Add figure to `docs/jpg/` if available
4. Content will automatically appear on both index.html and research.html

### Updating CV

1. Add new PDF to `docs/pdf/` (naming convention: `CV_MMDDYYYY.pdf`)
2. Update link in `docs/navbar.html` (navigation bar)
3. Update link in `docs/index.html` (CV button in bio section)

### Editing Bio and Personal Info

- **Bio text**: Edit `docs/index.html` around line 38 in the `<p id="bio">` section
- **Contact info**: Edit `docs/sidebar.html` (email, social media links, profile photo)
- **Navigation**: Edit `docs/navbar.html` for site title and nav links

## Static Site Deployment

This site is deployed via GitHub Pages:
- **Deployment directory**: `docs/` (configured in repo settings)
- **Branch**: `main`
- **No build process**: Pure static HTML/CSS/JS, no compilation needed
- **Custom domain**: Configured via `docs/CNAME` file

## Python Utility

`extract_comments.py` is a utility script for extracting and ranking teaching evaluation comments from `docs/sheets/evals.xlsx`. It reads the `written_comments` sheet, filters by rank, and outputs JSON data for potential integration into the teaching page.

## Design Philosophy

- **Minimal dependencies**: No build tools, package managers, or frameworks
- **Single source of truth**: All research content in one file (`content.js`)
- **Component reuse**: Navbar and sidebar shared across pages via dynamic loading
- **Responsive design**: Mobile-first CSS with CSS Grid and Flexbox
- **Academic focus**: Typography and layout optimized for academic content presentation

## Credits

Website design inspired by Afras Sial's website (https://github.com/afras-sial) and Gautam Rao's website (https://github.com/gautamrao/gautamrao.github.io).
