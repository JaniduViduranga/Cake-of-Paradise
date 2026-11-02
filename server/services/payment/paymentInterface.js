/**
 * @file paymentInterface.js
 * @description Base contract/interface for payment gateway adapters (Strategy pattern).
 * All payment gateway implementations (Stripe, PayHere, LankaQR, etc.) must implement this interface.
 */

export class PaymentInterface {
  /**
   * Initializes a payment intent/session with the underlying gateway.
   * @param {Object} params
   * @param {number} params.amount - Order amount in standard units (e.g., LKR or USD).
   * @param {string} [params.currency='lkr'] - ISO currency code (lowercase).
   * @param {Object} [params.metadata={}] - Key-value metadata associated with the intent.
   * @returns {Promise<{ clientSecret: string, transactionId: string, provider: string }>}
   */
  async createPaymentIntent({ amount, currency, metadata }) {
    throw new Error(`[PaymentInterface] createPaymentIntent() not implemented in ${this.constructor.name}`);
  }

  /**
   * Verifies that a payment transaction succeeded with the gateway.
   * @param {string|Object} transactionIdOrPayload - The gateway transaction/intent ID or verification payload.
   * @returns {Promise<{ success: boolean, status: string, transactionId: string, providerMetadata: Object }>}
   */
  async verifyPayment(transactionIdOrPayload) {
    throw new Error(`[PaymentInterface] verifyPayment() not implemented in ${this.constructor.name}`);
  }

  /**
   * Handles asynchronous gateway webhook events.
   * @param {Buffer|string|Object} payload - Raw request body from webhook.
   * @param {string} signature - Webhook signature header from gateway.
   * @returns {Promise<{ received: boolean, event: string, data: Object }>}
   */
  async handleWebhook(payload, signature) {
    throw new Error(`[PaymentInterface] handleWebhook() not implemented in ${this.constructor.name}`);
  }
}

export default PaymentInterface;

