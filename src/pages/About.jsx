import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

function BenefitCard({ icon, title, text, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="benefit-card reveal" style={{ transitionDelay: `${delay}s` }}>
      <div className="benefit-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function MilestoneItem({ m, i }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="milestone-item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
      <div className="milestone-year">{m.year}</div>
      <div><h4>{m.title}</h4><p style={{ marginTop: '0.3rem' }}>{m.desc}</p></div>
    </div>
  );
}

function TeamMemberCard({ m, i }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="team-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
      <div className="team-avatar" style={{ background: m.color || undefined }}>{m.initial}</div>
      <h4>{m.name}</h4>
      <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0.3rem 0 0.75rem' }}>{m.role}</p>
      <p style={{ fontSize: '0.83rem' }}>{m.bio}</p>
    </div>
  );
}

export default function About() {
  const heroLeft  = useReveal();
  const heroRight = useReveal();
  const sustLeft  = useReveal();
  const sustRight = useReveal();

  const milestones = [
    { year: '2019', title: 'Founded in San Francisco', desc: 'Dr. Maya Chen and Lila Torres launch LumiGlow with 3 products and a dream for clean beauty.' },
    { year: '2020', title: 'First 10,000 Customers',  desc: 'The Vitamin C Serum goes viral on social media, reaching 10,000 customers within 6 months.' },
    { year: '2022', title: 'PETA Certified',           desc: 'Leaping Bunny certification received and range expands to 10 products.' },
    { year: '2023', title: 'Sustainable Packaging',   desc: '100% of packaging transitions to recycled or recyclable materials. 100,000th tree planted.' },
    { year: '2025', title: '50,000+ Customers',        desc: 'LumiGlow reaches 50,000 loyal customers, 12,400+ five-star reviews, and launches in 15 countries.' },
  ];

  const team = [
    { initial: 'M', name: 'Dr. Maya Chen',  role: 'Co-Founder & CEO',         bio: 'PhD Biochemistry from Stanford. 15+ years in skincare formulation at leading dermatology labs.' },
    { initial: 'L', name: 'Lila Torres',    role: 'Co-Founder & Botanist',    bio: 'Certified herbalist who sources rare plant actives from sustainable farms across 12 countries.', color: 'linear-gradient(135deg,var(--sage-light),var(--sage))' },
    { initial: 'J', name: 'Dr. James Park', role: 'Head Dermatologist',        bio: 'Board-certified dermatologist who validates every formula and leads our clinical trials.', color: 'linear-gradient(135deg,#E8D5C4,#C9956A)' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="about-hero">
        <div className="reveal-left" ref={heroLeft}>
          <span className="section-label">Our Story</span>
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', marginBottom: '1.5rem' }}>
            Born From a <em style={{ color: 'var(--accent-dark)' }}>Passion</em> for Clean Beauty
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            LumiGlow was founded in 2019 by Dr. Maya Chen and botanist Lila Torres, frustrated by a skincare market full of empty promises and hidden toxins. They set out to create formulas that would actually work, using only ingredients they could trust.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
            Today, LumiGlow has helped over 50,000 people discover their skin's natural radiance, without compromising on ethics, sustainability, or efficacy.
          </p>
          <Link to="/products" className="btn btn-primary">Explore Our Range</Link>
        </div>
        <div className="reveal-right" ref={heroRight}>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lift)' }}>
            <img src="/images/hero.jpg" alt="LumiGlow founders" style={{ width: '100%', height: 460, objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" style={{ background: 'var(--secondary)' }}>
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">What We Stand For</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="benefits-grid">
            <BenefitCard icon="🔬" title="Science First"         delay={0}   text="Every ingredient is chosen based on peer-reviewed research. We work with leading dermatologists to validate every formula." />
            <BenefitCard icon="🌱" title="Planet Positive"       delay={0.1} text="Committed to net-zero carbon by 2026. Our packaging is 90% recycled, refillable where possible, never tested on animals." />
            <BenefitCard icon="🤝" title="Radical Transparency"  delay={0.2} text="We publish every ingredient, every supplier, and every test result. Because you deserve to know exactly what is on your skin." />
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="section-padding container" id="sustainability">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="reveal-left" ref={sustLeft}>
            <span className="section-label">Sustainability</span>
            <h2>Our Green Promise</h2>
            <p style={{ marginTop: '0.75rem', marginBottom: '2rem' }}>Good skincare doesn't have to cost the earth. We're committed to reducing our environmental footprint at every stage.</p>
            <div className="highlight-features" style={{ padding: 0 }}>
              {[
                { icon: '♻️', title: '90% Recycled Packaging',   desc: 'All primary packaging is made from PCR plastic or glass.' },
                { icon: '🌳', title: 'Tree Planted Per Order',    desc: 'Over 250,000 trees planted since 2021 via our reforestation partner.' },
                { icon: '⚡', title: '100% Renewable Energy',     desc: 'Our manufacturing facility runs entirely on solar and wind energy.' },
              ].map(f => (
                <div key={f.title} className="highlight-feature" style={{ background: 'var(--secondary)', borderColor: 'var(--border)' }}>
                  <span className="highlight-feature-icon">{f.icon}</span>
                  <div><h4 style={{ color: 'var(--text-dark)' }}>{f.title}</h4><p style={{ color: 'var(--text-mid)' }}>{f.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-right" ref={sustRight}>
            <img src="/images/sustainability.jpg" alt="Sustainable packaging" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-mid)', width: '100%', height: 420, objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding" style={{ background: 'var(--secondary)' }}>
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Our Journey</span>
            <h2>Milestones & Growth</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 700, margin: '0 auto' }}>
            {milestones.map((m, i) => <MilestoneItem key={m.year} m={m} i={i} />)}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding container">
        <div className="section-header centered">
          <span className="section-label">The People</span>
          <h2>Meet Our Team</h2>
          <p>A passionate team of scientists, formulators, and skin-lovers dedicated to your glow journey.</p>
        </div>
        <div className="team-grid">
          {team.map((m, i) => <TeamMemberCard key={m.name} m={m} i={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="newsletter-section">
        <div className="newsletter-inner">
          <span className="section-label" style={{ display: 'block' }}>Ready to Glow?</span>
          <h2>Start Your Skin Journey Today</h2>
          <p>Join 50,000+ customers who have transformed their skin with LumiGlow.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link to="/products" className="btn btn-primary">Shop All Products</Link>
            <Link to="/contact" className="btn btn-outline">Get a Free Consultation</Link>
          </div>
        </div>
      </section>
    </>
  );
}
