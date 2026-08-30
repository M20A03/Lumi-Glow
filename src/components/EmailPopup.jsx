import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function EmailPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { showToast } = useCart();
  const dialogRef = useRef(null);
  const emailInputRef = useRef(null);
  const prevFocusRef = useRef(null);

  useEffect(() => {
    if (!sessionStorage.getItem('lumiglow-popup-shown') && !localStorage.getItem('lumiglow-member-email')) {
      const t = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem('lumiglow-popup-shown', '1');
      }, 3500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    prevFocusRef.current = document.activeElement;

    const focusables = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
    const first = emailInputRef.current || focusables[0] || dialog;
    const last = focusables[focusables.length - 1] || first;

    first.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShow(false);
        showToast('You are continuing as guest. You can unlock GLOW15 anytime from this popup.');
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
  }, [show, showToast]);

  const continueWithEmail = () => {
    if (!email || !email.includes('@')) { showToast('Please enter a valid email!'); return; }
    localStorage.setItem('lumiglow-member-email', email.trim());
    if (name.trim()) localStorage.setItem('lumiglow-member-name', name.trim());
    setShow(false);
    showToast('Welcome to Lumi Glow. Code GLOW15 has been activated for your first order.');
  };

  const continueAsGuest = () => {
    setShow(false);
    showToast('You are continuing as guest. You can unlock GLOW15 anytime from this popup.');
  };

  return (
    <div className={`email-popup-overlay${show ? ' show' : ''}`} aria-hidden={!show}>
      <div ref={dialogRef} className="email-popup" role="dialog" aria-modal="true" aria-labelledby="email-popup-title" aria-describedby="email-popup-desc" tabIndex={-1}>
        <button className="popup-close" onClick={continueAsGuest} aria-label="Close popup">✕</button>
        <div className="popup-img">🌸</div>
        <div className="popup-content">
          <div className="popup-offer">Lumi Glow</div>
          <h3 id="email-popup-title">Continue With Email + Get 15% Off</h3>
          <p id="email-popup-desc">Log in with your email to continue and receive weekly offers, early access drops, and code GLOW15.</p>
          <input
            type="text"
            className="popup-input"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            ref={emailInputRef}
            type="email"
            className="popup-input"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={continueWithEmail}>
            Continue With Email
          </button>
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} onClick={continueAsGuest}>
            Continue As Guest
          </button>
          <button type="button" className="popup-no" onClick={continueAsGuest}>No thanks, continue without login</button>
        </div>
      </div>
    </div>
  );
}
