import { useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, shipping, tax, total, itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-chocolate-900/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-cream-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-caramel-600" strokeWidth={1.8} />
            <h2 className="font-playfair font-bold text-xl text-chocolate-900">Your Cart</h2>
            {itemCount > 0 && (
              <span className="bg-caramel-600 text-white text-xs font-montserrat font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-cream-100 text-chocolate-800/50 hover:text-chocolate-900 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center">
                <ShoppingCart size={32} className="text-cream-200" strokeWidth={1.2} />
              </div>
              <div>
                <p className="font-playfair text-lg font-semibold text-chocolate-900">Your cart is empty</p>
                <p className="font-montserrat text-sm text-chocolate-800/50 mt-1">Start a custom order to get started!</p>
              </div>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/custom-order'); }}
                className="btn-primary mt-2"
              >
                Start Custom Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                  <div className="w-18 h-18 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair font-semibold text-sm text-chocolate-900 truncate">{item.name}</p>
                    <p className="font-montserrat text-xs text-chocolate-800/50 mt-0.5 truncate">
                      {item.orderType} · {item.orderType === 'Cupcakes' ? `${item.cupcakeQuantity} Pack` : item.weight} · {item.flavor}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-2 bg-cream-100 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="text-chocolate-800/70 hover:text-caramel-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-montserrat font-semibold text-xs w-4 text-center text-chocolate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="text-chocolate-800/70 hover:text-caramel-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-montserrat font-bold text-caramel-600 text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-1 text-chocolate-800/30 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-6 py-5 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between font-montserrat text-sm text-chocolate-800/70">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-montserrat text-sm text-chocolate-800/70">
                <span>Shipping</span><span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-montserrat text-sm text-chocolate-800/70">
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-montserrat font-bold text-base text-chocolate-900 pt-2 border-t border-gray-100">
                <span>Total</span><span className="text-caramel-600">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              id="checkout-btn"
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 btn-primary py-3.5"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
