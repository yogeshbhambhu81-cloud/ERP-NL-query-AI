import React from 'react';

function Badge({ children, variant = 'neutral' }) {
  const variants = {
    success: 'badge-success',
    info: 'badge-info',
    warning: 'badge-warning',
    danger: 'badge-danger',
    neutral: 'badge-neutral',
  };
  return (
    <span className={`wfx-badge ${variants[variant] || 'badge-neutral'}`}>
      {children}
    </span>
  );
}

export default Badge;
