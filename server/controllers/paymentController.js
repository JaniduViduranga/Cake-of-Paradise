import paymentService from '../services/payment/index.js';

/**
 * Creates a payment session/intent via the decoupled PaymentService.
 * Vendor-agnostic: no direct Stripe SDK imports.
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'lkr', metadata = {} } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid numeric amount is required to create a payment intent.',
      });
    }

    const session = await paymentService.initializeCheckout({
      amount: Number(amount),
      currency,
      metadata,
    });

    res.status(200).json({
      success: true,
      clientSecret: session.clientSecret,
      transactionId: session.transactionId,
      paymentIntentId: session.transactionId, // for backward compatibility
      provider: session.provider,
    });
  } catch (error) {
    console.error('[PaymentController] Checkout initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error initializing payment gateway session.',
    });
  }
};

/**
 * Verifies payment confirmation with the gateway before order completion.
 */
export const verifyPayment = async (req, res) => {
  try {
    const { transactionId, paymentIntentId } = req.body;
    const idToVerify = transactionId || paymentIntentId;

    if (!idToVerify) {
      return res.status(400).json({
        success: false,
        message: 'A transactionId or paymentIntentId is required for verification.',
      });
    }

    const verification = await paymentService.confirmPayment(idToVerify);

    res.status(200).json({
      success: verification.success,
      ...verification,
    });
  } catch (error) {
    console.error('[PaymentController] Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment with gateway.',
    });
  }
};

/**
 * Handles incoming gateway webhooks asynchronously.
 */
export const handleGatewayWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] || req.headers['x-gateway-signature'];
    const result = await paymentService.handleWebhook(req.body, signature);

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[PaymentController] Gateway webhook error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Webhook processing failed.',
    });
  }
};
