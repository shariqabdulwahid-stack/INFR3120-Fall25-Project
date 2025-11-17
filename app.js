// Import required modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express app
const app = express();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route Imports (All files from the routes directory)
const indexRouter = require('./routes/index');
const ordersRouter = require('./routes/orders'); // Existing
const usersRouter = require('./routes/users');
const aboutRouter = require('./routes/about');
const contactRouter = require('./routes/contact');

// Route Setup
app.use('/', indexRouter); // Maps the root path (/)
app.use('/orders', ordersRouter); // Maps /orders and sub-paths
app.use('/users', usersRouter); // Maps /users and sub-paths
app.use('/about', aboutRouter);    // Maps /about
app.use('/contact', contactRouter); // Maps /contact

// Export app for server.js
module.exports = app;