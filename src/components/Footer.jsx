import { Link } from 'react-router-dom';

export default function Footer() {
  const shopLinks  = [
    ['All Products', '/products'], ['Best Sellers', '/products'], ['Bundles', '/products'],
    ['New Arrivals', '/products'], ['Limited Drops', '/products'],
  ];
  const companyLinks = [
    ['About Us', '/about'], ['Sustainability', '/sustainability'],
    ['Contact Us', '/contact'], ['Track Order', '/track-order']
  ];
  const helpLinks = [
    ['FAQ', '/faq'], ['Shipping & Returns', '/faq'],
    ['Privacy Policy', '/'], ['Terms of Service', '/'],
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo-text">Lumi<span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Glow</span></Link>
          <p>Advanced ecommerce design with premium motion, AI concierge support, and conversion-focused UX.</p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Shop</h5>
          <ul>{shopLinks.map(([l,h]) => <li key={l}><Link to={h}>{l}</Link></li>)}</ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>{companyLinks.map(([l,h]) => <li key={l}><Link to={h}>{l}</Link></li>)}</ul>
        </div>
        <div className="footer-col">
          <h5>Help</h5>
          <ul>{helpLinks.map(([l,h]) => <li key={l}><Link to={h}>{l}</Link></li>)}</ul>
        </div>
        <div className="footer-newsletter">
          <h5>Stay in the loop</h5>
          <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', lineHeight: 1.5 }}>Subscribe for updates, new releases, and exclusive deals.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">→</button>
          </form>
          <div className="contact-info" style={{ marginTop: '2rem' }}>
            <h5>Contact Info</h5>
            <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Email: support@lumiglow.com<br/>
              Phone: +1 (800) 123-4567<br/>
              Mon - Fri, 9am - 6pm EST
            </p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>© 2026 Lumi Glow. All rights reserved.</span>
          <button 
            onClick={() => {
              localStorage.removeItem('cookies-accepted');
              localStorage.removeItem('cookies-choice');
              window.location.reload();
            }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.9rem',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'rgba(255,255,255,0.8)'; }}
          >
            Reset Cookies
          </button>
        </div>
        <div className="footer-payments">
          <span style={{ marginRight: '0.5rem', fontSize: '0.72rem' }}>We accept:</span>
          {['VISA','MC','AMEX','PayPal','Apple Pay'].map(p => (
            <span key={p} className="payment-badge">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
