import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Phase2.css';

const tabs = ['description', 'benefits', 'ingredients'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = getProductById(id);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef(null);

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  }, [product]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    if (!product?.id) return;

    const key = 'lumi-recently-viewed';
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    const next = [product.id, ...parsed.filter((value) => value !== product.id)].slice(0, 8);
    window.localStorage.setItem(key, JSON.stringify(next));
  }, [product]);

  if (!product) {
    return (
      <div className="p2-not-found">
        <h2>Product not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 ? '☆' : '');

  const images = [product.image, product.image, product.image, product.image];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i += 1) addToCart(product);
  };

  const openConcierge = () => {
    window.dispatchEvent(new CustomEvent('open-dh-concierge'));
  };

  return (
    <div className="p2-detail-page">
      <div className="p2-breadcrumb">
        <div className="container p2-breadcrumb-inner">
          <button onClick={() => navigate('/')}>Home</button>
          <span>›</span>
          <button onClick={() => navigate('/products')}>Products</button>
          <span>›</span>
          <strong>{product.name}</strong>
        </div>
      </div>

      <section className="product-detail-grid p2-detail-grid">
        <div className="product-detail-images p2-detail-images">
          <div 
            className="product-main-img p2-main-image"
            ref={imgRef}
            style={{ 
              '--mouse-x': `${mousePos.x}%`,
              '--mouse-y': `${mousePos.y}%`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 50, y: 50 }); }}
            onMouseMove={handleMouseMove}
          >
            <div className={`product-glow ${isHovered ? 'active' : ''}`} style={{ zIndex: 1, pointerEvents: 'none' }} />
            <img src={images[activeImage]} alt={product.name} />
          </div>
          <div className="product-thumbnails p2-thumbs">
            {images.map((img, index) => (
              <button
                key={`${product.id}-${index}`}
                type="button"
                className={`product-thumb p2-thumb ${activeImage === index ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={img} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-info p2-detail-info">
          <p className="product-brand">{product.brand}</p>
          <h1>{product.name}</h1>

          <div className="p2-rating-row">
            <div className="product-rating">
              <span className="stars">{stars}</span>
              <span>({product.reviews.toLocaleString()} reviews)</span>
            </div>
            <span className="p2-stock-pill">In Stock</span>
          </div>

          <div className="product-detail-price">
            ₹{product.price.toFixed(2)}
            {product.originalPrice && <span className="p2-original-price">₹{product.originalPrice.toFixed(2)}</span>}
          </div>

          <div className="p2-offer-strip">
            Use code GLOW15 for first-order savings.
          </div>

          <div className="variant-group">
            <span className="variant-label">Select Size</span>
            <div className="variant-options">
              {product.size.map((size, index) => (
                <button
                  key={size}
                  className={`variant-btn${selectedSize === index ? ' active' : ''}`}
                  onClick={() => setSelectedSize(index)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="p2-buy-row">
            <div className="qty-control">
              <button className="qty-large" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <span className="qty-display">{qty}</span>
              <button className="qty-large" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-primary p2-buy-btn" onClick={handleAddToCart}>
              Add to Cart - ₹{(product.price * qty).toFixed(2)}
            </button>
          </div>

          <div className="p2-detail-actions">
            <button className="btn btn-dark" onClick={handleAddToCart}>Buy Now</button>
            <button className="btn btn-outline" onClick={openConcierge}>Ask AI for Fit Check</button>
          </div>

          <div className="product-meta p2-meta-list">
            {[
              ['Shipping', 'Free over ₹3000'],
              ['Returns', '30-day easy returns'],
              ['Payments', 'Secure encrypted checkout'],
              ['Support', 'AI + human support 24/7'],
            ].map(([label, value]) => (
              <div key={label} className="meta-item">
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container p2-tabs-section">
        <div className="p2-tabs" role="tablist" aria-label="Product information">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'active' : ''}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`product-tab-panel-${tab}`}
              id={`product-tab-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <p className="p2-tab-content" id="product-tab-panel-description" role="tabpanel" aria-labelledby="product-tab-description">
            {product.description}
          </p>
        )}

        {activeTab === 'benefits' && (
          <ul className="p2-benefit-list" id="product-tab-panel-benefits" role="tabpanel" aria-labelledby="product-tab-benefits">
            {product.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        )}

        {activeTab === 'ingredients' && (
          <p className="p2-tab-content" id="product-tab-panel-ingredients" role="tabpanel" aria-labelledby="product-tab-ingredients">
            {product.ingredients}
          </p>
        )}
      </section>

      {related.length > 0 && (
        <section className="section-padding p2-related-wrap">
          <div className="container">
            <div className="section-header centered">
              <span className="section-label">Recommended</span>
              <h2>Complete the Set</h2>
            </div>
            <div className="p2-related-grid p2-stagger-grid">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="p2-mobile-sticky-cart" aria-label="Sticky mobile cart summary">
        <div>
          <strong>₹{(product.price * qty).toFixed(2)}</strong>
          <span>{qty} item{qty > 1 ? 's' : ''} selected</span>
        </div>
        <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
