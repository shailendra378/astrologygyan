// Services Page E-commerce Functionality

// Initialize services page
document.addEventListener('DOMContentLoaded', function() {
    initializeServicesPage();
});

// Initialize all services functionality
function initializeServicesPage() {
    initializeCart();
    initializeFilters();
    initializeQuickView();
    initializeServiceActions();
    loadCartFromStorage();
    updateCartDisplay();
}

// Cart functionality
let cart = [];

function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Open cart
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            openCart();
        });
    }

    // Close cart
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            closeCart();
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', function() {
            closeCart();
        });
    }

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            proceedToCheckout();
        });
    }

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            const price = parseInt(this.getAttribute('data-price'));
            addToCart(serviceId, price);
        });
    });
}

// Add item to cart
function addToCart(serviceId, price) {
    const serviceElement = document.querySelector(`[data-service="${serviceId}"]`).closest('.service-product');
    const serviceName = serviceElement.querySelector('h3').textContent;
    const serviceImage = serviceElement.querySelector('img').src;

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === serviceId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('Item quantity updated in cart!', 'success');
    } else {
        const cartItem = {
            id: serviceId,
            name: serviceName,
            price: price,
            image: serviceImage,
            quantity: 1
        };
        cart.push(cartItem);
        showNotification('Service added to cart!', 'success');
    }

    updateCartDisplay();
    saveCartToStorage();
    
    // Animate add to cart button
    animateAddToCart(event.target);
}

// Remove item from cart
function removeFromCart(serviceId) {
    cart = cart.filter(item => item.id !== serviceId);
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Item removed from cart!', 'info');
}

// Update item quantity
function updateQuantity(serviceId, newQuantity) {
    const item = cart.find(item => item.id === serviceId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(serviceId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = total;
    }
}

// Open cart sidebar
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    // Store cart data for checkout
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('astrologyCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('astrologyCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Animate add to cart button
function animateAddToCart(button) {
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
        button.style.background = '';
    }, 2000);
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceProducts = document.querySelectorAll('.service-product');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            serviceProducts.forEach(product => {
                const category = product.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    product.style.display = 'block';
                    product.classList.add('fade-in-up');
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// Quick view functionality
function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeBtn = quickViewModal.querySelector('.close');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            openQuickView(serviceId);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            quickViewModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === quickViewModal) {
            quickViewModal.style.display = 'none';
        }
    });
}

// Open quick view modal
function openQuickView(serviceId) {
    const serviceElement = document.querySelector(`[data-service="${serviceId}"]`).closest('.service-product');
    const quickViewDetails = document.getElementById('quick-view-details');
    const quickViewModal = document.getElementById('quickViewModal');

    if (serviceElement && quickViewDetails) {
        const serviceName = serviceElement.querySelector('h3').textContent;
        const serviceImage = serviceElement.querySelector('img').src;
        const serviceDescription = serviceElement.querySelector('p').textContent;
        const serviceFeatures = Array.from(serviceElement.querySelectorAll('.service-features span')).map(span => span.textContent);
        const currentPrice = serviceElement.querySelector('.current-price').textContent;
        const originalPrice = serviceElement.querySelector('.original-price').textContent;
        const discount = serviceElement.querySelector('.discount').textContent;
        const rating = serviceElement.querySelector('.service-rating span').textContent;

        quickViewDetails.innerHTML = `
            <div class="quick-view-container">
                <div class="quick-view-image">
                    <img src="${serviceImage}" alt="${serviceName}">
                </div>
                <div class="quick-view-info">
                    <h2>${serviceName}</h2>
                    <div class="service-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span>${rating}</span>
                    </div>
                    <p class="service-description">${serviceDescription}</p>
                    <div class="service-features">
                        <h4>What's Included:</h4>
                        <ul>
                            ${serviceFeatures.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="service-pricing">
                        <span class="original-price">${originalPrice}</span>
                        <span class="current-price">${currentPrice}</span>
                        <span class="discount">${discount}</span>
                    </div>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary add-to-cart" data-service="${serviceId}" data-price="${currentPrice.replace('₹', '')}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary book-now" data-service="${serviceId}">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners to new buttons
        const addToCartBtn = quickViewDetails.querySelector('.add-to-cart');
        const bookNowBtn = quickViewDetails.querySelector('.book-now');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const serviceId = this.getAttribute('data-service');
                const price = parseInt(this.getAttribute('data-price'));
                addToCart(serviceId, price);
                quickViewModal.style.display = 'none';
            });
        }

        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', function() {
                const serviceId = this.getAttribute('data-service');
                window.AstrologyGyan.openBookingModal(serviceId);
                quickViewModal.style.display = 'none';
            });
        }

        quickViewModal.style.display = 'block';
    }
}

// Service actions initialization
function initializeServiceActions() {
    // Book now buttons
    const bookNowButtons = document.querySelectorAll('.book-now');
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            window.AstrologyGyan.openBookingModal(serviceId);
        });
    });

    // Service comparison
    initializeComparison();
    
    // Wishlist functionality
    initializeWishlist();
}

// Service comparison functionality
function initializeComparison() {
    let comparisonList = [];

    // Add comparison buttons to each service
    const serviceProducts = document.querySelectorAll('.service-product');
    serviceProducts.forEach(product => {
        const compareBtn = document.createElement('button');
        compareBtn.className = 'compare-btn';
        compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Compare';
        compareBtn.addEventListener('click', function() {
            const serviceId = product.querySelector('[data-service]').getAttribute('data-service');
            toggleComparison(serviceId, product);
        });
        
        product.querySelector('.service-actions').appendChild(compareBtn);
    });

    function toggleComparison(serviceId, productElement) {
        const index = comparisonList.findIndex(item => item.id === serviceId);
        
        if (index > -1) {
            // Remove from comparison
            comparisonList.splice(index, 1);
            productElement.classList.remove('in-comparison');
            showNotification('Removed from comparison', 'info');
        } else {
            // Add to comparison (max 3 items)
            if (comparisonList.length >= 3) {
                showNotification('You can compare maximum 3 services', 'error');
                return;
            }
            
            const serviceName = productElement.querySelector('h3').textContent;
            const servicePrice = productElement.querySelector('.current-price').textContent;
            const serviceImage = productElement.querySelector('img').src;
            
            comparisonList.push({
                id: serviceId,
                name: serviceName,
                price: servicePrice,
                image: serviceImage,
                element: productElement
            });
            
            productElement.classList.add('in-comparison');
            showNotification('Added to comparison', 'success');
        }
        
        updateComparisonBar();
    }

    function updateComparisonBar() {
        let comparisonBar = document.getElementById('comparison-bar');
        
        if (comparisonList.length === 0) {
            if (comparisonBar) {
                comparisonBar.remove();
            }
            return;
        }

        if (!comparisonBar) {
            comparisonBar = document.createElement('div');
            comparisonBar.id = 'comparison-bar';
            comparisonBar.className = 'comparison-bar';
            document.body.appendChild(comparisonBar);
        }

        comparisonBar.innerHTML = `
            <div class="comparison-content">
                <div class="comparison-items">
                    ${comparisonList.map(item => `
                        <div class="comparison-item">
                            <img src="${item.image}" alt="${item.name}">
                            <span>${item.name}</span>
                            <button onclick="removeFromComparison('${item.id}')">&times;</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary compare-now" onclick="showComparison()">
                    Compare (${comparisonList.length})
                </button>
                <button class="close-comparison" onclick="clearComparison()">&times;</button>
            </div>
        `;
    }

    // Global functions for comparison
    window.removeFromComparison = function(serviceId) {
        const index = comparisonList.findIndex(item => item.id === serviceId);
        if (index > -1) {
            comparisonList[index].element.classList.remove('in-comparison');
            comparisonList.splice(index, 1);
            updateComparisonBar();
        }
    };

    window.clearComparison = function() {
        comparisonList.forEach(item => {
            item.element.classList.remove('in-comparison');
        });
        comparisonList = [];
        updateComparisonBar();
    };

    window.showComparison = function() {
        if (comparisonList.length < 2) {
            showNotification('Please select at least 2 services to compare', 'error');
            return;
        }
        
        // Create comparison modal
        const comparisonModal = document.createElement('div');
        comparisonModal.className = 'modal comparison-modal';
        comparisonModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Service Comparison</h2>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                ${comparisonList.map(item => `<th>${item.name}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Price</td>
                                ${comparisonList.map(item => `<td>${item.price}</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Rating</td>
                                ${comparisonList.map(() => `<td>⭐⭐⭐⭐⭐</td>`).join('')}
                            </tr>
                            <tr>
                                <td>Delivery</td>
                                ${comparisonList.map(() => `<td>24-48 hours</td>`).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.body.appendChild(comparisonModal);
        comparisonModal.style.display = 'block';
        
        // Close modal functionality
        const closeBtn = comparisonModal.querySelector('.close');
        closeBtn.addEventListener('click', function() {
            comparisonModal.remove();
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === comparisonModal) {
                comparisonModal.remove();
            }
        });
    };
}

// Wishlist functionality
function initializeWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('astrologyWishlist') || '[]');

    // Add wishlist buttons to each service
    const serviceProducts = document.querySelectorAll('.service-product');
    serviceProducts.forEach(product => {
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        
        const serviceId = product.querySelector('[data-service]').getAttribute('data-service');
        const isInWishlist = wishlist.includes(serviceId);
        
        wishlistBtn.innerHTML = isInWishlist ? 
            '<i class="fas fa-heart"></i>' : 
            '<i class="far fa-heart"></i>';
        
        wishlistBtn.addEventListener('click', function() {
            toggleWishlist(serviceId, this);
        });
        
        product.querySelector('.service-image').appendChild(wishlistBtn);
    });

    function toggleWishlist(serviceId, button) {
        const index = wishlist.indexOf(serviceId);
        
        if (index > -1) {
            // Remove from wishlist
            wishlist.splice(index, 1);
            button.innerHTML = '<i class="far fa-heart"></i>';
            showNotification('Removed from wishlist', 'info');
        } else {
            // Add to wishlist
            wishlist.push(serviceId);
            button.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('Added to wishlist', 'success');
        }
        
        localStorage.setItem('astrologyWishlist', JSON.stringify(wishlist));
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search services...';
    searchInput.className = 'service-search';
    
    const servicesFilter = document.querySelector('.services-filter');
    servicesFilter.appendChild(searchInput);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const serviceProducts = document.querySelectorAll('.service-product');
        
        serviceProducts.forEach(product => {
            const serviceName = product.querySelector('h3').textContent.toLowerCase();
            const serviceDescription = product.querySelector('p').textContent.toLowerCase();
            
            if (serviceName.includes(searchTerm) || serviceDescription.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
}

// Initialize search
initializeSearch();

// Service reviews functionality
function initializeReviews() {
    const serviceProducts = document.querySelectorAll('.service-product');
    
    serviceProducts.forEach(product => {
        const reviewsBtn = document.createElement('button');
        reviewsBtn.className = 'reviews-btn';
        reviewsBtn.innerHTML = 'View Reviews';
        reviewsBtn.addEventListener('click', function() {
            const serviceId = product.querySelector('[data-service]').getAttribute('data-service');
            showReviews(serviceId);
        });
        
        product.querySelector('.service-rating').appendChild(reviewsBtn);
    });
}

// Show service reviews
function showReviews(serviceId) {
    const reviewsModal = document.createElement('div');
    reviewsModal.className = 'modal reviews-modal';
    reviewsModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Customer Reviews</h2>
            <div class="reviews-container">
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="images/client1.jpg" alt="Reviewer">
                            <div>
                                <h4>Priya Sharma</h4>
                                <div class="review-rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                        <span class="review-date">2 days ago</span>
                    </div>
                    <p class="review-text">Excellent service! Very accurate predictions and helpful guidance. Highly recommended!</p>
                </div>
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="images/client2.jpg" alt="Reviewer">
                            <div>
                                <h4>Rajesh Kumar</h4>
                                <div class="review-rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                        <span class="review-date">1 week ago</span>
                    </div>
                    <p class="review-text">Amazing insights and very professional service. The remedies really worked for me.</p>
                </div>
            </div>
            <div class="add-review">
                <h3>Add Your Review</h3>
                <form class="review-form">
                    <div class="rating-input">
                        <label>Rating:</label>
                        <div class="star-rating">
                            <span class="star" data-rating="1">☆</span>
                            <span class="star" data-rating="2">☆</span>
                            <span class="star" data-rating="3">☆</span>
                            <span class="star" data-rating="4">☆</span>
                            <span class="star" data-rating="5">☆</span>
                        </div>
                    </div>
                    <textarea placeholder="Write your review..." required></textarea>
                    <button type="submit" class="btn btn-primary">Submit Review</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(reviewsModal);
    reviewsModal.style.display = 'block';
    
    // Star rating functionality
    const stars = reviewsModal.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.textContent = '★';
                    s.classList.add('active');
                } else {
                    s.textContent = '☆';
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // Close modal
    const closeBtn = reviewsModal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        reviewsModal.remove();
    });
}

// Initialize reviews
initializeReviews();

// Notification function (if not already defined in main.js)
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
window.ServicesPage = {
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart
};
