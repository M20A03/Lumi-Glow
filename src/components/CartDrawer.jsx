import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, changeQty, removeFromCart, totalPrice } = useCart();
  const drawerRef = useRef(null);
  const prevFocusRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartOpen) return;

    const dialog = drawerRef.current;
    if (!dialog) return;

    prevFocusRef.current = document.activeElement;

    const focusables = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
    const first = focusables[0] || dialog;
    const last = focusables[focusables.length - 1] || first;

    first.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setCartOpen(false);
        return;
      }

      if (event.key !== 'Tab' || focusables.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (prevFocusRef.current instanceof HTMLElement) prevFocusRef.current.focus();
    };
  }, [cartOpen, setCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className="mobile-nav-overlay"
        style={{ display: cartOpen ? 'block' : 'none', zIndex: 2000 }}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div ref={drawerRef} className={`cart-drawer${cartOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" aria-hidden={!cartOpen} tabIndex={-1}>
        <div className="cart-header">
          <h3 id="cart-drawer-title">
            Your Cart{' '}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontFamily: 'var(--font-sans)' }}>
              ({cart.reduce((s, i) => s + i.qty, 0)} items)
            </span>
          </h3>
          <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>Your cart is empty</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setCartOpen(false)}>
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80'} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)} aria-label={`Decrease quantity for ${item.name}`}>−</button>
                    <span className="qty-value">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, 1)} aria-label={`Increase quantity for ${item.name}`}>+</button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-light)', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none' }}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span style={{ color: 'var(--sage)', fontWeight: 600 }}>FREE</span>
            </div>
            <div className="cart-summary-row" style={{ fontWeight: 700, fontSize: '1rem' }}>
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ background: 'rgba(143,175,143,0.1)', border: '1px solid var(--sage-light)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', fontSize: '0.78rem', color: 'var(--sage)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🎉 You qualify for FREE shipping!
            </div>
            <button
              className="btn btn-primary cart-checkout"
              onClick={() => {
                setCartOpen(false);
                navigate('/checkout');
              }}
            >
              Proceed to Checkout →
            </button>
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-light)' }}>
              🔒 Secure checkout · SSL encrypted
            </div>
          </div>
        )}
      </div>
    </>
  );
}
