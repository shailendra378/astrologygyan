// Enhanced Features and Dynamic Functionality

// Notification System
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        document.body.appendChild(this.container);
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            pointer-events: none;
        `;
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.pointerEvents = 'auto';
        
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icons[type] || icons.info}</div>
                <div class="notification-message">${message}</div>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to container
        this.container.appendChild(notification);

        // Show animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        const autoRemove = setTimeout(() => this.remove(notification), duration);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.remove(notification);
        });

        return notification;
    }

    remove(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize notification system
const notifications = new NotificationSystem();

// Loading Overlay System
class LoadingOverlay {
    constructor() {
        this.overlay = this.createOverlay();
        document.body.appendChild(this.overlay);
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            </div>
        `;
        return overlay;
    }

    show(text = 'Loading...') {
        this.overlay.querySelector('.loading-text').textContent = text;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize loading overlay
const loadingOverlay = new LoadingOverlay();

// Scroll Progress Bar
class ScrollProgress {
    constructor() {
        this.progressBar = this.createProgressBar();
        document.body.appendChild(this.progressBar);
        this.updateProgress();
        window.addEventListener('scroll', () => this.updateProgress());
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        return progressBar;
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        this.progressBar.querySelector('.scroll-progress-fill').style.width = `${scrollPercent}%`;
    }
}

// Initialize scroll progress
const scrollProgress = new ScrollProgress();

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = this.createButton();
        document.body.appendChild(this.button);
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    createButton() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Back to top');
        return button;
    }

    handleScroll() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize back to top
const backToTop = new BackToTop();

// Enhanced Form Validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    addRule(fieldName, validator, message) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push({ validator, message });
    }

    validateField(field) {
        const fieldName = field.name;
        const fieldRules = this.rules[fieldName];
        
        if (!fieldRules) return true;

        for (let rule of fieldRules) {
            if (!rule.validator(field.value, field)) {
                this.showFieldError(field, rule.message);
                return false;
            }
        }

        this.showFieldSuccess(field);
        return true;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    showFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error', 'success');
        
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.onSuccess();
        } else {
            notifications.show('Please fix the errors in the form', 'error');
        }
    }

    onSuccess() {
        // Override this method
        notifications.show('Form submitted successfully!', 'success');
    }
}

// Enhanced Shopping Cart
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.sidebar = document.getElementById('cart-sidebar');
        this.overlay = document.getElementById('cart-overlay');
        this.cartIcon = document.querySelector('.cart-icon');
        this.cartCount = document.querySelector('.cart-count');
        
        this.init();
        this.updateUI();
    }

    init() {
        // Cart icon click
        if (this.cartIcon) {
            this.cartIcon.addEventListener('click', () => this.toggleSidebar());
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Close button
        const closeBtn = document.getElementById('close-cart');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSidebar());
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const serviceId = e.target.dataset.service;
                const price = parseFloat(e.target.dataset.price);
                this.addItem(serviceId, price);
            }
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }

    addItem(serviceId, price) {
        const existingItem = this.items.find(item => item.id === serviceId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: serviceId,
                name: this.getServiceName(serviceId),
                price: price,
                quantity: 1
            });
        }

        this.saveToStorage();
        this.updateUI();
        this.showAddedAnimation();
        notifications.show('Item added to cart!', 'success', 2000);
    }

    removeItem(serviceId) {
        this.items = this.items.filter(item => item.id !== serviceId);
        this.saveToStorage();
        this.updateUI();
        notifications.show('Item removed from cart', 'info', 2000);
    }

    updateQuantity(serviceId, quantity) {
        const item = this.items.find(item => item.id === serviceId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(serviceId);
            } else {
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getServiceName(serviceId) {
        const serviceNames = {
            'kundali-analysis': 'Complete Kundali Analysis',
            'gemstone-recommendation': 'Gemstone Recommendation',
            'love-marriage': 'Love & Marriage Consultation',
            'career-finance': 'Career & Finance Guidance',
            'vastu-consultation': 'Vastu Consultation',
            'numerology-reading': 'Numerology Reading'
        };
        return serviceNames[serviceId] || 'Service';
    }

    updateUI() {
        // Update cart count
        if (this.cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCount.textContent = totalItems;
        }

        // Update cart items
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                cartItemsContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>₹${item.price}</p>
                        </div>
                        <div class="cart-item-controls">
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            <button onclick="cart.removeItem('${item.id}')" class="remove-btn">×</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update total
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = this.getTotal().toFixed(0);
        }
    }

    toggleSidebar() {
        if (this.sidebar.classList.contains('active')) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        this.sidebar.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeSidebar() {
        this.sidebar.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    showAddedAnimation() {
        if (this.cartIcon) {
            this.cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    checkout() {
        if (this.items.length === 0) {
            notifications.show('Your cart is empty', 'warning');
            return;
        }
        
        loadingOverlay.show('Redirecting to checkout...');
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.parallax-element');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateParallax());
        this.updateParallax();
    }

    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Initialize parallax effect
const parallaxEffect = new ParallaxEffect();

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.init();
    }

    init() {
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .fade-in-left, .fade-in-right, .slide-in-down, .zoom-in'
        );
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = this.getInitialTransform(element);
            this.observer.observe(element);
        });
    }

    getInitialTransform(element) {
        if (element.classList.contains('fade-in-up')) return 'translateY(30px)';
        if (element.classList.contains('fade-in-left')) return 'translateX(-50px)';
        if (element.classList.contains('fade-in-right')) return 'translateX(50px)';
        if (element.classList.contains('slide-in-down')) return 'translateY(-50px)';
        if (element.classList.contains('zoom-in')) return 'scale(0.8)';
        return 'none';
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
                entry.target.style.transition = 'all 0.8s ease-out';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Initialize animation observer
const animationObserver = new AnimationObserver();

// Enhanced Search Functionality
class SearchSystem {
    constructor(searchInput, resultsContainer) {
        this.searchInput = searchInput;
        this.resultsContainer = resultsContainer;
        this.searchData = [];
        this.init();
    }

    init() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Load search data
        this.loadSearchData();
    }

    loadSearchData() {
        // This would typically come from an API
        this.searchData = [
            { title: 'Kundali Analysis', category: 'service', url: 'services.html#kundali' },
            { title: 'Gemstone Recommendation', category: 'service', url: 'services.html#gemstone' },
            { title: 'Love Marriage Consultation', category: 'service', url: 'services.html#love' },
            { title: 'Career Guidance', category: 'service', url: 'services.html#career' },
            { title: 'Vastu Tips', category: 'service', url: 'services.html#vastu' },
            { title: 'Weekly Horoscope', category: 'blog', url: 'blog.html#rashifal' },
            { title: 'Planetary Effects', category: 'blog', url: 'blog.html#planets' },
            { title: 'Remedies and Mantras', category: 'blog', url: 'blog.html#remedies' }
        ];
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideResults();
            return;
        }

        const results = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        this.showResults(results, query);
    }

    showResults(results, query) {
        if (!this.resultsContainer) return;

        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            this.resultsContainer.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${result.url}">
                        <div class="search-result-title">${this.highlightMatch(result.title, query)}</div>
                        <div class="search-result-category">${result.category}</div>
                    </a>
                </div>
            `).join('');
        }

        this.resultsContainer.style.display = 'block';
    }

    hideResults() {
        if (this.resultsContainer) {
            this.resultsContainer.style.display = 'none';
        }
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// Initialize search system
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchSystem = new SearchSystem(searchInput, searchResults);
});

// Analytics Tracking
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        // Track page views
        this.trackPageView();
        
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });

        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            this.trackTimeOnPage();
        });
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title,
            timestamp: Date.now()
        });
    }

    trackClick(event) {
        const element = event.target;
        const data = {
            element: element.tagName,
            class: element.className,
            id: element.id,
            text: element.textContent?.substring(0, 50),
            timestamp: Date.now()
        };

        this.trackEvent('click', data);
    }

    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestone scrolls
                if ([25, 50, 75, 100].includes(scrollPercent)) {
                    this.trackEvent('scroll', {
                        depth: scrollPercent,
                        timestamp: Date.now()
                    });
                }
            }
        });
    }

    trackTimeOnPage() {
        const timeSpent = Date.now() - this.startTime;
        this.trackEvent('time_on_page', {
            duration: timeSpent,
            page: window.location.pathname,
            timestamp: Date.now()
        });
    }

    trackEvent(eventName, data) {
        const event = {
            name: eventName,
            data: data,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };

        this.events.push(event);
        console.log('Analytics Event:', eventName, data);
        
        // In a real application, you would send this to your analytics service
        // this.sendToAnalytics(event);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }
}

// Initialize analytics
const analytics = new AnalyticsTracker();

// Export for global access
window.notifications = notifications;
window.loadingOverlay = loadingOverlay;
window.cart = cart;
window.analytics = analytics;
