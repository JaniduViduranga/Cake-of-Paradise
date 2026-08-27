import { useState, useCallback } from 'react';

/**
 * Controller managing Cart state, item manipulation, and financial calculations
 */
export function useCartController() {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      // Grouping logic based on new order properties
      const existing = prev.find(
        (i) => 
          i.id === product.id && 
          i.orderType === product.orderType && 
          i.weight === product.weight && 
          i.cupcakeQuantity === product.cupcakeQuantity && 
          i.flavor === product.flavor &&
          i.deliveryDate === product.deliveryDate &&
          i.timeSlot === product.timeSlot &&
          i.customMessage === product.customMessage
          // We won't strictly compare referenceImage as it might be a new blob URL each time,
          // but typically users don't add the *exact* same custom image order twice.
      );

      if (existing && existing.referenceImage === product.referenceImage) {
        return prev.map((i) =>
          i.cartItemId === existing.cartItemId
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId, qty) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
  };
}
