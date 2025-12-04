const express = require('express');
const router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
    // Renders views/about.ejs
    res.render('about', { title: 'About Us', page: 'About' }); 
});

module.exports = router;