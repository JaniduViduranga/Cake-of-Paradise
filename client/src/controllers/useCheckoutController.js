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

  const placeOrder = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setPlaced(true);
    clearCart();
  };

  const finalTotal = total - (deliveryMethod === 'pickup' ? shipping : 0);

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
  };
}
