import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state from URL Query Parameters
  const activeCategory = searchParams.get('category') || 'all';
  const query = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'featured';

  const updateParam = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || (key === 'sort' && value === 'featured')) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((catKey) => {
    updateParam('category', catKey);
  }, [updateParam]);

  const handleSearchChange = useCallback((val) => {
    updateParam('q', val);
  }, [updateParam]);

  const handleSortChange = useCallback((val) => {
    updateParam('sort', val);
  }, [updateParam]);

  const resetAllFilters = useCallback(() => {
    const newParams = new URLSearchParams();
    if (searchParams.get('quickView')) {
      newParams.set('quickView', searchParams.get('quickView'));
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const suggestionChips = useMemo(() => {
    const chips = [];

    if (activeCategory === 'all' && !query.trim()) {
      chips.push({ label: 'Show high-rated picks', action: () => handleSortChange('rating') });
      chips.push({ label: 'Only bundles', action: () => handleCategoryChange('bundle') });
      chips.push({ label: 'Best value first', action: () => handleSortChange('price-low') });
      return chips;
    }

    if (activeCategory !== 'all') {
      chips.push({ label: 'Clear category', action: () => handleCategoryChange('all') });
    }

    if (query.trim()) {
      chips.push({ label: `Search "${query.trim()}" by rating`, action: () => handleSortChange('rating') });
      chips.push({ label: 'Reset search', action: () => handleSearchChange('') });
    }

    if (sortBy !== 'featured') {
      chips.push({ label: 'Back to featured', action: () => handleSortChange('featured') });
    }

    return chips.slice(0, 4);
  }, [activeCategory, query, sortBy, handleCategoryChange, handleSearchChange, handleSortChange]);

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
            <p className="section-label">Enterprise Skincare Line</p>
            <h1>Advanced Botanical Discovery</h1>
            <p>
              Smart filters, stateful URL routing, verified botanical active concentrations, and instant personalized recommendations.
            </p>
            <div className="p2-products-hero-actions">
              <button type="button" className="btn btn-primary" onClick={openConcierge}>
                Ask AI Skincare Concierge
              </button>
            </div>
          </div>
          <div className="p2-products-proof">
            <article>
              <strong>{products.length}</strong>
              <span>Formulated formulas</span>
            </article>
            <article>
              <strong>4.9★</strong>
              <span>Clinical satisfaction</span>
            </article>
            <article>
              <strong>100%</strong>
              <span>Cruelty-Free & Vegan</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding container p2-products-controls-wrap">
        <div className="p2-products-controls">
          {/* Filter Chips */}
          <div className="filter-chips p2-filter-chips" role="tablist" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category.key}
                role="tab"
                aria-selected={activeCategory === category.key}
                className={`chip${activeCategory === category.key ? ' active' : ''}`}
                onClick={() => handleCategoryChange(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="p2-products-tools">
            <label className="p2-search-box" aria-label="Search products">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="search"
                placeholder="Search formulas or ingredients..."
                value={query}
                onChange={(event) => handleSearchChange(event.target.value)}
                aria-label="Filter formulas by name or ingredient"
              />
            </label>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(event) => handleSortChange(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="p2-products-meta-row">
          <span>{filtered.length} formula{filtered.length !== 1 ? 's' : ''} found</span>
          {(activeCategory !== 'all' || query || sortBy !== 'featured') && (
            <button type="button" className="p2-inline-link" onClick={resetAllFilters}>
              Reset All Filters
            </button>
          )}
        </div>

        {/* AI Suggestion Chips */}
        {suggestionChips.length > 0 && (
          <div className="p2-ai-suggestions" aria-label="Smart suggestions">
            <span>Suggestions:</span>
            {suggestionChips.map((chip) => (
              <button key={chip.label} type="button" className="p2-suggestion-chip" onClick={chip.action}>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="products-full-grid p2-products-grid p2-stagger-grid grid-responsive-products">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={Math.min(index * 0.04, 0.4)} />
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="p2-empty-state">
            <h3>No formulas match your filters</h3>
            <p>Try searching for different botanical ingredients or clear active filters.</p>
            <button type="button" className="btn btn-outline" onClick={resetAllFilters} style={{ marginTop: '1rem' }}>
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
