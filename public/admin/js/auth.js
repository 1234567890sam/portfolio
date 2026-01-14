// Admin Authentication
const API_BASE = window.location.origin + '/api';

// Check if already logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token && window.location.pathname.includes('login.html')) {
        window.location.href = '/admin/dashboard';
    } else if (!token && window.location.pathname.includes('dashboard.html')) {
        window.location.href = '/admin';
    }
}

// Login form handler
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            const submitBtn = loginForm.querySelector('.btn-login');

            // Clear previous errors
            errorMessage.classList.remove('show');
            errorMessage.textContent = '';

            // Disable button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Logging in...</span><i class="fas fa-spinner fa-spin"></i>';

            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', JSON.stringify(data.admin));

                    // Redirect to dashboard
                    window.location.href = '/admin/dashboard';
                } else {
                    // Show error
                    errorMessage.textContent = data.error || 'Login failed';
                    errorMessage.classList.add('show');

                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'Network error. Please try again.';
                errorMessage.classList.add('show');

                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
            }
        });
    }
});

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin';
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Verify token on dashboard load
async function verifyToken() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin';
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            logout();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Token verification error:', error);
        logout();
        return false;
    }
}

// Export functions for use in other scripts
window.adminAuth = {
    checkAuth,
    logout,
    getAuthHeaders,
    verifyToken
};
