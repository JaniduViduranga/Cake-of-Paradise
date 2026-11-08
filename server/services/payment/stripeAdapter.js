/**
 * @file stripeAdapter.js
 * @description Concrete Stripe payment adapter implementing PaymentInterface.
 * Encapsulates all direct Stripe SDK interactions.
 */

import Stripe from 'stripe';
import PaymentInterface from './paymentInterface.js';

export class StripeAdapter extends PaymentInterface {
  /**
   * @param {string} [apiKey] - Stripe secret API key (defaults to process.env.STRIPE_SECRET_KEY)
   */
  constructor(apiKey = process.env.STRIPE_SECRET_KEY) {
    super();
    this.apiKey = apiKey?.trim() || null;
    this.stripe = this.apiKey ? new Stripe(this.apiKey) : null;
    this.providerName = 'stripe';
  }

  /**
   * Ensure Stripe instance is initialized
   * @private
   */
  _ensureInitialized() {
    if (!this.stripe) {
      const key = (this.apiKey || process.env.STRIPE_SECRET_KEY)?.trim();
      if (key) {
        this.stripe = new Stripe(key);
      } else {
        throw new Error('Stripe is not configured. Please verify STRIPE_SECRET_KEY in server/.env');
      }
    }
  }

  /**
   * Creates a PaymentIntent via Stripe SDK.
   * @param {Object} params
   * @param {number} params.amount - Amount in standard currency units (e.g. 5000 for Rs. 5000).
   * @param {string} [params.currency='lkr'] - ISO currency code.
   * @param {Object} [params.metadata={}] - Custom metadata tags for Stripe Dashboard.
   * @returns {Promise<{ clientSecret: string, transactionId: string, provider: string }>}
   */
  async createPaymentIntent({ amount, currency = 'lkr', metadata = {} }) {
    this._ensureInitialized();

    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error(`Invalid payment amount: ${amount}`);
    }

    // Stripe expects amounts in smallest currency units (cents / subunits)
    const amountInSmallestUnit = Math.round(numericAmount * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        platform: 'Cake of Paradise Storefront',
        ...metadata,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
      provider: this.providerName,
    };
  }

  /**
   * Verifies a payment intent with Stripe to check if it actually succeeded.
   * @param {string|Object} transactionIdOrPayload - The Stripe PaymentIntent ID (pi_...) or object containing it.
   * @returns {Promise<{ success: boolean, status: string, transactionId: string, provider: string, providerMetadata: Object }>}
   */
  async verifyPayment(transactionIdOrPayload) {
    const paymentIntentId =
      typeof transactionIdOrPayload === 'string'
        ? transactionIdOrPayload
        : transactionIdOrPayload?.paymentIntentId || transactionIdOrPayload?.transactionId;

    if (!paymentIntentId) {
      return {
        success: false,
        status: 'FAILED',
        transactionId: null,
        provider: this.providerName,
        error: 'Missing transaction/paymentIntent ID for verification.',
        providerMetadata: null,
      };
    }

    try {
      this._ensureInitialized();
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      const isSuccess = paymentIntent.status === 'succeeded';

      return {
        success: isSuccess,
        status: isSuccess ? 'PAID' : paymentIntent.status.toUpperCase(),
        transactionId: paymentIntent.id,
        provider: this.providerName,
        providerMetadata: {
          currency: paymentIntent.currency,
          amountReceived: (paymentIntent.amount_received || 0) / 100,
          paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
          status: paymentIntent.status,
          livemode: paymentIntent.livemode,
          created: paymentIntent.created,
        },
      };
    } catch (err) {
      console.warn(`[StripeAdapter] Verification failed for ${paymentIntentId}:`, err.message);
      return {
        success: false,
        status: 'FAILED',
        transactionId: paymentIntentId,
        provider: this.providerName,
        error: err.message,
        providerMetadata: null,
      };
    }
  }

  /**
   * Handles Stripe asynchronous webhook events.
   * @param {Buffer|string} payload - Raw request body.
   * @param {string} signature - stripe-signature header value.
   * @returns {Promise<{ received: boolean, event: string, data: Object }>}
   */
  async handleWebhook(payload, signature) {
    this._ensureInitialized();

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
    }

    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    return {
      received: true,
      event: event.type,
      data: event.data.object,
    };
  }
}

export default StripeAdapter;
