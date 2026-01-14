// API Integration - Fetch and render dynamic content
const API_BASE = window.location.origin + '/api';

// Fetch and render About content
async function loadAboutContent() {
    try {
        console.log('Loading about content...');
        const response = await fetch(`${API_BASE}/about`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('About data loaded:', data);

        // Update bio
        const bioElement = document.getElementById('bio-text');
        if (bioElement) {
            bioElement.textContent = data.bio || 'Welcome to my portfolio!';
        }

        // Update profile image
        if (data.profileImage) {
            const profileImg = document.getElementById('profile-image');
            if (profileImg) {
                profileImg.src = data.profileImage;
            }
        }

        // Render social links
        const socialLinksContainer = document.getElementById('social-links');
        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = '';

            const socialIcons = {
                github: 'fab fa-github',
                linkedin: 'fab fa-linkedin',
                twitter: 'fab fa-twitter',
                email: 'fas fa-envelope',
                instagram: 'fab fa-instagram'
            };

            Object.entries(data.socialLinks || {}).forEach(([platform, url]) => {
                if (url) {
                    const link = document.createElement('a');
                    link.href = url;
                    link.className = 'social-link';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.innerHTML = `<i class="${socialIcons[platform]}"></i>`;
                    socialLinksContainer.appendChild(link);
                }
            });
        }

        // Also add social links to Contact section
        const contactSocialLinks = document.querySelector('#contact .social-links');
        if (contactSocialLinks && data.socialLinks) {
            contactSocialLinks.innerHTML = '';
            const socialIcons = {
                github: 'fab fa-github',
                linkedin: 'fab fa-linkedin',
                twitter: 'fab fa-twitter',
                email: 'fas fa-envelope',
                instagram: 'fab fa-instagram'
            };

            Object.entries(data.socialLinks).forEach(([platform, url]) => {
                if (url) {
                    const link = document.createElement('a');
                    link.href = url;
                    link.className = 'social-link';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.innerHTML = `<i class="${socialIcons[platform]}"></i>`;
                    contactSocialLinks.appendChild(link);
                }
            });
        }
    } catch (error) {
        console.error('Error loading about content:', error);
        const bioElement = document.getElementById('bio-text');
        if (bioElement) {
            bioElement.textContent = 'Passionate developer creating amazing digital experiences. Please update your bio in the admin panel!';
        }
    }
}

// Fetch and render Skills
async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE}/skills`);
        const skills = await response.json();

        const skillsGrid = document.getElementById('skills-grid');
        skillsGrid.innerHTML = '';

        if (skills.length === 0) {
            skillsGrid.innerHTML = '<p class="text-center">No skills added yet.</p>';
            return;
        }

        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
        <div class="skill-card-content">
          <div class="skill-header">
            <div class="skill-icon">
              ${skill.icon || '<i class="fas fa-code"></i>'}
            </div>
            <div>
              <div class="skill-name">${skill.name}</div>
              <div class="skill-category">${skill.category}</div>
            </div>
          </div>
          <div class="skill-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%" data-width="${skill.proficiency}%"></div>
            </div>
          </div>
        </div>
      `;
            skillsGrid.appendChild(skillCard);
        });

        // Animate progress bars
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 100);

        // Apply tilt effect to new cards
        if (window.observeNewElements) {
            window.observeNewElements();
        }
    } catch (error) {
        console.error('Error loading skills:', error);
        document.getElementById('skills-grid').innerHTML = '<p class="text-center">Failed to load skills.</p>';
    }
}

// Fetch and render Projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/projects`);
        const projects = await response.json();

        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';

        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p class="text-center">No projects added yet.</p>';
            return;
        }

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x250/0a0a0f/00d4ff?text=${encodeURIComponent(project.title)}'">
        </div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tech">
            ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.projectUrl ? `<a href="${project.projectUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i> View Code</a>` : ''}
          </div>
        </div>
      `;
            projectsGrid.appendChild(projectCard);
        });

        // Apply tilt effect to new cards
        if (window.observeNewElements) {
            window.observeNewElements();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML = '<p class="text-center">Failed to load projects.</p>';
    }
}

// Load all dynamic content when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAboutContent();
    loadSkills();
    loadProjects();
});
