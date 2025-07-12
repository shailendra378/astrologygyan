// Authentication System

// Initialize auth page
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

// Initialize all auth functionality
function initializeAuthPage() {
    initializeLoginForm();
    initializeSignupForm();
    initializeForgotPasswordForm();
    initializePasswordStrength();
    initializeSocialAuth();
    initializeFormValidation();
    checkAuthStatus();
}

// Login form functionality
function initializeLoginForm() {
    const loginForm = document.getElementById('loginFormElement');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Auto-fill demo credentials
        addDemoCredentials();
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData.entries());
    
    if (validateLoginForm(loginData)) {
        processLogin(loginData);
    }
}

// Validate login form
function validateLoginForm(data) {
    let isValid = true;
    
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError(document.getElementById('loginEmail'), 'कृपया वैध ईमेल पता दर्ज करें।');
        isValid = false;
    }
    
    if (!data.password || data.password.length < 6) {
        showFieldError(document.getElementById('loginPassword'), 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।');
        isValid = false;
    }
    
    return isValid;
}

// Process login
function processLogin(loginData) {
    const submitBtn = document.querySelector('#loginFormElement .auth-btn');
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> लॉगिन हो रहा है...';
    submitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = users.find(u => u.email === loginData.email);
        
        if (user && user.password === loginData.password) {
            // Successful login
            const loginSession = {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone
                },
                loginTime: new Date().toISOString(),
                remember: loginData.remember === 'on'
            };
            
            // Store session
            if (loginData.remember === 'on') {
                localStorage.setItem('userSession', JSON.stringify(loginSession));
            } else {
                sessionStorage.setItem('userSession', JSON.stringify(loginSession));
            }
            
            // Track login
            trackAuthEvent('login_success', {
                userId: user.id,
                method: 'email'
            });
            
            // Show success and redirect
            showAuthSuccess('लॉगिन सफल!', 'आपका लॉगिन सफल रहा है।', () => {
                window.location.href = 'index.html';
            });
            
        } else {
            // Failed login
            showNotification('गलत ईमेल या पासवर्ड।', 'error');
            trackAuthEvent('login_failed', {
                email: loginData.email,
                reason: 'invalid_credentials'
            });
        }
        
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> लॉगिन करें';
        submitBtn.disabled = false;
        
    }, 2000);
}

// Signup form functionality
function initializeSignupForm() {
    const signupForm = document.getElementById('signupFormElement');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        
        // Real-time validation
        const inputs = signupForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateSignupField(this);
            });
        });
    }
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const signupData = Object.fromEntries(formData.entries());
    
    if (validateSignupForm(signupData)) {
        processSignup(signupData);
    }
}

// Validate signup form
function validateSignupForm(data) {
    let isValid = true;
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender', 'password', 'confirmPassword'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(document.getElementById(field), `${getFieldLabel(field)} आवश्यक है।`);
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError(document.getElementById('signupEmail'), 'कृपया वैध ईमेल पता दर्ज करें।');
        isValid = false;
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError(document.getElementById('phone'), 'कृपया वैध मोबाइल नंबर दर्ज करें।');
        isValid = false;
    }
    
    // Password validation
    if (data.password && data.password.length < 8) {
        showFieldError(document.getElementById('signupPassword'), 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए।');
        isValid = false;
    }
    
    // Password confirmation
    if (data.password !== data.confirmPassword) {
        showFieldError(document.getElementById('confirmPassword'), 'पासवर्ड मेल नहीं खाते।');
        isValid = false;
    }
    
    // Terms acceptance
    if (!data.terms) {
        showNotification('कृपया नियम और शर्तों को स्वीकार करें।', 'error');
        isValid = false;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.find(u => u.email === data.email)) {
        showFieldError(document.getElementById('signupEmail'), 'यह ईमेल पहले से पंजीकृत है।');
        isValid = false;
    }
    
    return isValid;
}

// Process signup
function processSignup(signupData) {
    const submitBtn = document.querySelector('#signupFormElement .auth-btn');
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> खाता बनाया जा रहा है...';
    submitBtn.disabled = true;
    
    // Simulate signup process
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        const newUser = {
            id: generateUserId(),
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: signupData.email,
            phone: signupData.phone,
            birthDate: signupData.birthDate,
            gender: signupData.gender,
            password: signupData.password, // In real app, this would be hashed
            newsletter: signupData.newsletter === 'on',
            registrationDate: new Date().toISOString(),
            isVerified: false,
            profile: {
                birthTime: null,
                birthPlace: null,
                preferences: {
                    language: 'hindi',
                    notifications: true
                }
            }
        };
        
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // Track signup
        trackAuthEvent('signup_success', {
            userId: newUser.id,
            method: 'email',
            newsletter: newUser.newsletter
        });
        
        // Send welcome email (simulate)
        sendWelcomeEmail(newUser);
        
        // Show success
        showAuthSuccess(
            'खाता सफलतापूर्वक बनाया गया!', 
            `धन्यवाद ${newUser.firstName}! आपका खाता बन गया है। कृपया अपना ईमेल वेरिफाई करें।`,
            () => {
                showLoginForm();
            }
        );
        
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> खाता बनाएं';
        submitBtn.disabled = false;
        
    }, 2500);
}

// Forgot password functionality
function initializeForgotPasswordForm() {
    const forgotForm = document.getElementById('forgotPasswordFormElement');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
}

// Handle forgot password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    if (!email || !isValidEmail(email)) {
        showFieldError(document.getElementById('resetEmail'), 'कृपया वैध ईमेल पता दर्ज करें।');
        return;
    }
    
    const submitBtn = document.querySelector('#forgotPasswordFormElement .auth-btn');
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> भेजा जा रहा है...';
    submitBtn.disabled = true;
    
    // Simulate password reset
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = users.find(u => u.email === email);
        
        if (user) {
            // Store reset request
            const resetRequests = JSON.parse(localStorage.getItem('passwordResets') || '[]');
            const resetToken = generateResetToken();
            
            resetRequests.push({
                email: email,
                token: resetToken,
                timestamp: new Date().toISOString(),
                used: false
            });
            
            localStorage.setItem('passwordResets', JSON.stringify(resetRequests));
            
            // Track reset request
            trackAuthEvent('password_reset_requested', {
                email: email
            });
            
            showAuthSuccess(
                'रीसेट लिंक भेजा गया!',
                'पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया है। कृपया अपना ईमेल चेक करें।',
                () => {
                    showLoginForm();
                }
            );
        } else {
            showNotification('यह ईमेल पंजीकृत नहीं है।', 'error');
        }
        
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> रीसेट लिंक भेजें';
        submitBtn.disabled = false;
        
    }, 2000);
}

// Password strength indicator
function initializePasswordStrength() {
    const passwordInput = document.getElementById('signupPassword');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strengthIndicator, strength);
        });
    }
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push('कम से कम 8 अक्षर');
    }
    
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('छोटे अक्षर');
    }
    
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('बड़े अक्षर');
    }
    
    if (/[0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('संख्या');
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('विशेष चिह्न');
    }
    
    return {
        score: score,
        feedback: feedback,
        level: score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong'
    };
}

// Update password strength display
function updatePasswordStrength(indicator, strength) {
    const levels = {
        weak: { text: 'कमजोर', class: 'weak' },
        medium: { text: 'मध्यम', class: 'medium' },
        strong: { text: 'मजबूत', class: 'strong' }
    };
    
    const level = levels[strength.level];
    
    indicator.innerHTML = `
        <div class="strength-bar ${level.class}">
            <div class="strength-fill" style="width: ${(strength.score / 5) * 100}%"></div>
        </div>
        <div class="strength-text">
            <span class="strength-level">${level.text}</span>
            ${strength.feedback.length > 0 ? `<span class="strength-feedback">आवश्यक: ${strength.feedback.join(', ')}</span>` : ''}
        </div>
    `;
}

// Social authentication
function initializeSocialAuth() {
    // Social auth would integrate with actual providers in production
    console.log('Social authentication initialized');
}

// Login with Google
function loginWithGoogle() {
    // Simulate Google login
    showNotification('Google लॉगिन जल्द ही उपलब्ध होगा।', 'info');
    trackAuthEvent('social_login_attempted', { provider: 'google' });
}

// Login with Facebook
function loginWithFacebook() {
    // Simulate Facebook login
    showNotification('Facebook लॉगिन जल्द ही उपलब्ध होगा।', 'info');
    trackAuthEvent('social_login_attempted', { provider: 'facebook' });
}

// Signup with Google
function signupWithGoogle() {
    // Simulate Google signup
    showNotification('Google साइन अप जल्द ही उपलब्ध होगा।', 'info');
    trackAuthEvent('social_signup_attempted', { provider: 'google' });
}

// Signup with Facebook
function signupWithFacebook() {
    // Simulate Facebook signup
    showNotification('Facebook साइन अप जल्द ही उपलब्ध होगा।', 'info');
    trackAuthEvent('social_signup_attempted', { provider: 'facebook' });
}

// Form switching
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    
    trackAuthEvent('form_switch', { to: 'login' });
}

function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    
    trackAuthEvent('form_switch', { to: 'signup' });
}

function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
    
    trackAuthEvent('form_switch', { to: 'forgot_password' });
}

// Password toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        button.className = 'fas fa-eye';
    }
}

// Form validation helpers
function initializeFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateSignupField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                isValid = false;
                errorMessage = `${getFieldLabel(fieldName)} आवश्यक है।`;
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = `${getFieldLabel(fieldName)} कम से कम 2 अक्षर का होना चाहिए।`;
            }
            break;
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'ईमेल पता आवश्यक है।';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'कृपया वैध ईमेल पता दर्ज करें।';
            }
            break;
        case 'phone':
            if (!value) {
                isValid = false;
                errorMessage = 'मोबाइल नंबर आवश्यक है।';
            } else if (!isValidPhone(value)) {
                isValid = false;
                errorMessage = 'कृपया वैध मोबाइल नंबर दर्ज करें।';
            }
            break;
        case 'password':
            if (!value) {
                isValid = false;
                errorMessage = 'पासवर्ड आवश्यक है।';
            } else if (value.length < 8) {
                isValid = false;
                errorMessage = 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए।';
            }
            break;
        case 'confirmPassword':
            const password = document.getElementById('signupPassword').value;
            if (!value) {
                isValid = false;
                errorMessage = 'पासवर्ड की पुष्टि आवश्यक है।';
            } else if (value !== password) {
                isValid = false;
                errorMessage = 'पासवर्ड मेल नहीं खाते।';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Success modal
function showAuthSuccess(title, message, callback) {
    const modal = document.getElementById('successModal');
    const titleElement = document.getElementById('successTitle');
    const messageElement = document.getElementById('successMessage');
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    modal.style.display = 'block';
    
    // Store callback for later use
    window.authSuccessCallback = callback;
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    if (window.authSuccessCallback) {
        window.authSuccessCallback();
        delete window.authSuccessCallback;
    }
}

// Terms modal
function showTermsModal() {
    document.getElementById('termsModal').style.display = 'block';
}

function closeTermsModal() {
    document.getElementById('termsModal').style.display = 'none';
}

// Check authentication status
function checkAuthStatus() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    
    if (session) {
        try {
            const userData = JSON.parse(session);
            // User is already logged in, redirect to dashboard or home
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            // Invalid session data, clear it
            localStorage.removeItem('userSession');
            sessionStorage.removeItem('userSession');
        }
    }
}

// Add demo credentials
function addDemoCredentials() {
    const demoBtn = document.createElement('button');
    demoBtn.type = 'button';
    demoBtn.className = 'demo-btn';
    demoBtn.innerHTML = '<i class="fas fa-user"></i> डेमो अकाउंट से लॉगिन करें';
    demoBtn.addEventListener('click', function() {
        document.getElementById('loginEmail').value = 'demo@astrologygyan.com';
        document.getElementById('loginPassword').value = 'demo123';
        
        // Create demo user if not exists
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (!users.find(u => u.email === 'demo@astrologygyan.com')) {
            users.push({
                id: 'demo-user',
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@astrologygyan.com',
                phone: '9876543210',
                password: 'demo123',
                registrationDate: new Date().toISOString()
            });
            localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
    });
    
    const loginForm = document.getElementById('loginFormElement');
    loginForm.appendChild(demoBtn);
}

// Send welcome email
function sendWelcomeEmail(user) {
    // Simulate sending welcome email
    setTimeout(() => {
        showNotification('स्वागत ईमेल भेजा गया है।', 'success');
    }, 3000);
}

// Utility functions
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateResetToken() {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function getFieldLabel(fieldName) {
    const labels = {
        'firstName': 'पहला नाम',
        'lastName': 'अंतिम नाम',
        'email': 'ईमेल पता',
        'phone': 'मोबाइल नंबर',
        'birthDate': 'जन्म तारीख',
        'gender': 'लिंग',
        'password': 'पासवर्ड',
        'confirmPassword': 'पासवर्ड की पुष्टि'
    };
    return labels[fieldName] || fieldName;
}

// Track authentication events
function trackAuthEvent(eventType, data) {
    const authAnalytics = JSON.parse(localStorage.getItem('authAnalytics') || '[]');
    authAnalytics.push({
        type: eventType,
        data: data,
        timestamp: new Date().toISOString(),
        page: 'auth'
    });
    localStorage.setItem('authAnalytics', JSON.stringify(authAnalytics));
    
    console.log('Auth Event:', eventType, data);
}

// Notification function (if not already defined)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }
}

// Export functions for global use
window.AuthSystem = {
    showLoginForm,
    showSignupForm,
    showForgotPassword,
    togglePassword,
    closeSuccessModal,
    showTermsModal,
    closeTermsModal,
    loginWithGoogle,
    loginWithFacebook,
    signupWithGoogle,
    signupWithFacebook
};
