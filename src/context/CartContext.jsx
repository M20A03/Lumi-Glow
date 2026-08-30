/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { detectUserGeo, formatPrice, CURRENCY_CONFIG } from '../router/guards';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiglow-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiglow-currency');
      if (saved && CURRENCY_CONFIG[saved]) return saved;
      return detectUserGeo().currency;
    } catch {
      return 'USD';
    }
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('lumiglow-cart', JSON.stringify(cart));
    } catch {
      // Storage quota resilience
    }
  }, [cart]);

  // Save currency preference
  useEffect(() => {
    try {
      localStorage.setItem('lumiglow-currency', currency);
    } catch {
      // Ignore
    }
  }, [currency]);

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ message: msg, type, id: Date.now() });
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Listen to global events from resilient fetcher or other components
  useEffect(() => {
    const handleGlobalToast = (event) => {
      if (event.detail && event.detail.message) {
        showToast(event.detail.message, event.detail.type || 'info');
      }
    };

    window.addEventListener('lumiglow-toast', handleGlobalToast);
    return () => window.removeEventListener('lumiglow-toast', handleGlobalToast);
  }, [showToast]);

  const addToCart = (item, qtyToAdd = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + qtyToAdd,
        };
        return updated;
      }
      return [...prev, { ...item, qty: qtyToAdd }];
    });
    setCartOpen(true);
    showToast(`✓ ${item.name} added to cart!`, 'success');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const clearCart = () => setCart([]);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Formatted price helper using active currency
  const getFormattedPrice = (cents) => formatPrice(cents, currency);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      changeQty,
      clearCart,
      cartOpen,
      setCartOpen,
      totalQty,
      totalPrice,
      currency,
      setCurrency,
      formatPrice: getFormattedPrice,
      toast,
      showToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
