import React from 'react';
import Spinner from './Spinner';

export function Button({
  children,
  className = '',
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  icon,
  iconRight,
  type = 'button',
  ...props
}) {
  const sizeClasses = {
    sm: 'padding: 0.375rem 0.75rem; font-size: 0.75rem;',
    md: 'padding: 0.625rem 1.25rem; font-size: 0.875rem;',
    lg: 'padding: 0.75rem 1.75rem; font-size: 1rem;'
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'wfx-btn-primary';
      case 'secondary': return 'wfx-btn-secondary';
      case 'outline': return 'wfx-btn-outline';
      case 'ghost': return 'wfx-btn-ghost';
      case 'danger': return 'wfx-btn-danger';
      default: return 'wfx-btn-primary';
    }
  };

  return (
    <button
      type={type}
      className={`wfx-btn ${getVariantClass()} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {!loading && icon && <span className="btn-icon-left">{icon}</span>}
      <span>{children}</span>
      {!loading && iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
}
export default Button;
