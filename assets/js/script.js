// ===== Load Theme Immediately (Prevent Flash) =====
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// ===== Google Analytics Event Tracking =====
function trackEvent(category, action, label = '', value = null) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
}

function trackPageView(sectionName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: sectionName,
            page_location: window.location.href + '#' + sectionName
        });
    }
}

// ===== Navigation Scroll Effect =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Track navigation click
        const sectionName = link.getAttribute('href').replace('#', '');
        trackEvent('Navigation', 'click', sectionName);
    });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Track scroll to section
            const sectionName = this.getAttribute('href').replace('#', '');
            if (sectionName) {
                trackPageView(sectionName);
            }
        }
    });
});

// ===== Animate Stats Counter =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Animate stats if in view
            if (entry.target.classList.contains('about-stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
            }
            
            // Track section view
            const section = entry.target.closest('section');
            if (section && section.id) {
                trackPageView(section.id);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.experience-item, .skill-category, .about-stats, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ===== Custom Featured Projects =====
function createCustomProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Build buttons HTML
    let buttonsHTML = '';
    if (project.demoUrl) {
        buttonsHTML += `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-demo">
            <i class="fas fa-external-link-alt"></i> Live Demo
        </a>`;
    }
    if (project.githubUrl) {
        buttonsHTML += `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-github">
            <i class="fab fa-github"></i> GitHub
        </a>`;
    }

    card.innerHTML = `
        <div class="project-header">
            <div>
                <h3 class="project-title">${escapeHtml(project.name)}</h3>
            </div>
        </div>
        <div class="project-content">
            <p class="project-description">${escapeHtml(project.description)}</p>
        </div>
        <div class="project-footer">
            <div class="project-tech">
                ${project.tech.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
            </div>
            <div class="project-buttons">
                ${buttonsHTML}
            </div>
        </div>
    `;

    // Add event tracking to project buttons
    const demoBtn = card.querySelector('.project-btn-demo');
    const githubBtn = card.querySelector('.project-btn-github');
    
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            trackEvent('Project', 'demo_click', project.name);
        });
    }
    
    if (githubBtn) {
        githubBtn.addEventListener('click', () => {
            trackEvent('Project', 'github_click', project.name);
        });
    }

    return card;
}

// ===== Fetch GitHub Projects =====
async function fetchGitHubProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const username = 'ShamikOfficial';
    
    // Clear skeleton loaders
    projectsGrid.innerHTML = '';

    // Add custom featured projects first
    const customProjects = [
        {
            name: 'EcoMateAI',
            description: 'Developed and deployed a production-ready Generative AI application for carbon footprint analysis. Built end-to-end ML pipeline using Python and StreamLit, implementing gamification features to drive user engagement. Delivered personalized sustainability recommendations through advanced data analytics and AI models.',
            demoUrl: 'https://ecomateai.streamlit.app/',
            githubUrl: 'https://github.com/ShamikOfficial',
            tech: ['Python', 'StreamLit', 'Generative AI', 'Data Analytics']
        },
        {
            name: 'BizScoutAI',
            description: 'Engineered an AI-powered business intelligence platform for location optimization using machine learning algorithms. Integrated geospatial data processing, demographic analysis, and predictive modeling to deliver actionable insights for strategic business decisions. Implemented scalable data clustering techniques for large-scale urban datasets.',
            demoUrl: null,
            githubUrl: 'https://github.com/ShamikOfficial',
            tech: ['Python', 'AI/ML', 'Geospatial Analysis', 'Data Clustering']
        }
    ];

    customProjects.forEach((project, index) => {
        const projectCard = createCustomProjectCard(project);
        projectsGrid.appendChild(projectCard);
        
        // Animate on load
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            projectCard.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    try {
        // Fetch user repositories
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub projects');
        }

        const repos = await response.json();

        // Custom project names to exclude (case-insensitive, handle variations)
        const customProjectNames = [
            'ecomateai',
            'ecomate-ai',
            'bizscoutai',
            'bizscout-ai'
        ];

        // Filter to only show Super-Store-Analysis
        const filteredRepos = repos.filter(repo => {
            const repoNameLower = repo.name.toLowerCase();
            return !repo.fork && 
                   repoNameLower !== username.toLowerCase() &&
                   repoNameLower !== 'shamikofficial.github.io' &&
                   !customProjectNames.some(customName => repoNameLower.includes(customName)) &&
                   (repoNameLower.includes('super-store') || repoNameLower.includes('superstore'));
        });
        
        // Add only Super-Store-Analysis project
        if (filteredRepos.length > 0) {
            const superStoreRepo = filteredRepos[0];
            const projectCard = createProjectCard(superStoreRepo);
            projectsGrid.appendChild(projectCard);
            
            // Animate on load
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                projectCard.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
            }, customProjects.length * 100);
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsGrid.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); grid-column: 1 / -1; padding: 2rem;">
                <p>Unable to load projects at the moment.</p>
                <p style="margin-top: 1rem;">
                    <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" 
                       style="color: var(--primary-color); text-decoration: none;">
                        Visit my GitHub profile →
                    </a>
                </p>
            </div>
        `;
    }
}

// ===== Create Project Card =====
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Get language or default
    const language = repo.language || 'Other';
    const description = repo.description || 'No description available.';
    
    // Format description (limit length)
    const shortDescription = description.length > 120 
        ? description.substring(0, 120) + '...' 
        : description;

    card.innerHTML = `
        <div class="project-header">
            <div>
                <h3 class="project-title">${escapeHtml(repo.name)}</h3>
            </div>
        </div>
        <div class="project-content">
            <p class="project-description">${escapeHtml(shortDescription)}</p>
        </div>
        <div class="project-footer">
            <div class="project-tech">
                <span class="tech-tag">${escapeHtml(language)}</span>
            </div>
            <div class="project-buttons">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-github">
                    <i class="fab fa-github"></i> GitHub
                </a>
            </div>
        </div>
    `;

    // Add event tracking to GitHub button
    const githubBtn = card.querySelector('.project-btn-github');
    if (githubBtn) {
        githubBtn.addEventListener('click', () => {
            trackEvent('Project', 'github_click', repo.name);
        });
    }

    return card;
}

// ===== Escape HTML to prevent XSS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Theme Toggle =====
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const html = document.documentElement;
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    // Update icon and text based on current theme
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeText.textContent = 'Light';
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeText.textContent = 'Dark';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Track theme toggle
        trackEvent('Theme', 'toggle', newTheme);
        
        // Update icon and text
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeText.textContent = 'Light';
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeText.textContent = 'Dark';
        }
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Fetch GitHub projects
    fetchGitHubProjects();
    
    // Track button clicks (excluding resume buttons which are tracked separately)
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        // Skip resume buttons - they're tracked separately
        if (btn.classList.contains('resume-btn-view') || btn.classList.contains('resume-btn-download')) {
            return;
        }
        
        btn.addEventListener('click', (e) => {
            const buttonText = btn.textContent.trim();
            const href = btn.getAttribute('href');
            
            // Track hero resume button
            if (buttonText.includes('View Resume') && href && href.includes('resume.pdf')) {
                trackEvent('Button', 'view_resume', 'Hero Section');
                return;
            }
            
            if (buttonText.includes('View My Work') || buttonText.includes('Projects')) {
                trackEvent('Button', 'view_projects', buttonText);
            } else if (buttonText.includes('Get In Touch') || buttonText.includes('Contact')) {
                trackEvent('Button', 'contact', buttonText);
            } else if (buttonText.includes('GitHub')) {
                trackEvent('Button', 'github_link', buttonText);
            } else {
                trackEvent('Button', 'click', buttonText);
            }
        });
    });
    
    // Track social media clicks
    document.querySelectorAll('.social-links a, .footer-social-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            let platform = 'unknown';
            
            if (href.includes('github.com')) {
                platform = 'GitHub';
            } else if (href.includes('linkedin.com')) {
                platform = 'LinkedIn';
            } else if (href.includes('mailto:')) {
                platform = 'Email';
            } else if (href.includes('twitter.com') || href.includes('x.com')) {
                platform = 'Twitter';
            }
            
            trackEvent('Social', 'click', platform);
        });
    });
    
    // Track resume view and download from nav
    document.querySelectorAll('.nav-resume-view').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Navigation', 'view_resume', 'Nav Bar');
        });
    });
    
    document.querySelectorAll('.nav-resume-download').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Navigation', 'download_resume', 'Nav Bar');
        });
    });
    
    // Track resume view and download from experience section
    document.querySelectorAll('.resume-btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Button', 'view_resume', 'Experience Section');
        });
    });
    
    document.querySelectorAll('.resume-btn-download').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Button', 'download_resume', 'Experience Section');
        });
    });
    
    // Set initial active nav link
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    // ===== Expandable Timeline Items =====
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach(item => {
        const experienceContent = item.querySelector('.experience-content');
        const expandBtn = item.querySelector('.expand-btn');
        const experienceHeader = item.querySelector('.experience-header');
        
        if (experienceContent && expandBtn && experienceHeader) {
            // Click handler for expand button
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanding = !experienceContent.classList.contains('expanded');
                experienceContent.classList.toggle('expanded');
                
                // Track experience expand/collapse
                const company = item.querySelector('.experience-company')?.textContent || 'Unknown';
                trackEvent('Experience', isExpanding ? 'expand' : 'collapse', company);
            });
            
            // Click handler for header (also expands)
            experienceHeader.addEventListener('click', (e) => {
                if (e.target !== expandBtn && !expandBtn.contains(e.target)) {
                    const isExpanding = !experienceContent.classList.contains('expanded');
                    experienceContent.classList.toggle('expanded');
                    
                    // Track experience expand/collapse
                    const company = item.querySelector('.experience-company')?.textContent || 'Unknown';
                    trackEvent('Experience', isExpanding ? 'expand' : 'collapse', company);
                }
            });
        }
    });
});

// ===== Lazy Load Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Add loading state management =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

