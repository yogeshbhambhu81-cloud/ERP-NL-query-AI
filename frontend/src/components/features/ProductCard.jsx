import React, { memo } from 'react';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = memo(function ProductCard({ product, showSimilarity = false }) {
  const {
    styleNumber, styleName, fabric, gsm,
    supplier, sellingPrice, imageUrl, similarityScore,
    category, buyer, color,
  } = product;

  return (
    <article className="wfx-card product-card" aria-label={styleName}>
      <div className="product-card-image-wrapper">
        <img
          src={imageUrl}
          alt={styleName}
          className="product-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/1a1a1e/6366f1?text=${encodeURIComponent(styleName)}`;
          }}
        />
        <div className="product-card-badges">
          <span className="product-badge category-badge">{category}</span>
          {showSimilarity && (
            <span className="product-badge similarity-badge">
              {similarityScore?.toFixed(1)}% match
            </span>
          )}
        </div>
      </div>

      <div className="product-card-body">
        <p className="product-style-number">{styleNumber}</p>
        <h3 className="product-style-name">{styleName}</h3>

        <div className="product-meta-grid">
          <div className="product-meta-item">
            <span className="meta-label">Fabric</span>
            <span className="meta-value">{fabric}</span>
          </div>
          <div className="product-meta-item">
            <span className="meta-label">GSM</span>
            <span className="meta-value">{gsm}</span>
          </div>
          <div className="product-meta-item">
            <span className="meta-label">Supplier</span>
            <span className="meta-value">{supplier}</span>
          </div>
          <div className="product-meta-item">
            <span className="meta-label">Buyer</span>
            <span className="meta-value">{buyer}</span>
          </div>
        </div>

        <div className="product-card-footer">
          <span className="product-price">{formatCurrency(sellingPrice)}</span>
          <span className="product-color-swatch" title={color}>
            <span className="color-dot" />
            {color}
          </span>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
