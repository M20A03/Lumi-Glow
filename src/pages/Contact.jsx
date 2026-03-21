import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Phase2.css';

const inquiryTypes = [
  'Order Status/Issue',
  'Routine Advice',
  'Product Question',
  'Returns & Exchanges',
  'Partnership',
  'Other',
];

export default function Contact() {
  const { showToast } = useCart();
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    showToast('Message received. Our team will reply within 24 hours.');
    event.target.reset();
    setSelectedTopic('');
  };

  const openConcierge = () => {
    window.dispatchEvent(new CustomEvent('open-dh-concierge'));
  };

  return (
    <div className="p2-contact-page">
      <section className="p2-contact-hero">
        <div className="container p2-contact-hero-inner">
          <p className="section-label">Premium Support</p>
          <h1>Talk to our team or launch AI assistance instantly</h1>
          <p>
            Reach us for order questions, product guidance, partnerships, or custom support requests.
          </p>
          <button type="button" className="btn btn-outline" onClick={openConcierge}>Open AI Concierge</button>
        </div>
      </section>

      <section className="section-padding container p2-contact-grid-wrap">
        <aside className="p2-contact-side reveal-left">
          <h2>Need help right now?</h2>
          <p>Choose your path and we will route your request to the fastest support flow.</p>

          <div className="p2-contact-cards">
            <article>
              <h4>Customer Support</h4>
              <p>hello@lumiglow.com</p>
              <span>Response target: within 24h</span>
            </article>
            <article>
              <h4>Phone Support</h4>
              <p>+1 (800) 555-HERO</p>
              <span>Mon to Sat, 9am to 6pm</span>
            </article>
            <article>
              <h4>Partnership Desk</h4>
              <p>partners@lumiglow.com</p>
              <span>Collabs, press, and wholesale</span>
            </article>
          </div>
        </aside>

        <div className="p2-contact-form-card reveal-right">
          <h3>Send a Message</h3>
          <p>Complete this form and we will respond with a clear next step.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="p2-contact-row">
              <input type="text" aria-label="First Name" placeholder="First Name" required />
              <input type="text" aria-label="Last Name" placeholder="Last Name" required />
            </div>
            <input type="email" aria-label="Email Address" placeholder="Email Address" required />

            <select aria-label="Inquiry type" required value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}>
              <option value="">Choose inquiry type</option>
              {inquiryTypes.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>

            <textarea aria-label="How can we help you today?" placeholder="How can we help you today?" required />

            <div className="p2-contact-form-actions">
              <button type="submit" className="btn btn-primary">Send Message</button>
              <button type="button" className="btn btn-ghost" onClick={openConcierge}>Use AI Instead</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
