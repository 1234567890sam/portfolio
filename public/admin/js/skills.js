// Skill Management
(function () {
    const API_BASE = window.location.origin + '/api';

    window.skillManager = {
        currentSkill: null,

        async loadSkills() {
            try {
                const response = await fetch(`${API_BASE}/skills`);
                const skills = await response.json();

                const skillsList = document.getElementById('skills-list');

                if (skills.length === 0) {
                    skillsList.innerHTML = '<p>No skills yet. Add your first skill!</p>';
                    return;
                }

                const table = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${skills.map(skill => `
              <tr>
                <td>${skill.name}</td>
                <td>${skill.category}</td>
                <td>${skill.proficiency}%</td>
                <td class="action-buttons">
                  <button class="btn-icon" onclick="window.skillManager.editSkill('${skill._id}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" onclick="window.skillManager.deleteSkill('${skill._id}')">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

                skillsList.innerHTML = table;
            } catch (error) {
                console.error('Error loading skills:', error);
                document.getElementById('skills-list').innerHTML = '<p>Error loading skills.</p>';
            }
        },

        showAddModal() {
            this.currentSkill = null;
            document.getElementById('skill-modal-title').textContent = 'Add Skill';
            document.getElementById('skill-form').reset();
            document.getElementById('skill-id').value = '';
            document.getElementById('skill-modal').classList.add('show');
        },

        async editSkill(id) {
            try {
                const response = await fetch(`${API_BASE}/skills`);
                const skills = await response.json();
                const skill = skills.find(s => s._id === id);

                if (!skill) {
                    alert('Skill not found');
                    return;
                }

                this.currentSkill = skill;
                document.getElementById('skill-modal-title').textContent = 'Edit Skill';
                document.getElementById('skill-id').value = skill._id;
                document.getElementById('skill-name').value = skill.name;
                document.getElementById('skill-category').value = skill.category;
                document.getElementById('skill-proficiency').value = skill.proficiency;
                document.getElementById('skill-icon').value = skill.icon || '';

                document.getElementById('skill-modal').classList.add('show');
            } catch (error) {
                console.error('Error loading skill:', error);
                alert('Error loading skill details');
            }
        },

        async deleteSkill(id) {
            if (!confirm('Are you sure you want to delete this skill?')) return;

            try {
                const response = await fetch(`${API_BASE}/skills/${id}`, {
                    method: 'DELETE',
                    headers: window.adminAuth.getAuthHeaders()
                });

                if (response.ok) {
                    alert('Skill deleted successfully');
                    this.loadSkills();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Error deleting skill');
                }
            } catch (error) {
                console.error('Error deleting skill:', error);
                alert('Error deleting skill');
            }
        },

        closeModal() {
            document.getElementById('skill-modal').classList.remove('show');
        }
    };

    // Skill form submission
    document.addEventListener('DOMContentLoaded', () => {
        const skillForm = document.getElementById('skill-form');
        if (skillForm) {
            skillForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const skillId = document.getElementById('skill-id').value;
                const skillData = {
                    name: document.getElementById('skill-name').value,
                    category: document.getElementById('skill-category').value,
                    proficiency: parseInt(document.getElementById('skill-proficiency').value),
                    icon: document.getElementById('skill-icon').value
                };

                try {
                    const url = skillId ? `${API_BASE}/skills/${skillId}` : `${API_BASE}/skills`;
                    const method = skillId ? 'PUT' : 'POST';

                    const response = await fetch(url, {
                        method,
                        headers: window.adminAuth.getAuthHeaders(),
                        body: JSON.stringify(skillData)
                    });

                    if (response.ok) {
                        alert(skillId ? 'Skill updated successfully' : 'Skill added successfully');
                        window.skillManager.closeModal();
                        window.skillManager.loadSkills();
                    } else {
                        const data = await response.json();
                        alert(data.error || 'Error saving skill');
                    }
                } catch (error) {
                    console.error('Error saving skill:', error);
                    alert('Error saving skill');
                }
            });
        }
    });
})();
