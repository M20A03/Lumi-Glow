export default function Sustainability() {
  return (
    <>
      <section className="about-hero" style={{ minHeight: '50vh', padding: '4rem 1.5rem', gridTemplateColumns: '1fr', textAlign: 'center', background: 'url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1600&q=80) center/cover no-repeat' }}>
        <div className="reveal" style={{ background: 'rgba(255,248,240,0.92)', padding: '4rem 3rem', borderRadius: 'var(--radius-lg)', maxWidth: '900px', margin: '0 auto', backdropFilter: 'blur(10px)' }}>
          <span className="section-label">Our Commitment</span>
          <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>Beauty without<br/>Costing the Earth</h1>
          <p style={{ maxWidth: 700, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-mid)' }}>
            The beauty industry produces 120 billion units of packaging every year, most of which ends up in landfills. At LumiGlow, we refuse to contribute to this crisis. From regenerative farming of our raw botanicals to our closed-loop packaging system, discover how we are working tirelessly to become the world's first fully carbon-negative premium skincare brand by 2030.
          </p>
        </div>
      </section>

      <section className="section-padding container">
        <div className="reveal-scale" style={{ maxWidth: 800, margin: '0 auto 6rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>A Note From Our Founders</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-mid)', marginBottom: '1.5rem' }}>
            When we started LumiGlow in 2019, we noticed a massive disconnect in the skincare industry. Brands were promising "clean beauty" while wrapping their formulas in layers of unrecyclable acrylic plastics and sourcing ingredients from supply chains that ravaged local ecosystems.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-mid)', marginBottom: '2rem' }}>
            We believed there had to be a better way. We spent our first two years exclusively researching sustainable materials and auditing supply chains before we even bottled exactly one serum. Today, every decision we make—from using sugarcane-derived squalane instead of shark liver, to our 100% wind-powered manufacturing facility—is rooted in profound respect for the planet. Perfection is impossible, but relentless progress is our daily reality.
          </p>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--accent-dark)' }}>Dr. Maya Chen & Lila Torres</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '2rem' }}>
          
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '3.5rem 2.5rem', background: 'var(--secondary)', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>♻️</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>100% Recyclable Packaging</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
                By 2025, every single LumiGlow product will be housed solely in glass, aluminum, or Post-Consumer Recycled (PCR) plastics. We have already completely eliminated single-use virgin plastics from our supply chain. Furthermore, all our shipping boxes are made from 100% recycled paper and printed exclusively with soy-based inks.
              </p>
            </div>
          </div>

          <div className="reveal delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '3.5rem 2.5rem', background: 'var(--sage-light)', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🐰</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Leaping Bunny Certified</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
                Cruelty-free isn't just a marketing buzzword for us—it is a core founding philosophy. We have never, and will never, test our formulas on animals. We do not pay any third parties to test on our behalf, and we strictly refuse to sell our products in any retail countries where animal testing is mandated by law.
              </p>
            </div>
          </div>

          <div className="reveal delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '3.5rem 2.5rem', background: '#E8C4A040', borderRadius: 'var(--radius-lg)', height: '100%', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌱</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Fair-Trade Sourcing</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
                Our botanicals are harvested using regenerative farming practices that actively restore soil health and local biodiversity. We partner directly with fair-trade cooperatives in 12 countries—seeking out organically grown Shea Butter from Northern Ghana, Squalane vertically sourced from Brazilian sugarcane, and pure Rose extract from Bulgaria.
              </p>
            </div>
          </div>

        </div>

        <div className="reveal-scale" style={{ margin: '6rem auto 2rem', background: 'var(--white)', padding: '4rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="section-label">Looking Forward</span>
            <h2 style={{ marginBottom: '1.5rem' }}>Our 2030 Carbon Negative Goal</h2>
            <p style={{ marginBottom: '1.5rem' }}>We are officially carbon neutral as of 2023, offsetting 100% of our emissions through certified reforestation projects. But neutral isn't enough.</p>
            <p style={{ marginBottom: '1.5rem' }}>By 2030, LumiGlow aims to become completely carbon negative, removing more carbon from the atmosphere than we emit across our entire operation. This involves shifting our labs to 100% renewable energy and launching our closed-loop refill system.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', fontWeight: 500 }}>
              <li>✓ 100% Renewable Energy in HQ</li>
              <li>✓ 500,000 Trees Planted to Date</li>
              <li>✓ 0% Waste to Landfill Policy</li>
            </ul>
          </div>
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-mid)' }}>
            <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80" alt="Sustainable farming" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>
    </>
  );
}
