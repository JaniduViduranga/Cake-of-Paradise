import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../../../context/CartContext';
import paymentService from '../../../services/paymentService';

export default function CheckoutForm({ customerDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Ask backend PaymentService to create a session
      const session = await paymentService.createPaymentSession({ amount: total });

      // 2. Confirm card payment securely on the browser
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(session.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone,
          },
        },
      });

      if (paymentResult.error) {
        setErrorMessage(paymentResult.error.message);
        setLoading(false);
        return;
      }

      // 3. Payment Succeeded -> Now persist order via paymentService
      if (paymentResult.paymentIntent.status === 'succeeded') {
        const orderData = {
          items,
          customerDetails,
          totalPrice: total,
          financials: { finalTotal: total },
          deliveryMethod: customerDetails.address ? 'delivery' : 'pickup',
          paymentMethod: 'credit',
        };

        await paymentService.processOrderCompletion(orderData, paymentResult.paymentIntent);

        clearCart();
        alert('🎉 Payment successful! Your cake order has been placed.');
        window.location.href = '/order-success';
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4 p-4 border border-brand-border rounded-lg bg-brand-surface shadow-sm">
      <h3 className="font-semibold text-lg text-brand-text-dark">Credit / Debit Card</h3>

      <div className="p-3 border border-brand-border rounded-md bg-brand-bg-hero">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-primary font-medium py-2 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay Rs. ${total}`}
      </button>
    </form>
  );
}
