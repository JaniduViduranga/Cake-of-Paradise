/**
 * @file paymentService.js
 * @description Frontend Payment Service Layer.
 * Decouples checkout views and controllers from raw payment gateway endpoints and order submission.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const paymentService = {
  /**
   * Requests a payment intent / checkout session from backend.
   * @param {Object} orderSummary
   * @param {number} orderSummary.amount - Amount to charge.
   * @param {string} [orderSummary.currency='lkr'] - Currency code.
   * @param {Object} [orderSummary.metadata={}] - Order metadata tags.
   * @returns {Promise<{ clientSecret: string, transactionId: string, paymentIntentId: string, provider: string }>}
   */
  async createPaymentSession({ amount, currency = 'lkr', metadata = {} }) {
    const response = await fetch(`${API_BASE_URL}/payment/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        metadata,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to establish secure payment channel.');
    }

    return {
      clientSecret: data.clientSecret,
      transactionId: data.transactionId || data.paymentIntentId,
      paymentIntentId: data.paymentIntentId || data.transactionId,
      provider: data.provider || 'stripe',
    };
  },

  /**
   * Submits verified order data and gateway confirmation token to backend for database persistence.
   * @param {Object} orderDetails - Customer info, items, delivery, financials.
   * @param {Object} paymentResult - Payment gateway transaction result.
   * @returns {Promise<Object>} Created and persisted Order document from MongoDB.
   */
  async processOrderCompletion(orderDetails, paymentResult = {}) {
    const transactionId =
      paymentResult.transactionId ||
      paymentResult.id ||
      paymentResult.paymentIntentId ||
      paymentResult.paymentIntent?.id;

    const payload = {
      ...orderDetails,
      transactionId,
      paymentIntentId: transactionId,
      paymentProvider: paymentResult.provider || 'stripe',
      paymentStatus:
        paymentResult.status === 'succeeded' || paymentResult.status === 'PAID'
          ? 'PAID'
          : paymentResult.status || 'PAID',
      paymentMethod: orderDetails.paymentMethod || 'credit',
      paymentInfo: {
        paymentMethod: orderDetails.paymentMethod || 'credit',
        paymentStatus: 'PAID',
        transactionId,
        paymentIntentId: transactionId,
        paymentProvider: paymentResult.provider || 'stripe',
        providerMetadata: paymentResult.providerMetadata || null,
      },
    };

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to persist verified order in database.');
    }

    return data.order;
  },

  /**
   * Verifies a transaction status via backend.
   * @param {string} transactionId
   * @returns {Promise<Object>}
   */
  async verifyPayment(transactionId) {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    });
    return response.json();
  },
};

export default paymentService;

