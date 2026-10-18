import { useMemo, useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Phase2.css';

const categories = [
  { key: 'all', label: 'All Categories' },
  { key: 'serum', label: 'Serums' },
  { key: 'moisturizer', label: 'Moisturizers' },
  { key: 'treatment', label: 'Treatments' },
  { key: 'bundle', label: 'Bundles' },
];

const skinTypes = [
  { key: 'all', label: 'All Skin Types' },
  { key: 'dry', label: 'Dry Skin' },
  { key: 'oily', label: 'Oily / Blemish' },
  { key: 'sensitive', label: 'Sensitive' },
  { key: 'combination', label: 'Combination' },
];

const getProductSkinTypes = (p) => {
  if (p.skinTypes && Array.isArray(p.skinTypes)) return p.skinTypes;
  const text = `${p.name} ${(p.benefits || []).join(' ')} ${p.ingredients || ''} ${p.description || ''}`.toLowerCase();
  const types = ['all'];
  if (text.includes('hydrat') || text.includes('dry') || text.includes('ceramide') || text.includes('cream') || text.includes('rose') || text.includes('moisture')) {
    types.push('dry');
  }
  if (text.includes('clay') || text.includes('cleanser') || text.includes('toner') || text.includes('aha') || text.includes('bha') || text.includes('pore') || text.includes('oil control') || text.includes('mist')) {
    types.push('oily');
  }
  if (text.includes('sooth') || text.includes('sensitive') || text.includes('aloe') || text.includes('calm') || text.includes('gentle') || text.includes('spf') || text.includes('eye')) {
    types.push('sensitive');
  }
  if (text.includes('peptide') || text.includes('serum') || text.includes('essence') || text.includes('glow') || text.includes('bundle') || text.includes('all skin')) {
    types.push('combination');
  }
  return types;
};

export default function Products() {
  const [activeCategory, setActive] = useState('all');
  const [activeSkinType, setActiveSkinType] = useState('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Compute live skin type counts
  const skinTypeCounts = useMemo(() => {
    const counts = { all: products.length, dry: 0, oily: 0, sensitive: 0, combination: 0 };
    products.forEach((p) => {
      const types = getProductSkinTypes(p);
      if (types.includes('dry')) counts.dry++;
      if (types.includes('oily')) counts.oily++;
      if (types.includes('sensitive')) counts.sensitive++;
      if (types.includes('combination')) counts.combination++;
    });
    return counts;
  }, []);

  const suggestionChips = useMemo(() => {
    const chips = [];

    if (activeCategory === 'all' && activeSkinType === 'all' && !query.trim()) {
      chips.push({ label: 'Show high-rated picks', action: () => setSortBy('rating') });
      chips.push({ label: 'Only bundles', action: () => setActive('bundle') });
      chips.push({ label: 'Dry skin soothing', action: () => setActiveSkinType('dry') });
      chips.push({ label: 'Sensitive safe', action: () => setActiveSkinType('sensitive') });
      return chips;
    }

    if (activeCategory !== 'all') {
      chips.push({ label: 'Clear category filter', action: () => setActive('all') });
    }

    if (activeSkinType !== 'all') {
      chips.push({ label: 'Clear skin type filter', action: () => setActiveSkinType('all') });
    }

    if (query.trim()) {
      chips.push({ label: `Search "${query.trim()}" by rating`, action: () => setSortBy('rating') });
      chips.push({ label: 'Reset search', action: () => setQuery('') });
    }

    if (sortBy !== 'featured') {
      chips.push({ label: 'Back to featured', action: () => setSortBy('featured') });
    }

    return chips.slice(0, 4);
  }, [activeCategory, activeSkinType, query, sortBy]);

  const filtered = useMemo(() => {
    const byCategory = activeCategory === 'all'
      ? products
      : products.filter((item) => item.category === activeCategory);

    const bySkin = activeSkinType === 'all'
      ? byCategory
      : byCategory.filter((item) => getProductSkinTypes(item).includes(activeSkinType));

    const bySearch = bySkin.filter((item) => {
      const target = `${item.name} ${item.brand} ${item.category}`.toLowerCase();
      return target.includes(query.toLowerCase().trim());
    });

    const sorted = [...bySearch];
    if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'reviews') sorted.sort((a, b) => b.reviews - a.reviews);

    return sorted;
  }, [activeCategory, activeSkinType, query, sortBy]);

  const openConcierge = () => {
    window.dispatchEvent(new CustomEvent('open-dh-concierge'));
  };

  return (
    <div className="p2-products-page">
      <section className="p2-products-hero">
        <div className="container p2-products-hero-inner">
          <div>
            <p className="section-label">Botanical Science & High Efficacy</p>
            <h1>Advanced Skincare Discovery</h1>
            <p>
              Smart dermatologist-tested filters by skin concern, instant search, and real-time botanical concierge recommendations.
            </p>
            <div className="p2-products-hero-actions">
              <button type="button" className="btn btn-primary" onClick={openConcierge}>Ask AI for Skin Recommendations</button>
            </div>
          </div>
          <div className="p2-products-proof">
            <article>
              <strong>{products.length}</strong>
              <span>Eco-luxury formulations</span>
            </article>
            <article>
              <strong>4.9★</strong>
              <span>Verified customer rating</span>
            </article>
            <article>
              <strong>100%</strong>
              <span>Clean botanical certified</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding container p2-products-controls-wrap">
        <div className="p2-products-controls">
          {/* Category Filter Chips */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: '6px' }}>
              Filter by Category
            </span>
            <div className="filter-chips p2-filter-chips">
              {categories.map((category) => (
                <button
                  key={category.key}
                  className={`chip${activeCategory === category.key ? ' active' : ''}`}
                  onClick={() => setActive(category.key)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter Chips with Live Counter Badges */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--sage, #4ade80)', display: 'block', marginBottom: '6px' }}>
              Filter by Skin Type & Need
            </span>
            <div className="filter-chips p2-filter-chips" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {skinTypes.map((st) => (
                <button
                  key={st.key}
                  className={`chip${activeSkinType === st.key ? ' active' : ''}`}
                  onClick={() => setActiveSkinType(st.key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderColor: activeSkinType === st.key ? 'var(--sage)' : 'var(--glass-border)'
                  }}
                >
                  {st.label}
                  <span style={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    background: activeSkinType === st.key ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {skinTypeCounts[st.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p2-products-tools">
            <label className="p2-search-box" aria-label="Search products">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                type="search"
                placeholder="Search by ingredient, concern, or name..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <label className="p2-sort-box" aria-label="Sort products">
              <span>Sort:</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Featured Picks</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          {suggestionChips.length > 0 && (
            <div className="p2-intent-pills" aria-label="Quick filter recommendations">
              {suggestionChips.map((chip) => (
                <button key={chip.label} type="button" onClick={chip.action}>
                  {chip.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p2-products-status-row">
          <p>
            Showing <strong>{filtered.length}</strong> of {products.length} botanical products
            {activeSkinType !== 'all' && ` matching ${activeSkinType} skin`}
            {activeCategory !== 'all' && ` in ${activeCategory}`}
          </p>
          {(activeCategory !== 'all' || activeSkinType !== 'all' || query.trim() || sortBy !== 'featured') && (
            <button
              type="button"
              className="p2-reset-link"
              onClick={() => {
                setActive('all');
                setActiveSkinType('all');
                setQuery('');
                setSortBy('featured');
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="p2-empty-results">
            <h3>No matching products found</h3>
            <p>Try clearing your skin type filter or search query to view all available products.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setActive('all');
                setActiveSkinType('all');
                setQuery('');
              }}
            >
              View Full Botanical Catalog
            </button>
          </div>
        ) : (
          <div className="products-full-grid p2-products-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
