import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const { totalQty, setCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [searchOpen, setSearch]   = useState(false);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const searchDialogRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTriggerRef = useRef(null);
  const prevSearchFocusRef = useRef(null);
  const mobileNavRef = useRef(null);
  const prevMobileFocusRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const dialog = searchDialogRef.current;
    if (!dialog) return;

    const previousFocus = prevSearchFocusRef.current;
    const focusables = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
    const first = searchInputRef.current || focusables[0] || dialog;
    const last = focusables[focusables.length - 1] || first;

    first.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSearch(false);
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
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const dialog = mobileNavRef.current;
    if (!dialog) return;

    const previousFocus = prevMobileFocusRef.current;
    const focusables = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
    const first = focusables[0] || dialog;
    const last = focusables[focusables.length - 1] || first;

    first.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobile(false);
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
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [mobileOpen]);

  const openSearch = (event) => {
    prevSearchFocusRef.current = event.currentTarget;
    setSearch(true);
  };

  const navLinks = [
    { to: '/',               label: 'Home' },
    { to: '/products',       label: 'Products' },
    { to: '/about',          label: 'About' },
    { to: '/sustainability', label: 'Impact' },
    { to: '/track-order',    label: 'Track Order'},
    { to: '/faq',            label: 'FAQ' },
    { to: '/contact',        label: 'Contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <button
          type="button"
          className="announcement-toggle"
          onClick={() => setMarqueePaused((prev) => !prev)}
          aria-pressed={marqueePaused}
          aria-controls="announcement-marquee"
        >
          {marqueePaused ? 'Resume announcements' : 'Pause announcements'}
        </button>
        <div className="announcement-viewport">
          <div id="announcement-marquee" className={`marquee-track${marqueePaused ? ' paused' : ''}`} aria-live="off">
            <span>Lumi Glow Concierge Active <span className="dot">•</span> Use code <strong>GLOW15</strong> for first order savings</span>
            <span>Advanced interactions <span className="dot">•</span> Story-driven layout <span className="dot">•</span> Fast checkout path</span>
            <span>Lumi Glow Concierge Active <span className="dot">•</span> Use code <strong>GLOW15</strong> for first order savings</span>
            <span>Advanced interactions <span className="dot">•</span> Story-driven layout <span className="dot">•</span> Fast checkout path</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <nav className="nav-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Lumi Glow" />
            <span className="logo-text">Lumi<span>Glow</span></span>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to==='/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            <button ref={searchTriggerRef} className="nav-icon-btn" onClick={openSearch} aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist" style={{ position: 'relative', textDecoration: 'none', color: 'inherit' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span className={`cart-badge${wishlist.length > 0 ? ' show' : ''}`}>{wishlist.length}</span>
            </Link>
            <button className="nav-icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart" style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span className={`cart-badge${totalQty > 0 ? ' show' : ''}`}>{totalQty}</span>
            </button>
            <button
              className={`hamburger${mobileOpen ? ' open' : ''}`}
              onClick={(event) => {
                if (!mobileOpen) prevMobileFocusRef.current = event.currentTarget;
                setMobile(!mobileOpen);
              }}
              aria-label="Menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-dialog"
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay${mobileOpen ? ' open' : ''}`} style={{ display: mobileOpen ? 'block' : 'none' }} onClick={() => setMobile(false)} />
      <nav
        ref={mobileNavRef}
        id="mobile-nav-dialog"
        className={`mobile-nav${mobileOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        tabIndex={-1}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span className="logo-text" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
            Lumi<span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Glow</span>
          </span>
          <button type="button" onClick={() => setMobile(false)} aria-label="Close mobile menu" style={{ fontSize: '1.4rem', color: 'var(--text-mid)', cursor: 'pointer' }}>✕</button>
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} className="mobile-nav-link" onClick={() => setMobile(false)}>{l.label}</Link>
            </li>
          ))}
          <li>
            <Link to="/wishlist" className="mobile-nav-link" onClick={() => setMobile(false)}>
              ♡ My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
          </li>
        </ul>
        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
            Use code <strong style={{ color: 'var(--accent-dark)' }}>GLOW15</strong> for first order savings
          </p>
          <Link to="/products" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center' }} onClick={() => setMobile(false)}>
            Shop Now
          </Link>
        </div>
      </nav>

      {/* Search Overlay */}
      <div ref={searchDialogRef} className={`search-overlay${searchOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Site search" aria-hidden={!searchOpen} tabIndex={-1}>
        <button style={{ position: 'absolute', top: '2rem', right: '2rem', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-mid)' }} onClick={() => setSearch(false)} aria-label="Close search">✕</button>
        <div className="search-box">
          <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          <input ref={searchInputRef} type="text" placeholder="Search products..." aria-label="Search products" />
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Popular:</span>
          {['Best sellers', 'AI picks', 'Bundles', 'New drops'].map(t => (
            <Link key={t} to="/products" onClick={() => setSearch(false)} style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem', border: '1px solid var(--border)', borderRadius: '100px', color: 'var(--text-mid)' }}>
              {t}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
