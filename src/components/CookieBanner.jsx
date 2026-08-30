import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [hasResponded, setHasResponded] = useState(() => {
    const existingConsent = localStorage.getItem('cookies-choice') || localStorage.getItem('cookies-accepted');
    return Boolean(existingConsent);
  });

  useEffect(() => {
    if (!hasResponded) {
      // Pops up immediately on opening the website
      const t = setTimeout(() => setShow(true), 200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [hasResponded]);

  const accept = () => {
    localStorage.setItem('cookies-accepted', '1');
    localStorage.setItem('cookies-choice', 'accepted');
    setShow(false);
    setTimeout(() => setHasResponded(true), 400);
  };

  const decline = () => {
    localStorage.setItem('cookies-choice', 'declined');
    setShow(false);
    setTimeout(() => setHasResponded(true), 400);
  };

  if (hasResponded) return null;

  return (
    <div className={`cookie-overlay ${show ? 'show' : ''}`}>
      <div className="cookie-banner-popup">
        <div className="cookie-icon" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🍪</div>
        <h3>Cookie Preferences</h3>
        <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.</p>
        <div className="cookie-actions">
          <button className="btn btn-primary" style={{ padding: '0.9rem 1.5rem', flex: 1, fontSize: '1rem' }} onClick={accept}>Accept</button>
          <button className="btn btn-ghost" style={{ padding: '0.9rem 1.5rem', flex: 1, fontSize: '1rem' }} onClick={decline}>Decline</button>
        </div>
      </div>
    </div>
  );
}
