const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// 1. DATABASE CONNECTION
const mongoURI = process.env.DATABASE_URL; 
mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ DB Error:", err));

// 2. THE BLUEPRINT (Updated to include cart and total)
const OrderSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    note: String,
    signature: String,
    cartItems: String,  // This captures the items in the bag
    totalPrice: String, // This captures the total ₱
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// 3. SETTINGS
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 4. RECEIVE ORDER
app.post('/submit-order', async (req, res) => {
    try {
        const newOrder = new Order({
            fullName: req.body.fullName,
            email: req.body.email,
            note: req.body.note,
            signature: req.body.signatureData,
            cartItems: req.body.cartData,   
            totalPrice: req.body.totalPrice 
        });

        await newOrder.save();
        console.log("💾 Full Order Saved to DB!");
        
        // Clear the cart on the browser and show success
        res.send(`
            <script>localStorage.removeItem('cart');</script>
            <div style="text-align:center; padding:50px; font-family:sans-serif;">
                <h1>Order Confirmed!</h1>
                <p>We received your order for ${req.body.totalPrice}.</p>
                <a href="/">Return to Home</a>
            </div>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving order.");
    }
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));