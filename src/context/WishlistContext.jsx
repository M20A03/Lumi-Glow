import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = window.localStorage.getItem('lumi-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const addToWishlist = (productId) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev : [...prev, productId];
      window.localStorage.setItem('lumi-wishlist', JSON.stringify(next));
      return next;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => {
      const next = prev.filter((id) => id !== productId);
      window.localStorage.setItem('lumi-wishlist', JSON.stringify(next));
      return next;
    });
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
