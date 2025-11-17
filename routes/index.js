var express = require('express');
var router = express.Router();

// Home page
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home', page: 'Home' });
});

// About page
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Us', page: 'About' });
});

// Menu page
router.get('/menu', function(req, res, next) {
  res.render('menu', { title: 'Menu', page: 'Menu' });
});

// Contact page
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', page: 'Contact' });
});

// Order page
router.get('/order', function(req, res, next) {
  res.render('order', { title: 'Place an Order', page: 'Order' });
});

module.exports = router;
