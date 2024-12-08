const express = require('express');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/', async (req, res) => {
    const { amount, currency, paymentMethodId } = req.body;



    try {
        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency,
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true, // Automatically determine supported methods
            },
            return_url: 'http://localhost:8000/explore', // Redirect to this URL after payment
        });
  

        // Handle post-payment actions (e.g., database updates)
        res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
    
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;