// Checkout Page Functionality

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

// Global checkout data
let checkoutData = {
    cart: [],
    customer: {},
    payment: {},
    order: {},
    currentStep: 1,
    pricing: {
        subtotal: 0,
        discount: 0,
        gst: 0,
        total: 0
    }
};

// Initialize checkout functionality
function initializeCheckout() {
    loadCartData();
    initializeSteps();
    initializePromoCodes();
    initializeFormValidation();
    initializePaymentMethods();
    updateOrderSummary();
    
    // Check if user is logged in
    checkUserAuthentication();
}

// Load cart data from localStorage
function loadCartData() {
    const cartData = localStorage.getItem('checkoutCart');
    if (cartData) {
        try {
            checkoutData.cart = JSON.parse(cartData);
            displayOrderItems();
        } catch (error) {
            console.error('Error loading cart data:', error);
            showNotification('कार्ट डेटा लोड करने में त्रुटि।', 'error');
            window.location.href = 'services.html';
        }
    } else {
        showNotification('कार्ट खाली है। कृपया पहले सेवाएं चुनें।', 'error');
        window.location.href = 'services.html';
    }
}

// Display order items
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (checkoutData.cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">कोई आइटम नहीं मिला।</p>';
        return;
    }
    
    orderItemsContainer.innerHTML = checkoutData.cart.map(item => `
        <div class="order-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-description">व्यापक विश्लेषण और व्यक्तिगत सुझाव</p>
                <div class="item-features">
                    <span><i class="fas fa-check"></i> विस्तृत रिपोर्ट</span>
                    <span><i class="fas fa-check"></i> व्यक्तिगत परामर्श</span>
                    <span><i class="fas fa-check"></i> उपाय सुझाव</span>
                </div>
            </div>
            <div class="item-pricing">
                <div class="item-quantity">
                    <button class="qty-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="item-price">₹${item.price}</div>
                <div class="item-total">₹${item.price * item.quantity}</div>
                <button class="remove-item" onclick="removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    calculatePricing();
}

// Update item quantity
function updateItemQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(itemId);
        return;
    }
    
    const item = checkoutData.cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        displayOrderItems();
        updateOrderSummary();
        
        // Update localStorage
        localStorage.setItem('checkoutCart', JSON.stringify(checkoutData.cart));
        
        trackCheckoutEvent('quantity_updated', {
            itemId: itemId,
            newQuantity: newQuantity
        });
    }
}

// Remove item from cart
function removeItem(itemId) {
    checkoutData.cart = checkoutData.cart.filter(item => item.id !== itemId);
    
    if (checkoutData.cart.length === 0) {
        showNotification('कार्ट खाली हो गया है।', 'info');
        window.location.href = 'services.html';
        return;
    }
    
    displayOrderItems();
    updateOrderSummary();
    
    // Update localStorage
    localStorage.setItem('checkoutCart', JSON.stringify(checkoutData.cart));
    
    trackCheckoutEvent('item_removed', {
        itemId: itemId
    });
    
    showNotification('आइटम हटा दिया गया।', 'success');
}

// Calculate pricing
function calculatePricing() {
    checkoutData.pricing.subtotal = checkoutData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply discount if any
    const discountPercent = checkoutData.discount ? checkoutData.discount.percent : 0;
    checkoutData.pricing.discount = Math.round(checkoutData.pricing.subtotal * discountPercent / 100);
    
    // Calculate GST on discounted amount
    const taxableAmount = checkoutData.pricing.subtotal - checkoutData.pricing.discount;
    checkoutData.pricing.gst = Math.round(taxableAmount * 0.18);
    
    // Calculate total
    checkoutData.pricing.total = checkoutData.pricing.subtotal - checkoutData.pricing.discount + checkoutData.pricing.gst;
}

// Update order summary
function updateOrderSummary() {
    calculatePricing();
    
    // Update all summary sections
    ['', '2', '3'].forEach(suffix => {
        const subtotalEl = document.getElementById(`subtotal${suffix}`);
        const discountEl = document.getElementById(`discount${suffix}`);
        const gstEl = document.getElementById(`gst${suffix}`);
        const totalEl = document.getElementById(`total${suffix}`);
        
        if (subtotalEl) subtotalEl.textContent = `₹${checkoutData.pricing.subtotal.toLocaleString()}`;
        if (discountEl) discountEl.textContent = `₹${checkoutData.pricing.discount.toLocaleString()}`;
        if (gstEl) gstEl.textContent = `₹${checkoutData.pricing.gst.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `₹${checkoutData.pricing.total.toLocaleString()}`;
    });
}

// Step navigation
function initializeSteps() {
    updateStepProgress(1);
}

function nextStep(step) {
    if (validateCurrentStep()) {
        checkoutData.currentStep = step;
        showStep(step);
        updateStepProgress(step);
        
        trackCheckoutEvent('step_completed', {
            step: step - 1,
            nextStep: step
        });
    }
}

function previousStep(step) {
    checkoutData.currentStep = step;
    showStep(step);
    updateStepProgress(step);
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(stepEl => {
        stepEl.style.display = 'none';
    });
    
    // Show current step
    document.getElementById(`step${step}`).style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepProgress(currentStep) {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Validate current step
function validateCurrentStep() {
    switch (checkoutData.currentStep) {
        case 1:
            return checkoutData.cart.length > 0;
        case 2:
            return validatePersonalDetails();
        case 3:
            return validatePaymentMethod();
        default:
            return true;
    }
}

// Validate personal details
function validatePersonalDetails() {
    const form = document.getElementById('personalDetailsForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'birthTime', 'birthPlace', 'gender'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`कृपया ${getFieldLabel(field)} भरें।`, 'error');
            document.getElementById(field).focus();
            return false;
        }
    }
    
    // Validate email
    if (!isValidEmail(data.email)) {
        showNotification('कृपया वैध ईमेल पता दर्ज करें।', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    // Validate phone
    if (!isValidPhone(data.phone)) {
        showNotification('कृपया वैध मोबाइल नंबर दर्ज करें।', 'error');
        document.getElementById('phone').focus();
        return false;
    }
    
    // Store customer data
    checkoutData.customer = data;
    return true;
}

function validateAndNext(step) {
    if (validatePersonalDetails()) {
        nextStep(step);
    }
}

// Validate payment method
function validatePaymentMethod() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedMethod) {
        showNotification('कृपया भुगतान विधि चुनें।', 'error');
        return false;
    }
    
    checkoutData.payment.method = selectedMethod.value;
    return true;
}

// Promo codes functionality
function initializePromoCodes() {
    // Available promo codes
    checkoutData.promoCodes = {
        'FIRST20': { percent: 20, description: 'पहली खरीदारी पर 20% छूट', minAmount: 1000 },
        'ASTRO15': { percent: 15, description: 'सभी सेवाओं पर 15% छूट', minAmount: 500 },
        'WELCOME10': { percent: 10, description: 'स्वागत छूट 10%', minAmount: 0 },
        'DIWALI25': { percent: 25, description: 'दिवाली विशेष 25% छूट', minAmount: 2000 }
    };
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('कृपया प्रोमो कोड दर्ज करें।', 'error');
        return;
    }
    
    const promoData = checkoutData.promoCodes[code];
    
    if (!promoData) {
        showNotification('अमान्य प्रोमो कोड।', 'error');
        return;
    }
    
    if (checkoutData.pricing.subtotal < promoData.minAmount) {
        showNotification(`इस कोड के लिए न्यूनतम ऑर्डर राशि ₹${promoData.minAmount} होनी चाहिए।`, 'error');
        return;
    }
    
    // Apply discount
    checkoutData.discount = {
        code: code,
        percent: promoData.percent,
        description: promoData.description
    };
    
    updateOrderSummary();
    showNotification(`प्रोमो कोड लागू किया गया! ${promoData.percent}% छूट मिली।`, 'success');
    
    // Disable promo input
    promoInput.disabled = true;
    promoInput.value = `${code} - ${promoData.percent}% छूट`;
    
    trackCheckoutEvent('promo_applied', {
        code: code,
        discount: promoData.percent
    });
}

function applyCoupon(code) {
    document.getElementById('promoCode').value = code;
    applyPromoCode();
}

// Payment methods
function initializePaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update visual selection
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            trackCheckoutEvent('payment_method_selected', {
                method: radio.value
            });
        });
    });
}

// Process payment
function processPayment() {
    if (!validatePaymentMethod()) {
        return;
    }
    
    const paymentBtn = document.querySelector('.payment-btn');
    
    // Show loading state
    paymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> भुगतान प्रक्रिया...';
    paymentBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        if (success) {
            processSuccessfulPayment();
        } else {
            processFailedPayment();
        }
        
        // Reset button
        paymentBtn.innerHTML = '<i class="fas fa-credit-card"></i> भुगतान करें';
        paymentBtn.disabled = false;
        
    }, 3000);
    
    trackCheckoutEvent('payment_initiated', {
        method: checkoutData.payment.method,
        amount: checkoutData.pricing.total
    });
}

// Process successful payment
function processSuccessfulPayment() {
    // Generate order data
    checkoutData.order = {
        id: generateOrderId(),
        paymentId: generatePaymentId(),
        date: new Date().toISOString(),
        status: 'confirmed',
        customer: checkoutData.customer,
        items: checkoutData.cart,
        pricing: checkoutData.pricing,
        payment: checkoutData.payment,
        discount: checkoutData.discount
    };
    
    // Store order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(checkoutData.order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('checkoutCart');
    localStorage.removeItem('astrologyCart');
    
    // Update confirmation page
    updateConfirmationPage();
    
    // Show confirmation step
    nextStep(4);
    
    // Send confirmation email (simulate)
    sendOrderConfirmation();
    
    trackCheckoutEvent('payment_success', {
        orderId: checkoutData.order.id,
        amount: checkoutData.pricing.total
    });
    
    showNotification('भुगतान सफल! आपका ऑर्डर कन्फर्म हो गया है।', 'success');
}

// Process failed payment
function processFailedPayment() {
    showNotification('भुगतान असफल। कृपया दोबारा कोशिश करें।', 'error');
    
    trackCheckoutEvent('payment_failed', {
        method: checkoutData.payment.method,
        amount: checkoutData.pricing.total
    });
}

// Update confirmation page
function updateConfirmationPage() {
    document.getElementById('orderId').textContent = checkoutData.order.id;
    document.getElementById('paymentId').textContent = checkoutData.order.paymentId;
    document.getElementById('orderDate').textContent = new Date(checkoutData.order.date).toLocaleDateString('hi-IN');
    document.getElementById('finalAmount').textContent = `₹${checkoutData.pricing.total.toLocaleString()}`;
}

// Send order confirmation
function sendOrderConfirmation() {
    // Simulate sending confirmation email and SMS
    setTimeout(() => {
        showNotification('पुष्टिकरण ईमेल और SMS भेजा गया है।', 'success');
    }, 2000);
}

// Download receipt
function downloadReceipt() {
    // Generate receipt content
    const receiptContent = generateReceiptContent();
    
    // Create and download receipt
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${checkoutData.order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    trackCheckoutEvent('receipt_downloaded', {
        orderId: checkoutData.order.id
    });
    
    showNotification('रसीद डाउनलोड हो गई है।', 'success');
}

// Generate receipt content
function generateReceiptContent() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt - ${checkoutData.order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-details { margin-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .total-section { text-align: right; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Astrology Gyan</h1>
                <h2>Order Receipt</h2>
            </div>
            
            <div class="order-details">
                <p><strong>Order ID:</strong> ${checkoutData.order.id}</p>
                <p><strong>Payment ID:</strong> ${checkoutData.order.paymentId}</p>
                <p><strong>Date:</strong> ${new Date(checkoutData.order.date).toLocaleDateString('hi-IN')}</p>
                <p><strong>Customer:</strong> ${checkoutData.customer.firstName} ${checkoutData.customer.lastName}</p>
                <p><strong>Email:</strong> ${checkoutData.customer.email}</p>
                <p><strong>Phone:</strong> ${checkoutData.customer.phone}</p>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${checkoutData.cart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.price}</td>
                            <td>₹${item.price * item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total-section">
                <p>Subtotal: ₹${checkoutData.pricing.subtotal}</p>
                <p>Discount: ₹${checkoutData.pricing.discount}</p>
                <p>GST (18%): ₹${checkoutData.pricing.gst}</p>
                <p><strong>Total: ₹${checkoutData.pricing.total}</strong></p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p>Thank you for choosing Astrology Gyan!</p>
                <p>Contact: +91 9876543210 | info@astrologygyan.com</p>
            </div>
        </body>
        </html>
    `;
}

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('personalDetailsForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateFormField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateFormField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} आवश्यक है।`;
    }
    
    // Specific validations
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

// Check user authentication
function checkUserAuthentication() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    
    if (session) {
        try {
            const userData = JSON.parse(session);
            // Pre-fill form with user data
            prefillUserData(userData.user);
        } catch (error) {
            console.error('Error parsing user session:', error);
        }
    }
}

// Pre-fill user data
function prefillUserData(user) {
    if (user) {
        const fields = {
            'firstName': user.firstName,
            'lastName': user.lastName,
            'email': user.email,
            'phone': user.phone
        };
        
        Object.keys(fields).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && fields[fieldName]) {
                field.value = fields[fieldName];
            }
        });
    }
}

// Utility functions
function generateOrderId() {
    return 'AG' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function generatePaymentId() {
    return 'PAY' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
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
        'birthTime': 'जन्म समय',
        'birthPlace': 'जन्म स्थान',
        'gender': 'लिंग',
        'maritalStatus': 'वैवाहिक स्थिति'
    };
    return labels[fieldName] || fieldName;
}

// Track checkout events
function trackCheckoutEvent(eventType, data) {
    const checkoutAnalytics = JSON.parse(localStorage.getItem('checkoutAnalytics') || '[]');
    checkoutAnalytics.push({
        type: eventType,
        data: data,
        timestamp: new Date().toISOString(),
        page: 'checkout',
        step: checkoutData.currentStep
    });
    localStorage.setItem('checkoutAnalytics', JSON.stringify(checkoutAnalytics));
    
    console.log('Checkout Event:', eventType, data);
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
window.CheckoutPage = {
    nextStep,
    previousStep,
    validateAndNext,
    applyPromoCode,
    applyCoupon,
    processPayment,
    downloadReceipt,
    updateItemQuantity,
    removeItem
};
