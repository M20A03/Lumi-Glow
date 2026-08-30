import React from 'react';

export function SkeletonBox({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm, 6px)', style = {} }) {
  return (
    <div
      className="skeleton-pulse"
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-bg-subtle, #EFE4D6)',
        backgroundImage: 'linear-gradient(90deg, var(--color-bg-subtle, #EFE4D6) 0%, var(--color-bg-secondary, #F2E8DC) 50%, var(--color-bg-subtle, #EFE4D6) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-wave 1.5s infinite linear',
        ...style,
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card" style={{ pointerEvents: 'none' }} aria-busy="true" aria-label="Loading product card">
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', borderRadius: 'var(--radius-md, 12px)' }}>
        <SkeletonBox style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>
      <div style={{ padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SkeletonBox width="40%" height="14px" />
        <SkeletonBox width="85%" height="20px" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <SkeletonBox width="30%" height="22px" />
          <SkeletonBox width="36px" height="36px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="products-full-grid p2-products-grid" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
