import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { CURRENCY_CONFIG } from '../router/guards';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const { totalQty, setCartOpen, currency, setCurrency } = useCart();
  const { wishlist } = useWishlist();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobile] = useState(false);
  const [searchOpen, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [marqueePaused, setMarqueePaused] = useState(false);

  const searchDialogRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTriggerRef = useRef(null);
  const prevSearchFocusRef = useRef(null);
  const mobileNavRef = useRef(null);
  const prevMobileFocusRef = useRef(null);
  const touchStartXRef = useRef(null);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Escape)
  useKeyboardShortcut({
    onSearch: () => setSearch(true),
    onEscape: () => {
      setSearch(false);
      setMobile(false);
    }
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  // Focus trap for Search Overlay
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

  // Focus trap for Mobile Navigation
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearch(false);
      setSearchQuery('');
    }
  };

  // Mobile swipe-to-dismiss handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    // If swiped right by more than 70px, close drawer
    if (deltaX > 70) {
      setMobile(false);
    }
    touchStartXRef.current = null;
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
          {marqueePaused ? 'Resume' : 'Pause'}
        </button>
        <div className="announcement-viewport">
          <div id="announcement-marquee" className={`marquee-track${marqueePaused ? ' paused' : ''}`} aria-live="off">
            <span>Clean Clinical Botanical Formulations <span className="dot">•</span> Free Express Shipping on orders over $50</span>
            <span>Code <strong>GLOW15</strong> for 15% off first order <span className="dot">•</span> 30-Day Happiness Guarantee</span>
            <span>Clean Clinical Botanical Formulations <span className="dot">•</span> Free Express Shipping on orders over $50</span>
            <span>Code <strong>GLOW15</strong> for 15% off first order <span className="dot">•</span> 30-Day Happiness Guarantee</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <nav className="nav-inner container" aria-label="Main Navigation">
          {/* Logo */}
          <Link to="/" className="logo" aria-label="LumiGlow Home">
            <img src="/images/logo.png" alt="" width="36" height="36" loading="eager" />
            <span className="logo-text">Lumi<span>Glow</span></span>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links" role="menubar">
            {navLinks.map(l => (
              <li key={l.to} role="none">
                <NavLink to={l.to} end={l.to==='/'} role="menuitem" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {/* Currency Selector */}
            <div className="currency-selector-wrap" style={{ marginRight: '0.25rem' }}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Select Currency"
                className="currency-select"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  minHeight: '36px',
                }}
              >
                {Object.entries(CURRENCY_CONFIG).map(([code, cfg]) => (
                  <option key={code} value={code} style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' }}>
                    {code} ({cfg.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Dark / Light Theme Toggle Button */}
            <button
              type="button"
              className="nav-icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {isDark ? (
                /* Sun Icon */
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                /* Moon Icon */
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* Search Button with Cmd+K badge on desktop */}
            <button
              ref={searchTriggerRef}
              className="nav-icon-btn"
              onClick={openSearch}
              aria-label="Search formulas (Press Cmd+K)"
              title="Search (Cmd+K)"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="nav-icon-btn"
              aria-label="Wishlist"
              style={{ position: 'relative', textDecoration: 'none', color: 'inherit', minWidth: '44px', minHeight: '44px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span className={`cart-badge${wishlist.length > 0 ? ' show' : ''}`}>{wishlist.length}</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              className="nav-icon-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              style={{ position: 'relative', minWidth: '44px', minHeight: '44px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span className={`cart-badge${totalQty > 0 ? ' show' : ''}`}>{totalQty}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className={`hamburger${mobileOpen ? ' open' : ''}`}
              onClick={(event) => {
                if (!mobileOpen) prevMobileFocusRef.current = event.currentTarget;
                setMobile(!mobileOpen);
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-dialog"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Nav Overlay & Drawer */}
      <div
        className={`mobile-nav-overlay${mobileOpen ? ' open' : ''}`}
        style={{ display: mobileOpen ? 'block' : 'none' }}
        onClick={() => setMobile(false)}
      />
      <nav
        ref={mobileNavRef}
        id="mobile-nav-dialog"
        className={`mobile-nav${mobileOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        aria-hidden={!mobileOpen}
        tabIndex={-1}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span className="logo-text" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
            Lumi<span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Glow</span>
          </span>
          <button
            type="button"
            onClick={() => setMobile(false)}
            aria-label="Close mobile menu"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              fontSize: '1.4rem',
              color: 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none' }}>
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} className="mobile-nav-link" onClick={() => setMobile(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/wishlist" className="mobile-nav-link" onClick={() => setMobile(false)}>
              ♡ My Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
          </li>
        </ul>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
            Use code <strong style={{ color: 'var(--color-accent)' }}>GLOW15</strong> for 15% off
          </p>
          <Link
            to="/products"
            className="btn btn-primary"
            style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}
            onClick={() => setMobile(false)}
          >
            Explore Catalog
          </Link>
        </div>
      </nav>

      {/* Search Overlay with Cmd+K support */}
      <div
        ref={searchDialogRef}
        className={`search-overlay${searchOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
        aria-hidden={!searchOpen}
        tabIndex={-1}
      >
        <button
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            minWidth: '44px',
            minHeight: '44px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            background: 'none',
            border: 'none'
          }}
          onClick={() => setSearch(false)}
          aria-label="Close search"
        >
          ✕
        </button>
        <form onSubmit={handleSearchSubmit} className="search-box" style={{ maxWidth: '600px', width: '90%' }}>
          <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas, ingredients, or skin concerns..."
            aria-label="Search products"
          />
        </form>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>Popular Searches:</span>
          {['Vitamin C Serum', 'Hydrating Moisturizer', 'Ceramides', 'Night Mask', 'Bundles'].map(t => (
            <Link
              key={t}
              to={`/products?q=${encodeURIComponent(t)}`}
              onClick={() => setSearch(false)}
              style={{
                fontSize: '0.8125rem',
                padding: '0.4rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                minHeight: '36px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
