// Contact Page Functionality

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// Initialize all contact page functionality
function initializeContactPage() {
    initializeContactForm();
    initializeFAQ();
    initializeMapInteraction();
    initializeSocialTracking();
    initializeFormValidation();
    initializeAutoSave();
    initializeContactAnalytics();
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
                autoSaveFormData();
            });
        });
        
        // Load saved form data
        loadSavedFormData();
    }
}

// Handle contact form submission
function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = Object.fromEntries(formData.entries());
    
    // Validate form
    if (validateContactForm(contactData)) {
        submitContactForm(contactData, event.target);
    }
}

// Validate contact form
function validateContactForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'subject', 'message'];
    let isValid = true;
    
    // Check required fields
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(document.getElementById(field), `${getFieldLabel(field)} आवश्यक है।`);
            isValid = false;
        }
    }
    
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        showFieldError(document.getElementById('email'), 'कृपया वैध ईमेल पता दर्ज करें।');
        isValid = false;
    }
    
    // Validate phone
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError(document.getElementById('phone'), 'कृपया वैध मोबाइल नंबर दर्ज करें।');
        isValid = false;
    }
    
    // Check terms acceptance
    if (!data.terms) {
        showNotification('कृपया नियम और शर्तों को स्वीकार करें।', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Submit contact form
function submitContactForm(data, form) {
    const submitBtn = form.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> भेजा जा रहा है...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Store contact data
        const contacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        const contactEntry = {
            ...data,
            id: generateContactId(),
            timestamp: new Date().toISOString(),
            status: 'pending',
            source: 'contact-form'
        };
        
        contacts.push(contactEntry);
        localStorage.setItem('contactSubmissions', JSON.stringify(contacts));
        
        // Clear saved form data
        localStorage.removeItem('contactFormData');
        
        // Show success message
        showContactSuccess(contactEntry);
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> संदेश भेजें';
        submitBtn.disabled = false;
        
        // Track submission
        trackContactEvent('form_submit', {
            subject: data.subject,
            preferredContact: data.preferredContact,
            hasNewsletter: data.newsletter === 'yes'
        });
        
        // Send confirmation email (simulate)
        sendConfirmationEmail(contactEntry);
        
    }, 2000);
}

// Show contact success message
function showContactSuccess(contactData) {
    const successModal = document.createElement('div');
    successModal.className = 'modal success-modal';
    successModal.innerHTML = `
        <div class="modal-content">
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>संदेश सफलतापूर्वक भेजा गया!</h2>
                <p>धन्यवाद ${contactData.firstName} जी, आपका संदेश हमें मिल गया है।</p>
                <div class="contact-details">
                    <p><strong>संदेश ID:</strong> ${contactData.id}</p>
                    <p><strong>विषय:</strong> ${getSubjectLabel(contactData.subject)}</p>
                    <p><strong>संपर्क माध्यम:</strong> ${getContactMethodLabel(contactData.preferredContact)}</p>
                </div>
                <p class="response-time">हम 24 घंटे के अंदर आपसे संपर्क करेंगे।</p>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="closeSuccessModal()">ठीक है</button>
                    <a href="services.html" class="btn btn-secondary">सेवाएं देखें</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    successModal.style.display = 'block';
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (successModal.parentNode) {
            successModal.remove();
        }
    }, 10000);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

// Generate contact ID
function generateContactId() {
    return 'CNT' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Send confirmation email (simulate)
function sendConfirmationEmail(contactData) {
    // Simulate email sending
    setTimeout(() => {
        showNotification('पुष्टिकरण ईमेल भेजा गया है।', 'success');
    }, 3000);
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                otherItem.querySelector('i').style.transform = 'rotate(0deg)';
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                
                // Track FAQ interaction
                trackContactEvent('faq_open', {
                    question: question.querySelector('h3').textContent
                });
            }
        });
    });
}

// Map interaction
function initializeMapInteraction() {
    const mapContainer = document.querySelector('.map-container');
    const mapIframe = document.querySelector('.map-container iframe');
    
    if (mapContainer && mapIframe) {
        // Add click tracking
        mapContainer.addEventListener('click', function() {
            trackContactEvent('map_interaction', {
                action: 'click'
            });
        });
        
        // Add directions button
        const directionsBtn = document.createElement('button');
        directionsBtn.className = 'directions-btn';
        directionsBtn.innerHTML = '<i class="fas fa-directions"></i> दिशा-निर्देश प्राप्त करें';
        directionsBtn.addEventListener('click', function() {
            const address = encodeURIComponent('123, ज्योतिष भवन, अंधेरी पूर्व, मुंबई - 400069');
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
            
            trackContactEvent('directions_requested', {
                method: 'google_maps'
            });
        });
        
        mapContainer.appendChild(directionsBtn);
    }
}

// Social media tracking
function initializeSocialTracking() {
    const socialLinks = document.querySelectorAll('.social-link, .social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('instagram') ? 'instagram' :
                           this.classList.contains('youtube') ? 'youtube' :
                           this.classList.contains('twitter') ? 'twitter' : 'unknown';
            
            trackContactEvent('social_media_click', {
                platform: platform,
                source: 'contact_page'
            });
        });
    });
}

// Form validation helpers
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} आवश्यक है।`;
    }
    
    // Specific field validations
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'कृपया वैध ईमेल पता दर्ज करें।';
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = 'कृपया वैध मोबाइल नंबर दर्ज करें।';
            }
            break;
        case 'date':
            if (value && fieldName === 'birthDate') {
                const birthDate = new Date(value);
                const today = new Date();
                if (birthDate > today) {
                    isValid = false;
                    errorMessage = 'जन्म तारीख भविष्य में नहीं हो सकती।';
                }
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
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Auto-save form data
function initializeAutoSave() {
    const form = document.getElementById('contactForm');
    if (form) {
        // Auto-save every 30 seconds
        setInterval(autoSaveFormData, 30000);
        
        // Save on form change
        form.addEventListener('change', autoSaveFormData);
    }
}

// Auto-save form data
function autoSaveFormData() {
    const form = document.getElementById('contactForm');
    if (form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Don't save empty forms
        if (data.firstName || data.lastName || data.email || data.message) {
            localStorage.setItem('contactFormData', JSON.stringify({
                ...data,
                savedAt: new Date().toISOString()
            }));
        }
    }
}

// Load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const form = document.getElementById('contactForm');
            
            // Check if data is not too old (24 hours)
            const savedAt = new Date(data.savedAt);
            const now = new Date();
            const hoursDiff = (now - savedAt) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                // Show restore option
                showRestoreDataOption(data, form);
            } else {
                // Remove old data
                localStorage.removeItem('contactFormData');
            }
        } catch (error) {
            console.error('Error loading saved form data:', error);
            localStorage.removeItem('contactFormData');
        }
    }
}

// Show restore data option
function showRestoreDataOption(data, form) {
    const restoreNotification = document.createElement('div');
    restoreNotification.className = 'restore-notification';
    restoreNotification.innerHTML = `
        <div class="restore-content">
            <i class="fas fa-info-circle"></i>
            <span>आपका पिछला फॉर्म डेटा मिला है। क्या आप इसे पुनर्स्थापित करना चाहते हैं?</span>
            <div class="restore-actions">
                <button class="btn-restore" onclick="restoreFormData()">हां, पुनर्स्थापित करें</button>
                <button class="btn-dismiss" onclick="dismissRestore()">नहीं, हटाएं</button>
            </div>
        </div>
    `;
    
    form.insertAdjacentElement('beforebegin', restoreNotification);
    
    // Store data for restoration
    window.savedFormData = data;
}

// Restore form data
function restoreFormData() {
    const data = window.savedFormData;
    const form = document.getElementById('contactForm');
    
    if (data && form) {
        Object.keys(data).forEach(key => {
            if (key !== 'savedAt') {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'radio') {
                        const radioField = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                        if (radioField) radioField.checked = true;
                    } else if (field.type === 'checkbox') {
                        field.checked = data[key] === 'yes' || data[key] === 'on';
                    } else {
                        field.value = data[key];
                    }
                }
            }
        });
        
        showNotification('फॉर्म डेटा पुनर्स्थापित किया गया।', 'success');
    }
    
    dismissRestore();
}

// Dismiss restore notification
function dismissRestore() {
    const notification = document.querySelector('.restore-notification');
    if (notification) {
        notification.remove();
    }
    localStorage.removeItem('contactFormData');
    delete window.savedFormData;
}

// Contact analytics
function initializeContactAnalytics() {
    // Track page visit
    trackContactEvent('page_visit', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) {
                trackContactEvent('scroll_depth', {
                    depth: maxScroll
                });
            }
        }
    }, 1000));
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackContactEvent('time_on_page', {
            seconds: timeSpent
        });
    });
}

// Track contact events
function trackContactEvent(eventType, data) {
    const contactAnalytics = JSON.parse(localStorage.getItem('contactAnalytics') || '[]');
    contactAnalytics.push({
        type: eventType,
        data: data,
        timestamp: new Date().toISOString(),
        page: 'contact'
    });
    localStorage.setItem('contactAnalytics', JSON.stringify(contactAnalytics));
    
    console.log('Contact Event:', eventType, data);
}

// Utility functions
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
        'subject': 'विषय',
        'message': 'संदेश',
        'birthDate': 'जन्म तारीख',
        'birthTime': 'जन्म समय',
        'birthPlace': 'जन्म स्थान'
    };
    return labels[fieldName] || fieldName;
}

function getSubjectLabel(subject) {
    const subjects = {
        'kundali-analysis': 'कुंडली विश्लेषण',
        'gemstone-recommendation': 'रत्न सुझाव',
        'love-marriage': 'प्रेम विवाह',
        'career-finance': 'करियर और वित्त',
        'vastu-consultation': 'वास्तु सलाह',
        'numerology': 'अंक ज्योतिष',
        'general-inquiry': 'सामान्य पूछताछ',
        'other': 'अन्य'
    };
    return subjects[subject] || subject;
}

function getContactMethodLabel(method) {
    const methods = {
        'phone': 'फोन कॉल',
        'whatsapp': 'WhatsApp',
        'email': 'ईमेल'
    };
    return methods[method] || method;
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
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
window.ContactPage = {
    closeSuccessModal,
    restoreFormData,
    dismissRestore,
    trackContactEvent
};
