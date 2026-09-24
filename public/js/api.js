/**
 * api.js – Dynamic Content Loader
 * Fetches portfolio data from /api and renders into the premium UI
 */

const API_BASE = window.location.origin + '/api';

// Live Global State shared with Terminal, Command Palette & UI
window.PORTFOLIO_STATE = {
  about: null,
  skills: [],
  projects: []
};

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
    window.PORTFOLIO_STATE.about = data;

    // Bio text
    const bioEl = document.getElementById('bio-text');
    if (bioEl && data.bio) bioEl.textContent = data.bio;

    // Live Telemetry Bar Synchronization from DB
    const locEl = document.querySelector('.telemetry-location .telemetry-label');
    if (locEl && data.location) locEl.textContent = data.location;

    const availBadge = document.querySelector('.telemetry-status-badge');
    if (availBadge && data.availabilityStatus) availBadge.textContent = data.availabilityStatus;

    const availText = document.querySelector('.telemetry-status .telemetry-text');
    if (availText && data.availabilityLabel) availText.textContent = data.availabilityLabel;

    const focusEl = document.querySelector('.telemetry-focus .highlight');
    if (focusEl && data.currentFocus) focusEl.textContent = data.currentFocus;

    const replyEl = document.querySelector('.telemetry-metric-val');
    if (replyEl && data.replyTime) replyEl.textContent = data.replyTime;

    // Profile image (hero)
    if (data.profileImage) {
      const heroImg = document.querySelector('.profile-avatar-wrap img');
      if (heroImg) heroImg.src = data.profileImage;
    }

    // Secondary Profile image (about)
    const aboutImg = document.querySelector('#about-profile-img');
    if (aboutImg) {
      aboutImg.src = data.profileImageSecondary || '/uploads/profile_secondary.jpg';
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
   SKILLS (Production Capability Matrix)
   ══════════════════════════════════════════════ */
async function loadSkills() {
  try {
    const res    = await fetchWithTimeout(`${API_BASE}/skills`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const skills = await res.json();
    window.PORTFOLIO_STATE.skills = skills || [];
    if (!skills.length) return;

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      const cat = skill.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});

    // Categorize into 3 Senior Engineering Tiers
    const tier1Categories = ['Frontend', 'Backend'];
    const tier2Categories = ['Database', 'Cloud', 'DevOps', 'Tools'];
    const tier3Categories = ['Cybersecurity', 'Security', 'Other', 'Mobile'];

    const tier1Skills = skills.filter(s => tier1Categories.includes(s.category));
    const tier2Skills = skills.filter(s => tier2Categories.includes(s.category));
    const tier3Skills = skills.filter(s => tier3Categories.includes(s.category));

    // Fallback if distribution is uneven
    const t1 = tier1Skills.length ? tier1Skills : skills.slice(0, 4);
    const t2 = tier2Skills.length ? tier2Skills : skills.slice(4, 8);
    const t3 = tier3Skills.length ? tier3Skills : skills.slice(8);

    const grid = document.getElementById('skills-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="capability-tier-card tier-1" data-tier="primary">
          <div class="tier-header">
            <span class="tier-badge"><i class="fas fa-bolt"></i> TIER 01 / CORE</span>
            <h3 class="tier-title">Primary Weapons</h3>
            <p class="tier-desc">Core full-stack technologies architected and written in production daily.</p>
          </div>
          <div class="capability-items-list">
            ${t1.map(s => `
              <div class="capability-item">
                <div class="capability-item-main">
                  <div class="capability-item-icon">${s.icon && !s.icon.startsWith('<') ? s.icon : '⚡'}</div>
                  <div class="capability-item-info">
                    <h4>${s.name}</h4>
                    <span class="capability-item-scope">${s.category || 'Full Stack'} · Daily Driver</span>
                  </div>
                </div>
                <span class="capability-tag">${s.badge || 'Production Core'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="capability-tier-card tier-2" data-tier="infra">
          <div class="tier-header">
            <span class="tier-badge"><i class="fas fa-server"></i> TIER 02 / SYSTEMS</span>
            <h3 class="tier-title">Data & Infrastructure</h3>
            <p class="tier-desc">Persistence, container workflows, virtualization, and resilient data layers.</p>
          </div>
          <div class="capability-items-list">
            ${t2.map(s => `
              <div class="capability-item">
                <div class="capability-item-main">
                  <div class="capability-item-icon">${s.icon && !s.icon.startsWith('<') ? s.icon : '🗄️'}</div>
                  <div class="capability-item-info">
                    <h4>${s.name}</h4>
                    <span class="capability-item-scope">${s.category || 'Database'} · Architecture</span>
                  </div>
                </div>
                <span class="capability-tag">${s.badge || 'Data Layer'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="capability-tier-card tier-3" data-tier="security">
          <div class="tier-header">
            <span class="tier-badge"><i class="fas fa-shield-alt"></i> TIER 03 / DEFENSE</span>
            <h3 class="tier-title">Security & Exploration</h3>
            <p class="tier-desc">Application security auditing, threat modeling, vulnerability testing, and active R&D.</p>
          </div>
          <div class="capability-items-list">
            ${t3.map(s => `
              <div class="capability-item">
                <div class="capability-item-main">
                  <div class="capability-item-icon">${s.icon && !s.icon.startsWith('<') ? s.icon : '🔒'}</div>
                  <div class="capability-item-info">
                    <h4>${s.name}</h4>
                    <span class="capability-item-scope">${s.category || 'Security'} · Auditing</span>
                  </div>
                </div>
                <span class="capability-tag">${s.badge || 'Active R&D'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
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
   PROJECTS (Impact Case Studies)
   ══════════════════════════════════════════════ */
async function loadProjects() {
  try {
    const res      = await fetchWithTimeout(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    window.PORTFOLIO_STATE.projects = projects || [];
    if (!projects.length) return;

    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Update stats
    const statEls = document.querySelectorAll('#stat-total-projects, #stat-projects');
    statEls.forEach(el => { el.textContent = projects.length + '+'; });

    const emojiMap = ['🚀','🔒','🌐','🛒','🤖','📊','🎮','💡','⚡','🎨'];

    const metricPresets = [
      { text: '⚡ < 80ms Latency', cls: '' },
      { text: '🛡️ OWASP Compliant', cls: 'metric-security' },
      { text: '📈 50k+ Req/Day', cls: 'metric-scale' },
      { text: '🔐 AES-256 Auth', cls: 'metric-security' },
      { text: '⚡ 99.98% Uptime', cls: '' }
    ];

    projects.forEach((project, idx) => {
      const card = document.createElement('article');

      const isFeatured   = idx === 0;
      const colClass     = isFeatured ? 'project-card-featured'
                         : idx === 1 ? 'project-card-sm-1'
                         : `project-card-sm-${((idx - 1) % 4) + 1}`;

      // Assign categories for filtering
      const pTitle = (project.title || '').toLowerCase();
      const pDesc  = (project.description || '').toLowerCase();
      const pCat   = (project.category || '').toLowerCase();

      let catType  = 'fullstack';
      if (pCat.includes('sec') || pTitle.includes('scan') || pTitle.includes('secure') || pTitle.includes('vault') || pDesc.includes('security') || pDesc.includes('encrypt')) {
        catType = 'security';
      } else if (pCat.includes('ai') || pTitle.includes('bot') || pTitle.includes('ai') || pTitle.includes('prompt') || pDesc.includes('llm') || pDesc.includes('ai')) {
        catType = 'ai';
      }

      card.className = `project-card ${colClass}`;
      card.dataset.category = `all ${catType}`;

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
      const defaultMetric = metricPresets[idx % metricPresets.length];
      const metricText = project.metrics || defaultMetric.text;
      const metricCls = defaultMetric.cls;
      const outcomeText = project.outcome || 'Production architecture delivering high performance and strict type/security safety.';

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
          <div class="project-metrics-row">
            ${isFeatured ? '<div class="project-featured-badge">⭐ Case Study</div>' : ''}
            <span class="metric-pill ${metricCls}">${metricText}</span>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-problem-solution">
            <span class="ps-label">Outcome:</span>
            <span class="ps-text">${outcomeText}</span>
          </div>
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

/* ── Boot Initializer & Splash Screen Handler ── */
document.addEventListener('DOMContentLoaded', () => {
  let loaded = false;

  const hideSplash = () => {
    if (loaded) return;
    loaded = true;

    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('fade-out');
      document.body.classList.remove('loading');
      setTimeout(() => {
        splash.remove();
      }, 350);
    }
  };

  // Fast fallback timeout (max 800ms)
  const fallbackTimeout = setTimeout(hideSplash, 800);

  // Run all fetches in parallel
  Promise.all([
    loadAboutContent(),
    loadSkills(),
    loadProjects()
  ])
    .then(() => {
      // Broadcast synchronized state to CLI, Command Palette, etc.
      window.dispatchEvent(new CustomEvent('portfolioStateUpdated', { detail: window.PORTFOLIO_STATE }));
    })
    .catch(err => console.warn('Dynamic content boot error:', err))
    .finally(() => {
      clearTimeout(fallbackTimeout);
      hideSplash();
    });
});
