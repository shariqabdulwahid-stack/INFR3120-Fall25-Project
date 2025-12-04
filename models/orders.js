const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  item: String,
  quantity: Number,
  pickupDate: Date,
  notes: String,
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
