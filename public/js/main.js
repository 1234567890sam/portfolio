/**
 * main.js – Premium Portfolio 2026
 * Handles: Navbar, Typing, Scroll Animations, Tilt, Magnetic Buttons,
 *          GSAP Parallax, Skill Bars, Mobile Nav
 */

/* ══════════════════════════════════════════════
   1. INIT & UTILITIES
   ══════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/* ══════════════════════════════════════════════
   2. NAVBAR – Floating + Active Links
   ══════════════════════════════════════════════ */
(function initNavbar() {
  const navbar     = $('#navbar');
  const navLinks   = $$('.nav-link');
  const hamburger  = $('#nav-hamburger');
  const mobileNav  = $('#mobile-nav');
  const mobileClose= $('#mobile-nav-close');
  const logoBtn    = $('#nav-logo-btn');
  const sections   = $$('section[id]');

  // Logo click → top
  logoBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Active link on scroll (Intersection Observer)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Mobile Nav
  hamburger?.addEventListener('click', () => {
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileClose?.addEventListener('click', closeMobileNav);

  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      closeMobileNav();
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
  });
})();

/* ══════════════════════════════════════════════
   3. TYPING EFFECT
   ══════════════════════════════════════════════ */
(function initTyping() {
  const el = $('#typing-text');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'Cybersecurity Enthusiast',
    'UI/UX Craftsman',
    'Open Source Contributor',
    'Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let delay       = 120;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      delay = 55;
    } else {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      delay = 110;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      delay = 1800; // pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();

/* ══════════════════════════════════════════════
   4. SCROLL REVEAL
   ══════════════════════════════════════════════ */
(function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal, .reveal-scale').forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════════
   5. SKILL BAR ANIMATIONS
   ══════════════════════════════════════════════ */
function animateSkillBarsInCard(card) {
  $$('.skill-bar-fill', card).forEach(fill => {
    const w = fill.dataset.width || '80';
    fill.style.width = '0%';
    fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
    setTimeout(() => { fill.style.width = w + '%'; }, 100);
  });
}

function observeSkillCards(container) {
  const cards = $$(`.skill-category-card`, container || document);
  if (!cards.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBarsInCard(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

  cards.forEach(card => io.observe(card));
}

(function initSkillBars() {
  observeSkillCards(document);
})();

// Expose for api.js to call after dynamic render
window.observeSkillCards = observeSkillCards;

/* ══════════════════════════════════════════════
   6. GSAP ANIMATIONS (if GSAP is loaded)
   ══════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax
  gsap.to('.hero-left', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 80,
    opacity: 0.6,
    ease: 'none'
  });

  // NOTE: We don't use GSAP to animate opacity on bento/skill/project cards
  // because the CSS reveal system handles that. GSAP only does hero parallax.

  // Hero orbs parallax
  gsap.to('.orb-1', {
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 2 },
    y: -120, ease: 'none'
  });
  gsap.to('.orb-2', {
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1.5 },
    y: -80, ease: 'none'
  });
}

/* ══════════════════════════════════════════════
   7. 3D CARD TILT EFFECT (Performance Optimized)
   ══════════════════════════════════════════════ */
(function initTilt() {
  const cards = $$('.bento-card, .project-card, .skill-category-card, .contact-panel, .glass-card');

  cards.forEach(card => {
    let rect = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect(); // Cache bounding rect on enter
    });

    card.addEventListener('mousemove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const maxTilt = 8;

      card.style.transform = `
        perspective(800px)
        rotateX(${clamp(-y * maxTilt, -maxTilt, maxTilt)}deg)
        rotateY(${clamp(x * maxTilt, -maxTilt, maxTilt)}deg)
        translateY(-4px)
        scale(1.01)
      `;
      card.style.transition = 'transform 0.08s ease';
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
})();

/* ══════════════════════════════════════════════
   8. MAGNETIC BUTTONS (Performance Optimized)
   ══════════════════════════════════════════════ */
(function initMagneticButtons() {
  const btns = $$('.btn-primary, .btn-ghost');

  btns.forEach(btn => {
    let rect = null;

    btn.addEventListener('mouseenter', () => {
      rect = btn.getBoundingClientRect(); // Cache bounding rect
    });

    btn.addEventListener('mousemove', e => {
      if (!rect) rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.3;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      btn.style.transition = 'transform 0.08s ease';
    });

    btn.addEventListener('mouseleave', () => {
      rect = null;
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
})();

/* ══════════════════════════════════════════════
   9. HERO SCROLL INDICATOR
   ══════════════════════════════════════════════ */
(function initScrollIndicator() {
  const indicator = $('#hero-scroll-indicator');
  indicator?.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (indicator) {
      indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   10. CUSTOM CURSOR (GPU Accelerated translate3d)
   ══════════════════════════════════════════════ */
(function initCursor() {
  if (window.innerWidth < 768) return;

  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(0, 212, 255, 0.7);
    mix-blend-mode: screen;
    transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
    top: 0; left: 0;
    transform: translate3d(-50%, -50%, 0);
    will-change: transform;
  `;

  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9997;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid rgba(0, 212, 255, 0.3);
    transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
    top: 0; left: 0;
    transform: translate3d(-50%, -50%, 0);
    will-change: transform;
  `;

  document.body.appendChild(ring);
  document.body.appendChild(cursor);

  let curX = -100, curY = -100, ringX = -100, ringY = -100;

  document.addEventListener('mousemove', e => {
    curX = e.clientX; curY = e.clientY;
    cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate3d(-50%, -50%, 0)`;
  });

  function animateRing() {
    ringX += (curX - ringX) * 0.15;
    ringY += (curY - ringY) * 0.15;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand on interactive elements
  const hoverEls = $$('a, button, .bento-card, .project-card, .skill-category-card, .contact-channel');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '40px';
      cursor.style.height = '40px';
      cursor.style.opacity = '0.4';
      ring.style.width    = '60px';
      ring.style.height   = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursor.style.opacity = '0.7';
      ring.style.width    = '36px';
      ring.style.height   = '36px';
    });
  });
})();

/* ══════════════════════════════════════════════
   11. PARTICLE / GRID DOTS BACKGROUND (Intersection Observer Optimized)
   ══════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = `
    position: fixed; inset: 0; pointer-events: none;
    z-index: -1; opacity: 0.5;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;
  let isSimulating = false;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles(n = 50) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1
    }));
  }

  function draw() {
    if (!isSimulating) return; // Halt simulation loop when not visible
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();
    });

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  particles = createParticles();

  window.addEventListener('resize', () => { 
    resize(); 
    particles = createParticles(); 
  }, { passive: true });

  // Observe canvas so simulation runs only when visible on screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isSimulating) {
          isSimulating = true;
          draw();
        }
      } else {
        isSimulating = false;
      }
    });
  }, { threshold: 0.01 });

  observer.observe(canvas);
})();

/* ══════════════════════════════════════════════
   12. PERFORMANCE – Reduced Motion
   ══════════════════════════════════════════════ */
(function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ══════════════════════════════════════════════
   13. DOMContentLoaded – Boot sequence
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // GSAP (loaded async, might be ready)
  if (typeof gsap !== 'undefined') {
    initGSAP();
  } else {
    // Wait for GSAP to load
    const checkGSAP = setInterval(() => {
      if (typeof gsap !== 'undefined') {
        clearInterval(checkGSAP);
        initGSAP();
      }
    }, 100);
  }
});

/* Re-observe dynamically added elements (used by api.js - Performance Optimized) */
window.observeNewElements = function() {
  $$('.bento-card, .project-card, .skill-category-card').forEach(el => {
    let rect = null;
    el.addEventListener('mouseenter', () => {
      rect = el.getBoundingClientRect(); // Cache rect on enter
    });
    el.addEventListener('mousemove', e => {
      if (!rect) rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px) scale(1.01)`;
      el.style.transition = 'transform 0.08s ease';
    });
    el.addEventListener('mouseleave', () => {
      rect = null;
      el.style.transform = '';
      el.style.transition = 'transform 0.5s ease';
    });
  });
};
