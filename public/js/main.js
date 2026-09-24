/**
 * main.js – Premium Portfolio (Ultra-smooth 60/120fps Native Experience)
 * Purpose-built for maximum performance on mobile, tablet, and PC.
 * Zero layout thrashing, zero heavy canvas loops, zero scroll freezes.
 */

/* ══════════════════════════════════════════════
   1. UTILITIES
   ══════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════
   2. NAVBAR & ACTIVE NAVIGATION
   ══════════════════════════════════════════════ */
(function initNavbar() {
  const navLinks   = $$('.nav-link');
  const hamburger  = $('#nav-hamburger');
  const mobileNav  = $('#mobile-nav');
  const mobileClose= $('#mobile-nav-close');
  const logoBtn    = $('#nav-logo-btn');
  const sections   = $$('section[id]');

  // Logo click → scroll to top
  logoBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Track active section via IntersectionObserver (Zero scroll listener cost)
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
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mobile Nav Drawer Toggle
  const openMobileNav = () => {
    mobileNav?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileNav?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);

  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      closeMobileNav();
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    });
  });

  // Close mobile nav on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
  });
})();

/* ══════════════════════════════════════════════
   3. TYPING EFFECT (Clean & Lightweight)
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
      delay = 45;
    } else {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      delay = 1800; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 600);
})();

/* ══════════════════════════════════════════════
   4. SCROLL REVEAL (Fast IntersectionObserver)
   ══════════════════════════════════════════════ */
(function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  $$('.reveal, .reveal-scale').forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════════
   5. SKILL BAR ANIMATIONS
   ══════════════════════════════════════════════ */
function animateSkillBarsInCard(card) {
  $$('.skill-bar-fill', card).forEach(fill => {
    const w = fill.dataset.width || '80';
    fill.style.width = '0%';
    fill.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    requestAnimationFrame(() => {
      fill.style.width = w + '%';
    });
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
  }, { threshold: 0.15 });

  cards.forEach(card => io.observe(card));
}

(function initSkillBars() {
  observeSkillCards(document);
})();

// Expose for api.js dynamic renders
window.observeSkillCards = observeSkillCards;

/* ══════════════════════════════════════════════
   6. HERO SCROLL INDICATOR
   ══════════════════════════════════════════════ */
(function initScrollIndicator() {
  const indicator = $('#hero-scroll-indicator');
  if (!indicator) return;

  indicator.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        indicator.style.opacity = window.scrollY > 80 ? '0' : '1';
        indicator.style.pointerEvents = window.scrollY > 80 ? 'none' : 'auto';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   7. DYNAMIC CONTENT OBSERVER
   ══════════════════════════════════════════════ */
window.observeNewElements = function() {
  // Re-observe any newly injected reveal elements
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  $$('.reveal:not(.visible), .reveal-scale:not(.visible)').forEach(el => io.observe(el));
};
