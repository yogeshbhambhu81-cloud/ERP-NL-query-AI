import React, { memo } from 'react';
import { formatCurrency } from '../../utils/formatters';

const ImageCard = memo(function ImageCard({ product }) {
  const {
    styleNumber, styleName, fabric,
    supplier, sellingPrice, imageUrl, similarityScore,
  } = product;

  const scoreColor =
    similarityScore >= 85 ? 'var(--color-success)' :
    similarityScore >= 65 ? 'var(--color-warning)' :
    'var(--color-danger)';

  return (
    <article className="wfx-card image-card" aria-label={styleName}>
      <div className="image-card-img-wrapper">
        <img
          src={imageUrl}
          alt={styleName}
          className="image-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/1a1a1e/6366f1?text=${encodeURIComponent(styleName)}`;
          }}
        />
        {/* Similarity score badge */}
        <div className="image-card-score-badge" style={{ borderColor: scoreColor, color: scoreColor }}>
          <svg viewBox="0 0 36 36" className="score-ring" aria-hidden="true">
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border-color)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke={scoreColor}
              strokeWidth="3"
              strokeDasharray={`${(similarityScore / 100) * 94.2} 94.2`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <span className="score-value">{similarityScore?.toFixed(0)}%</span>
        </div>
      </div>

      <div className="image-card-body">
        <p className="product-style-number">{styleNumber}</p>
        <h3 className="product-style-name" style={{ fontSize: '0.9rem' }}>{styleName}</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{fabric}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{supplier}</span>
          <span className="product-price">{formatCurrency(sellingPrice)}</span>
        </div>
      </div>
    </article>
  );
});

export default ImageCard;
