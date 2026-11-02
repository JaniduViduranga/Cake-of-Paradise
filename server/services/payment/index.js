/**
 * @file index.js
 * @description Configures and exports the paymentService singleton based on environment settings.
 */

import { PaymentInterface } from './paymentInterface.js';
import { StripeAdapter } from './stripeAdapter.js';
import { PaymentService } from './paymentService.js';

// Resolve configured gateway provider from environment
const rawProvider = process.env.PAYMENT_GATEWAY_PROVIDER || 'stripe';
const provider = rawProvider.trim().toLowerCase();

/**
 * Adapter factory function
 * @param {string} providerType
 * @returns {PaymentInterface}
 */
export function createPaymentAdapter(providerType = provider) {
  switch (providerType) {
    case 'stripe':
      return new StripeAdapter(process.env.STRIPE_SECRET_KEY);

    // Future gateway adapters can easily be registered here:
    // case 'payhere':
    //   return new PayHereAdapter(process.env.PAYHERE_MERCHANT_ID, process.env.PAYHERE_SECRET);
    // case 'lankaqr':
    //   return new LankaQRAdapter(process.env.LANKAQR_MERCHANT_KEY);

    default:
      console.warn(
        `[PaymentService] Unrecognized PAYMENT_GATEWAY_PROVIDER "${providerType}". Falling back to Stripe.`
      );
      return new StripeAdapter(process.env.STRIPE_SECRET_KEY);
  }
}

// Create configured singleton instance
export const paymentService = new PaymentService(createPaymentAdapter(provider));

export { PaymentInterface, StripeAdapter, PaymentService };
export default paymentService;

