import { useState } from 'react';

const faqs = [
  { category: 'Products & Ingredients', q: "Are your products truly 100% natural?", a: "We believe in the power of nature, backed by science. Our products are 98-100% naturally derived. For the remaining 0-2%, we use clean, lab-synthesized ingredients strictly to ensure the formula's stability, safety, and shelf-life. We never use parabens, sulfates, silicones, or synthetic fragrances." },
  { category: 'Products & Ingredients', q: "Are LumiGlow products cruelty-free and vegan?", a: "Yes! We are immensely proud to be Leaping Bunny certified and PETA certified cruelty-free. Every single product we create is 100% vegan and never tested on animals at any stage of production." },
  { category: 'Products & Ingredients', q: "Can I use the Vitamin C Serum if I have sensitive skin?", a: "Our Vitamin C Serum is formulated with soothing botanicals like Aloe Vera to minimize irritation. However, 20% L-Ascorbic Acid is highly potent and can occasionally cause tingling. If you have very sensitive skin, we recommend patch testing first or using it every other day mixed with our Rose Quartz Moisturizer to build tolerance." },
  { category: 'Products & Ingredients', q: "How long until I see results?", a: "Skincare is a marathon, not a sprint! While hydration benefits from our moisturizers are immediate, active ingredients like Vitamin C, Niacinamide, and Retinol typically take 4-6 weeks of consistent use to show visible improvements in skin tone, texture, and firmness. Cellular turnover takes 28 days." },
  { category: 'Products & Ingredients', q: "Are your products safe during pregnancy?", a: "While the vast majority of our products are safe for pregnancy and nursing, we strongly recommend avoiding the 'Retinol Renewal Eye Cream' as retinol is generally not advised during pregnancy. Please always consult with your doctor before starting any new skincare routine while pregnant." },
  
  { category: 'Orders & Shipping', q: "Do you ship internationally?", a: "We currently ship to the US, Canada, UK, Australia, New Zealand, and all countries within the European Union. We are actively working on expanding our logistics to South America and Asia by late 2026." },
  { category: 'Orders & Shipping', q: "How much does shipping cost?", a: "We offer Free Standard Shipping (3-5 business days) on all orders over ₹3000 within the country. For orders below ₹3000, standard shipping is a flat rate of ₹250. Expedited 2-Day Shipping is available at checkout for ₹600." },
  { category: 'Orders & Shipping', q: "How can I track my order?", a: "Once your order is successfully packed and passed to the courier, we will email you a shipment confirmation with a tracking number. You can also track your order directly on our site at any time using our 'Track Order' page." },
  { category: 'Orders & Shipping', q: "My package says delivered, but I can't find it.", a: "Sometimes carriers mark packages as delivered prematurely. Please wait 48 hours to see if it turns up. Check thoroughly around your property and with neighbors. If it has still not arrived after 48 hours, please contact us at support@lumiglow.com so we can file a claim and send a replacement." },
  
  { category: 'Returns & Exchanges', q: "What is your return policy?", a: "We want you to love your LumiGlow ritual! If you're not completely satisfied with your purchase, you can return any gently used or unopened item within 30 days of the delivery date for a full refund to your original payment method." },
  { category: 'Returns & Exchanges', q: "How do I initiate a return?", a: "To start a return, email returns@lumiglow.com with your order number and the items you wish to return. We will provide you with a prepaid return shipping label. Please note that original shipping costs are non-refundable." },
  { category: 'Returns & Exchanges', q: "Do you offer exchanges?", a: "Due to the nature of our inventory, we do not offer direct exchanges. If you matched with the wrong shade or product, please return the original item for a refund and place a new order for the correct item." }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Products & Ingredients', 'Orders & Shipping', 'Returns & Exchanges'];
  
  const filteredFaqs = faqs.filter(f => activeCategory === 'All' || f.category === activeCategory);

  return (
    <>
      <section className="about-hero" style={{ minHeight: '40vh', padding: '4rem 1.5rem', gridTemplateColumns: '1fr', textAlign: 'center', background: 'url(https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1600&q=80) center/cover no-repeat' }}>
        <div className="reveal" style={{ background: 'rgba(255,248,240,0.92)', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', maxWidth: '800px', margin: '0 auto', backdropFilter: 'blur(10px)' }}>
          <span className="section-label">Support</span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
          <p style={{ maxWidth: 500, margin: '0 auto' }}>Find answers to common questions about our products, ingredients, orders, and returns.</p>
        </div>
      </section>

      <section className="section-padding container" style={{ maxWidth: 1000 }}>
        
        <div className="reveal" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`chip ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="reveal-scale" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
          {filteredFaqs.map((f, i) => (
            <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`} style={{ background: 'var(--white)', boxShadow: 'var(--shadow-soft)' }}>
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                aria-expanded={openIdx === i}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                style={{ fontSize: '1.05rem', padding: '1.5rem', width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
              >
                {f.q}
                <span className="faq-icon" style={{ background: 'var(--secondary)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark)' }}>+</span>
              </button>
              <div className="faq-a" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`}>
                <p style={{ fontSize: '0.95rem' }}>{f.a}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{f.category}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '6rem', background: 'var(--secondary)', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }} className="reveal">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
          <h2 style={{ marginBottom: '1rem' }}>Still have questions?</h2>
          <p style={{ marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem', color: 'var(--text-mid)' }}>If you couldn't find the answer you were looking for, our customer service team is happy to help.</p>
          <a href="/contact" className="btn btn-primary">Contact Our Experts</a>
        </div>
      </section>
    </>
  );
}
