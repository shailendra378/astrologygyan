// Main JavaScript for Astrology Gyan Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    initializeNavigation();
    initializeModals();
    initializeBookingSystem();
    initializeAnimations();
    initializeFormValidation();
    initializePaymentSystem();
    initializeAnalytics();
    initializeAIFeatures();
}

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

// Update active navigation based on scroll position
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Modal functionality
function initializeModals() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookNowButtons = document.querySelectorAll('.book-now');

    // Open modal
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            openBookingModal(serviceType);
        });
    });

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Open booking modal with service type
function openBookingModal(serviceType) {
    const modal = document.getElementById('bookingModal');
    const consultationSelect = document.getElementById('consultation-type');
    
    if (modal && consultationSelect) {
        modal.style.display = 'block';
        
        // Pre-select the service type
        if (serviceType) {
            consultationSelect.value = serviceType;
        }
        
        // Add fade-in animation
        modal.classList.add('fade-in-up');
    }
}

// Booking system functionality
function initializeBookingSystem() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }

    // Initialize date restrictions
    setDateRestrictions();
}

// Set date restrictions for booking
function setDateRestrictions() {
    const birthdateInput = document.getElementById('birthdate');
    const preferredDateInput = document.getElementById('preferred-date');
    
    if (birthdateInput) {
        // Set max date for birthdate to today
        const today = new Date().toISOString().split('T')[0];
        birthdateInput.setAttribute('max', today);
    }
    
    if (preferredDateInput) {
        // Set min date for preferred date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        preferredDateInput.setAttribute('min', tomorrow.toISOString().split('T')[0]);
    }
}

// Handle booking form submission
function handleBookingSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookingData = Object.fromEntries(formData.entries());
    
    // Validate form data
    if (validateBookingForm(bookingData)) {
        // Show loading state
        showLoadingState(event.target);
        
        // Process booking
        processBooking(bookingData);
    }
}

// Validate booking form
function validateBookingForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'birthdate', 'birthtime', 'birthplace', 'consultation-type', 'preferred-date', 'preferred-time'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace('-', ' ')} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone number
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    return true;
}

// Process booking and initiate payment
function processBooking(bookingData) {
    // Simulate API call
    setTimeout(() => {
        // Calculate price based on consultation type
        const prices = {
            'phone-consultation': 1500,
            'video-consultation': 2000,
            'in-person-consultation': 3000
        };
        
        const price = prices[bookingData['consultation-type']] || 1500;
        
        // Store booking data
        localStorage.setItem('currentBooking', JSON.stringify({
            ...bookingData,
            price: price,
            bookingId: generateBookingId()
        }));
        
        // Initiate payment
        initiatePayment(price, bookingData);
        
    }, 1000);
}

// Generate unique booking ID
function generateBookingId() {
    return 'AG' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Show loading state
function showLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.innerHTML = '<span class="loading"></span> Processing...';
        submitButton.disabled = true;
    }
}

// Payment system initialization
function initializePaymentSystem() {
    // Initialize Razorpay (for Indian market)
    window.razorpayOptions = {
        key: 'rzp_test_1234567890', // Replace with actual key
        currency: 'INR',
        name: 'Astrology Gyan',
        description: 'Astrology Consultation Booking',
        image: 'images/logo.png',
        theme: {
            color: '#D4AF37'
        }
    };
}

// Initiate payment process
function initiatePayment(amount, bookingData) {
    const options = {
        ...window.razorpayOptions,
        amount: amount * 100, // Amount in paise
        order_id: generateOrderId(),
        prefill: {
            name: bookingData.name,
            email: bookingData.email,
            contact: bookingData.phone
        },
        handler: function(response) {
            handlePaymentSuccess(response, bookingData);
        },
        modal: {
            ondismiss: function() {
                handlePaymentFailure();
            }
        }
    };
    
    // For demo purposes, simulate payment success
    setTimeout(() => {
        const mockResponse = {
            razorpay_payment_id: 'pay_' + Math.random().toString(36).substr(2, 10),
            razorpay_order_id: options.order_id,
            razorpay_signature: 'signature_' + Math.random().toString(36).substr(2, 10)
        };
        handlePaymentSuccess(mockResponse, bookingData);
    }, 2000);
}

// Generate order ID
function generateOrderId() {
    return 'order_' + Date.now() + Math.random().toString(36).substr(2, 5);
}

// Handle payment success
function handlePaymentSuccess(response, bookingData) {
    const bookingId = JSON.parse(localStorage.getItem('currentBooking')).bookingId;
    
    // Store successful booking
    const successfulBooking = {
        ...bookingData,
        bookingId: bookingId,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        status: 'confirmed',
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage (in real app, send to server)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(successfulBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Close modal and show success
    document.getElementById('bookingModal').style.display = 'none';
    showBookingConfirmation(successfulBooking);
    
    // Send confirmation email (simulate)
    sendConfirmationEmail(successfulBooking);
    
    // Track analytics
    trackBookingConversion(successfulBooking);
}

// Handle payment failure
function handlePaymentFailure() {
    showNotification('Payment was cancelled or failed. Please try again.', 'error');
    
    // Reset form button
    const submitButton = document.querySelector('#bookingForm button[type="submit"]');
    if (submitButton) {
        submitButton.innerHTML = 'Proceed to Payment';
        submitButton.disabled = false;
    }
}

// Show booking confirmation
function showBookingConfirmation(booking) {
    const confirmationHTML = `
        <div class="booking-confirmation">
            <div class="confirmation-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Booking Confirmed!</h2>
                <p>Your consultation has been successfully booked.</p>
                <div class="booking-details">
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Service:</strong> ${booking['consultation-type'].replace('-', ' ').toUpperCase()}</p>
                    <p><strong>Date:</strong> ${booking['preferred-date']}</p>
                    <p><strong>Time:</strong> ${booking['preferred-time']}</p>
                    <p><strong>Amount Paid:</strong> ₹${booking.price}</p>
                </div>
                <p class="confirmation-note">
                    You will receive a confirmation email shortly. Our team will contact you 24 hours before your consultation.
                </p>
                <button class="btn btn-primary" onclick="closeConfirmation()">Close</button>
            </div>
        </div>
    `;
    
    // Create and show confirmation modal
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal';
    confirmationModal.id = 'confirmationModal';
    confirmationModal.innerHTML = confirmationHTML;
    confirmationModal.style.display = 'block';
    
    document.body.appendChild(confirmationModal);
}

// Close confirmation modal
function closeConfirmation() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.remove();
    }
}

// Send confirmation email (simulate)
function sendConfirmationEmail(booking) {
    // In a real application, this would make an API call to send email
    console.log('Sending confirmation email for booking:', booking.bookingId);
    
    // Simulate email sending
    setTimeout(() => {
        showNotification('Confirmation email sent successfully!', 'success');
    }, 1500);
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .booking-card');
    animateElements.forEach(el => observer.observe(el));
    
    // Counter animation for statistics
    animateCounters();
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${fieldName.replace('-', ' ')} is required.`;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Show/hide error
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

// Analytics initialization
function initializeAnalytics() {
    // Track page views
    trackPageView();
    
    // Track user interactions
    trackUserInteractions();
    
    // Track form submissions
    trackFormSubmissions();
}

// Track page view
function trackPageView() {
    const pageData = {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // Store in localStorage (in real app, send to analytics service)
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push({
        type: 'pageview',
        data: pageData
    });
    localStorage.setItem('analytics', JSON.stringify(analytics));
}

// Track user interactions
function trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', function(event) {
        if (event.target.matches('.btn, .book-now, .nav-link')) {
            trackEvent('click', {
                element: event.target.tagName,
                class: event.target.className,
                text: event.target.textContent.trim(),
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('scroll', {
                    depth: maxScroll,
                    timestamp: new Date().toISOString()
                });
            }
        }
    });
}

// Track form submissions
function trackFormSubmissions() {
    document.addEventListener('submit', function(event) {
        const formId = event.target.id || 'unknown';
        trackEvent('form_submit', {
            form: formId,
            timestamp: new Date().toISOString()
        });
    });
}

// Track booking conversion
function trackBookingConversion(booking) {
    trackEvent('booking_conversion', {
        bookingId: booking.bookingId,
        service: booking['consultation-type'],
        amount: booking.price,
        timestamp: new Date().toISOString()
    });
}

// Generic event tracking
function trackEvent(eventType, data) {
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push({
        type: eventType,
        data: data
    });
    localStorage.setItem('analytics', JSON.stringify(analytics));
    
    // In a real application, you would send this to your analytics service
    console.log('Analytics Event:', eventType, data);
}

// AI Features initialization
function initializeAIFeatures() {
    // Initialize chatbot
    initializeChatbot();
    
    // Initialize recommendation engine
    initializeRecommendations();
    
    // Initialize predictive text
    initializePredictiveText();
}

// Initialize AI chatbot
function initializeChatbot() {
    // Create chatbot widget
    const chatbotHTML = `
        <div id="chatbot-widget" class="chatbot-widget">
            <div class="chatbot-header">
                <h4>Ask Astro AI</h4>
                <button id="chatbot-toggle" class="chatbot-toggle">
                    <i class="fas fa-comments"></i>
                </button>
            </div>
            <div id="chatbot-body" class="chatbot-body" style="display: none;">
                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="bot-message">
                        Hello! I'm Astro AI, your virtual astrology assistant. How can I help you today?
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-input" placeholder="Ask me anything about astrology...">
                    <button id="chatbot-send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // Add chatbot to page
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Initialize chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    
    chatbotToggle.addEventListener('click', function() {
        chatbotBody.style.display = chatbotBody.style.display === 'none' ? 'block' : 'none';
    });
    
    chatbotSend.addEventListener('click', function() {
        sendChatMessage();
    });
    
    chatbotInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Send chat message
function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'user-message';
    userMessageDiv.textContent = message;
    messages.appendChild(userMessageDiv);
    
    // Clear input
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const botResponse = generateAIResponse(message);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'bot-message';
        botMessageDiv.textContent = botResponse;
        messages.appendChild(botMessageDiv);
        
        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
}

// Generate AI response (simplified)
function generateAIResponse(message) {
    const responses = {
        'hello': 'Hello! How can I assist you with your astrological questions today?',
        'horoscope': 'I can help you understand your horoscope. Would you like to book a detailed consultation with our expert astrologer?',
        'gemstone': 'Gemstones can have powerful effects based on your birth chart. Our gemstone recommendation service can help you find the perfect stone for you.',
        'marriage': 'Marriage compatibility is an important aspect of Vedic astrology. Our love and marriage consultation can provide detailed insights.',
        'career': 'Career guidance through astrology can help you make better professional decisions. Would you like to know more about our career consultation services?',
        'vastu': 'Vastu Shastra can bring positive energy to your home and workplace. Our Vastu experts can provide personalized recommendations.',
        'default': 'That\'s an interesting question! For detailed and personalized answers, I recommend booking a consultation with our expert astrologer Adarsh. Would you like me to help you book an appointment?'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (let key in responses) {
        if (lowerMessage.includes(key)) {
            return responses[key];
        }
    }
    
    return responses.default;
}

// Initialize recommendation engine
function initializeRecommendations() {
    // Analyze user behavior and show personalized recommendations
    const userBehavior = JSON.parse(localStorage.getItem('analytics') || '[]');
    
    // Simple recommendation logic based on user interactions
    if (userBehavior.length > 0) {
        showPersonalizedRecommendations(userBehavior);
    }
}

// Show personalized recommendations
function showPersonalizedRecommendations(behavior) {
    const clickEvents = behavior.filter(event => event.type === 'click');
    const interests = analyzeUserInterests(clickEvents);
    
    if (interests.length > 0) {
        displayRecommendations(interests);
    }
}

// Analyze user interests
function analyzeUserInterests(clickEvents) {
    const interests = [];
    
    clickEvents.forEach(event => {
        const text = event.data.text.toLowerCase();
        if (text.includes('kundali') || text.includes('birth chart')) {
            interests.push('kundali');
        }
        if (text.includes('gemstone')) {
            interests.push('gemstone');
        }
        if (text.includes('love') || text.includes('marriage')) {
            interests.push('love');
        }
        if (text.includes('career') || text.includes('finance')) {
            interests.push('career');
        }
        if (text.includes('vastu')) {
            interests.push('vastu');
        }
    });
    
    return [...new Set(interests)]; // Remove duplicates
}

// Display recommendations
function displayRecommendations(interests) {
    const recommendationHTML = `
        <div class="recommendation-banner">
            <div class="recommendation-content">
                <h4>Recommended for You</h4>
                <p>Based on your interests, you might like these services:</p>
                <div class="recommendation-services">
                    ${interests.map(interest => `
                        <a href="services.html#${interest}" class="recommendation-link">
                            ${interest.charAt(0).toUpperCase() + interest.slice(1)} Consultation
                        </a>
                    `).join('')}
                </div>
                <button class="close-recommendation">&times;</button>
            </div>
        </div>
    `;
    
    // Add recommendation banner
    document.body.insertAdjacentHTML('afterbegin', recommendationHTML);
    
    // Close functionality
    document.querySelector('.close-recommendation').addEventListener('click', function() {
        document.querySelector('.recommendation-banner').remove();
    });
}

// Initialize predictive text
function initializePredictiveText() {
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 2) {
                showPredictiveSuggestions(this);
            }
        });
    });
}

// Show predictive suggestions
function showPredictiveSuggestions(input) {
    const suggestions = getAstrologySuggestions(input.value);
    
    if (suggestions.length > 0) {
        displaySuggestions(input, suggestions);
    }
}

// Get astrology-related suggestions
function getAstrologySuggestions(text) {
    const astrologyTerms = [
        'birth chart analysis',
        'gemstone recommendation',
        'love compatibility',
        'marriage timing',
        'career guidance',
        'financial prosperity',
        'vastu consultation',
        'numerology reading',
        'planetary positions',
        'horoscope matching'
    ];
    
    return astrologyTerms.filter(term => 
        term.toLowerCase().includes(text.toLowerCase())
    ).slice(0, 3);
}

// Display suggestions
function displaySuggestions(input, suggestions) {
    // Remove existing suggestions
    const existingSuggestions = document.querySelector('.suggestions-dropdown');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    
    // Create suggestions dropdown
    const suggestionsHTML = `
        <div class="suggestions-dropdown">
            ${suggestions.map(suggestion => `
                <div class="suggestion-item" data-suggestion="${suggestion}">
                    ${suggestion}
                </div>
            `).join('')}
        </div>
    `;
    
    input.parentNode.style.position = 'relative';
    input.parentNode.insertAdjacentHTML('beforeend', suggestionsHTML);
    
    // Handle suggestion clicks
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            input.value = this.getAttribute('data-suggestion');
            this.parentNode.remove();
        });
    });
}

// Notification system
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    
    // Track error for analytics
    trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: new Date().toISOString()
    });
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for use in other scripts
window.AstrologyGyan = {
    openBookingModal,
    closeConfirmation,
    showNotification,
    trackEvent
};
