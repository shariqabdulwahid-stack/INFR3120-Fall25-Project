const express = require('express');
const router = express.Router();
const Order = require('../models/orders.js');

// GET /orders → Render EJS dashboard (R - Read All)
router.get('/', async (req, res) => {
  try {
    // Pass a 'page' variable for active state in nav, and the orders array
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('orders', { 
        title: 'Order Dashboard', 
        page: 'Orders', // Added for nav active state
        orders 
    });
  } catch (err) {
    // Log error to console for debugging, send generic message to user
    console.error("Error loading orders:", err);
    res.status(500).send('Error loading orders. Check database connection.');
  }
});

// POST /orders → Handle form submission (C - Create)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, item, quantity, pickupDate, notes } = req.body;
    const newOrder = new Order({
      customerName, // Shorthand syntax is fine here
      customerEmail, 
      item,
      quantity,
      pickupDate,
      notes
    });
    await newOrder.save();
    res.status(201).json({ message: 'Order saved', order: newOrder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /orders/api → API endpoint to fetch all orders (R - Read All)
router.get('/api', async (req, res) => {
  // No try/catch needed here since the GET /orders route handles the EJS render failure
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /orders/:id (U - Update)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /orders/:id (D - Delete)
router.delete('/:id', async (req, res) => {
  // Added try/catch for robust error handling
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete order.' });
  }
});

module.exports = router;