import React from 'react';

function Spinner({ size = 'md', color = 'primary' }) {
  const sizes = { sm: '16px', md: '28px', lg: '44px' };
  const dim = sizes[size] || sizes.md;

  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: dim,
        height: dim,
        borderRadius: '50%',
        border: `2px solid var(--border-color)`,
        borderTopColor: color === 'primary' ? 'var(--primary)' : 'currentColor',
        animation: 'wfx-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );
}

// Inject the keyframe once
const style = document.createElement('style');
style.textContent = `@keyframes wfx-spin { to { transform: rotate(360deg); } }`;
if (!document.head.querySelector('[data-wfx-spinner]')) {
  style.setAttribute('data-wfx-spinner', '');
  document.head.appendChild(style);
}

export default Spinner;
