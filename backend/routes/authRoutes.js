const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const OtpModel = require('../models/otpauthmodel'); // <-- fixed import name
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// --- Request OTP ---
router.post('/request-otp', async (req, res) => {
  const { contact } = req.body;
  if (!contact) return res.json({ success: false, message: 'Contact required' });

  // Generate OTP
  const otpValue = Math.floor(100000 + Math.random() * 900000).toString(); // <-- changed variable name

  // Store OTP in DB
  await OtpModel.create({ contact, otp: otpValue }); // <-- use OtpModel

  // --- Send OTP via email ---
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contact,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otpValue}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Nodemailer error:', err);
    res.json({ success: false, message: 'Failed to send OTP' });
  }
});

// --- Verify OTP ---
router.post('/verify-otp', async (req, res) => {
  const { contact, otp } = req.body;
  const record = await OtpModel.findOne({ contact, otp }); // <-- check DB
  if (record) {
    await OtpModel.deleteMany({ contact }); // Remove all OTPs for this contact
    const token = jwt.sign({ contact }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } else {
    res.json({ success: false, message: 'Invalid OTP' });
  }
});

// --- Save profile info ---
router.post('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;

    const profileData = req.body; // Using data sent by frontend
    const fullAddress = profileData.address; // Should be the full address string from frontend
    const user = await User.findOneAndUpdate(
      { contact },
      { ...profileData, contact, address: fullAddress }, // Explicitly set address
      { upsert: true, new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error('Profile save error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please log in again.' });
    }
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// --- Get profile info ---
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;
    const user = await User.findOne({ contact });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please log in again.' });
    }
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// Place an order
router.post('/order', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { items, total } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const contact = decoded.contact;
    const user = await User.findOne({ contact });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const address = user.address || "";
     console.log("Order address:", address);
    user.orders.push({ items, total, status: "Placed", address });
    user.cart = []; // Clear cart after order
    await user.save();
    res.json({ success: true, orders: user.orders });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// Get orders
router.get('/orders', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const contact = decoded.contact;
    const user = await User.findOne({ contact });
    res.json({ success: true, orders: user.orders || [] });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

router.post('/clear-orders', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const contact = decoded.contact;
    const user = await User.findOne({ contact });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.orders = [];
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});


module.exports = router;

