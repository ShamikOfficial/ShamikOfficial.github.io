# Shamik Basu - Portfolio

Personal portfolio for **Shamik Basu**, AI Enabled Data Scientist. Project-first, recruiter-oriented, mobile-friendly, and built with plain HTML, CSS, and JavaScript (no build step).

## 🌐 Live Site

Primary portfolio: **[https://www.shamik-basu.com](https://www.shamik-basu.com)**
Mirrored on GitHub Pages at [https://shamikofficial.github.io](https://shamikofficial.github.io) when enabled.

## 🗂️ Structure

```
index.html                     Home: hero, highlights slideshow, projects, experience, education, skills, contact
projects/                      One case-study page per featured project
assets/css/styles.css          Single stylesheet (light + dark themes, mobile-first)
assets/js/script.js            Slideshow, mobile nav, theme toggle, lazy YouTube embeds
assets/data/profile.json       Machine-readable profile (loaded in background for crawlers/agents)
assets/documents/              Resume PDFs + LaTeX sources
sitemap.xml / robots.txt       SEO
```

## ✏️ How to update content

- **Text content** lives directly in `index.html` and the `projects/*.html` pages (static HTML = best for SEO and the easiest to edit).
- **Structured data for crawlers** lives in two places: the `<script type="application/ld+json">` blocks in each page, and `assets/data/profile.json`. Keep these in sync with your resume.

### Add a project demo video
Each project has a `<div class="video-embed" data-youtube="">`. Paste a YouTube **video ID** (the part after `v=`) into `data-youtube` and the poster becomes a click-to-play player automatically.

### Add images
Drop files into:
- `assets/images/profile.jpg` - replace the "SB" monogram in the hero with an `<img>`.
- `assets/images/highlights/` - slideshow backgrounds (`ucla-sairs.jpg`, `agentic-trend.jpg`, `grids-usc.jpg`).
- `assets/images/projects/` - project card / case-study posters.
- `assets/images/og-cover.jpg` - social share image (1200×630).

Until images are added, the site uses tasteful gradient placeholders - nothing appears broken.

## 📧 Contact

- **Email**: shamik1900@gmail.com
- **LinkedIn**: [linkedin.com/in/shamikofficial](https://linkedin.com/in/shamikofficial/)
- **GitHub**: [github.com/ShamikOfficial](https://github.com/ShamikOfficial)
- **Devpost**: [devpost.com/shamik1900](https://devpost.com/shamik1900)

---

Built by Shamik Basu.
