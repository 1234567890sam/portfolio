// Dashboard Navigation
document.addEventListener('DOMContentLoaded', async () => {
    // Verify authentication
    const isAuthenticated = await window.adminAuth.verifyToken();
    if (!isAuthenticated) return;

    // Display admin username
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    document.getElementById('admin-username').textContent = `@${adminUser.username}`;

    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding section
            const sectionId = link.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Initial data load
    window.projectManager.loadProjects();
    window.skillManager.loadSkills();
    window.aboutManager.loadAbout();

    // Mobile menu toggle
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.setAttribute('aria-label', 'Toggle menu');
    document.body.appendChild(mobileToggle);

    const sidebar = document.querySelector('.sidebar');

    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileToggle.innerHTML = sidebar.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});
