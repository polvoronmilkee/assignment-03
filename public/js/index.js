const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const welcomeContainer = document.getElementById('welcome-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const passwordInput = document.getElementById('password');
const repasswordInput = document.getElementById('repassword');
const passwordMatch = document.getElementById('password-match');

// Show login form
function showLogin() {
    loginContainer.classList.remove('hidden');
    signupContainer.classList.add('hidden');
    welcomeContainer.classList.add('hidden');
    clearMessages();
    clearForm(signupForm);
}

// Show signup form
function showSignup() {
    signupContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
    welcomeContainer.classList.add('hidden');
    clearMessages();
    clearForm(loginForm);
}

// Show welcome page
function showWelcome(user) {
    welcomeContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
    signupContainer.classList.add('hidden');
    document.getElementById('welcome-message').textContent = 
        `Welcome, ${user.firstname} ${user.lastname}! You have successfully logged in.`;
}

// Logout function
function logout() {
    showLogin();
    clearMessages();
}

// Clear all messages
function clearMessages() {
    document.getElementById('login-message').innerHTML = '';
    document.getElementById('signup-message').innerHTML = '';
    passwordMatch.textContent = '';
}

// Clear form fields
function clearForm(form) {
    form.reset();
}

// Real-time password matching
repasswordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const repassword = repasswordInput.value;
    
    if (repassword && password !== repassword) {
        passwordMatch.textContent = 'Passwords do not match';
    } else {
        passwordMatch.textContent = '';
    }
});

// Signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Signup form submitted'); // Debug log
    
    const formData = {
        firstname: document.getElementById('firstname').value.trim(),
        lastname: document.getElementById('lastname').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        birthdate: document.getElementById('birthdate').value,
        password: document.getElementById('password').value,
        repassword: document.getElementById('repassword').value
    };

    console.log('Form data:', formData); // Debug log

    // Client-side validation
    if (formData.password !== formData.repassword) {
        showMessage('signup-message', 'Passwords do not match', 'danger');
        return;
    }

    if (formData.password.length < 6) {
        showMessage('signup-message', 'Password must be at least 6 characters long', 'danger');
        return;
    }

// Signup fetch call
try {
    const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log('Server response:', result);

    if (result.success) {
        showMessage('signup-message', result.message, 'success');
        setTimeout(() => showLogin(), 1500);
    } else {
        showMessage('signup-message', result.message, 'danger');
    }
} catch (error) {
    console.error('Signup error:', error);
    showMessage('signup-message', `Network error: ${error.message}`, 'danger');
}

// Login fetch call
try {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log('Server response:', result);

    if (result.success) {
        showWelcome(result.user);
    } else {
        showMessage('login-message', result.message, 'danger');
    }
} catch (error) {
    console.error('Login error:', error);
    showMessage('login-message', `Network error: ${error.message}`, 'danger');
}

});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login form submitted'); // Debug log
    
    const formData = {
        email: document.getElementById('login-email').value.trim().toLowerCase(),
        password: document.getElementById('login-password').value
    };

    console.log('Login data:', formData); // Debug log

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
    });



        const result = await response.json();
        console.log('Server response:', result); // Debug log

        if (result.success) {
            showWelcome(result.user);
        } else {
            showMessage('login-message', result.message, 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('login-message', 'Network error. Please check if server is running.', 'danger');
    }
});

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}


showLogin();