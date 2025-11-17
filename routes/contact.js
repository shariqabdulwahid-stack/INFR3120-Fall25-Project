const express = require('express');
const router = express.Router();

/* GET contact page. */
router.get('/', function(req, res, next) {
    // Renders views/contact.ejs
    res.render('contact', { title: 'Contact Us', page: 'Contact' });
});

module.exports = router;