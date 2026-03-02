// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('ranchCart')) || [];

function updateCartUI() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.length;

    const summary = document.getElementById('summary-list');
    if (summary) {
        summary.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            summary.innerHTML += `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-0 serif">${item.name}</h6>
                        <small class="text-muted">₱${item.price.toLocaleString()}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removeItem(${index})">✕</button>
                </div>`;
            total += item.price;
        });
        const totalEl = document.getElementById('total-price');
        if (totalEl) totalEl.innerText = `₱${total.toLocaleString()}`;
    }
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('ranchCart', JSON.stringify(cart));
    updateCartUI();
    
    const toast = document.createElement('div');
    toast.style = "position:fixed; bottom:20px; right:20px; background:#262626; color:white; padding:15px 25px; border-radius:50px; z-index:3000;";
    toast.innerText = `Added ${name} to your bag!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('ranchCart', JSON.stringify(cart));
    updateCartUI();
}

function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    if (lb && lbImg) {
        lbImg.src = src;
        lb.style.display = 'flex';
    }
}

// Signature 
let canvas, ctx, drawing = false, lastX = 0, lastY = 0;

function initSignaturePad() {
    canvas = document.getElementById('signature-pad');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    }

    function start(e) {
        drawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
    }
    function draw(e) {
        if (!drawing) return;
        const pos = getPos(e);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
    }
    function end() { drawing = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseout', end);

    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('touchcancel', end);

    const clearBtn = document.getElementById('clear-signature');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
}

// Order Data Storage logic
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initSignaturePad();
    
    const checkoutForm = document.querySelector('form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) return alert("Your bag is empty!");

    if (canvas && ctx) {
         const blankCanvas = document.createElement('canvas');
         blankCanvas.width = canvas.width;
         blankCanvas.height = canvas.height;

    if (canvas.toDataURL() === blankCanvas.toDataURL()) {
        alert("Please provide your signature before confirming the order.");
        return;
    }
}

            let orderHistory = JSON.parse(localStorage.getItem('ranchOrders')) || [];

            const newOrder = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                customer: {
                    name: checkoutForm.querySelector('input[type="text"]').value,
                    email: checkoutForm.querySelector('input[type="email"]').value
                },
                items: cart,
                total: cart.reduce((sum, item) => sum + item.price, 0),
                signature: canvas.toDataURL()
            };

            orderHistory.push(newOrder);
            localStorage.setItem('ranchOrders', JSON.stringify(orderHistory));

            localStorage.removeItem('ranchCart');
            cart = [];
            alert("Order Confirmed! Your order history has been updated.");
            window.location.href = 'index.html';
        });
    }
});