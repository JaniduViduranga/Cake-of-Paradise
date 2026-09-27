import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';

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
            // 1. Ask backend to create a PaymentIntent
            const intentRes = await fetch('http://localhost:5000/api/payment/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total }),
            });
            const { clientSecret, success } = await intentRes.json();

            if (!success) throw new Error('Could not initiate payment session.');

            // 2. Confirm card payment securely on the browser
            const cardElement = elements.getElement(CardElement);
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
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

            // 3. Payment Succeeded -> Now persist order to MongoDB
            if (paymentResult.paymentIntent.status === 'succeeded') {
                const orderData = {
                    items,
                    customerDetails,
                    totalPrice: total,
                    paymentStatus: 'Paid',
                    paymentIntentId: paymentResult.paymentIntent.id,
                };

                const orderRes = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData),
                });

                if (orderRes.ok) {
                    clearCart(); // Wipes localStorage cart
                    alert('🎉 Payment successful! Your cake order has been placed.');
                    window.location.href = '/order-success';
                }
            }
        } catch (err) {
            setErrorMessage(err.message || 'Payment processing failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePayment} className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800">Credit / Debit Card</h3>

            <div className="p-3 border rounded-md bg-gray-50">
                <CardElement options={{ hidePostalCode: true }} />
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
                {loading ? 'Processing...' : `Pay $${total}`}
            </button>
        </form>
    );
}