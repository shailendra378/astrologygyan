// About Page Functionality

// Initialize about page
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

// Initialize all about page functionality
function initializeAboutPage() {
    initializeCounterAnimation();
    initializeTimelineAnimation();
    initializeImageGallery();
    initializeTestimonialSlider();
    initializeSkillBars();
    initializeParallaxEffect();
    initializeContactForm();
}

// Counter animation for statistics
function initializeCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate individual counter
function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        if (current < target) {
            current += increment;
            if (current > target) current = target;
            
            // Format number based on size
            if (target >= 1000) {
                counter.textContent = Math.floor(current).toLocaleString();
            } else {
                counter.textContent = Math.floor(current);
            }
            
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target.toLocaleString();
        }
    };

    updateCounter();
}

// Timeline animation
function initializeTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    timelineItems.forEach((item, index) => {
        // Add delay based on index
        item.style.animationDelay = `${index * 0.2}s`;
        timelineObserver.observe(item);
    });
}

// Image gallery functionality
function initializeImageGallery() {
    // Create image gallery modal
    const galleryModal = document.createElement('div');
    galleryModal.className = 'gallery-modal';
    galleryModal.innerHTML = `
        <div class="gallery-modal-content">
            <span class="gallery-close">&times;</span>
            <img class="gallery-modal-image" src="" alt="">
            <div class="gallery-caption"></div>
            <div class="gallery-navigation">
                <button class="gallery-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="gallery-next"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(galleryModal);

    // Add click handlers to images
    const galleryImages = document.querySelectorAll('.about-image img, .philosophy-image img, .media-card img');
    let currentImageIndex = 0;
    const imageArray = Array.from(galleryImages);

    galleryImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openGallery(this.src, this.alt);
        });
    });

    // Gallery modal functionality
    const closeBtn = galleryModal.querySelector('.gallery-close');
    const prevBtn = galleryModal.querySelector('.gallery-prev');
    const nextBtn = galleryModal.querySelector('.gallery-next');
    const modalImage = galleryModal.querySelector('.gallery-modal-image');
    const caption = galleryModal.querySelector('.gallery-caption');

    closeBtn.addEventListener('click', closeGallery);
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);

    // Close on outside click
    galleryModal.addEventListener('click', function(event) {
        if (event.target === galleryModal) {
            closeGallery();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (galleryModal.style.display === 'block') {
            switch(event.key) {
                case 'Escape':
                    closeGallery();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    function openGallery(src, alt) {
        modalImage.src = src;
        caption.textContent = alt;
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length;
        const img = imageArray[currentImageIndex];
        modalImage.src = img.src;
        caption.textContent = img.alt;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        const img = imageArray[currentImageIndex];
        modalImage.src = img.src;
        caption.textContent = img.alt;
    }
}

// Testimonial slider (if testimonials are added)
function initializeTestimonialSlider() {
    // This can be expanded if testimonials are added to the about page
    const testimonialContainer = document.querySelector('.testimonials-container');
    
    if (testimonialContainer) {
        // Add testimonial slider functionality here
        console.log('Testimonial slider initialized');
    }
}

// Skill bars animation
function initializeSkillBars() {
    // Create skill bars section
    const skillsSection = document.createElement('section');
    skillsSection.className = 'skills-section';
    skillsSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">विशेषज्ञता के क्षेत्र</h2>
            <div class="skills-container">
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">वैदिक ज्योतिष</span>
                        <span class="skill-percentage">95%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="95"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">कुंडली विश्लेषण</span>
                        <span class="skill-percentage">98%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="98"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">रत्न सुझाव</span>
                        <span class="skill-percentage">92%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="92"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">वास्तु शास्त्र</span>
                        <span class="skill-percentage">88%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="88"></div>
                    </div>
                </div>
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">अंक ज्योतिष</span>
                        <span class="skill-percentage">90%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="90"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert after philosophy section
    const philosophySection = document.querySelector('.philosophy');
    if (philosophySection) {
        philosophySection.insertAdjacentElement('afterend', skillsSection);
    }

    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Parallax effect for hero section
function initializeParallaxEffect() {
    const heroSection = document.querySelector('.about-hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// Contact form in CTA section
function initializeContactForm() {
    // Add quick contact form to CTA section
    const ctaSection = document.querySelector('.cta-section .cta-content');
    
    if (ctaSection) {
        const quickContactForm = document.createElement('div');
        quickContactForm.className = 'quick-contact-form';
        quickContactForm.innerHTML = `
            <h3>त्वरित संपर्क</h3>
            <form class="contact-form">
                <div class="form-row">
                    <input type="text" name="name" placeholder="आपका नाम" required>
                    <input type="tel" name="phone" placeholder="मोबाइल नंबर" required>
                </div>
                <textarea name="message" placeholder="आपकी समस्या संक्षेप में बताएं" rows="3" required></textarea>
                <button type="submit" class="btn btn-primary">संदेश भेजें</button>
            </form>
        `;
        
        ctaSection.appendChild(quickContactForm);
        
        // Handle form submission
        const form = quickContactForm.querySelector('.contact-form');
        form.addEventListener('submit', handleQuickContact);
    }
}

// Handle quick contact form submission
function handleQuickContact(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> भेजा जा रहा है...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Store contact request
        const contactRequests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
        contactRequests.push({
            ...contactData,
            timestamp: new Date().toISOString(),
            source: 'about-page'
        });
        localStorage.setItem('contactRequests', JSON.stringify(contactRequests));
        
        // Show success message
        showNotification('आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।', 'success');
        
        // Reset form
        event.target.reset();
        submitBtn.innerHTML = 'संदेश भेजें';
        submitBtn.disabled = false;
        
        // Track contact attempt
        trackAboutEvent('quick_contact', contactData);
        
    }, 2000);
}

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
initializeSmoothScrolling();

// Add floating action buttons
function addFloatingActionButtons() {
    const fabContainer = document.createElement('div');
    fabContainer.className = 'fab-container';
    fabContainer.innerHTML = `
        <div class="fab-main">
            <i class="fas fa-plus"></i>
        </div>
        <div class="fab-options">
            <a href="tel:+919876543210" class="fab-option" title="कॉल करें">
                <i class="fas fa-phone"></i>
            </a>
            <a href="https://wa.me/919876543210" class="fab-option" title="WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
            <a href="mailto:info@astrologygyan.com" class="fab-option" title="ईमेल करें">
                <i class="fas fa-envelope"></i>
            </a>
            <a href="services.html" class="fab-option" title="सेवाएं देखें">
                <i class="fas fa-star"></i>
            </a>
        </div>
    `;
    
    document.body.appendChild(fabContainer);
    
    // Toggle FAB options
    const fabMain = fabContainer.querySelector('.fab-main');
    const fabOptions = fabContainer.querySelector('.fab-options');
    
    fabMain.addEventListener('click', function() {
        fabContainer.classList.toggle('active');
    });
    
    // Close FAB when clicking outside
    document.addEventListener('click', function(event) {
        if (!fabContainer.contains(event.target)) {
            fabContainer.classList.remove('active');
        }
    });
}

// Initialize floating action buttons
addFloatingActionButtons();

// Track about page events
function trackAboutEvent(eventType, data) {
    const aboutAnalytics = JSON.parse(localStorage.getItem('aboutAnalytics') || '[]');
    aboutAnalytics.push({
        type: eventType,
        data: data,
        timestamp: new Date().toISOString(),
        page: 'about'
    });
    localStorage.setItem('aboutAnalytics', JSON.stringify(aboutAnalytics));
    
    console.log('About Event:', eventType, data);
}

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressFill = document.querySelector('.scroll-progress-fill');
        if (progressFill) {
            progressFill.style.width = Math.min(scrollPercent, 100) + '%';
        }
    });
}

// Initialize scroll progress
addScrollProgress();

// Add back to top button
function addBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.title = 'वापस ऊपर जाएं';
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        trackAboutEvent('back_to_top', { scrollPosition: window.pageYOffset });
    });
}

// Initialize back to top button
addBackToTop();

// Add reading time estimator
function addReadingTime() {
    const content = document.querySelector('.about-main');
    if (content) {
        const text = content.textContent;
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        const readingTimeElement = document.createElement('div');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `<i class="fas fa-clock"></i> पढ़ने का समय: ${readingTime} मिनट`;
        
        const heroContent = document.querySelector('.about-hero .hero-content');
        if (heroContent) {
            heroContent.appendChild(readingTimeElement);
        }
    }
}

// Initialize reading time
addReadingTime();

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
window.AboutPage = {
    trackAboutEvent,
    animateCounter
};
