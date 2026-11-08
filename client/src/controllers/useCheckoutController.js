import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { paymentService } from '../services/paymentService';

/**
 * Controller managing checkout process, delivery options, payment selection, and order placement.
 * Delegates order finalization to the decoupled paymentService.
 */
export function useCheckoutController() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const finalTotal = total - (deliveryMethod === 'pickup' ? shipping : 0);

  const placeOrder = async (paymentResult = {}) => {
    if (paymentResult && typeof paymentResult.preventDefault === 'function') {
      paymentResult.preventDefault();
      paymentResult = {};
    }

    // Validation
    if (!form.email || !form.firstName || !form.lastName) {
      const msg = 'Please enter your email, first name, and last name.';
      setOrderError(msg);
      throw new Error(msg);
    }

    if (deliveryMethod === 'delivery' && (!form.address || !form.city || !form.state || !form.zip)) {
      const msg = 'Please complete all delivery address fields.';
      setOrderError(msg);
      throw new Error(msg);
    }

    if (!items || items.length === 0) {
      const msg = 'Your cart is empty.';
      setOrderError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setOrderError('');

    try {
      const orderPayload = {
        customerDetails: {
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          address: deliveryMethod === 'delivery' ? form.address.trim() : '',
          city: deliveryMethod === 'delivery' ? form.city.trim() : '',
          state: deliveryMethod === 'delivery' ? form.state.trim() : '',
          zip: deliveryMethod === 'delivery' ? form.zip.trim() : '',
        },
        deliveryMethod,
        items,
        financials: {
          subtotal,
          shipping: deliveryMethod === 'pickup' ? 0 : shipping,
          tax,
          finalTotal,
        },
        paymentMethod: paymentMethod || 'credit',
      };

      // Decoupled persistence through paymentService
      const savedOrder = await paymentService.processOrderCompletion(orderPayload, paymentResult);

      setCreatedOrder(savedOrder);
      clearCart();
      setPlaced(true);
      return savedOrder;
    } catch (err) {
      console.error('[useCheckoutController] Order placement error:', err);
      setOrderError(err.message || 'Failed to place order.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    subtotal,
    shipping,
    tax,
    total,
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
    createdOrder,
    orderError,
  };
}
