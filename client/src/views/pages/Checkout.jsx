import { useNavigate } from 'react-router-dom';
import { Truck, Store, ShieldCheck, CreditCard, CheckCircle2, Lock } from 'lucide-react';
import { useCheckoutController } from '../../controllers/useCheckoutController';

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Credit Card', icon: CreditCard },
  { id: 'paypal', label: 'PayPal', icon: null },
  { id: 'applepay', label: 'Apple Pay', icon: null },
];

export default function Checkout() {
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
    loading,
    form,
    updateField,
    placeOrder,
  } = useCheckoutController();

  const navigate = useNavigate();

  if (placed) {
    return (
      <div className="min-h-screen bg-cream-50 pt-16 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="font-playfair font-bold text-3xl text-chocolate-900 mb-3">Order Placed!</h2>
          <p className="font-montserrat text-sm text-chocolate-800/60 leading-relaxed mb-2">
            Your delicious creation is now in our hands. We'll send you a confirmation email shortly.
          </p>
          <p className="font-montserrat text-xs text-caramel-600 font-semibold mb-8">
            Order #ORD-{Date.now().toString().slice(-6)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/profile')} className="btn-primary">
              Track My Order
            </button>
            <button onClick={() => navigate('/menu')} className="btn-secondary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-16 flex items-center justify-center px-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-playfair font-bold text-2xl text-chocolate-900 mb-2">Your cart is empty</h2>
          <p className="font-montserrat text-sm text-chocolate-800/50 mb-6">Add some cakes to get started!</p>
          <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      {/* Logo Header */}
      <div className="bg-white border-b border-gray-100 py-4 text-center">
        <p className="font-playfair italic font-semibold text-2xl text-caramel-600">Cake of Paradise</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-10">
        <h1 className="font-playfair font-bold text-4xl text-chocolate-900 mb-10 text-center">Checkout</h1>

        <form onSubmit={placeOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Left: Form ── */}
            <div className="lg:col-span-3 space-y-8">
              {/* Delivery Method */}
              <div>
                <h2 className="font-playfair font-bold text-2xl text-chocolate-900 flex items-center gap-3 mb-5">
                  <Truck size={22} className="text-caramel-600" />
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
                          ? 'border-caramel-600 bg-cream-100 text-chocolate-900'
                          : 'border-gray-200 bg-white text-chocolate-800/60 hover:border-caramel-600/40'
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
                  <h2 className="font-playfair font-bold text-2xl text-chocolate-900 flex items-center gap-3 mb-5">
                    <span className="text-caramel-600">📍</span>
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">Email Address</label>
                      <input id="checkout-email" type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">First Name</label>
                        <input id="checkout-firstname" type="text" required value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="First Name" className="input-field" />
                      </div>
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">Last Name</label>
                        <input id="checkout-lastname" type="text" required value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Last Name" className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">Address</label>
                      <input id="checkout-address" type="text" required value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Street Address" className="input-field" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">City</label>
                        <input id="checkout-city" type="text" required value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="City" className="input-field" />
                      </div>
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">State</label>
                        <input id="checkout-state" type="text" required value={form.state} onChange={(e) => updateField('state', e.target.value)} placeholder="State" className="input-field" />
                      </div>
                      <div>
                        <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">ZIP</label>
                        <input id="checkout-zip" type="text" required value={form.zip} onChange={(e) => updateField('zip', e.target.value)} placeholder="ZIP" className="input-field" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <h2 className="font-playfair font-bold text-2xl text-chocolate-900 flex items-center gap-3 mb-5">
                  <CreditCard size={22} className="text-caramel-600" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                    <label
                      key={id}
                      htmlFor={`payment-${id}`}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        paymentMethod === id ? 'border-caramel-600 bg-cream-50' : 'border-gray-200 bg-white hover:border-caramel-600/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`payment-${id}`}
                          name="payment"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={() => setPaymentMethod(id)}
                          className="accent-caramel-600"
                        />
                        <span className="font-montserrat font-semibold text-sm text-chocolate-800">{label}</span>
                      </div>
                      {Icon && <Icon size={20} className="text-chocolate-800/40" />}
                      {!Icon && <span className="font-montserrat text-sm font-bold text-chocolate-800/40">{label}</span>}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="font-playfair font-bold text-2xl text-chocolate-900 mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair font-semibold text-sm text-chocolate-900 truncate">{item.name}</p>
                        <p className="font-montserrat text-xs text-chocolate-800/50 mt-0.5">{item.size} · {item.flavor}</p>
                        <p className="font-montserrat text-xs text-chocolate-800/40 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-montserrat font-bold text-sm text-chocolate-900 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* Totals */}
                <div className="space-y-2 mb-5">
                  {[
                    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', value: deliveryMethod === 'pickup' ? 'Free' : `$${shipping.toFixed(2)}` },
                    { label: 'Tax', value: `$${tax.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between font-montserrat text-sm text-chocolate-800/70">
                      <span>{label}</span><span>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-montserrat font-bold text-lg text-chocolate-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-caramel-600">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  id="place-order-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 btn-primary py-4 text-base disabled:opacity-60"
                >
                  <Lock size={15} />
                  {loading ? 'Processing...' : 'Place Order Securely'}
                </button>
                <p className="font-montserrat text-xs text-chocolate-800/40 text-center mt-3">
                  By placing your order, you agree to our Terms &amp; Conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Secure Footer */}
      <div className="bg-chocolate-900 py-5 text-center mt-10">
        <p className="font-playfair italic font-semibold text-lg text-cream-50 mb-1">Cake of Paradise</p>
        <div className="flex items-center justify-center gap-1.5 text-cream-200/50">
          <ShieldCheck size={13} />
          <span className="font-montserrat text-xs">Secure Checkout</span>
        </div>
        <p className="font-montserrat text-xs text-cream-200/30 mt-2">© 2024 Cake of Paradise. Artisanally Crafted.</p>
      </div>
    </div>
  );
}
