/**
 * api.js – Dynamic Content Loader
 * Fetches portfolio data from /api and renders into the premium UI
 */

const API_BASE = window.location.origin + '/api';

// Fast fetch with timeout – fails gracefully if DB is offline
function fetchWithTimeout(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(id));
}

/* ══════════════════════════════════════════════
   ABOUT CONTENT
   ══════════════════════════════════════════════ */
async function loadAboutContent() {
  try {
    const res  = await fetchWithTimeout(`${API_BASE}/about`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Bio text
    const bioEl = document.getElementById('bio-text');
    if (bioEl && data.bio) bioEl.textContent = data.bio;

    // Profile image (hero + about)
    if (data.profileImage) {
      const imgs = document.querySelectorAll('#about-profile-img, .profile-avatar-wrap img');
      imgs.forEach(img => { img.src = data.profileImage; });
    }

    // Social links (hero + about panel)
    const socialMap = {
      github:    { icon: 'fab fa-github',    label: 'GitHub' },
      linkedin:  { icon: 'fab fa-linkedin',  label: 'LinkedIn' },
      twitter:   { icon: 'fab fa-twitter',   label: 'Twitter' },
      email:     { icon: 'fas fa-envelope',  label: 'Email' },
      instagram: { icon: 'fab fa-instagram', label: 'Instagram' },
      whatsapp:  { icon: 'fab fa-whatsapp',  label: 'WhatsApp' }
    };

    const aboutSocials = document.getElementById('about-social-links');
    if (aboutSocials && data.socialLinks) {
      aboutSocials.innerHTML = '';
      aboutSocials.style.cssText = 'display:flex; gap:8px; flex-wrap:wrap; margin-top:16px;';
      Object.entries(data.socialLinks).forEach(([platform, url]) => {
        if (!url) return;
        const a = document.createElement('a');
        a.href   = platform === 'email' ? `mailto:${url}` : (platform === 'whatsapp' ? `https://wa.me/${url.replace(/\D/g, '')}` : url);
        a.target = '_blank';
        a.rel    = 'noopener noreferrer';
        a.setAttribute('aria-label', socialMap[platform]?.label || platform);
        a.style.cssText = `
          width:36px; height:36px; border-radius:8px;
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
          display:flex; align-items:center; justify-content:center;
          color:var(--text-secondary); font-size:14px;
          transition:all 0.25s ease; text-decoration:none;
        `;
        a.innerHTML = `<i class="${socialMap[platform]?.icon || 'fas fa-link'}" aria-hidden="true"></i>`;
        a.addEventListener('mouseenter', () => {
          a.style.background    = 'rgba(0,212,255,0.1)';
          a.style.borderColor   = 'rgba(0,212,255,0.3)';
          a.style.color         = 'var(--primary)';
          a.style.transform     = 'translateY(-2px)';
        });
        a.addEventListener('mouseleave', () => {
          a.style.background    = 'rgba(255,255,255,0.05)';
          a.style.borderColor   = 'rgba(255,255,255,0.08)';
          a.style.color         = 'var(--text-secondary)';
          a.style.transform     = '';
        });
        aboutSocials.appendChild(a);
      });
    }

    // Hero social links update
    const heroGH  = document.getElementById('hero-social-github');
    const heroLI  = document.getElementById('hero-social-linkedin');
    const heroEM  = document.getElementById('hero-social-email');
    const heroWA  = document.getElementById('hero-social-whatsapp');

    if (data.socialLinks) {
      if (heroGH  && data.socialLinks.github)   heroGH.href = data.socialLinks.github;
      if (heroLI  && data.socialLinks.linkedin)  heroLI.href = data.socialLinks.linkedin;
      if (heroEM  && data.socialLinks.email)     heroEM.href = `mailto:${data.socialLinks.email}`;
      if (heroWA  && data.socialLinks.whatsapp)  heroWA.href = `https://wa.me/${data.socialLinks.whatsapp.replace(/\D/g, '')}`;
    }

    // Contact section social links
    const ghBtn = document.getElementById('social-github-btn');
    const liBtn = document.getElementById('social-linkedin-btn');
    const twBtn = document.getElementById('social-twitter-btn');
    const igBtn = document.getElementById('social-instagram-btn');

    if (data.socialLinks) {
      if (ghBtn && data.socialLinks.github)    ghBtn.href = data.socialLinks.github;
      if (liBtn && data.socialLinks.linkedin)  liBtn.href = data.socialLinks.linkedin;
      if (twBtn && data.socialLinks.twitter)   twBtn.href = data.socialLinks.twitter;
      if (igBtn && data.socialLinks.instagram) igBtn.href = data.socialLinks.instagram;
    }

    // Resume Button Update
    const resumeBtn = document.getElementById('about-resume-btn');
    if (resumeBtn) {
      if (data.resumeUrl) {
        resumeBtn.href = data.resumeUrl;
        resumeBtn.style.display = 'inline-flex';
      } else {
        resumeBtn.style.display = 'none';
      }
    }

    // Experience Card Injection
    const expYears = document.getElementById('about-experience-years');
    const expLabel = document.getElementById('about-experience-label');
    if (data.experience) {
      if (expYears && data.experience.years) expYears.textContent = data.experience.years;
      if (expLabel && data.experience.label) expLabel.innerHTML = data.experience.label.replace(/\n/g, '<br>');
    }

    // Stats Card (Completed Projects)
    const statsCompleted = document.getElementById('stat-projects');
    if (data.stats && data.stats.completed && statsCompleted) {
      statsCompleted.textContent = data.stats.completed;
    }

    // Education Card Injection
    const eduList = document.getElementById('about-education-list');
    if (eduList && data.education && data.education.length > 0) {
      eduList.innerHTML = data.education.map(edu => `
        <li class="edu-item">
          <div class="edu-icon"><i class="${edu.icon || 'fas fa-graduation-cap'}" aria-hidden="true"></i></div>
          <div>
            <div class="edu-name">${edu.degree}</div>
            <div class="edu-year">${edu.institution} (${edu.year})</div>
          </div>
        </li>
      `).join('');
    }

    // Certifications Card Injection
    const certsList = document.getElementById('about-certs-list');
    if (certsList && data.certifications && data.certifications.length > 0) {
      certsList.innerHTML = data.certifications.map(cert => `
        <div class="edu-item">
          <div class="edu-icon">${cert.icon || '🛡️'}</div>
          <div>
            <div class="edu-name">${cert.name}</div>
            <div class="edu-year">${cert.issuer}</div>
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    console.warn('About content:', err.message);
  }
}

/* ══════════════════════════════════════════════
   SKILLS
   ══════════════════════════════════════════════ */
async function loadSkills() {
  try {
    const res    = await fetchWithTimeout(`${API_BASE}/skills`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const skills = await res.json();
    if (!skills.length) return;

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      const cat = skill.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});

    const categoryIcons = {
      Frontend:      '🎨',
      Backend:       '⚙️',
      Database:      '🗄️',
      Cloud:         '☁️',
      Cybersecurity: '🔒',
      DevOps:        '🐳',
      Mobile:        '📱',
      Other:         '💡',
      Tools:         '🛠️'
    };

    // 1. Render Skills Section categories
    const grid = document.getElementById('skills-grid');
    if (grid) {
      grid.innerHTML = '';
      Object.entries(grouped).forEach(([cat, catSkills]) => {
        const card = document.createElement('div');
        card.className = `skill-category-card`;

        card.innerHTML = `
          <div class="skill-cat-icon">${categoryIcons[cat] || '💡'}</div>
          <div class="skill-cat-name">${cat}</div>
          <div class="skill-list">
            ${catSkills.slice(0, 5).map(s => `
              <div class="skill-item">
                <span class="skill-item-name">${s.name}</span>
                <div class="skill-bar">
                  <div class="skill-bar-fill" data-width="${s.proficiency || 80}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        grid.appendChild(card);
      });
      // Animate skill bars using the shared function
      if (window.observeSkillCards) window.observeSkillCards(grid);
    }

    // 2. Render Core Skills bento card (grouped)
    const bentoSkills = document.getElementById('bento-skills-list');
    if (bentoSkills) {
      bentoSkills.innerHTML = '';
      Object.entries(grouped).slice(0, 4).forEach(([cat, catSkills]) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'bento-skill-category';
        catDiv.innerHTML = `
          <div class="skill-cat-title">${cat}</div>
          <div class="skill-pills">
            ${catSkills.slice(0, 3).map(s => `
              <span class="skill-pill"><span class="skill-dot"></span>${s.name}</span>
            `).join('')}
          </div>
        `;
        bentoSkills.appendChild(catDiv);
      });
    }

    // 3. Render Technologies bento card pills (flat list)
    const bentoTech = document.getElementById('about-tech-pills');
    if (bentoTech) {
      bentoTech.innerHTML = '';
      skills.slice(0, 12).forEach(s => {
        const pill = document.createElement('span');
        pill.className = 'skill-pill';
        let iconHtml = '';
        if (s.icon) {
          if (s.icon.trim().startsWith('<')) {
            iconHtml = s.icon; // raw FontAwesome HTML
          } else {
            iconHtml = `<span style="margin-right: 6px;">${s.icon}</span>`; // Emoji character
          }
        } else {
          iconHtml = '<span class="skill-dot"></span>'; // fallback dot
        }
        pill.innerHTML = `${iconHtml} ${s.name}`;
        bentoTech.appendChild(pill);
      });
    }

  } catch (err) {
    console.warn('Skills:', err.message);
  }
}

/* ══════════════════════════════════════════════
   PROJECTS
   ══════════════════════════════════════════════ */
async function loadProjects() {
  try {
    const res      = await fetchWithTimeout(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    if (!projects.length) return;

    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Update stats
    const statEls = document.querySelectorAll('#stat-total-projects, #stat-projects');
    statEls.forEach(el => { el.textContent = projects.length + '+'; });

    const emojiMap = ['🚀','🔒','🌐','🛒','🤖','📊','🎮','💡','⚡','🎨'];

    projects.forEach((project, idx) => {
      const card = document.createElement('article');

      const isFeatured   = idx === 0;
      const colClass     = isFeatured ? 'project-card-featured'
                         : idx === 1 ? 'project-card-sm-1'
                         : `project-card-sm-${((idx - 1) % 4) + 1}`;

      card.className = `project-card ${colClass}`;

      const imgHtml = project.image
        ? `<img class="project-image" src="${project.image}" alt="${project.title}"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
               loading="lazy">
           <div class="project-image-placeholder" style="display:none">${emojiMap[idx % emojiMap.length]}</div>`
        : `<div class="project-image-placeholder">${emojiMap[idx % emojiMap.length]}</div>`;

      const techBadges = (project.techStack || [])
        .map(t => `<span class="tech-badge">${t}</span>`)
        .join('');

      const demoBtn = project.projectUrl
        ? `<a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer"
              class="project-action-btn" aria-label="Live Demo">
             <i class="fas fa-external-link-alt" aria-hidden="true"></i>
           </a>`
        : '';

      const ghBtn = project.githubUrl
        ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"
              class="project-action-btn" aria-label="GitHub">
             <i class="fab fa-github" aria-hidden="true"></i>
           </a>`
        : '';

      const demoLink = project.projectUrl
        ? `<a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer"
              class="project-link" aria-label="Live Demo">
             <i class="fas fa-external-link-alt" aria-hidden="true"></i> Demo
           </a>` : '';

      const ghLink = project.githubUrl
        ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"
              class="project-link" aria-label="GitHub">
             <i class="fab fa-github" aria-hidden="true"></i> Code
           </a>` : '';

      const imgHeight = isFeatured ? 240 : 160;

      card.innerHTML = `
        <div class="project-image-wrap" style="height:${imgHeight}px">
          ${imgHtml}
          <div class="project-overlay"></div>
          <div class="project-actions">
            ${demoBtn}
            ${ghBtn}
          </div>
        </div>
        <div class="project-content">
          ${isFeatured ? '<div class="project-featured-badge">⭐ Featured Project</div>' : ''}
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tech-stack">${techBadges}</div>
          <div class="project-links">
            ${demoLink}
            ${ghLink}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    if (window.observeNewElements) window.observeNewElements();

  } catch (err) {
    console.warn('Projects:', err.message);
  }
}

/* ══════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadAboutContent();
  loadSkills();
  loadProjects();
});
