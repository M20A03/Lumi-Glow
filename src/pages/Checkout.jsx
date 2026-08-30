import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { cart, totalPrice, formatPrice, clearCart, showToast } = useCart();
  const navigate = useNavigate();
  const formId = useId();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [idempotencyKey] = useState(() => `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing || submissionCompleted) return;

    setIsProcessing(true);

    // Simulate real gateway processing with idempotency token
    setTimeout(() => {
      setIsProcessing(false);
      setSubmissionCompleted(true);
      clearCart();
      showToast('Order confirmed! Receipt sent to your email.', 'success');
      navigate('/');
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (cart.length === 0 && !isProcessing && !submissionCompleted) {
    return (
      <div className="checkout-empty">
        <div className="container" style={{ textAlign: 'center', padding: '10vh 0' }}>
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
            Please add some items to your bag before heading to checkout.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/products')}
            style={{ marginTop: '2rem', minHeight: '44px' }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-container">
        <div className="checkout-left reveal-left">
          <div className="checkout-header">
            <h1>LumiGlow Checkout</h1>
            <p className="secure-badge" aria-label="Security status">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secure 256-bit Encrypted Checkout
            </p>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form" id={formId}>
            {/* Hidden Idempotency Token */}
            <input type="hidden" name="idempotency_key" value={idempotencyKey} />

            <section className="form-section">
              <h2>Contact Information</h2>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={isProcessing}
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Shipping Address</h2>
              <div className="checkout-grid">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    required
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    required
                    type="text"
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="address">Street Address</label>
                <input
                  required
                  type="text"
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
              </div>
              <div className="checkout-grid">
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input
                    required
                    type="text"
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    required
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    autoComplete="postal-code"
                    inputMode="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h2>Payment Details</h2>
              <div className="input-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  required
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  autoComplete="cc-number"
                  inputMode="numeric"
                  placeholder="•••• •••• •••• ••••"
                  maxLength={19}
                  value={formData.cardNumber}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
              </div>
              <div className="checkout-grid">
                <div className="input-group">
                  <label htmlFor="expiry">Expiry Date</label>
                  <input
                    required
                    type="text"
                    id="expiry"
                    name="expiry"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    placeholder="MM / YY"
                    maxLength={7}
                    value={formData.expiry}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="cvc">CVC / CVV</label>
                  <input
                    required
                    type="password"
                    id="cvc"
                    name="cvc"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    placeholder="•••"
                    maxLength={4}
                    value={formData.cvc}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="btn btn-primary checkout-btn"
              disabled={isProcessing || submissionCompleted}
              aria-busy={isProcessing}
              style={{
                width: '100%',
                minHeight: '52px',
                marginTop: '1rem',
                opacity: (isProcessing || submissionCompleted) ? 0.7 : 1,
                cursor: (isProcessing || submissionCompleted) ? 'not-allowed' : 'pointer',
              }}
            >
              {isProcessing ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg
                    style={{ animation: 'spin 1s linear infinite' }}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  Processing Securely...
                </span>
              ) : (
                `Complete Order • ${formatPrice(totalPrice)}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-right reveal-right">
          <div className="order-summary-card">
            <h2>Order Summary ({cart.reduce((s, i) => s + i.qty, 0)} items)</h2>
            <div className="order-items-list">
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-img">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <span className="order-item-qty">{item.qty}</span>
                  </div>
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.category}</p>
                  </div>
                  <div className="order-item-price">
                    {formatPrice(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Standard Shipping</span>
                <span style={{ color: 'var(--color-sage)' }}>Free</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}