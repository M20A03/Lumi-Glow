import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import EmailPopup from './components/EmailPopup';
import CookieBanner from './components/CookieBanner';
import BackToTop from './components/BackToTop';
import ChatBot from './components/ChatBot';
import GlobalFX from './components/GlobalFX';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import TrackOrder from './pages/TrackOrder';
import Sustainability from './pages/Sustainability';
import Checkout from './pages/Checkout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function GlobalScrollObserver() {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    const revealSelector = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-glow';

    const shouldRevealImmediately = (el) => {
      const rect = el.getBoundingClientRect();
      // If the element is already above (or within) the viewport on attach, reveal it now
      // so restored scroll positions do not leave large blank hidden sections.
      return rect.top <= window.innerHeight * 0.92;
    };

    // Delay slightly to allow React to mount the DOM nodes after route change
    const timeout = setTimeout(() => {
      document.querySelectorAll(revealSelector).forEach(el => {
        if (el.classList.contains('visible')) return;
        if (shouldRevealImmediately(el)) {
          el.classList.add('visible');
          return;
        }
        observer.observe(el);
      });
    }, 150);

    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, [pathname]);
  return null;
}

function Layout({ children }) {
  return (
    <>
      <GlobalFX />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="site-content">{children}</main>
      <Footer />
      <CartDrawer />
      <Toast />
      <EmailPopup />
      <CookieBanner />
      <BackToTop />
      <ChatBot />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <ScrollToTop />
          <GlobalScrollObserver />
          <Layout>
            <Routes>
              <Route path="/"               element={<Home />}          />
              <Route path="/products"       element={<Products />}      />
              <Route path="/products/:id"   element={<ProductDetail />} />
              <Route path="/wishlist"       element={<Wishlist />}      />
              <Route path="/about"          element={<About />}         />
              <Route path="/contact"        element={<Contact />}       />
              <Route path="/faq"            element={<FAQ />}           />
              <Route path="/track-order"    element={<TrackOrder />}    />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/checkout"       element={<Checkout />}      />
            </Routes>
          </Layout>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
