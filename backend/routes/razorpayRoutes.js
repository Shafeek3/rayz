const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Razorpay order creation failed' });
  }
});

module.exports = router;