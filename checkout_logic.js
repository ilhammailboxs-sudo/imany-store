// checkout_logic.js - Direct Bank Transfer & WhatsApp Logic (English Version)

// 1. Sri Lanka Province and District Data
const lankaData = {
    'Western': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern': ['Galle', 'Matara', 'Hambantota'],
    'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    'Eastern': ['Trincomalee', 'Batticaloa', 'Ampara'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    'Uva': ['Badulla', 'Monaragala'],
    'Sabaragamuwa': ['Ratnapura', 'Kegalle']
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Cart Summary
    renderCartSummary();
    
    // 2. Populate Province Select Box
    populateProvinces();
    
    // 3. Add Event Listener for Province change to populate Districts
    document.getElementById('province').addEventListener('change', populateDistricts);

    // 4. Place Order Button Event Listener
    document.getElementById('placeOrderBtn').addEventListener('click', handlePlaceOrder);
    
    // 5. Image Preview Event Listener
    document.getElementById('receiptImage').addEventListener('change', previewImage);
});

// ===============================================
// Address & Cart Logic Functions
// ===============================================

function populateProvinces() {
    const provinceSelect = document.getElementById('province');
    provinceSelect.innerHTML = '<option value="" selected disabled>Select Province</option>';

    Object.keys(lankaData).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
}

function populateDistricts() {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const selectedProvince = provinceSelect.value;

    districtSelect.innerHTML = '<option value="" selected disabled>Select District</option>';

    if (selectedProvince && lankaData[selectedProvince]) {
        lankaData[selectedProvince].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}

function renderCartSummary() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const summaryDiv = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        summaryDiv.innerHTML = '<p class="text-danger mb-0">Your Cart is Empty! Add some items.</p>';
        return;
    }

    let totalAmount = 0;
    let summaryHTML = '<ul class="list-group list-group-flush">';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        summaryHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.name} (x${item.quantity})
            <span>LKR ${(itemTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </li>`;
    });

    summaryHTML += `</ul>
        <div class="mt-3 text-end">
            <h5 class="text-success mb-0">Total: LKR ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h5>
        </div>`;

    summaryDiv.innerHTML = summaryHTML;
}

// ===============================================
// Payment Receipt & Order Logic
// ===============================================

function previewImage(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    const preview = document.getElementById('receiptPreview');
    const container = document.getElementById('imagePreviewContainer');

    if (file) {
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            container.style.display = 'block';
        };
        // Read file as Base64 Data URL. This is used for preview and storage.
        reader.readAsDataURL(file); 
    } else {
        preview.style.display = 'none';
        container.style.display = 'none';
        preview.src = '#';
    }
}


function handlePlaceOrder() {
    const form = document.getElementById('checkoutForm');
    const receiptInput = document.getElementById('receiptImage');
    
    // Form validation, including checking if a receipt image is uploaded
    if (!form.checkValidity() || !receiptInput.files.length) {
        form.classList.add('was-validated'); 
        alert("Please fill in all required details and upload the Payment Receipt.");
        return;
    }
    
    // Collect Form data
    const orderDetails = {
        orderId: 'ORD-' + Date.now().toString().slice(-6),
        name: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        notes: document.getElementById('notes').value,
        items: JSON.parse(localStorage.getItem('shoppingCart') || '[]'),
        totalText: document.querySelector('#cartSummary h5.text-success').textContent,
    };

    // Read the receipt image as a Base64 string
    const file = receiptInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        // Store the Base64 string in the order details
        orderDetails.receiptImageBase64 = e.target.result; 

        // Save order details to Local Storage
        localStorage.setItem('pendingOrderDetails', JSON.stringify(orderDetails));
        
        // Redirect to Order Confirmation Page
        window.location.href = 'order_confirmation.html';
    };

    // Start reading the file
    reader.readAsDataURL(file);
}