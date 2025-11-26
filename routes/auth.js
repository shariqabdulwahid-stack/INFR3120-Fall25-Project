const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// GET Register
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { title: 'Register', errors: [], data: {} });
});

// POST Register
router.post('/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password too short'),
    body('confirm').custom((v, { req }) => v === req.body.password).withMessage('Passwords must match')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.render('register', { errors: errors.array(), data: { name, email }, title: 'Register' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.render('register', {
        title: 'Register',
        errors: [{ msg: 'Email already in use' }],
        data: { name, email }
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    req.session.user = { id: user._id, name: user.name };

    res.redirect('/');
  }
);

// GET Login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { title: 'Login', errors: [], data: {} });
});

// POST Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.render('login', { title: 'Login', errors: errors.array(), data: { email } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        data: { email }
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.render('login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password' }],
        data: { email }
      });
    }

    req.session.user = { id: user._id, name: user.name };
    res.redirect('/');
  }
);

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
