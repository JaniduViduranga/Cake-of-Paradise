import { useState, useCallback, useEffect } from 'react';

const CART_STORAGE_KEY = 'cake_of_paradise_cart';

/**
 * Controller managing Cart state, item manipulation, financial calculations,
 * and persistent storage across page refreshes.
 */
export function useCartController() {
  // 1. Initialize cart from localStorage if available
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. Synchronize items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [items]);

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      // Grouping logic based on custom order properties
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
      )

      if (existing && existing.referenceImage === product.referenceImage) {
        return prev.map((i) =>
          i.cartItemId === existing.cartItemId
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        );
      }

      const cartItemId = product.cartItemId || product.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      return [
        ...prev,
        {
          ...product,
          cartItemId,
          price: product.price ?? product.totalPrice ?? product.basePrice ?? 0,
          quantity: product.quantity || 1,
        },
      ];
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

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear cart storage:', err);
    }
  }, []);

  // Financial calculations with safe price fallbacks
  const subtotal = items.reduce((sum, i) => {
    const unitPrice = i.price ?? i.totalPrice ?? i.basePrice ?? 0;
    return sum + unitPrice * (i.quantity || 1);
  }, 0);

  const shipping = subtotal > 0 ? 15 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

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
};