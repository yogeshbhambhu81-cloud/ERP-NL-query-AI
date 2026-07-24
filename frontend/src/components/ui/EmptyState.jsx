import React from 'react';

function EmptyState({ icon, title = 'No results found', description = '', action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1rem',
      textAlign: 'center',
    }}>
      {icon && (
        <div style={{
          fontSize: '3rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-surface-secondary)',
          borderRadius: '50%',
          width: '5rem',
          height: '5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-color)',
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
      {description && <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', fontSize: '0.875rem' }}>{description}</p>}
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  );
}

export default EmptyState;
