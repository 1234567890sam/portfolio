// Advanced About Content Management
(function () {
    const API_BASE = window.location.origin + '/api';

    // Local state for dynamic lists
    let educationList = [];
    let certificationsList = [];

    // Helper: Show Custom Toast Notification
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);

        // Auto remove toast
        setTimeout(() => {
            toast.style.animation = 'toastFadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4700);
    }

    // Dynamic Lists Rendering
    function renderEducation() {
        const container = document.getElementById('education-list');
        if (!container) return;

        if (educationList.length === 0) {
            container.innerHTML = `<p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); padding: var(--space-sm) 0;">No education items added yet.</p>`;
            return;
        }

        container.innerHTML = educationList.map((item, index) => `
            <div class="dynamic-list-item">
                <div class="item-icon-preview">
                    <i class="${item.icon || 'fas fa-graduation-cap'}"></i>
                </div>
                <div class="item-details">
                    <div class="item-title">${item.degree}</div>
                    <div class="item-subtitle">${item.institution} &bull; ${item.year}</div>
                </div>
                <div class="item-actions">
                    <button type="button" class="btn-item-action edit" onclick="window.aboutManager.editEduItem(${index})" title="Edit Item">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button type="button" class="btn-item-action delete" onclick="window.aboutManager.deleteEduItem(${index})" title="Delete Item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function renderCertifications() {
        const container = document.getElementById('certifications-list');
        if (!container) return;

        if (certificationsList.length === 0) {
            container.innerHTML = `<p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); padding: var(--space-sm) 0;">No certifications added yet.</p>`;
            return;
        }

        container.innerHTML = certificationsList.map((item, index) => `
            <div class="dynamic-list-item">
                <div class="item-icon-preview">
                    <span style="font-size: 1.25rem;">${item.icon || '🛡️'}</span>
                </div>
                <div class="item-details">
                    <div class="item-title">${item.name}</div>
                    <div class="item-subtitle">${item.issuer}</div>
                </div>
                <div class="item-actions">
                    <button type="button" class="btn-item-action edit" onclick="window.aboutManager.editCertItem(${index})" title="Edit Item">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button type="button" class="btn-item-action delete" onclick="window.aboutManager.deleteCertItem(${index})" title="Delete Item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Media Upload API call
    async function uploadFile(file, zoneId, inputId, previewId, isImage = true) {
        const zone = document.getElementById(zoneId);
        const input = document.getElementById(inputId);
        const previewWrap = document.getElementById(previewId);
        
        // Show loading state
        const originalText = zone.querySelector('p').textContent;
        const originalIcon = zone.querySelector('i').className;
        zone.querySelector('p').textContent = 'Uploading...';
        zone.querySelector('i').className = 'fas fa-spinner fa-spin';

        const formData = new FormData();
        formData.append('image', file); // API expects key 'image' for uploads

        try {
            const authHeaders = window.adminAuth.getAuthHeaders();
            const headers = {};
            if (authHeaders.Authorization) {
                headers['Authorization'] = authHeaders.Authorization;
            }

            const response = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Upload failed');
            }

            const data = await response.json();
            input.value = data.filePath;

            // Update preview
            if (isImage) {
                const img = previewWrap.querySelector('img') || document.createElement('img');
                img.src = data.filePath;
                img.id = 'profile-image-preview';
                img.alt = 'Profile Preview';
                previewWrap.innerHTML = '';
                previewWrap.appendChild(img);
            } else {
                previewWrap.innerHTML = `<i class="fas fa-file-pdf" style="font-size: 24px; color: var(--color-neon-green);"></i>`;
            }

            showToast('File uploaded successfully!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showToast(error.message || 'File upload failed', 'error');
        } finally {
            // Restore upload zone text
            zone.querySelector('p').textContent = originalText;
            zone.querySelector('i').className = originalIcon;
        }
    }

    // Setup drag-and-drop listeners
    function setupDragAndDrop(zoneId, fileInputId, onDropCallback) {
        const zone = document.getElementById(zoneId);
        const fileInput = document.getElementById(fileInputId);
        if (!zone || !fileInput) return;

        zone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                onDropCallback(e.target.files[0]);
            }
        });

        // Drag events
        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.remove('dragover');
            }, false);
        });

        zone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                onDropCallback(files[0]);
            }
        });
    }

    // Expose aboutManager globally
    window.aboutManager = {
        async loadAbout() {
            try {
                const response = await fetch(`${API_BASE}/about`);
                const about = await response.json();

                // Populate Form Fields
                document.getElementById('bio').value = about.bio || '';
                document.getElementById('profile-image').value = about.profileImage || '';
                document.getElementById('resume-url').value = about.resumeUrl || '';
                
                // Set Profile Image Preview
                if (about.profileImage) {
                    const imgPreview = document.getElementById('profile-image-preview');
                    if (imgPreview) imgPreview.src = about.profileImage;
                }

                // Set Resume Preview Icon color
                if (about.resumeUrl) {
                    const resumePreview = document.getElementById('resume-preview-wrap');
                    if (resumePreview) {
                        resumePreview.innerHTML = `<i class="fas fa-file-pdf" style="font-size: 24px; color: var(--color-neon-green);"></i>`;
                    }
                }

                // Stats & Experience
                document.getElementById('exp-years').value = about.experience?.years || '';
                document.getElementById('exp-label').value = about.experience?.label || '';
                document.getElementById('stats-completed').value = about.stats?.completed || '';

                // Social Links
                document.getElementById('github').value = about.socialLinks?.github || '';
                document.getElementById('linkedin').value = about.socialLinks?.linkedin || '';
                document.getElementById('twitter').value = about.socialLinks?.twitter || '';
                document.getElementById('instagram').value = about.socialLinks?.instagram || '';
                document.getElementById('email-contact').value = about.socialLinks?.email || '';
                document.getElementById('whatsapp').value = about.socialLinks?.whatsapp || '';

                // Load arrays
                educationList = about.education || [];
                certificationsList = about.certifications || [];

                // Render dynamic cards
                renderEducation();
                renderCertifications();

            } catch (error) {
                console.error('Error loading about content:', error);
                showToast('Error loading about content', 'error');
            }
        },

        // --- EDUCATION MODAL CONTROLS ---
        showEduModal(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            document.getElementById('education-modal-title').textContent = 'Add Education Item';
            document.getElementById('education-form').reset();
            document.getElementById('edu-index').value = '';
            document.getElementById('education-modal').classList.add('show');
        },

        closeEduModal() {
            document.getElementById('education-modal').classList.remove('show');
        },

        saveEduItem(e) {
            e.preventDefault();
            const indexStr = document.getElementById('edu-index').value;
            const item = {
                degree: document.getElementById('edu-degree').value,
                institution: document.getElementById('edu-institution').value,
                year: document.getElementById('edu-year').value,
                icon: document.getElementById('edu-icon').value
            };

            if (indexStr === '') {
                // Add new
                educationList.push(item);
                showToast('Education item added', 'success');
            } else {
                // Update existing
                const index = parseInt(indexStr);
                educationList[index] = item;
                showToast('Education item updated', 'success');
            }

            this.closeEduModal();
            renderEducation();
        },

        editEduItem(index) {
            const item = educationList[index];
            document.getElementById('education-modal-title').textContent = 'Edit Education Item';
            document.getElementById('edu-index').value = index;
            document.getElementById('edu-degree').value = item.degree;
            document.getElementById('edu-institution').value = item.institution;
            document.getElementById('edu-year').value = item.year;
            document.getElementById('edu-icon').value = item.icon || 'fas fa-graduation-cap';
            document.getElementById('education-modal').classList.add('show');
        },

        deleteEduItem(index) {
            if (confirm('Are you sure you want to delete this education item?')) {
                educationList.splice(index, 1);
                renderEducation();
                showToast('Education item deleted', 'success');
            }
        },

        // --- CERTIFICATIONS MODAL CONTROLS ---
        showCertModal(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            document.getElementById('certification-modal-title').textContent = 'Add Certification Item';
            document.getElementById('certification-form').reset();
            document.getElementById('cert-index').value = '';
            document.getElementById('certification-modal').classList.add('show');
        },

        closeCertModal() {
            document.getElementById('certification-modal').classList.remove('show');
        },

        saveCertItem(e) {
            e.preventDefault();
            const indexStr = document.getElementById('cert-index').value;
            const item = {
                name: document.getElementById('cert-name').value,
                issuer: document.getElementById('cert-issuer').value,
                icon: document.getElementById('cert-icon').value
            };

            if (indexStr === '') {
                // Add new
                certificationsList.push(item);
                showToast('Certification item added', 'success');
            } else {
                // Update existing
                const index = parseInt(indexStr);
                certificationsList[index] = item;
                showToast('Certification item updated', 'success');
            }

            this.closeCertModal();
            renderCertifications();
        },

        editCertItem(index) {
            const item = certificationsList[index];
            document.getElementById('certification-modal-title').textContent = 'Edit Certification Item';
            document.getElementById('cert-index').value = index;
            document.getElementById('cert-name').value = item.name;
            document.getElementById('cert-issuer').value = item.issuer;
            document.getElementById('cert-icon').value = item.icon || '🛡️';
            document.getElementById('certification-modal').classList.add('show');
        },

        deleteCertItem(index) {
            if (confirm('Are you sure you want to delete this certification?')) {
                certificationsList.splice(index, 1);
                renderCertifications();
                showToast('Certification item deleted', 'success');
            }
        }
    };

    // Event Listeners setup
    document.addEventListener('DOMContentLoaded', () => {
        // Form submits
        const aboutForm = document.getElementById('about-form');
        if (aboutForm) {
            aboutForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const aboutData = {
                    bio: document.getElementById('bio').value,
                    profileImage: document.getElementById('profile-image').value,
                    resumeUrl: document.getElementById('resume-url').value,
                    experience: {
                        years: document.getElementById('exp-years').value,
                        label: document.getElementById('exp-label').value
                    },
                    stats: {
                        completed: document.getElementById('stats-completed').value
                    },
                    socialLinks: {
                        github: document.getElementById('github').value,
                        linkedin: document.getElementById('linkedin').value,
                        twitter: document.getElementById('twitter').value,
                        instagram: document.getElementById('instagram').value,
                        email: document.getElementById('email-contact').value,
                        whatsapp: document.getElementById('whatsapp').value
                    },
                    education: educationList,
                    certifications: certificationsList
                };

                try {
                    const response = await fetch(`${API_BASE}/about`, {
                        method: 'PUT',
                        headers: window.adminAuth.getAuthHeaders(),
                        body: JSON.stringify(aboutData)
                    });

                    if (response.ok) {
                        showToast('About portfolio contents saved successfully!', 'success');
                    } else {
                        const data = await response.json();
                        showToast(data.error || 'Error saving about content', 'error');
                    }
                } catch (error) {
                    console.error('Error updating about content:', error);
                    showToast('Error saving about content', 'error');
                }
            });
        }

        // Setup media drag-and-drop
        setupDragAndDrop(
            'profile-upload-zone', 
            'profile-upload-file', 
            (file) => uploadFile(file, 'profile-upload-zone', 'profile-image', 'profile-image-preview-wrap', true)
        );

        setupDragAndDrop(
            'resume-upload-zone', 
            'resume-upload-file', 
            (file) => uploadFile(file, 'resume-upload-zone', 'resume-url', 'resume-preview-wrap', false)
        );
    });
})();
