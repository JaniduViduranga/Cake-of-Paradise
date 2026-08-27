import { createContext, useContext } from 'react';
import { useCartController } from '../controllers/useCartController';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCartController();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
