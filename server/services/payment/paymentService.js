/**
 * @file paymentService.js
 * @description Payment Service Orchestrator (Strategy Pattern).
 * Acts as the centralized, vendor-agnostic entry point for all payment gateway operations.
 */

export class PaymentService {
  /**
   * @param {import('./paymentInterface.js').PaymentInterface} adapter
   */
  constructor(adapter) {
    if (!adapter) {
      throw new Error('[PaymentService] A valid PaymentInterface adapter must be provided.');
    }
    this.adapter = adapter;
  }

  /**
   * Swaps the active payment gateway adapter at runtime (Strategy Pattern).
   * @param {import('./paymentInterface.js').PaymentInterface} newAdapter
   */
  setAdapter(newAdapter) {
    if (!newAdapter) {
      throw new Error('[PaymentService] Cannot set an invalid or null adapter.');
    }
    this.adapter = newAdapter;
  }

  /**
   * Returns the current provider name.
   * @returns {string}
   */
  getProviderName() {
    return this.adapter.providerName || 'unknown';
  }

  /**
   * Initializes a payment checkout session / intent with the active gateway.
   * @param {Object} paymentDetails
   * @param {number} paymentDetails.amount
   * @param {string} [paymentDetails.currency]
   * @param {Object} [paymentDetails.metadata]
   * @returns {Promise<{ clientSecret: string, transactionId: string, provider: string }>}
   */
  async initializeCheckout(paymentDetails) {
    return this.adapter.createPaymentIntent(paymentDetails);
  }

  /**
   * Confirms/verifies payment status with the active gateway before order finalization.
   * @param {string|Object} verificationData
   * @returns {Promise<{ success: boolean, status: string, transactionId: string, provider: string, providerMetadata: Object }>}
   */
  async confirmPayment(verificationData) {
    return this.adapter.verifyPayment(verificationData);
  }

  /**
   * Processes asynchronous gateway webhooks.
   * @param {Buffer|string|Object} payload
   * @param {string} signature
   * @returns {Promise<{ received: boolean, event: string, data: Object }>}
   */
  async handleWebhook(payload, signature) {
    return this.adapter.handleWebhook(payload, signature);
  }
}

export default PaymentService;

