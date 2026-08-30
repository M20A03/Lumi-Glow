import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    city: '',
    postalCode: '',
    country: 'US',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate real gateway processing time
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      showToast('Payment successful! Your order is being processed.');
      navigate('/');
    }, 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="checkout-empty">
        <div className="container" style={{ textAlign: 'center', padding: '10vh 0' }}>
          <h2>Your cart is empty</h2>
          <p>Please add some products to your cart before checking out.</p>
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
            <h1>LumiGlow Checkout</h1>
            <p className="secure-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secure 256-bit SSL Encryption
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
              <h2>Shipping Address</h2>
              <div className="checkout-grid">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input required type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input required type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="address">Street Address</label>
                <input required type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="checkout-grid">
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input required type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input required type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                </div>
              </div>
            </section>

            <section className="form-section payment-section">
              <h2>Payment Details</h2>
              <div className="payment-gateways">
                <div className="payment-tab active">
                  <span className="radio-circle"></span>
                  Credit Card
                  <div className="cc-icons">
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" width="30"/>
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" width="30"/>
                    <img src="https://cdn-icons-png.flaticon.com/128/174/174884.png" alt="Amex" width="30"/>
                  </div>
                </div>
              </div>
              <div className="cc-box">
                <div className="input-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <div className="cc-input-wrap">
                    <svg viewBox="0 0 24 24" width="20" stroke="#a07040" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    <input required type="text" id="cardNumber" name="cardNumber" maxLength="19" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} />
                  </div>
                </div>
                <div className="checkout-grid">
                  <div className="input-group">
                    <label htmlFor="expiry">Expiry Date (MM/YY)</label>
                    <input required type="text" id="expiry" name="expiry" maxLength="5" placeholder="MM/YY" value={formData.expiry} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="cvc">CVC</label>
                    <div className="cc-input-wrap">
                      <svg viewBox="0 0 24 24" width="20" stroke="#a07040" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      <input required type="text" id="cvc" name="cvc" maxLength="4" placeholder="123" value={formData.cvc} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <button type="submit" className="btn btn-primary checkout-submit-btn" disabled={isProcessing}>
              {isProcessing ? (
                <span className="spinner">Processing Payment...</span>
              ) : (
                `Pay ₹${totalPrice.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        <div className="checkout-right reveal-right">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
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
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="totals-row">
                <span>Taxes</span>
                <span>Calculated at next step</span>
              </div>
              <div className="divider"></div>
              <div className="totals-row grand-total">
                <span>Total</span>
                <span>
                  <span className="currency">INR</span> ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}