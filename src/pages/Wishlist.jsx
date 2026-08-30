import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Phase2.css';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  const wishlisted = useMemo(() => {
    return wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
  }, [wishlist]);

  const openConcierge = () => {
    window.dispatchEvent(new CustomEvent('open-dh-concierge'));
  };

  return (
    <div className="p2-products-page">
      <section className="p2-products-hero">
        <div className="container p2-products-hero-inner">
          <div>
            <p className="section-label">Saved Items</p>
            <h1>My Wishlist</h1>
            <p>
              {wishlisted.length > 0
                ? `You have ${wishlisted.length} item${wishlisted.length !== 1 ? 's' : ''} saved in your wishlist.`
                : 'Your wishlist is empty. Start exploring and save your favorite products.'}
            </p>
            {wishlisted.length === 0 && (
              <div className="p2-products-hero-actions">
                <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                <button type="button" className="btn btn-outline" onClick={openConcierge}>Ask AI for Recommendations</button>
              </div>
            )}
          </div>
          {wishlisted.length > 0 && (
            <div className="p2-products-proof">
              <article>
                <strong>{wishlisted.length}</strong>
                <span>Saved items</span>
              </article>
              <article>
                <strong>{(wishlisted.reduce((sum, p) => sum + p.rating, 0) / wishlisted.length).toFixed(1)}</strong>
                <span>Avg rating</span>
              </article>
              <article>
                <strong>₹{wishlisted.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</strong>
                <span>Total value</span>
              </article>
            </div>
          )}
        </div>
      </section>

      {wishlisted.length > 0 ? (
        <section className="section-padding container">
          <div className="products-full-grid p2-stagger-grid">
            {wishlisted.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index * 0.06} />
            ))}
          </div>
        </section>
      ) : (
        <section className="section-padding">
          <div className="container" style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>♡</div>
              <h3 style={{ marginBottom: '0.5rem', marginTop: 0 }}>Your wishlist is empty</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                Browse our collection and add your favorite products to your wishlist to view them later.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-primary">
                  Shop Products
                </Link>
                <button type="button" className="btn btn-outline" onClick={openConcierge}>
                  Get Recommendations
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
