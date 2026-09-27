import { useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * Controller managing checkout process, delivery options, payment selection, and order placement
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

  const placeOrder = async (paymentDetails = {}) => {
    if (paymentDetails && typeof paymentDetails.preventDefault === 'function') {
      paymentDetails.preventDefault();
      paymentDetails = {};
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const payload = {
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
        paymentInfo: {
          paymentMethod: paymentMethod || 'credit',
          paymentStatus: paymentDetails.paymentStatus || 'Paid',
          paymentIntentId: paymentDetails.paymentIntentId || `pi_sim_${Date.now()}`,
        },
      };

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order in database.');
      }

      setCreatedOrder(data.order);
      clearCart();
      setPlaced(true);
      return data.order;
    } catch (err) {
      console.error('Order placement error:', err);
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
