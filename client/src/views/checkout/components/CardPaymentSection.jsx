import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#2E1E1A',
      fontFamily: 'Montserrat, sans-serif',
      '::placeholder': {
        color: '#786C6A',
      },
    },
    invalid: {
      color: '#dc2626',
    },
  },
};

/**
 * Modular Card Payment Input Section.
 * Decoupled from CheckoutPage so it can be swapped with other provider forms (e.g. PayHere / LankaQR).
 */
export default function CardPaymentSection({ error, disabled = false }) {
  return (
    <div className="mt-4 pt-4 border-t border-brand-border/60">
      <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wide">
        Card Information
      </label>
      <div className="p-3.5 bg-brand-surface border border-brand-border rounded-lg shadow-inner">
        <CardElement options={{ ...CARD_ELEMENT_OPTIONS, disabled }} />
      </div>
      {error && (
        <p className="font-montserrat text-xs text-red-600 mt-2 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

