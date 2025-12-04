const express = require('express');
const router = express.Router();
const Order = require('../models/orders.js');
const { requireAuth } = require('../middleware/auth'); // import middleware

// GET /orders → Render EJS dashboard (Read All)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('orders', { 
      title: 'Order Dashboard', 
      page: 'Orders',
      orders 
    });
  } catch (err) {
    console.error("Error loading orders:", err);
    res.status(500).send('Error loading orders. Check database connection.');
  }
});

// POST /orders → Handle form submission (Create)
// (Decide if you want this protected or open to guests. If protected, add requireAuth)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, item, quantity, pickupDate, notes } = req.body;
    const newOrder = new Order({
      customerName,
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

// GET /orders/api → API endpoint to fetch all orders (Read All)
router.get('/api', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /orders/:id (Update) Protected
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /orders/:id (D - Delete) Protected
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete order.' });
  }
});

module.exports = router;
