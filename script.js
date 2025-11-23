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
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.timeline-item, .skill-category, .about-stats, .project-card').forEach(el => {
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
            description: 'Built and hosted a gamified Generative AI based carbon footprint analyzer using StreamLit that tracks daily activities and offers personalized suggestions to optimize sustainability goals in day-to-day tasks.',
            demoUrl: 'https://ecomateai.streamlit.app/',
            githubUrl: 'https://github.com/ShamikOfficial',
            tech: ['Python', 'StreamLit', 'Generative AI', 'Data Analytics']
        },
        {
            name: 'BizScoutAI',
            description: 'Developed an AI-powered platform that assists in identifying optimal locations for new businesses in urban areas. The system integrates geospatial data clustering, demographic trends, and economic indicators to provide recommendations.',
            demoUrl: null, // Add demo URL here if available
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

        // Filter and display projects (exclude portfolio repo, forks, and custom projects)
        const filteredRepos = repos.filter(repo => {
            const repoNameLower = repo.name.toLowerCase();
            return !repo.fork && 
                   repoNameLower !== username.toLowerCase() &&
                   repoNameLower !== 'shamikofficial.github.io' &&
                   !customProjectNames.some(customName => repoNameLower.includes(customName));
        });
        
        // Add GitHub projects
        filteredRepos.slice(0, 4).forEach((repo, index) => {
            const projectCard = createProjectCard(repo);
            projectsGrid.appendChild(projectCard);
            
            // Animate on load
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                projectCard.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
            }, (customProjects.length + index) * 100);
        });
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

    return card;
}

// ===== Escape HTML to prevent XSS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Fetch GitHub projects
    fetchGitHubProjects();
    
    // Set initial active nav link
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
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

