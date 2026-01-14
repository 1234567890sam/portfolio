// About Content Management
(function () {
    const API_BASE = window.location.origin + '/api';

    window.aboutManager = {
        async loadAbout() {
            try {
                const response = await fetch(`${API_BASE}/about`);
                const about = await response.json();

                // Populate form
                document.getElementById('bio').value = about.bio;
                document.getElementById('github').value = about.socialLinks.github || '';
                document.getElementById('linkedin').value = about.socialLinks.linkedin || '';
                document.getElementById('twitter').value = about.socialLinks.twitter || '';
                document.getElementById('email-contact').value = about.socialLinks.email || '';
            } catch (error) {
                console.error('Error loading about content:', error);
                alert('Error loading about content');
            }
        }
    };

    // About form submission
    document.addEventListener('DOMContentLoaded', () => {
        const aboutForm = document.getElementById('about-form');
        if (aboutForm) {
            aboutForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const aboutData = {
                    bio: document.getElementById('bio').value,
                    socialLinks: {
                        github: document.getElementById('github').value,
                        linkedin: document.getElementById('linkedin').value,
                        twitter: document.getElementById('twitter').value,
                        email: document.getElementById('email-contact').value
                    }
                };

                try {
                    const response = await fetch(`${API_BASE}/about`, {
                        method: 'PUT',
                        headers: window.adminAuth.getAuthHeaders(),
                        body: JSON.stringify(aboutData)
                    });

                    if (response.ok) {
                        alert('About content updated successfully');
                    } else {
                        const data = await response.json();
                        alert(data.error || 'Error updating about content');
                    }
                } catch (error) {
                    console.error('Error updating about content:', error);
                    alert('Error updating about content');
                }
            });
        }
    });
})();
