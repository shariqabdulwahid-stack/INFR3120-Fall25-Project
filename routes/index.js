var express = require('express');
var router = express.Router();

/* ===========================
   HOME PAGE
   =========================== */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Home',
    page: 'Home'
  });
});

/* ===========================
   ABOUT PAGE
   =========================== */
router.get('/about', function (req, res) {
  res.render('about', {
    title: 'About Us',
    page: 'About'
  });
});

/* ===========================
   CONTACT PAGE
   =========================== */
router.get('/contact', function (req, res) {
  res.render('contact', {
    title: 'Contact',
    page: 'Contact'
  });
});

/* ===========================
   ORDERS PAGE
   =========================== */
router.get('/orders', function (req, res) {
  res.render('orders', {
    title: 'Place an Order',
    page: 'Orders'
  });
});

module.exports = router;
