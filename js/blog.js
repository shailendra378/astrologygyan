// Blog Page Functionality

// Initialize blog page
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPage();
});

// Initialize all blog functionality
function initializeBlogPage() {
    initializeCategoryFilter();
    initializeSearch();
    initializeLoadMore();
    initializeNewsletter();
    initializeSocialSharing();
    initializeReadingProgress();
    initializeLikeSystem();
}

// Category filtering
function initializeCategoryFilter() {
    const categoryCards = document.querySelectorAll('.category-card');
    const blogCards = document.querySelectorAll('.blog-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active category
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter blog posts
            filterBlogPosts(category, blogCards);
            
            // Track category selection
            trackBlogEvent('category_filter', { category: category });
        });
    });
}

// Filter blog posts by category
function filterBlogPosts(category, blogCards) {
    blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('fade-in-up');
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    const visibleCards = Array.from(blogCards).filter(card => card.style.display !== 'none');
    updateResultsCount(visibleCards.length);
}

// Update results count
function updateResultsCount(count) {
    let resultsCounter = document.querySelector('.results-counter');
    
    if (!resultsCounter) {
        resultsCounter = document.createElement('div');
        resultsCounter.className = 'results-counter';
        document.querySelector('.blog-categories').appendChild(resultsCounter);
    }
    
    resultsCounter.textContent = `Showing ${count} articles`;
}

// Search functionality
function initializeSearch() {
    // Create search bar
    const searchContainer = document.createElement('div');
    searchContainer.className = 'blog-search-container';
    searchContainer.innerHTML = `
        <div class="search-bar">
            <input type="text" id="blog-search" placeholder="Search articles..." />
            <button type="button" class="search-btn">
                <i class="fas fa-search"></i>
            </button>
        </div>
        <div class="search-suggestions" id="search-suggestions"></div>
    `;
    
    // Insert search bar after hero section
    const heroSection = document.querySelector('.blog-hero');
    heroSection.insertAdjacentElement('afterend', searchContainer);
    
    const searchInput = document.getElementById('blog-search');
    const searchBtn = document.querySelector('.search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // Search functionality
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length > 0) {
            performSearch(query);
            showSearchSuggestions(query, suggestionsContainer);
        } else {
            clearSearch();
            hideSuggestions(suggestionsContainer);
        }
    }, 300));
    
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            performSearch(query);
            trackBlogEvent('search', { query: query });
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchContainer.contains(event.target)) {
            hideSuggestions(suggestionsContainer);
        }
    });
}

// Perform search
function performSearch(query) {
    const blogCards = document.querySelectorAll('.blog-card');
    let matchCount = 0;
    
    blogCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const content = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.blog-category').textContent.toLowerCase();
        
        if (title.includes(query) || content.includes(query) || category.includes(query)) {
            card.style.display = 'block';
            highlightSearchTerms(card, query);
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updateResultsCount(matchCount);
    
    if (matchCount === 0) {
        showNoResults(query);
    } else {
        hideNoResults();
    }
}

// Clear search
function clearSearch() {
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.style.display = 'block';
        removeHighlights(card);
    });
    
    updateResultsCount(blogCards.length);
    hideNoResults();
}

// Highlight search terms
function highlightSearchTerms(card, query) {
    const title = card.querySelector('h3');
    const content = card.querySelector('p');
    
    [title, content].forEach(element => {
        const originalText = element.textContent;
        const highlightedText = originalText.replace(
            new RegExp(query, 'gi'),
            `<mark>$&</mark>`
        );
        element.innerHTML = highlightedText;
    });
}

// Remove highlights
function removeHighlights(card) {
    const highlightedElements = card.querySelectorAll('mark');
    highlightedElements.forEach(element => {
        element.outerHTML = element.textContent;
    });
}

// Show search suggestions
function showSearchSuggestions(query, container) {
    const suggestions = getSearchSuggestions(query);
    
    if (suggestions.length > 0) {
        container.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" data-suggestion="${suggestion}">${suggestion}</div>`
        ).join('');
        
        container.style.display = 'block';
        
        // Add click handlers to suggestions
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const suggestion = this.getAttribute('data-suggestion');
                document.getElementById('blog-search').value = suggestion;
                performSearch(suggestion.toLowerCase());
                hideSuggestions(container);
            });
        });
    } else {
        hideSuggestions(container);
    }
}

// Get search suggestions
function getSearchSuggestions(query) {
    const suggestions = [
        'राशिफल', 'ज्योतिष', 'उपाय', 'मंत्र', 'रत्न', 'वास्तु',
        'ग्रह', 'कुंडली', 'प्रेम', 'करियर', 'स्वास्थ्य', 'धन',
        'शनि', 'मंगल', 'बृहस्पति', 'शुक्र', 'बुध', 'सूर्य', 'चंद्र',
        'हनुमान चालीसा', 'गायत्री मंत्र', 'महामृत्युंजय मंत्र'
    ];
    
    return suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
}

// Hide suggestions
function hideSuggestions(container) {
    container.style.display = 'none';
}

// Show no results message
function showNoResults(query) {
    let noResultsDiv = document.querySelector('.no-results');
    
    if (!noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        document.querySelector('.blog-grid').appendChild(noResultsDiv);
    }
    
    noResultsDiv.innerHTML = `
        <div class="no-results-content">
            <i class="fas fa-search"></i>
            <h3>No articles found for "${query}"</h3>
            <p>Try searching with different keywords or browse our categories.</p>
            <button class="btn btn-primary" onclick="clearSearchAndShow()">Show All Articles</button>
        </div>
    `;
    
    noResultsDiv.style.display = 'block';
}

// Hide no results message
function hideNoResults() {
    const noResultsDiv = document.querySelector('.no-results');
    if (noResultsDiv) {
        noResultsDiv.style.display = 'none';
    }
}

// Clear search and show all articles
function clearSearchAndShow() {
    document.getElementById('blog-search').value = '';
    clearSearch();
}

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let currentPage = 1;
    const articlesPerPage = 6;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles(currentPage + 1);
            currentPage++;
            
            // Track load more
            trackBlogEvent('load_more', { page: currentPage });
        });
    }
}

// Load more articles
function loadMoreArticles(page) {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Show loading state
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const newArticles = generateMoreArticles(page);
        const blogGrid = document.querySelector('.blog-grid');
        
        newArticles.forEach(article => {
            blogGrid.insertBefore(article, document.querySelector('.load-more-section'));
        });
        
        // Reset button
        loadMoreBtn.innerHTML = 'Load More Articles';
        loadMoreBtn.disabled = false;
        
        // Hide button if no more articles
        if (page >= 3) {
            loadMoreBtn.style.display = 'none';
            
            // Show end message
            const endMessage = document.createElement('div');
            endMessage.className = 'end-message';
            endMessage.innerHTML = '<p>You\'ve reached the end of our articles. Check back soon for more content!</p>';
            document.querySelector('.load-more-section').appendChild(endMessage);
        }
        
        // Animate new articles
        newArticles.forEach((article, index) => {
            setTimeout(() => {
                article.classList.add('fade-in-up');
            }, index * 100);
        });
        
    }, 1000);
}

// Generate more articles (simulate API response)
function generateMoreArticles(page) {
    const articles = [];
    const sampleArticles = [
        {
            category: 'rashifal',
            title: 'नवंबर 2024 राशिफल विशेष',
            content: 'नवंबर महीने की विशेष भविष्यवाणी और उपाय।',
            image: 'images/november-horoscope.jpg',
            author: 'Adarsh',
            date: 'Nov 5, 2024',
            views: '1.5k',
            likes: '98'
        },
        {
            category: 'planets',
            title: 'शुक्र ग्रह का प्रभाव और उपाय',
            content: 'शुक्र ग्रह कैसे प्रभावित करता है प्रेम और सौंदर्य को।',
            image: 'images/venus-effects.jpg',
            author: 'Adarsh',
            date: 'Nov 3, 2024',
            views: '2.1k',
            likes: '145'
        },
        {
            category: 'remedies',
            title: 'दीपावली के दिन विशेष उपाय',
            content: 'दीपावली पर करें ये उपाय, मिलेगी धन की बरसात।',
            image: 'images/diwali-remedies.jpg',
            author: 'Adarsh',
            date: 'Nov 1, 2024',
            views: '3.8k',
            likes: '267'
        }
    ];
    
    for (let i = 0; i < 3; i++) {
        const articleData = sampleArticles[i];
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.setAttribute('data-category', articleData.category);
        
        article.innerHTML = `
            <div class="blog-image">
                <img src="${articleData.image}" alt="${articleData.title}">
                <div class="blog-category">${getCategoryName(articleData.category)}</div>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="author">By ${articleData.author}</span>
                    <span class="date">${articleData.date}</span>
                </div>
                <h3>${articleData.title}</h3>
                <p>${articleData.content}</p>
                <div class="blog-stats">
                    <span><i class="fas fa-eye"></i> ${articleData.views} views</span>
                    <span><i class="fas fa-heart"></i> ${articleData.likes} likes</span>
                </div>
                <a href="#" class="read-more">Read More</a>
            </div>
        `;
        
        articles.push(article);
    }
    
    return articles;
}

// Get category display name
function getCategoryName(category) {
    const categoryNames = {
        'rashifal': 'Saptahik Rashifal',
        'planets': 'Grahon ka Prabhav',
        'remedies': 'Totke & Mantra',
        'faq': 'Astrology FAQs'
    };
    
    return categoryNames[category] || category;
}

// Newsletter subscription
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            subscribeToNewsletter(email);
        });
    }
}

// Subscribe to newsletter
function subscribeToNewsletter(email) {
    const submitBtn = document.querySelector('.newsletter-form button');
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store subscription
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            
            showNotification('Successfully subscribed to newsletter!', 'success');
            
            // Reset form
            document.querySelector('.newsletter-form input').value = '';
            
            // Track subscription
            trackBlogEvent('newsletter_subscribe', { email: email });
        } else {
            showNotification('You are already subscribed!', 'info');
        }
        
        // Reset button
        submitBtn.innerHTML = 'Subscribe';
        submitBtn.disabled = false;
        
    }, 1500);
}

// Social sharing
function initializeSocialSharing() {
    // Add social sharing buttons to each blog card
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        const socialShare = document.createElement('div');
        socialShare.className = 'social-share';
        socialShare.innerHTML = `
            <button class="share-btn" data-platform="facebook" title="Share on Facebook">
                <i class="fab fa-facebook"></i>
            </button>
            <button class="share-btn" data-platform="twitter" title="Share on Twitter">
                <i class="fab fa-twitter"></i>
            </button>
            <button class="share-btn" data-platform="whatsapp" title="Share on WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </button>
            <button class="share-btn" data-platform="copy" title="Copy Link">
                <i class="fas fa-link"></i>
            </button>
        `;
        
        card.querySelector('.blog-content').appendChild(socialShare);
        
        // Add event listeners
        socialShare.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                const platform = this.getAttribute('data-platform');
                const articleTitle = card.querySelector('h3').textContent;
                shareArticle(platform, articleTitle);
            });
        });
    });
}

// Share article
function shareArticle(platform, title) {
    const url = window.location.href;
    const text = `Check out this article: ${title}`;
    
    switch (platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            });
            break;
    }
    
    // Track sharing
    trackBlogEvent('article_share', { platform: platform, title: title });
}

// Reading progress indicator
function initializeReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', throttle(updateReadingProgress, 100));
}

// Update reading progress
function updateReadingProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset;
    const progress = (scrollTop / documentHeight) * 100;
    
    if (progressFill) {
        progressFill.style.width = Math.min(progress, 100) + '%';
    }
}

// Like system
function initializeLikeSystem() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        const likeBtn = card.querySelector('.blog-stats span:last-child');
        const articleId = generateArticleId(card.querySelector('h3').textContent);
        
        // Check if already liked
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        if (likedArticles.includes(articleId)) {
            likeBtn.classList.add('liked');
        }
        
        likeBtn.addEventListener('click', function() {
            toggleLike(articleId, this);
        });
        
        likeBtn.style.cursor = 'pointer';
    });
}

// Toggle like
function toggleLike(articleId, element) {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const likeCountSpan = element;
    const currentCount = parseInt(likeCountSpan.textContent.match(/\d+/)[0]);
    
    if (likedArticles.includes(articleId)) {
        // Unlike
        const index = likedArticles.indexOf(articleId);
        likedArticles.splice(index, 1);
        likeCountSpan.innerHTML = `<i class="far fa-heart"></i> ${currentCount - 1} likes`;
        likeCountSpan.classList.remove('liked');
        
        trackBlogEvent('article_unlike', { articleId: articleId });
    } else {
        // Like
        likedArticles.push(articleId);
        likeCountSpan.innerHTML = `<i class="fas fa-heart"></i> ${currentCount + 1} likes`;
        likeCountSpan.classList.add('liked');
        
        // Animate like
        likeCountSpan.classList.add('like-animation');
        setTimeout(() => {
            likeCountSpan.classList.remove('like-animation');
        }, 600);
        
        trackBlogEvent('article_like', { articleId: articleId });
    }
    
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
}

// Generate article ID
function generateArticleId(title) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

// Track blog events
function trackBlogEvent(eventType, data) {
    const blogAnalytics = JSON.parse(localStorage.getItem('blogAnalytics') || '[]');
    blogAnalytics.push({
        type: eventType,
        data: data,
        timestamp: new Date().toISOString(),
        page: 'blog'
    });
    localStorage.setItem('blogAnalytics', JSON.stringify(blogAnalytics));
    
    console.log('Blog Event:', eventType, data);
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
window.BlogPage = {
    clearSearchAndShow,
    filterBlogPosts,
    shareArticle,
    toggleLike
};
