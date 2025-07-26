// Main JavaScript for vozolpuff.org.tr
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle mobile menu
            navMenu.classList.toggle('active');
        });
    }
    
    // Search Functionality
    const searchForm = document.querySelector('.search-container form');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchForm && searchInput) {
        // Sample products for search
        const products = [
            { name: 'Vozol Puff Bar 4000 Mentol', price: '150 TL', image: '/images/vozol-puff-mentol.jpg' },
            { name: 'Vozol Puff Bar Mango', price: '150 TL', image: '/images/vozol-puff-mango.jpg' },
            { name: 'Vozol Puff Bar Çilek', price: '150 TL', image: '/images/vozol-puff-strawberry.jpg' }
        ];
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length > 0) {
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(query)
                );
                
                displaySearchResults(filteredProducts);
            } else {
                hideSearchResults();
            }
        });
        
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle search form submission
            console.log('Arama yapıldı:', searchInput.value);
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                hideSearchResults();
            }
        });
    }
    
    function displaySearchResults(products) {
        if (!searchResults) return;
        
        if (products.length === 0) {
            searchResults.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">Ürün bulunamadı</div>';
        } else {
            searchResults.innerHTML = products.map(product => `
                <div style="padding: 0.75rem; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 0.75rem; cursor: pointer;" onclick="selectProduct('${product.name}')">
                    <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <div style="font-weight: 500; color: #333;">${product.name}</div>
                        <div style="color: #007bff; font-size: 0.9rem;">${product.price}</div>
                    </div>
                </div>
            `).join('');
        }
        
        searchResults.style.display = 'block';
    }
    
    function hideSearchResults() {
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
    
    // Global function for product selection
    window.selectProduct = function(productName) {
        if (searchInput) {
            searchInput.value = productName;
        }
        hideSearchResults();
        console.log('Ürün seçildi:', productName);
    };
    
    // Shopping Cart Functionality
    let cart = JSON.parse(localStorage.getItem('vozolpuff_cart')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Ekleniyor...';
            this.disabled = true;
            
            // Simulate adding to cart
            setTimeout(() => {
                addToCart({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    id: Date.now() // Simple ID generation
                });
                
                // Show success message
                showNotification(`${productName} sepete eklendi!`, 'success');
                
                // Reset button
                this.textContent = originalText;
                this.disabled = false;
            }, 800);
        });
    });
    
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('vozolpuff_cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Cart button click
    const cartButton = document.querySelector('.cart-btn');
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            showCart();
        });
    }
    
    function showCart() {
        // Simple cart display (you can enhance this)
        if (cart.length === 0) {
            alert('Sepetiniz boş');
            return;
        }
        
        let cartContent = 'Sepetiniz:\n\n';
        cart.forEach(item => {
            cartContent += `${item.name} - ${item.price} (${item.quantity} adet)\n`;
        });
        
        alert(cartContent);
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            // Initially hide answers
            answer.style.display = 'none';
            
            question.addEventListener('click', function() {
                const isOpen = answer.style.display === 'block';
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('p');
                    if (otherAnswer && otherAnswer !== answer) {
                        otherAnswer.style.display = 'none';
                    }
                });
                
                // Toggle current item
                answer.style.display = isOpen ? 'none' : 'block';
            });
        }
    });
    
    // Live Chat Toggle
    const chatToggle = document.querySelector('.chat-toggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            // Simple chat simulation
            alert('Canlı destek yakında aktif olacak!\n\nŞimdilik bize info@vozolpuff.org.tr adresinden ulaşabilirsiniz.');
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Create notification container if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 350px;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="flex: 1;">${message}</span>
                <button class="notification-close" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 18px; padding: 0;">&times;</button>
            </div>
        `;
        
        // Notification styles
        const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff';
        notification.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;
        
        notificationContainer.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
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
    
    // Image error handling
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdvcnNlbCB5dWtsZW5lbWVkaQ==';
            this.alt = 'Görsel yüklenemedi';
        });
    });
    
    // Responsive handling
    function handleResize() {
        if (window.innerWidth > 768) {
            navMenu?.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification {
            animation: slideInRight 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize cart count on page load
    updateCartCount();
    
    console.log('VozolPuff.org.tr JavaScript loaded successfully');
});

// Age verification (18+)
function checkAge() {
    const ageVerified = localStorage.getItem('vozolpuff_age_verified');
    
    if (!ageVerified) {
        const isAdult = confirm('Bu site 18 yaş üstü kullanıcılar içindir. 18 yaşından büyük müsünüz?');
        
        if (isAdult) {
            localStorage.setItem('vozolpuff_age_verified', 'true');
        } else {
            alert('Bu siteye erişim için 18 yaşından büyük olmanız gerekmektedir.');
            window.location.href = 'https://www.google.com';
        }
    }
}

// Check age on page load
window.addEventListener('load', checkAge);

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}