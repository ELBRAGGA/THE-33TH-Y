// Scroll animations for background sections
class ScrollAnimations {
    constructor() {
        this.backgroundSections = document.querySelectorAll('.background-section');
        this.init();
    }

    init() {
        if (this.backgroundSections.length > 0) {
            this.checkVisibility();
            window.addEventListener('scroll', () => this.checkVisibility());
            window.addEventListener('resize', () => this.checkVisibility());
        }
    }

    checkVisibility() {
        this.backgroundSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
                section.classList.add('visible');
            }
        });
    }
}

// The 33rd Y - Vinyl Store JavaScript
class VinylStore {
    constructor() {
        this.inventory = [];
        this.cart = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadInventory();
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.displayRecords();
        this.updateCartCount();
    }

    loadInventory() {
        this.inventory = [
            {
                id: 1,
                albumName: "King of the Delta Blues",
                artist: "Robert Johnson",
                genre: "delta",
                year: 1961,
                condition: "Very Good",
                rarity: "grail",
                price: 4500,
                quantity: 2
            },
            {
                id: 2,
                albumName: "Complete Recordings", 
                artist: "Charley Patton",
                genre: "delta",
                year: 1990,
                condition: "Near Mint",
                rarity: "rare",
                price: 3200,
                quantity: 4
            },
            {
                id: 3,
                albumName: "Born Under a Bad Sign",
                artist: "Albert King",
                genre: "chicago", 
                year: 1967,
                condition: "Good",
                rarity: "rare",
                price: 2800,
                quantity: 2
            },
            {
                id: 4,
                albumName: "Hard Again",
                artist: "Muddy Waters",
                genre: "chicago",
                year: 1977, 
                condition: "Near Mint",
                rarity: "limited",
                price: 2200,
                quantity: 4
            },
            {
                id: 5,
                albumName: "Live at the Regal",
                artist: "B.B. King",
                genre: "chicago",
                year: 1965,
                condition: "Mint",
                rarity: "grail",
                price: 6800,
                quantity: 3
            },
            {
                id: 6,
                albumName: "Texas Flood", 
                artist: "Stevie Ray Vaughan",
                genre: "texas",
                year: 1983,
                condition: "Near Mint",
                rarity: "limited",
                price: 1800,
                quantity: 4
            },
            {
                id: 7,
                albumName: "From the Cradle",
                artist: "Eric Clapton", 
                genre: "chicago",
                year: 1994,
                condition: "Near Mint",
                rarity: "common",
                price: 1200,
                quantity: 6
            },
            {
                id: 8,
                albumName: "Blues Breakers",
                artist: "John Mayall & Eric Clapton",
                genre: "chicago",
                year: 1966,
                condition: "Good", 
                rarity: "grail",
                price: 5200,
                quantity: 4
            }
        ];
        this.displayRecords();
        console.log('✅ Inventory loaded');
    }

    calculatePrice(record) {
        let price = record.price;
        
        const conditionMultipliers = {
            "Mint": 2.5,
            "Near Mint": 2.0,
            "Very Good": 1.5,
            "Good": 1.2
        };
        
        const rarityMultipliers = {
            "grail": 4.0,
            "rare": 2.5,
            "limited": 1.8,
            "common": 1.0
        };
        
        price *= conditionMultipliers[record.condition] || 1;
        price *= rarityMultipliers[record.rarity] || 1;
        
        return Math.round(price);
    }

    addToCart(recordId) {
        const record = this.inventory.find(r => r.id === recordId);
        if (record && record.quantity > 0) {
            const finalPrice = this.calculatePrice(record);
            const cartItem = {
                ...record,
                finalPrice: finalPrice,
                cartId: Date.now() + Math.random()
            };
            
            this.cart.push(cartItem);
            record.quantity--;
            
            this.saveCartToStorage();
            this.updateCartCount();
            this.displayRecords();
            this.showMessage(`${record.albumName} added to collection`, 'success');
            
            return true;
        } else if (record && record.quantity === 0) {
            this.showMessage('Sorry, this record is out of stock', 'error');
        }
        return false;
    }

    removeFromCart(cartId) {
        const itemIndex = this.cart.findIndex(item => item.cartId === cartId);
        if (itemIndex > -1) {
            const item = this.cart[itemIndex];
            
            const inventoryItem = this.inventory.find(r => r.id === item.id);
            if (inventoryItem) {
                inventoryItem.quantity++;
            }
            
            this.cart.splice(itemIndex, 1);
            this.saveCartToStorage();
            this.updateCartCount();
            this.displayCart();
            this.displayRecords();
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + item.finalPrice, 0);
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }

    saveCartToStorage() {
        localStorage.setItem('the33rdYCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('the33rdYCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    displayRecords(filter = 'all') {
        const grid = document.getElementById('records-grid');
        if (!grid) return;

        let filteredRecords = this.inventory;
        
        if (filter !== 'all') {
            filteredRecords = this.inventory.filter(record => {
                if (filter === 'rare') {
                    return record.rarity === 'grail' || record.rarity === 'rare';
                }
                return record.genre === filter || record.rarity === filter;
            });
        }

        if (filteredRecords.length === 0) {
            grid.innerHTML = `
                <div class="loading">
                    <i class="fas fa-music"></i>
                    <p>No records found in this category</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredRecords.map(record => {
            const finalPrice = this.calculatePrice(record);
            const isOutOfStock = record.quantity === 0;
            
            return `
                <div class="record-card">
                    <div class="record-image" style="background-image: url('images/record${record.id}.jpg')">
                        <div class="image-overlay"></div>
                        <i class="fas fa-compact-disc"></i>
                    </div>
                    <div class="record-info">
                        <div class="record-title">${record.albumName}</div>
                        <div class="record-artist">${record.artist}</div>
                        <div class="record-details">
                            <span>${record.year}</span>
                            <span>${record.condition}</span>
                            <span class="record-rarity rarity-${record.rarity}">
                                ${record.rarity.charAt(0).toUpperCase() + record.rarity.slice(1)}
                            </span>
                        </div>
                        <div class="record-price">¥${finalPrice}</div>
                        <div class="record-actions">
                            <button class="btn-add-cart" 
                                    onclick="store.addToCart(${record.id})"
                                    ${isOutOfStock ? 'disabled' : ''}>
                                ${isOutOfStock ? 'Out of Stock' : 'Add to Collection'}
                            </button>
                            <button class="btn-details" onclick="store.showRecordDetails(${record.id})">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    displayCart() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="loading">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your collection is empty</p>
                </div>
            `;
            this.updateCartTotal();
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image" style="background-image: url('images/record${item.id}.jpg')">
                    <i class="fas fa-record-vinyl"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.albumName}</div>
                    <div class="cart-item-artist">${item.artist}</div>
                    <div class="cart-item-price">¥${item.finalPrice}</div>
                </div>
                <button class="cart-item-remove" onclick="store.removeFromCart(${item.cartId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateCartTotal();
    }

    updateCartTotal() {
        const total = this.getCartTotal();
        const cartTotal = document.getElementById('cart-total');
        const finalTotal = document.getElementById('final-total');
        
        if (cartTotal) cartTotal.textContent = total;
        if (finalTotal) finalTotal.textContent = total;
    }

    showRecordDetails(recordId) {
        const record = this.inventory.find(r => r.id === recordId);
        if (record) {
            const finalPrice = this.calculatePrice(record);
            const isOutOfStock = record.quantity === 0;
            
            document.getElementById('details-title').textContent = record.albumName;
            document.getElementById('details-artist').textContent = record.artist;
            document.getElementById('details-year').textContent = record.year;
            document.getElementById('details-genre').textContent = this.formatGenre(record.genre);
            document.getElementById('details-price').textContent = `¥${finalPrice.toLocaleString()}`;
            
            const conditionBadge = document.getElementById('details-condition');
            conditionBadge.textContent = record.condition;
            conditionBadge.className = 'condition-badge ' + this.getConditionClass(record.condition);
            
            const rarityElement = document.getElementById('details-rarity');
            rarityElement.textContent = record.rarity.charAt(0).toUpperCase() + record.rarity.slice(1);
            rarityElement.className = 'record-rarity rarity-' + record.rarity;
            
            document.getElementById('details-stock').textContent = 
                isOutOfStock ? 'Out of Stock' : `${record.quantity} available`;
            document.getElementById('details-stock').style.color = 
                isOutOfStock ? 'var(--error)' : 'var(--success)';
            
            document.getElementById('details-header').style.backgroundImage = 
                `url('images/record${record.id}.jpg')`;
            
            const addButton = document.getElementById('details-add-btn');
            addButton.disabled = isOutOfStock;
            addButton.innerHTML = isOutOfStock ? 
                '<i class="fas fa-times"></i> Out of Stock' : 
                '<i class="fas fa-shopping-bag"></i> Add to Collection';
            
            addButton.setAttribute('data-record-id', record.id);
            
            document.getElementById('record-details-modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    getConditionClass(condition) {
        const conditionClasses = {
            'Mint': 'condition-mint',
            'Near Mint': 'condition-near-mint',
            'Very Good': 'condition-very-good',
            'Good': 'condition-good'
        };
        return conditionClasses[condition] || 'condition-good';
    }

    formatGenre(genre) {
        const genreNames = {
            'delta': 'Delta Blues',
            'chicago': 'Chicago Blues',
            'texas': 'Texas Blues'
        };
        return genreNames[genre] || genre;
    }

    showMessage(message, type = 'info') {
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = type === 'error' ? 'error-message' : 'success-message';
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    processCheckout(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.cart = [];
                this.saveCartToStorage();
                this.updateCartCount();
                this.displayCart();
                resolve(true);
            }, 2000);
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.currentFilter = filter;
                
                document.querySelectorAll('.filter-tab').forEach(t => {
                    t.classList.remove('active');
                });
                e.target.classList.add('active');
                
                this.displayRecords(filter);
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    link.classList.add('active');
                    
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        document.addEventListener('click', (e) => {
            const cart = document.getElementById('cart');
            const cartIcon = document.querySelector('.cart-icon');
            
            if (cart.classList.contains('active') && 
                !cart.contains(e.target) && 
                !cartIcon.contains(e.target)) {
                this.toggleCart();
            }
        });
    }

    toggleCart() {
        const cart = document.getElementById('cart');
        cart.classList.toggle('active');
    }
}

// Global functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
    }
}

function toggleCart() {
    store.toggleCart();
    store.displayCart();
}

function openCheckout() {
    if (store.cart.length === 0) {
        store.showMessage('Your collection is empty', 'error');
        return;
    }
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function processPayment() {
    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !email || !address) {
        store.showMessage('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        store.showMessage('Please enter a valid email address', 'error');
        return;
    }

    store.showMessage('Processing your order...', 'success');

    store.processCheckout({ name, email, address, paymentMethod }).then(() => {
        store.showMessage('Order completed successfully! Thank you for your purchase.', 'success');
        closeCheckout();
        toggleCart();
        
        document.getElementById('checkout-name').value = '';
        document.getElementById('checkout-email').value = '';
        document.getElementById('checkout-address').value = '';
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function closeRecordDetails() {
    document.getElementById('record-details-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function addFromDetails() {
    const addButton = document.getElementById('details-add-btn');
    const recordId = parseInt(addButton.getAttribute('data-record-id'));
    
    if (recordId && store.addToCart(recordId)) {
        closeRecordDetails();
    }
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('record-details-modal');
    if (e.target === modal) {
        closeRecordDetails();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeRecordDetails();
        closeCheckout();
    }
});

let store;
let scrollAnimations;

document.addEventListener('DOMContentLoaded', () => {
    store = new VinylStore();
    // Force cart to be hidden on page load
    const cart = document.getElementById('cart');
    if (cart) cart.classList.remove('active');
    
    scrollAnimations = new ScrollAnimations();
    
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
});

window.scrollToSection = scrollToSection;
window.toggleCart = toggleCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.processPayment = processPayment;
window.closeRecordDetails = closeRecordDetails;
window.addFromDetails = addFromDetails;