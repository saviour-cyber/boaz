// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() 
{
    // Check authentication on page load
    checkAuth();
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // In a real app, this would be an API call to your backend
            if (username && password) {
                // Simulate successful login
                localStorage.setItem('authToken', 'simulated-token');
                localStorage.setItem('user', JSON.stringify({
                                    username: username,
                farmName: "Sample Farm",
                fullName: "Sample Farmer"
            }));
            
            window.location.href = 'dashboard.html';
        } else {
            alert('Please enter both username and password');
        }
    });
}

// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const farmName = document.getElementById('farmName').value;
        const location = document.getElementById('location').value;
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // In a real app, this would be an API call to your backend
        // Simulate successful registration
        localStorage.setItem('authToken', 'simulated-token');
        localStorage.setItem('user', JSON.stringify({
            username: username,
            farmName: farmName,
            fullName: fullName,
            email: email,
            phone: phone,
            location: location
        }));
        
        alert('Registration successful! You will now be redirected to the dashboard.');
        window.location.href = 'dashboard.html';
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) 
    {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}