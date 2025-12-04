const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('contact', { page: 'Contact', title: 'Contact' });
});

router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // You can log it, email it, or store it in a DB
  console.log('Contact form submitted:', { name, email, message });

  res.render('contact', {
    page: 'Contact',
    title: 'Contact',
    success: 'Thanks for reaching out! We’ll get back to you soon.'
  });
});

module.exports = router;
