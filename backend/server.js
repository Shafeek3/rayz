const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRoutes = require('./routes/ProductRoutes.js');
const searchRoutes = require('./routes/searchRoutes.js')
const singleproductRoutes = require('./routes/singleproductRoutes.js')
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes.js');
const razorpayRoutes = require('./routes/razorpayRoutes.js');
const path = require('path');

const connectDB = require('./config/db');
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/products', productRoutes);
app.use('/api/products', singleproductRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/razorpay', razorpayRoutes);

// Serve frontend (React build)
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});