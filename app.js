// app.js - Full Code (Card/Grid structure is correctly included here)

const products = [
    { id: 1, name: "Onthera Cleansing Bar", price: 1500, image: "https://i.postimg.cc/1RjLGfJc/Onthera-Cleansing-Bar.png" },

];

let cart = []; 

const productContainer = document.getElementById('productContainer');
const cartCountElement = document.getElementById('cartCount');
const viewCartBtn = document.getElementById('viewCartBtn');
const clearCartBtn = document.getElementById('clearCartBtn'); 

// Load cart from Local Storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    renderProducts();
    updateCartCount();
});


function renderProducts() {
    productContainer.innerHTML = '';
    products.forEach(product => {
        const cardHtml = `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card product-card shadow">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-success fw-bold fs-4">LKR ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        
                        <div class="quantity-container d-flex align-items-center mb-3">
                            <label for="quantity-${product.id}" class="form-label me-2 mb-0 small">Quantity:</label>
                            <input type="number" id="quantity-${product.id}" class="form-control quantity-input" value="1" min="1">
                        </div>
                        
                        <button class="btn btn-add-to-cart mt-auto" onclick="addToCart(${product.id})">
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += cardHtml;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (product && quantity > 0) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }

        updateCartCount(); 
        alert(`${product.name} (x${quantity}) added to the Cart!`);
        
        if(quantityInput) quantityInput.value = 1; 
    } else {
        alert("Please select a valid quantity.");
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

viewCartBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        // Go to checkout page
        window.location.href = 'checkout.html';
    } else {
        alert("Your Cart is empty! Please add some items.");
    }
});

clearCartBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Cart is already empty.");
        return;
    }
    
    const confirmed = confirm("Are you sure? All items in the cart will be removed.");
    
    if (confirmed) {
        cart = []; 
        localStorage.removeItem('shoppingCart'); 
        updateCartCount(); 
        alert("Cart cleared successfully!");
    }
});