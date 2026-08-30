import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReveal } from '../hooks/useReveal';

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart, formatPrice } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const revealRef = useReveal();
  const cardRef = useRef(null);
  
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const isWishlisted = wishlist.includes(product.id);
  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 ? '☆' : '');

  const openQuickView = (e) => {
    e.stopPropagation();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('quickView', product.id);
    setSearchParams(newParams);
  };

  return (
    <div
      ref={(el) => {
        revealRef.current = el;
        cardRef.current = el;
      }}
      className="product-card reveal"
      style={{ 
        transitionDelay: `${delay}s`,
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 50, y: 50 }); }}
      onMouseMove={handleMouseMove}
      onClick={() => navigate(`/products/${product.id}`)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/products/${product.id}`);
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
    >
      <div className={`product-glow ${isHovered ? 'active' : ''}`} />
      <div className="product-img-wrap">
        {product.badge && (
          <span className={`product-label ${product.badgeType}`}>{product.badge}</span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="400"
          height="400"
          style={{ aspectRatio: '1/1', objectFit: 'cover' }}
        />

        {/* Wishlist button */}
        <button
          className={`product-wishlist ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick View Button (Intercepting Route) */}
        <button
          type="button"
          className="product-quick-view-btn"
          onClick={openQuickView}
          aria-label={`Quick view ${product.name}`}
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.92)',
            color: 'var(--color-text-primary, #21140B)',
            border: 'none',
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s, transform 0.2s',
            zIndex: 3,
            boxShadow: 'var(--shadow-sm)',
            whiteSpace: 'nowrap',
          }}
        >
          Quick View
        </button>

        {/* Add to Cart Button */}
        <button
          className="product-quick-add"
          onClick={e => { e.stopPropagation(); addToCart(product); }}
          aria-label={`Add ${product.name} to cart`}
        >
          + Add to Cart
        </button>
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h4 className="product-name">{product.name}</h4>
        <div className="product-rating">
          <span className="stars" aria-label={`${product.rating} stars`}>{stars}</span>
          <span>({product.reviews.toLocaleString()} reviews)</span>
        </div>
        <div className="product-price">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
              <span className="price-badge">SAVE {Math.round((1 - product.price/product.originalPrice)*100)}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
