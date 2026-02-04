 document.addEventListener('DOMContentLoaded', function() {
    // Mock data (in a real backend, fetch from server)
    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 1, name: 'Smartphone', price: 599, img: 'https://via.placeholder.com/200' },
        { id: 2, name: 'Laptop', price: 1299, img: 'https://via.placeholder.com/200' }
    ];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = localStorage.getItem('currentUser');

    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('href').substring(1));
        });
    });

    // Show section
    function showSection(id) {
        document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
        document.getElementById(id).style.display = 'block';
        if (id === 'products') renderProducts();
        if (id === 'cart') renderCart();
        if (id === 'admin' && currentUser === 'admin') document.getElementById('admin').style.display = 'block';
        else if (id === 'admin') alert('Admin only!');
    }

    // Render products
    function renderProducts() {
        const list = document.getElementById('product-list');
        list.innerHTML = '';
        products.forEach(prod => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <img src="${prod.img}" alt="${prod.name}">
                <h3>${prod.name}</h3>
                <p>$${prod.price}</p>
                <button onclick="addToCart(${prod.id})">Add to Cart</button>
            `;
            list.appendChild(div);
        });
    }

    // Add to cart
    window.addToCart = function(id) {
        const prod = products.find(p => p.id === id);
        cart.push(prod);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    };

    // Render cart
    function renderCart() {
        const items = document.getElementById('cart-items');
        items.innerHTML = '';
        cart.forEach((item, index) => {
            items.innerHTML += `<p>${item.name} - $${item.price} <button onclick="removeFromCart(${index})">Remove</button></p>`;
        });
    }

    // Remove from cart
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => showSection('checkout'));
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Order placed! (Simulated - in real backend, process payment)');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        showSection('home');
    });

    // Login/Signup
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const user = users.find(u => u.email === email && u.pass === pass);
        if (user) {
            currentUser = user.email;
            localStorage.setItem('currentUser', currentUser);
            document.getElementById('login-link').innerHTML = `<a href="#logout">Logout</a>`;
            showSection('home');
        } else alert('Invalid credentials');
    });
    document.getElementById('signup-btn').addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        users.push({ email, pass });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signed up!');
    });

    // Admin add product
    document.getElementById('add-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('prod-name').value;
        const price = document.getElementById('prod-price').value;
        const img = document.getElementById('prod-img').value;
        products.push({ id: Date.now(), name, price: parseFloat(price), img });
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        alert('Product added!');
    });

    // Initial load
    showSection('home');
});