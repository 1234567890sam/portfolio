// GSAP Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax effect
    gsap.to('.hero', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        opacity: 0.5
    });

    // Section fade-in animations
    const sections = gsap.utils.toArray('section:not(.hero)');
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // About section animations
    gsap.from('.about-image img', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    });

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Skills cards stagger animation
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 70%'
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Projects cards stagger animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 70%'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Contact form animation
    gsap.from('.contact-form .form-group', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%'
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll indicator hide on scroll
    gsap.to('.scroll-indicator', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=300',
            scrub: true
        },
        opacity: 0,
        y: 20
    });
});
