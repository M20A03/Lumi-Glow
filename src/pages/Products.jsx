import { useMemo, useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Phase2.css';

const categories = [
  { key: 'all', label: 'All Products' },
  { key: 'serum', label: 'Serums' },
  { key: 'moisturizer', label: 'Moisturizers' },
  { key: 'treatment', label: 'Treatments' },
  { key: 'bundle', label: 'Bundles' },
];

export default function Products() {
  const [activeCategory, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const suggestionChips = useMemo(() => {
    const chips = [];

    if (activeCategory === 'all' && !query.trim()) {
      chips.push({ label: 'Show high-rated picks', action: () => setSortBy('rating') });
      chips.push({ label: 'Only bundles', action: () => setActive('bundle') });
      chips.push({ label: 'Best value first', action: () => setSortBy('price-low') });
      return chips;
    }

    if (activeCategory !== 'all') {
      chips.push({ label: 'Clear category', action: () => setActive('all') });
    }

    if (query.trim()) {
      chips.push({ label: `Search "${query.trim()}" by rating`, action: () => setSortBy('rating') });
      chips.push({ label: 'Reset search', action: () => setQuery('') });
    }

    if (sortBy !== 'featured') {
      chips.push({ label: 'Back to featured', action: () => setSortBy('featured') });
    }

    return chips.slice(0, 4);
  }, [activeCategory, query, sortBy]);

  const filtered = useMemo(() => {
    const byCategory = activeCategory === 'all'
      ? products
      : products.filter((item) => item.category === activeCategory);

    const bySearch = byCategory.filter((item) => {
      const target = `${item.name} ${item.brand} ${item.category}`.toLowerCase();
      return target.includes(query.toLowerCase().trim());
    });

    const sorted = [...bySearch];
    if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'reviews') sorted.sort((a, b) => b.reviews - a.reviews);

    return sorted;
  }, [activeCategory, query, sortBy]);

  const openConcierge = () => {
    window.dispatchEvent(new CustomEvent('open-dh-concierge'));
  };

  return (
    <div className="p2-products-page">
      <section className="p2-products-hero">
        <div className="container p2-products-hero-inner">
          <div>
            <p className="section-label">Phase 2 Experience</p>
            <h1>Advanced Product Discovery</h1>
            <p>
              Smart filters, instant search, stronger visual hierarchy, and an AI concierge shortcut for faster buying decisions.
            </p>
            <div className="p2-products-hero-actions">
              <button type="button" className="btn btn-primary" onClick={openConcierge}>Ask AI for Recommendations</button>
            </div>
          </div>
          <div className="p2-products-proof">
            <article>
              <strong>{products.length}</strong>
              <span>Curated products</span>
            </article>
            <article>
              <strong>4.9</strong>
              <span>Average rating</span>
            </article>
            <article>
              <strong>24/7</strong>
              <span>Concierge support</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding container p2-products-controls-wrap">
        <div className="p2-products-controls">
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

          <div className="p2-products-tools">
            <label className="p2-search-box" aria-label="Search products">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                type="search"
                placeholder="Search products..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>

        <div className="p2-products-meta-row">
          <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
          <button type="button" className="p2-inline-link" onClick={() => { setQuery(''); setSortBy('featured'); setActive('all'); }}>
            Reset Filters
          </button>
        </div>

        {suggestionChips.length > 0 && (
          <div className="p2-ai-suggestions" aria-label="Smart suggestions">
            <span>AI suggestions:</span>
            {suggestionChips.map((chip) => (
              <button key={chip.label} type="button" className="p2-suggestion-chip" onClick={chip.action}>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        <div className="products-full-grid p2-products-grid p2-stagger-grid">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.05} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p2-empty-state">
            <h3>No products match your filters</h3>
            <p>Try a different keyword or switch category.</p>
            <button type="button" className="btn btn-outline" onClick={() => { setQuery(''); setActive('all'); }}>
              Clear Search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
