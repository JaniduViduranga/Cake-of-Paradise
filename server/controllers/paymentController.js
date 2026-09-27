import Stripe from 'stripe';

const getStripeInstance = () => {
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) return null;
    return new Stripe(key);
};

export const createPaymentIntent = async (req, res) => {
    try {
        const stripe = getStripeInstance();
        if (!stripe) {
            return res.status(500).json({
                success: false,
                message: 'Stripe secret key is not configured in server environment (STRIPE_SECRET_KEY in server/.env).',
            });
        }

        const { amount, currency = 'usd' } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid amount is required to create a payment intent.',
            });
        }

        // Amount should be in smallest currency unit (e.g. cents for USD, LKR cents)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency,
            payment_method_types: ['card'],
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Stripe PaymentIntent Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};