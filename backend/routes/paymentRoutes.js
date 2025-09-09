const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Add this in .env

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // amount in paise (for INR) or cents (for USD)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

module.exports = router;
