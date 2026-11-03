import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, ShieldCheck, CreditCard, CheckCircle2, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCheckoutController } from '../../controllers/useCheckoutController';
import paymentService from '../../services/paymentService';
import CardPaymentSection from './components/CardPaymentSection';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY?.trim();
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Credit / Debit Card', icon: CreditCard },
];

function CheckoutContent() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    items,
    subtotal,
    shipping,
    tax,
    finalTotal,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    placed,
    loading: controllerLoading,
    form,
    updateField,
    placeOrder,
    createdOrder,
    orderError,
  } = useCheckoutController();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Client-side pre-validation
    if (!form.email || !form.firstName || !form.lastName) {
      setCardError('Please enter your email, first name, and last name.');
      return;
    }
    if (deliveryMethod === 'delivery' && (!form.address || !form.city || !form.state || !form.zip)) {
      setCardError('Please complete all delivery address fields.');
      return;
    }

    if (paymentMethod === 'credit') {
      if (!stripeKey || !stripe || !elements) {
        setCardError('Stripe public key is not configured. Please set VITE_STRIPE_PUBLIC_KEY in client/.env.');
        return;
      }

      setIsProcessing(true);
      setCardError('');

      try {
        // 1. Request Payment Intent / session from decoupled backend PaymentService
        const session = await paymentService.createPaymentSession({
          amount: finalTotal,
          currency: 'lkr',
          metadata: {
            customerEmail: form.email,
            customerName: `${form.firstName} ${form.lastName}`.trim(),
          },
        });

        // 2. Authorize card payment securely via provider elements
        const cardElement = elements.getElement(CardElement);
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          session.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${form.firstName} ${form.lastName}`.trim(),
                email: form.email,
                address:
                  deliveryMethod === 'delivery'
                    ? {
                        line1: form.address,
                        city: form.city,
                        state: form.state,
                        postal_code: form.zip,
                      }
                    : undefined,
              },
            },
          }
        );

        if (stripeError) {
          setCardError(stripeError.message);
          setIsProcessing(false);
          return;
        }

        // 3. Payment succeeded -> persist verified order with transaction details
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          await placeOrder({
            transactionId: paymentIntent.id,
            paymentIntentId: paymentIntent.id,
            paymentStatus: 'PAID',
            provider: session.provider || 'stripe',
            providerMetadata: {
              currency: paymentIntent.currency,
              amountReceived: paymentIntent.amount_received / 100,
              paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
              status: paymentIntent.status,
            },
          });
        }
      } catch (err) {
        setCardError(err.message || 'Payment transaction failed. Please retry.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Non-card / fallback payment method
      try {
        await placeOrder();
      } catch (err) {
        setCardError(err.message || 'Order placement failed.');
      }
    }
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-brand-bg-hero pt-16 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="font-playfair font-bold text-3xl text-brand-text-dark mb-3">Order Placed!</h2>
          <p className="font-montserrat text-sm text-brand-text-muted leading-relaxed mb-2">
            Your delicious creation is now in our hands. We'll send you a confirmation email shortly.
          </p>
          <p className="font-montserrat text-sm text-brand-accent font-bold mb-8">
            Order #{createdOrder?.orderNumber || `ORD-${Date.now().toString().slice(-6)}`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/profile')} className="btn-primary">
              Track My Order
            </button>
            <button onClick={() => navigate('/gallery')} className="btn-secondary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg-hero pt-16 flex items-center justify-center px-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-playfair font-bold text-2xl text-brand-text-dark mb-2">Your cart is empty</h2>
          <p className="font-montserrat text-sm text-brand-text-muted mb-6">Add some cakes to get started!</p>
          <button onClick={() => navigate('/gallery')} className="btn-primary">Browse Gallery</button>
        </div>
      </div>
    );
  }

  const isBusy = controllerLoading || isProcessing;

  return (
    <div className="min-h-screen bg-brand-bg-hero pt-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-10">
        <h1 className="font-playfair font-bold text-4xl text-brand-text-dark mb-10 text-center">Checkout</h1>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Left: Form ── */}
            <div className="lg:col-span-3 space-y-8">
              {/* Delivery Method */}
              <div>
                <h2 className="font-playfair font-bold text-2xl text-brand-text-dark flex items-center gap-3 mb-5">
                  <Truck size={22} className="text-brand-accent" />
                  Delivery Method
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'delivery', label: 'Local Delivery', Icon: Truck },
                    { id: 'pickup', label: 'Store Pickup', Icon: Store },
                  ].map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDeliveryMethod(id)}
                      id={`delivery-${id}`}
                      className={`flex flex-col items-center gap-2 py-6 rounded-xl border-2 font-montserrat font-semibold text-sm transition-all duration-200 ${
                        deliveryMethod === id
                          ? 'border-brand-primary bg-brand-surface text-brand-text-dark shadow-sm'
                          : 'border-brand-border bg-white text-brand-text-muted hover:border-brand-primary/40'
                      }`}
                    >
                      <Icon size={22} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {deliveryMethod === 'delivery' && (
                <div>
                  <h2 className="font-playfair font-bold text-2xl text-brand-text-dark flex items-center gap-3 mb-5">
                    <span className="text-brand-accent">📍</span>
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wide">
                        Email Address
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="your@email.com"
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wide">
                          First Name
                        </label>
                        <input
                          id="checkout-firstname"
                          type="text"
                          required
                          value={form.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          placeholder="First Name"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wide">
                          Last Name
                        </label>
                        <input
                          id="checkout-lastname"
                          type="text"
                          required
                          value={form.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          placeholder="Last Name"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wide">
                        Address
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        required
                        value={form.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="Street Address"
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wide">
                          City
                        </label>
                        <input
                          id="checkout-city"
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          placeholder="City"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wide">
                          State
                        </label>
                        <input
                          id="checkout-state"
                          type="text"
                          required
                          value={form.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          placeholder="State"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wide">
                          ZIP
                        </label>
                        <input
                          id="checkout-zip"
                          type="text"
                          required
                          value={form.zip}
                          onChange={(e) => updateField('zip', e.target.value)}
                          placeholder="ZIP"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Section */}
              <div>
                <h2 className="font-playfair font-bold text-2xl text-brand-text-dark flex items-center gap-3 mb-5">
                  <CreditCard size={22} className="text-brand-accent" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                    <div
                      key={id}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                        paymentMethod === id
                          ? 'border-brand-primary bg-brand-surface shadow-sm'
                          : 'border-brand-border bg-white'
                      }`}
                    >
                      <label htmlFor={`payment-${id}`} className="flex items-center justify-between cursor-pointer mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id={`payment-${id}`}
                            name="payment"
                            value={id}
                            checked={paymentMethod === id}
                            onChange={() => setPaymentMethod(id)}
                            className="accent-brand-primary"
                          />
                          <span className="font-montserrat font-semibold text-sm text-brand-text-dark">{label}</span>
                        </div>
                        {Icon && <Icon size={20} className="text-brand-text-muted" />}
                      </label>

                      {/* Modular Payment Form: Easily swapped for other gateway forms */}
                      {paymentMethod === 'credit' && (
                        <CardPaymentSection
                          error={cardError || orderError}
                          disabled={isBusy}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-2">
              <div className="bg-brand-surface rounded-2xl shadow-sm border border-brand-border p-6 sticky top-24">
                <h2 className="font-playfair font-bold text-2xl text-brand-text-dark mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.cartItemId || item.id} className="flex gap-3">
                      <img
                        src={item.image || item.referenceImage || '/placeholder-cake.png'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shrink-0 border border-brand-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair font-semibold text-sm text-brand-text-dark truncate">{item.name}</p>
                        <p className="font-montserrat text-xs text-brand-text-muted mt-0.5">
                          {item.weight || item.size} · {item.flavor}
                        </p>
                        <p className="font-montserrat text-xs text-brand-text-muted mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-montserrat font-bold text-sm text-brand-text-dark shrink-0">
                        Rs. {((item.price || item.totalPrice || item.basePrice || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="border-brand-border mb-4" />

                {/* Totals */}
                <div className="space-y-2 mb-5">
                  {[
                    { label: 'Subtotal', value: `Rs. ${subtotal.toFixed(2)}` },
                    { label: 'Shipping', value: deliveryMethod === 'pickup' ? 'Free' : `Rs. ${shipping.toFixed(2)}` },
                    { label: 'Tax', value: `Rs. ${tax.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between font-montserrat text-sm text-brand-text-body">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-montserrat font-bold text-lg text-brand-text-dark pt-3 border-t border-brand-border">
                    <span>Total</span>
                    <span className="text-brand-accent">Rs. {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  id="place-order-btn"
                  type="submit"
                  disabled={isBusy || (Boolean(stripeKey) && !stripe)}
                  className="w-full flex items-center justify-center gap-2 btn-primary py-4 text-base disabled:opacity-60 cursor-pointer"
                >
                  <Lock size={15} />
                  {isBusy ? 'Processing Payment...' : `Pay Rs. ${finalTotal.toFixed(2)}`}
                </button>
                <p className="font-montserrat text-xs text-brand-text-muted text-center mt-3">
                  By placing your order, you agree to our Terms &amp; Conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Secure Footer */}
      <div className="bg-brand-text-dark py-5 text-center mt-10">
        <p className="font-playfair font-semibold text-lg text-white mb-1">Cake of Paradise</p>
        <div className="flex items-center justify-center gap-1.5 text-white/70">
          <ShieldCheck size={13} />
          <span className="font-montserrat text-xs">Secure Checkout</span>
        </div>
        <p className="font-montserrat text-xs text-white/40 mt-2">© 2024 Cake of Paradise. Artisanally Crafted.</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}

