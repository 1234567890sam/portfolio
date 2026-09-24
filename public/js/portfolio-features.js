/**
 * portfolio-features.js – Handcrafted Bespoke Developer Features
 * 1. Live Developer Telemetry & Real-Time IST Clock
 * 2. Global Command Palette (Cmd+K / Ctrl+K)
 * 3. Interactive Developer CLI Terminal (msaad-cli)
 * 4. Production Capability Matrix Filtering
 * 5. Case Study Impact Tag Filtering
 * 6. Native Toast Notifications
 */

(function initPortfolioFeatures() {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     0. TOAST NOTIFICATION UTILITY
     ────────────────────────────────────────────────────────── */
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  function showToast(message, icon = 'fas fa-info-circle') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon} toast-icon" aria-hidden="true"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
  window.showToast = showToast;

  /* ──────────────────────────────────────────────────────────
     1. LIVE DEVELOPER TELEMETRY & IST CLOCK
     ────────────────────────────────────────────────────────── */
  function updateTelemetryClock() {
    const clockEl = document.getElementById('telemetry-time');
    if (!clockEl) return;

    try {
      const now = new Date();
      // Format specifically in Indian Standard Time (Asia/Kolkata)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `${timeStr} IST`;
    } catch (e) {
      // Fallback if timezone not supported
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      clockEl.textContent = istDate.toLocaleTimeString() + ' IST';
    }
  }

  setInterval(updateTelemetryClock, 1000);
  updateTelemetryClock();

  /* ──────────────────────────────────────────────────────────
     2. GLOBAL COMMAND PALETTE (CMD+K / CTRL+K)
     ────────────────────────────────────────────────────────── */
  const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
  const cmdInput    = document.getElementById('cmd-palette-input');
  const cmdResults  = document.getElementById('cmd-palette-results');
  const cmdNavBtn   = document.getElementById('nav-cmd-btn');
  const mobileCmdBtn= document.getElementById('mobile-cmd-btn');

  // Command Palette Registry
  const COMMANDS = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Home',
      desc: 'Jump to top hero section',
      icon: 'fas fa-home',
      badge: 'Section',
      action: () => scrollToSection('home')
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      title: 'About Me & Bento',
      desc: 'View bio, education, and credentials',
      icon: 'fas fa-user',
      badge: 'Section',
      action: () => scrollToSection('about')
    },
    {
      id: 'nav-terminal',
      category: 'Navigation',
      title: 'Developer Terminal Sandbox',
      desc: 'Jump to interactive retro CLI',
      icon: 'fas fa-terminal',
      badge: 'CLI',
      action: () => {
        scrollToSection('terminal');
        const termInput = document.getElementById('terminal-input');
        if (termInput) setTimeout(() => termInput.focus(), 600);
      }
    },
    {
      id: 'nav-skills',
      category: 'Navigation',
      title: 'Production Capability Matrix',
      desc: 'Explore engineering tiers and stack',
      icon: 'fas fa-layer-group',
      badge: 'Section',
      action: () => scrollToSection('skills')
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Featured Projects & Case Studies',
      desc: 'View production work with metrics',
      icon: 'fas fa-folder-open',
      badge: 'Section',
      action: () => scrollToSection('projects')
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Contact & Inquiries',
      desc: 'Direct channels, email & WhatsApp',
      icon: 'fas fa-paper-plane',
      badge: 'Section',
      action: () => scrollToSection('contact')
    },

    // Developer Actions
    {
      id: 'act-copy-email',
      category: 'Developer Actions',
      title: 'Copy Email Address',
      desc: 'work.msaad@gmail.com',
      icon: 'fas fa-envelope',
      badge: 'Copy',
      action: () => {
        navigator.clipboard.writeText('work.msaad@gmail.com');
        showToast('Email copied to clipboard: work.msaad@gmail.com', 'fas fa-check-circle');
      }
    },
    {
      id: 'act-resume',
      category: 'Developer Actions',
      title: 'Download / View Resume',
      desc: 'Open official PDF CV',
      icon: 'fas fa-file-pdf',
      badge: 'Resume',
      action: () => {
        const resumeBtn = document.getElementById('about-resume-btn');
        if (resumeBtn && resumeBtn.href && resumeBtn.href !== '#') {
          window.open(resumeBtn.href, '_blank');
        } else {
          window.open('/uploads/profile.jpg', '_blank');
        }
        showToast('Opening Resume...', 'fas fa-file-pdf');
      }
    },
    {
      id: 'act-github',
      category: 'Developer Actions',
      title: 'Open GitHub Profile',
      desc: 'github.com/m-saad-shaikh',
      icon: 'fab fa-github',
      badge: 'External',
      action: () => window.open('https://github.com/m-saad-shaikh/', '_blank')
    },
    {
      id: 'act-linkedin',
      category: 'Developer Actions',
      title: 'Open LinkedIn Profile',
      desc: 'Connect with Saad on LinkedIn',
      icon: 'fab fa-linkedin',
      badge: 'External',
      action: () => window.open('https://in.linkedin.com/in/m-saad-shaikh-795814345', '_blank')
    },
    {
      id: 'act-whatsapp',
      category: 'Developer Actions',
      title: 'Message on WhatsApp',
      desc: 'Instant direct messaging (+91 9423183735)',
      icon: 'fab fa-whatsapp',
      badge: 'Direct',
      action: () => window.open('https://wa.me/919423183735', '_blank')
    },

    // Quick Project Filters
    {
      id: 'proj-filter-all',
      category: 'Projects Filter',
      title: 'Filter: All Projects',
      desc: 'Show all production case studies',
      icon: 'fas fa-th-large',
      badge: 'Filter',
      action: () => {
        scrollToSection('projects');
        filterProjectsByCategory('all');
      }
    },
    {
      id: 'proj-filter-fullstack',
      category: 'Projects Filter',
      title: 'Filter: Full Stack Systems',
      desc: 'Next.js, React, Node.js & databases',
      icon: 'fas fa-code',
      badge: 'Filter',
      action: () => {
        scrollToSection('projects');
        filterProjectsByCategory('fullstack');
      }
    },
    {
      id: 'proj-filter-security',
      category: 'Projects Filter',
      title: 'Filter: Cybersecurity & Auditing',
      desc: 'Pentesting, OWASP, encryption tools',
      icon: 'fas fa-shield-alt',
      badge: 'Filter',
      action: () => {
        scrollToSection('projects');
        filterProjectsByCategory('security');
      }
    },

    // Interactive Terminal Actions
    {
      id: 'term-run-help',
      category: 'Terminal Quick Run',
      title: 'Run CLI "help"',
      desc: 'List all commands inside mini-terminal',
      icon: 'fas fa-terminal',
      badge: 'CLI',
      action: () => {
        scrollToSection('terminal');
        executeTerminalCommand('help');
      }
    },
    {
      id: 'term-run-skills',
      category: 'Terminal Quick Run',
      title: 'Run CLI "skills"',
      desc: 'Query stack matrix from CLI',
      icon: 'fas fa-microchip',
      badge: 'CLI',
      action: () => {
        scrollToSection('terminal');
        executeTerminalCommand('skills');
      }
    },
    {
      id: 'term-run-hire',
      category: 'Terminal Quick Run',
      title: 'Run CLI "hire"',
      desc: 'Initiate inquiry flow',
      icon: 'fas fa-briefcase',
      badge: 'CLI',
      action: () => {
        scrollToSection('terminal');
        executeTerminalCommand('hire');
      }
    }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...COMMANDS];

  function openCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.style.display = 'flex';
    requestAnimationFrame(() => {
      cmdBackdrop.classList.add('open');
      cmdInput.value = '';
      filterCommands('');
      cmdInput.focus();
    });
    document.body.style.overflow = 'hidden';
  }

  function closeCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('open');
    setTimeout(() => {
      cmdBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    }, 200);
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderCommands() {
    if (!cmdResults) return;
    cmdResults.innerHTML = '';

    if (!filteredCommands.length) {
      cmdResults.innerHTML = `<div class="cmd-palette-empty">No commands or actions matching your query.</div>`;
      return;
    }

    // Group by category
    const groups = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });

    let globalIdx = 0;
    Object.entries(groups).forEach(([category, items]) => {
      const header = document.createElement('div');
      header.className = 'cmd-category-header';
      header.textContent = category;
      cmdResults.appendChild(header);

      items.forEach(cmd => {
        const itemEl = document.createElement('div');
        itemEl.className = `cmd-item ${globalIdx === selectedIndex ? 'active' : ''}`;
        itemEl.dataset.index = globalIdx;

        itemEl.innerHTML = `
          <div class="cmd-item-left">
            <div class="cmd-item-icon"><i class="${cmd.icon}" aria-hidden="true"></i></div>
            <div>
              <div class="cmd-item-title">${cmd.title}</div>
              <div class="cmd-item-desc">${cmd.desc}</div>
            </div>
          </div>
          <span class="cmd-item-badge">${cmd.badge}</span>
        `;

        itemEl.addEventListener('click', () => {
          closeCommandPalette();
          cmd.action();
        });

        itemEl.addEventListener('mouseenter', () => {
          selectedIndex = Number(itemEl.dataset.index);
          updateActiveItem();
        });

        cmdResults.appendChild(itemEl);
        globalIdx++;
      });
    });

    scrollActiveIntoView();
  }

  function updateActiveItem() {
    const items = cmdResults.querySelectorAll('.cmd-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === selectedIndex);
    });
    scrollActiveIntoView();
  }

  function scrollActiveIntoView() {
    const active = cmdResults.querySelector('.cmd-item.active');
    if (active) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  function filterCommands(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      filteredCommands = [...COMMANDS];
    } else {
      filteredCommands = COMMANDS.filter(cmd =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.desc.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.id.toLowerCase().includes(q)
      );
    }
    selectedIndex = 0;
    renderCommands();
  }

  // Keyboard navigation inside Palette
  cmdInput?.addEventListener('input', e => {
    filterCommands(e.target.value);
  });

  cmdInput?.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredCommands.length) {
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        updateActiveItem();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredCommands.length) {
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        updateActiveItem();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        closeCommandPalette();
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      closeCommandPalette();
    }
  });

  // Global Shortcut listener (Cmd+K / Ctrl+K / slash)
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdBackdrop?.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openCommandPalette();
    } else if (e.key === 'Escape' && cmdBackdrop?.classList.contains('open')) {
      closeCommandPalette();
    }
  });

  cmdBackdrop?.addEventListener('click', e => {
    if (e.target === cmdBackdrop) closeCommandPalette();
  });

  cmdNavBtn?.addEventListener('click', openCommandPalette);
  mobileCmdBtn?.addEventListener('click', openCommandPalette);

  /* ──────────────────────────────────────────────────────────
     3. INTERACTIVE DEVELOPER CLI TERMINAL (msaad-cli)
     ────────────────────────────────────────────────────────── */
  const terminalForm   = document.getElementById('terminal-form');
  const terminalInput  = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const termBtnClear   = document.getElementById('term-btn-clear');
  const termBtnCopy    = document.getElementById('term-btn-copy');

  const history = [];
  let historyIndex = -1;

  const TERMINAL_COMMANDS = {
    help: () => `
<div class="terminal-table">
  <div class="terminal-table-key">help</div><div class="terminal-table-val">Show available CLI commands</div>
  <div class="terminal-table-key">bio</div><div class="terminal-table-val">Read my engineering philosophy & background</div>
  <div class="terminal-table-key">skills</div><div class="terminal-table-val">Display production capability stack matrix</div>
  <div class="terminal-table-key">projects</div><div class="terminal-table-val">Query featured projects & performance metrics</div>
  <div class="terminal-table-key">telemetry</div><div class="terminal-table-val">Print system status, IST clock, & uptime</div>
  <div class="terminal-table-key">contact</div><div class="terminal-table-val">Display interactive communication channels</div>
  <div class="terminal-table-key">hire</div><div class="terminal-table-val">Initiate freelance inquiry / role booking</div>
  <div class="terminal-table-key">theme</div><div class="terminal-table-val">Toggle terminal color accents</div>
  <div class="terminal-table-key">whoami</div><div class="terminal-table-val">Display visitor context</div>
  <div class="terminal-table-key">date</div><div class="terminal-table-val">Print current Indian Standard Time (IST)</div>
  <div class="terminal-table-key">clear</div><div class="terminal-table-val">Wipe screen buffer</div>
</div>`,

    bio: async () => {
      let about = window.PORTFOLIO_STATE?.about;
      if (!about) {
        try {
          const res = await fetch('/api/about');
          if (res.ok) {
            about = await res.json();
            if (window.PORTFOLIO_STATE) window.PORTFOLIO_STATE.about = about;
          }
        } catch (e) {}
      }
      const bioText = about?.bio || 'Full Stack Developer & Cybersecurity Enthusiast based in Pune, India.';
      const focus = about?.currentFocus || 'Distributed Systems & Pentesting';
      return `
<p><strong>M Saad Shaikh</strong> – Full Stack Developer & Cybersecurity Enthusiast</p>
<p style="margin-top:6px; color:#cbd5e1; line-height:1.6;">${bioText}</p>
<p style="margin-top:6px; color:#38bdf8; font-size:12px;"><strong>Current Focus:</strong> ${focus}</p>`;
    },

    skills: async () => {
      let list = window.PORTFOLIO_STATE?.skills;
      if (!list || !list.length) {
        try {
          const res = await fetch('/api/skills');
          if (res.ok) {
            list = await res.json();
            if (window.PORTFOLIO_STATE) window.PORTFOLIO_STATE.skills = list;
          }
        } catch (e) {}
      }
      if (!list || !list.length) {
        return '<p style="color:#94a3b8;">No skills found in database.</p>';
      }
      const grouped = {};
      list.forEach(s => {
        const cat = s.category || 'Other';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(s);
      });
      return `
<div style="display:flex; flex-direction:column; gap:8px;">
  <p style="color:#38bdf8; font-weight:700;">[DATABASE CONNECTED: ${list.length} LIVE SKILLS]</p>
  ${Object.entries(grouped).map(([cat, items]) => `
    <div>
      <span style="color:#00d4ff; font-weight:600; font-size:12px;">// ${cat.toUpperCase()} (${items.length})</span>
      <p style="color:#cbd5e1; margin-top:2px; font-size:12px; line-height:1.5;">
        ${items.map(s => `${s.name}${s.badge ? ` <span style="color:#94a3b8; font-size:11px;">[${s.badge}]</span>` : ''}`).join(' · ')}
      </p>
    </div>
  `).join('')}
</div>`;
    },

    projects: async () => {
      let list = window.PORTFOLIO_STATE?.projects;
      if (!list || !list.length) {
        try {
          const res = await fetch('/api/projects');
          if (res.ok) {
            list = await res.json();
            if (window.PORTFOLIO_STATE) window.PORTFOLIO_STATE.projects = list;
          }
        } catch (e) {}
      }
      if (!list || !list.length) {
        return '<p style="color:#94a3b8;">No projects found in database.</p>';
      }
      return `
<div style="display:flex; flex-direction:column; gap:10px;">
  <p style="color:#38bdf8; font-weight:700;">[DATABASE CONNECTED: ${list.length} LIVE PROJECTS]</p>
  ${list.map((p, i) => `
    <div style="padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
      <div>
        <strong style="color:#f8fafc;">${i + 1}. ${p.title}</strong>
        <span style="color:#00d4ff; margin-left:6px; font-size:12px;">[${p.category || 'Full Stack'}]</span>
        ${p.metrics ? `<span style="color:#34d399; margin-left:6px; font-size:12px;">[${p.metrics}]</span>` : ''}
      </div>
      ${p.description ? `<p style="margin:3px 0; color:#94a3b8; font-size:12px;">${p.description}</p>` : ''}
      ${p.outcome ? `<p style="margin:2px 0; color:#cbd5e1; font-size:11px;"><em>Outcome: ${p.outcome}</em></p>` : ''}
      <div style="margin-top:4px; font-size:11px; display:flex; gap:12px;">
        ${p.projectUrl ? `<a href="${p.projectUrl}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; text-decoration:none;">↗ Live Demo</a>` : ''}
        ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" style="color:#a78bfa; text-decoration:none;">↗ Source Code</a>` : ''}
        <a href="#projects" onclick="window.scrollToSection && window.scrollToSection('projects')" style="color:#94a3b8; text-decoration:none;">↗ View in Grid</a>
      </div>
    </div>
  `).join('')}
</div>`;
    },

    telemetry: async () => {
      let about = window.PORTFOLIO_STATE?.about;
      if (!about) {
        try {
          const res = await fetch('/api/about');
          if (res.ok) {
            about = await res.json();
            if (window.PORTFOLIO_STATE) window.PORTFOLIO_STATE.about = about;
          }
        } catch (e) {}
      }
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).format(now);
      const location = about?.location || 'Pune, Maharashtra, India 🇮🇳';
      const status = about?.availabilityLabel || 'Online & Available for Projects';
      const replyTime = about?.replyTime || '< 12 Hours';
      const currentFocus = about?.currentFocus || 'Distributed Systems & Pentesting';

      return `
<div class="terminal-table">
  <div class="terminal-table-key">Location</div><div class="terminal-table-val">${location}</div>
  <div class="terminal-table-key">Local Time</div><div class="terminal-table-val">${timeStr} IST</div>
  <div class="terminal-table-key">Status</div><div class="terminal-table-val" style="color:#34d399;">● ${status}</div>
  <div class="terminal-table-key">Current Focus</div><div class="terminal-table-val" style="color:#38bdf8;">${currentFocus}</div>
  <div class="terminal-table-key">Avg Reply</div><div class="terminal-table-val">${replyTime}</div>
  <div class="terminal-table-key">Database Sync</div><div class="terminal-table-val" style="color:#a78bfa;">Active (Live MongoDB)</div>
</div>`;
    },

    contact: async () => {
      let about = window.PORTFOLIO_STATE?.about;
      if (!about) {
        try {
          const res = await fetch('/api/about');
          if (res.ok) {
            about = await res.json();
            if (window.PORTFOLIO_STATE) window.PORTFOLIO_STATE.about = about;
          }
        } catch (e) {}
      }
      const s = about?.socialLinks || {};
      const email = s.email || 'work.msaad@gmail.com';
      const li = s.linkedin || 'https://in.linkedin.com/in/m-saad-shaikh-795814345';
      const gh = s.github || 'https://github.com/m-saad-shaikh/';
      const wa = s.whatsapp || '+91 9423183735';
      return `
<div class="terminal-table">
  <div class="terminal-table-key">Email</div><div class="terminal-table-val"><a href="mailto:${email}">${email}</a></div>
  <div class="terminal-table-key">LinkedIn</div><div class="terminal-table-val"><a href="${li}" target="_blank">${li}</a></div>
  <div class="terminal-table-key">GitHub</div><div class="terminal-table-val"><a href="${gh}" target="_blank">${gh}</a></div>
  <div class="terminal-table-key">WhatsApp</div><div class="terminal-table-val"><a href="${wa.startsWith('http') ? wa : `https://wa.me/${wa.replace(/\\D/g, '')}`}" target="_blank">${wa}</a></div>
</div>`;
    },

    hire: () => `
<div style="background:rgba(0,212,255,0.06); padding:10px; border-left:3px solid #00D4FF; border-radius:4px;">
  <p><strong>Booking / Inquiry Initiated ⚡</strong></p>
  <p style="margin-top:4px; color:#cbd5e1;">I am actively taking select freelance projects and full-time opportunities.</p>
  <p style="margin-top:6px;">
    👉 <a href="#contact" onclick="window.scrollToSection && window.scrollToSection('contact')">Jump directly to the Contact Form</a> or send an email to <a href="mailto:work.msaad@gmail.com">work.msaad@gmail.com</a>.
  </p>
</div>`,

    whoami: () => `
<p>visitor@msaad-portfolio (authenticated via web-sandbox session). Permissions: [READ, EXECUTE, INTERACT]. Welcome!</p>`,

    date: () => {
      const now = new Date();
      return `<p>${now.toString()} (IST: ${now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })})</p>`;
    },

    sudo: () => `
<p style="color:#ef4444;">🔒 Permission denied: M Saad Shaikh holds sole root privilege. Try 'hire' or 'contact' instead.</p>`,

    theme: () => {
      const colors = ['#00D4FF', '#10B981', '#8B5CF6', '#F59E0B'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      document.querySelector('.terminal-window')?.style.setProperty('--primary', randomColor);
      return `<p>Terminal accent shifted to <span style="color:${randomColor}; font-weight:700;">${randomColor}</span>.</p>`;
    }
  };

  async function executeTerminalCommand(rawCmd) {
    if (!terminalOutput) return;
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    // Append executed command to output
    const entry = document.createElement('div');
    entry.className = 'terminal-entry';
    entry.innerHTML = `
      <div class="terminal-command-line">
        <span class="prompt-tag">visitor@msaad-mac:~$</span>
        <span class="cmd-text">${rawCmd}</span>
      </div>
      <div class="terminal-output-content">
        <p style="color:#64748b;">Processing command...</p>
      </div>
    `;

    terminalOutput.appendChild(entry);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    const contentEl = entry.querySelector('.terminal-output-content');

    try {
      if (TERMINAL_COMMANDS[cmd]) {
        const handler = TERMINAL_COMMANDS[cmd];
        const res = typeof handler === 'function' ? handler() : handler;
        const resolved = (res instanceof Promise) ? await res : res;
        contentEl.innerHTML = resolved;
      } else {
        contentEl.innerHTML = `<p style="color:#f87171;">Command not found: "${rawCmd}". Type <strong style="color:#38bdf8;">help</strong> to view available commands.</p>`;
      }
    } catch (err) {
      contentEl.innerHTML = `<p style="color:#ef4444;">Error: ${err.message}</p>`;
    }
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  terminalForm?.addEventListener('submit', e => {
    e.preventDefault();
    const val = terminalInput.value;
    if (val.trim()) {
      history.push(val);
      historyIndex = history.length;
      executeTerminalCommand(val);
      terminalInput.value = '';
    }
  });

  terminalInput?.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  // Quick Run Chips
  document.querySelectorAll('.term-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd) {
        if (terminalInput) terminalInput.value = cmd;
        executeTerminalCommand(cmd);
        if (cmd !== 'clear' && terminalInput) terminalInput.value = '';
      }
    });
  });

  termBtnClear?.addEventListener('click', () => {
    if (terminalOutput) terminalOutput.innerHTML = '';
    showToast('Terminal buffer cleared', 'fas fa-eraser');
  });

  termBtnCopy?.addEventListener('click', () => {
    if (terminalOutput) {
      navigator.clipboard.writeText(terminalOutput.innerText);
      showToast('Terminal text copied to clipboard', 'fas fa-copy');
    }
  });

  /* ──────────────────────────────────────────────────────────
     4. PRODUCTION CAPABILITY MATRIX TIER FILTERING
     ────────────────────────────────────────────────────────── */
  const matrixFilterBtns = document.querySelectorAll('.matrix-filter-btn');
  const capabilityCards   = document.querySelectorAll('.capability-tier-card');

  matrixFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      matrixFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.tier;
      capabilityCards.forEach(card => {
        if (filter === 'all' || card.dataset.tier === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ──────────────────────────────────────────────────────────
     5. CASE STUDY IMPACT & TECH FILTERING (PROJECTS)
     ────────────────────────────────────────────────────────── */
  function filterProjectsByCategory(cat) {
    const filterPills = document.querySelectorAll('.project-filter-pill');
    filterPills.forEach(p => p.classList.toggle('active', p.dataset.cat === cat));

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const cardCats = (card.dataset.category || 'all fullstack').toLowerCase();
      if (cat === 'all' || cardCats.includes(cat.toLowerCase())) {
        card.style.display = '';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });
  }

  const projectFilterPills = document.querySelectorAll('.project-filter-pill');
  projectFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterProjectsByCategory(pill.dataset.cat);
    });
  });

  // Interactive tech badge click filter
  document.addEventListener('click', e => {
    const badge = e.target.closest('.tech-badge');
    if (!badge) return;

    const techName = badge.textContent.trim().toLowerCase();
    const allBadges = document.querySelectorAll('.tech-badge');
    const isAlreadyActive = badge.classList.contains('active');

    allBadges.forEach(b => b.classList.remove('active'));

    if (isAlreadyActive) {
      // Clear filter
      document.querySelectorAll('.project-card').forEach(c => (c.style.display = ''));
      showToast('Tech filter cleared', 'fas fa-filter');
    } else {
      badge.classList.add('active');
      let matchCount = 0;
      document.querySelectorAll('.project-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(techName)) {
          card.style.display = '';
          card.style.opacity = '1';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });
      showToast(`Showing ${matchCount} projects built with ${badge.textContent}`, 'fas fa-filter');
    }
  });

  // Synchronize Command Palette with live Database Projects
  window.addEventListener('portfolioStateUpdated', e => {
    const projects = e.detail?.projects || [];
    if (!projects.length) return;

    // Remove any previously added live projects
    const baseCommands = COMMANDS.filter(c => !c.id.startsWith('dyn-proj-'));
    COMMANDS.length = 0;
    COMMANDS.push(...baseCommands);

    projects.forEach((proj, idx) => {
      COMMANDS.push({
        id: `dyn-proj-${proj._id || idx}`,
        category: 'Projects (Database)',
        title: proj.title,
        desc: proj.metrics || (proj.description ? proj.description.slice(0, 60) + '...' : 'Live Project'),
        icon: 'fas fa-rocket',
        badge: proj.category || 'Project',
        action: () => {
          if (proj.projectUrl) {
            window.open(proj.projectUrl, '_blank');
          } else {
            scrollToSection('projects');
          }
        }
      });
    });
  });

  // Expose global helper for outside calls
  window.executeTerminalCommand = executeTerminalCommand;
  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;
  window.scrollToSection = scrollToSection;
  window.filterProjectsByCategory = filterProjectsByCategory;
})();
