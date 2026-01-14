// Project Management
(function () {
    const API_BASE = window.location.origin + '/api';

    window.projectManager = {
        currentProject: null,

        async loadProjects() {
            try {
                const response = await fetch(`${API_BASE}/projects`);
                const projects = await response.json();

                const projectsList = document.getElementById('projects-list');

                if (projects.length === 0) {
                    projectsList.innerHTML = '<p>No projects yet. Add your first project!</p>';
                    return;
                }

                const table = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tech Stack</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(project => `
              <tr>
                <td>${project.title}</td>
                <td>${project.techStack.join(', ')}</td>
                <td class="action-buttons">
                  <button class="btn-icon" onclick="window.projectManager.editProject('${project._id}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" onclick="window.projectManager.deleteProject('${project._id}')">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

                projectsList.innerHTML = table;
            } catch (error) {
                console.error('Error loading projects:', error);
                document.getElementById('projects-list').innerHTML = '<p>Error loading projects.</p>';
            }
        },

        showAddModal() {
            this.currentProject = null;
            document.getElementById('project-modal-title').textContent = 'Add Project';
            document.getElementById('project-form').reset();
            document.getElementById('project-id').value = '';
            document.getElementById('project-modal').classList.add('show');
        },

        async editProject(id) {
            try {
                const response = await fetch(`${API_BASE}/projects/${id}`);
                const project = await response.json();

                this.currentProject = project;
                document.getElementById('project-modal-title').textContent = 'Edit Project';
                document.getElementById('project-id').value = project._id;
                document.getElementById('project-title').value = project.title;
                document.getElementById('project-description').value = project.description;
                document.getElementById('project-image').value = project.image;
                document.getElementById('project-tech').value = project.techStack.join(', ');
                document.getElementById('project-url').value = project.projectUrl || '';
                document.getElementById('project-github').value = project.githubUrl || '';

                document.getElementById('project-modal').classList.add('show');
            } catch (error) {
                console.error('Error loading project:', error);
                alert('Error loading project details');
            }
        },

        async deleteProject(id) {
            if (!confirm('Are you sure you want to delete this project?')) return;

            try {
                const response = await fetch(`${API_BASE}/projects/${id}`, {
                    method: 'DELETE',
                    headers: window.adminAuth.getAuthHeaders()
                });

                if (response.ok) {
                    alert('Project deleted successfully');
                    this.loadProjects();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Error deleting project');
                }
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Error deleting project');
            }
        },

        closeModal() {
            document.getElementById('project-modal').classList.remove('show');
        }
    };

    // Project form submission
    document.addEventListener('DOMContentLoaded', () => {
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const projectId = document.getElementById('project-id').value;
                const projectData = {
                    title: document.getElementById('project-title').value,
                    description: document.getElementById('project-description').value,
                    image: document.getElementById('project-image').value,
                    techStack: document.getElementById('project-tech').value.split(',').map(t => t.trim()),
                    projectUrl: document.getElementById('project-url').value,
                    githubUrl: document.getElementById('project-github').value
                };

                try {
                    const url = projectId ? `${API_BASE}/projects/${projectId}` : `${API_BASE}/projects`;
                    const method = projectId ? 'PUT' : 'POST';

                    const response = await fetch(url, {
                        method,
                        headers: window.adminAuth.getAuthHeaders(),
                        body: JSON.stringify(projectData)
                    });

                    if (response.ok) {
                        alert(projectId ? 'Project updated successfully' : 'Project added successfully');
                        window.projectManager.closeModal();
                        window.projectManager.loadProjects();
                    } else {
                        const data = await response.json();
                        alert(data.error || 'Error saving project');
                    }
                } catch (error) {
                    console.error('Error saving project:', error);
                    alert('Error saving project');
                }
            });
        }
    });
})();
