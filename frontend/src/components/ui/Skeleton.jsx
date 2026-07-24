import React from 'react';

function Skeleton({ width = '100%', height = '1rem', borderRadius = '6px', className = '' }) {
  return (
    <div
      className={`wfx-skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="wfx-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Skeleton height="1rem" width="60%" />
      <Skeleton height="2.5rem" width="40%" />
      <Skeleton height="0.75rem" width="80%" />
    </div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="wfx-card" style={{ padding: 0, overflow: 'hidden' }}>
      <Skeleton height="220px" borderRadius="10px 10px 0 0" />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton height="0.875rem" width="50%" />
        <Skeleton height="1.1rem" width="90%" />
        <Skeleton height="0.75rem" width="70%" />
        <Skeleton height="0.75rem" width="55%" />
        <Skeleton height="1.2rem" width="35%" />
      </div>
    </div>
  );
}

export default Skeleton;
