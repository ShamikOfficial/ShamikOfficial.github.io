# Shamik Basu - Personal Portfolio

A clean, modern, and professional portfolio website showcasing my projects, skills, and experience.

## 🌐 Live Site

Visit the live portfolio at: [https://shamikofficial.github.io](https://shamikofficial.github.io)

## ✨ Features

- **Modern Design**: Clean and aesthetic UI with smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **GitHub Integration**: Automatically fetches and displays projects from GitHub
- **Smooth Scrolling**: Enhanced user experience with smooth scroll navigation
- **Performance Optimized**: Fast loading times and optimized assets
- **SEO Friendly**: Proper meta tags and semantic HTML

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- JavaScript (Vanilla)
- GitHub API
- Font Awesome Icons
- Google Fonts (Inter)

## 📁 Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
├── README.md          # Project documentation
└── Shamik_profile_picture.JPG  # Profile picture
```

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ShamikOfficial/ShamikOfficial.github.io.git
```

2. Navigate to the project directory:
```bash
cd ShamikOfficial.github.io
```

3. Open `index.html` in your web browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

4. Visit `http://localhost:8000` in your browser

### Deploy to GitHub Pages

1. Push your code to the `main` branch of your repository
2. Go to your repository settings on GitHub
3. Navigate to "Pages" in the left sidebar
4. Select the source branch (usually `main`)
5. Your site will be available at `https://yourusername.github.io`

## 📝 Customization

### Update Personal Information

1. Edit `index.html` to update:
   - Name and title in the hero section
   - About section content
   - Experience details
   - Skills list
   - Contact information

### Change Profile Picture

1. Replace `Shamik_profile_picture.JPG` with your own image
2. Ensure the filename matches in `index.html`

### Modify Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    /* ... other variables */
}
```

### GitHub Projects

The portfolio automatically fetches your public repositories from GitHub. To customize:
- Edit the `username` variable in `script.js`
- Modify the `fetchGitHubProjects()` function to filter specific repos

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

- **Email**: shamik1900@gmail.com
- **LinkedIn**: [linkedin.com/in/shamikofficial](https://linkedin.com/in/shamikofficial)
- **GitHub**: [github.com/ShamikOfficial](https://github.com/ShamikOfficial)

---

Built with ❤️ by Shamik Basu
