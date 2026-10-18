import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { cart, totalPrice, clearCart, showToast } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: 'Dhanbad',
    postalCode: '826001',
    country: 'IN',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvc: '',
    upiId: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessStep('Verifying botanical formulation inventory...');

    setTimeout(() => {
      setProcessStep('Applying carbon-neutral delivery offset...');
    }, 800);

    setTimeout(() => {
      setProcessStep('Authorizing 256-bit encrypted payment token...');
    }, 1600);

    setTimeout(() => {
      setIsProcessing(false);
      const orderId = `LG-ECO-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        id: orderId,
        date: new Date().toISOString(),
        customer: { ...formData },
        items: [...cart],
        total: totalPrice,
        deliveryTime: '2-3 Business Days'
      };

      // Store in localStorage for TrackOrder lookup
      try {
        const stored = JSON.parse(localStorage.getItem('lumiglow_orders') || '[]');
        localStorage.setItem('lumiglow_orders', JSON.stringify([orderData, ...stored]));
      } catch (err) {
        console.warn('Could not store order locally:', err);
      }

      setConfirmedOrder(orderData);
      clearCart();
      showToast('🎉 Eco-Luxury Order Confirmed! Receipt generated below.');
    }, 2400);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (cart.length === 0 && !isProcessing && !confirmedOrder) {
    return (
      <div className="checkout-empty">
        <div className="container" style={{ textAlign: 'center', padding: '10vh 0' }}>
          <h2>Your cart is empty</h2>
          <p>Please add some botanical products to your cart before checking out.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '2rem' }}>
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
            <h1>Lumi Glow Eco-Luxury Checkout</h1>
            <p className="secure-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure 256-bit SSL · Carbon-Neutral Shipping
            </p>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <section className="form-section">
              <h2>Contact Information</h2>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
            </section>

            <section className="form-section">
              <h2>Eco-Delivery Shipping Address</h2>
              <div className="checkout-grid">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input required type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Aarav" />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input required type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Sharma" />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="address">Street Address</label>
                <input required type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Flat 4B, Green Glen Boulevard" />
              </div>
              <div className="checkout-grid">
                <div className="input-group">
                  <label htmlFor="city">City / District</label>
                  <input required type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="postalCode">PIN / Postal Code</label>
                  <input required type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} maxLength={6} />
                </div>
              </div>
            </section>

            <section className="form-section payment-section">
              <h2>Payment Method</h2>
              <div className="payment-gateways" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                <button
                  type="button"
                  className={`payment-tab ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setFormData(p => ({ ...p, paymentMethod: 'card' }))}
                  style={{ cursor: 'pointer', padding: '10px', textAlign: 'center' }}
                >
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  className={`payment-tab ${formData.paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setFormData(p => ({ ...p, paymentMethod: 'upi' }))}
                  style={{ cursor: 'pointer', padding: '10px', textAlign: 'center' }}
                >
                  Instant UPI / QR
                </button>
                <button
                  type="button"
                  className={`payment-tab ${formData.paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setFormData(p => ({ ...p, paymentMethod: 'cod' }))}
                  style={{ cursor: 'pointer', padding: '10px', textAlign: 'center' }}
                >
                  Cash on Delivery
                </button>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="cc-box">
                  <div className="input-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <div className="cc-input-wrap">
                      <svg viewBox="0 0 24 24" width="20" stroke="#a07040" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                      <input required type="text" id="cardNumber" name="cardNumber" maxLength="19" placeholder="4242 •••• •••• 4242" value={formData.cardNumber} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="checkout-grid">
                    <div className="input-group">
                      <label htmlFor="expiry">Expiry (MM/YY)</label>
                      <input required type="text" id="expiry" name="expiry" maxLength="5" placeholder="12/28" value={formData.expiry} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="cvc">CVC</label>
                      <div className="cc-input-wrap">
                        <svg viewBox="0 0 24 24" width="20" stroke="#a07040" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <input required type="text" id="cvc" name="cvc" maxLength="4" placeholder="888" value={formData.cvc} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="cc-box" style={{ padding: '16px' }}>
                  <label htmlFor="upiId" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>UPI ID / VPA</label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    placeholder="yourname@okhdfcbank or yourname@paytm"
                    value={formData.upiId}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-default)' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '8px' }}>
                    A collect request notification will be dispatched to your UPI app instantly.
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'cod' && (
                <div className="cc-box" style={{ padding: '16px', background: 'rgba(143,175,143,0.1)', border: '1px solid var(--sage)' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    💵 Pay on Delivery available for verified residential addresses. Zero contact handover supported.
                  </p>
                </div>
              )}
            </section>

            <button type="submit" className="btn btn-primary checkout-submit-btn" disabled={isProcessing}>
              {isProcessing ? (
                <span className="spinner">{processStep || 'Processing Order...'}</span>
              ) : (
                `Complete Botanical Order · ₹${totalPrice.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        <div className="checkout-right reveal-right">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="img-wrap">
                    <img src={item.image} alt={item.name} />
                    <span className="qty-badge">{item.qty}</span>
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.brand}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Carbon-Neutral Delivery</span>
                <span style={{ color: 'var(--sage, #4ade80)', fontWeight: 700 }}>FREE</span>
              </div>
              <div className="totals-row final-total">
                <span>Total Due</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.2rem', padding: '0.8rem', background: 'rgba(143, 175, 143, 0.1)', borderRadius: '8px', border: '1px solid rgba(143, 175, 143, 0.3)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              🌱 <strong>Eco-Promise:</strong> 1 Tree planted with Eden Reforestation Projects for every order placed.
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Eco-Luxury Order Confirmation Receipt Modal */}
      {confirmedOrder && (
        <div 
          className="order-receipt-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="order-receipt-card"
            style={{
              background: 'var(--bg-surface, #ffffff)',
              color: 'var(--text-primary)',
              borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 36px)',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-default)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(143, 175, 143, 0.2)', border: '2px solid var(--sage, #4ade80)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage, #22c55e)', fontSize: '28px', marginBottom: '12px' }}>
                ✓
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Eco-Luxury Order Confirmed</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Thank you, {confirmedOrder.customer.firstName}! Your artisanal botanical formulation is being prepared.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle, #f8fafc)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-default)', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Reference</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: 'var(--brand-primary, #b45309)' }}>#{confirmedOrder.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Delivery Address:</span>
                <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{confirmedOrder.customer.address}, {confirmedOrder.customer.city} {confirmedOrder.customer.postalCode}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Payment Method:</span>
                <strong style={{ textTransform: 'uppercase' }}>{confirmedOrder.customer.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Estimated Arrival:</span>
                <strong style={{ color: 'var(--sage, #22c55e)' }}>{confirmedOrder.deliveryTime}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Itemized Manifest</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {confirmedOrder.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                    <span>{item.qty}x {item.name}</span>
                    <strong>₹{(item.price * item.qty).toFixed(2)}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', paddingTop: '8px', marginTop: '4px', fontSize: '1.05rem', fontWeight: 700 }}>
                  <span>Total Amount Paid</span>
                  <span style={{ color: 'var(--brand-primary)' }}>₹{confirmedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, minHeight: '46px' }}
                onClick={() => {
                  navigate(`/track-order?orderId=${confirmedOrder.id}`);
                }}
              >
                Track Shipment Live →
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, minHeight: '46px' }}
                onClick={() => {
                  setConfirmedOrder(null);
                  navigate('/products');
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}