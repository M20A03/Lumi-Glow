import React, { useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductQuickViewModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, formatPrice } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();

  const quickViewId = searchParams.get('quickView');
  const product = products.find(p => p.id === quickViewId);
  const modalRef = useRef(null);

  const closeModal = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('quickView');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!product) return;

    // Trap focus and body scroll lock
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, closeModal]);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div
      className="quick-view-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-overlay, rgba(0, 0, 0, 0.75))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3vw, 2.5rem)',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        ref={modalRef}
        className="quick-view-dialog"
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-bg-elevated, #FFFFFF)',
          color: 'var(--color-text-primary, #21140B)',
          borderRadius: 'var(--radius-lg, 20px)',
          maxWidth: '850px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          animation: 'fadeInScale 0.25s var(--ease-spring)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          aria-label="Close product preview"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-subtle, #F2E8DC)',
            color: 'var(--color-text-primary, #21140B)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background-color 0.2s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Product Image */}
        <div style={{ position: 'relative', backgroundColor: 'var(--color-bg-subtle, #F2E8DC)', minHeight: '320px' }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {product.badge && (
            <span
              className="badge"
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-accent)' }}>
              {product.category}
            </span>
            <h2
              id="quick-view-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-2xl)',
                marginTop: '0.25rem',
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              ★ {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {product.benefits && (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {product.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-sage)' }}>✓</span> {benefit}
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, minHeight: '44px', padding: '0.75rem 1rem' }}
              onClick={() => {
                addToCart(product);
                closeModal();
              }}
            >
              Add to Cart
            </button>
            <button
              className="btn btn-outline"
              style={{ minHeight: '44px', padding: '0.75rem 1rem' }}
              onClick={() => {
                closeModal();
                navigate(`/products/${product.id}`);
              }}
            >
              Full Details
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{ minWidth: '44px', minHeight: '44px', padding: '0.75rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'var(--color-rose)' : 'none'} stroke={isWishlisted ? 'var(--color-rose)' : 'currentColor'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
