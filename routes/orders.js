// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const { requireAuth } = require('../middleware/auth');

// Render dashboard (optional protection)
router.get('/', requireAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render('orders', { title: 'Order Dashboard', page: 'Orders', orders });
});

// Public read API
router.get('/api', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Create
router.post('/', requireAuth, async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json({ message: 'Order saved', order: newOrder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete order.' });
  }
});

module.exports = router;