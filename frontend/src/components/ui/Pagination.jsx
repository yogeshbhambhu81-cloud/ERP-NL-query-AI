import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta + 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i);
    }
  }

  const withEllipsis = [];
  let prev = null;
  for (const page of pages) {
    if (prev && page - prev > 1) {
      withEllipsis.push('...');
    }
    withEllipsis.push(page);
    prev = page;
  }

  return (
    <nav
      aria-label="Pagination"
      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', marginTop: '2rem' }}
    >
      <button
        className="wfx-btn wfx-btn-ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ padding: '0.5rem 0.75rem' }}
        aria-label="Previous page"
      >
        <IoChevronBack />
      </button>

      {withEllipsis.map((item, idx) =>
        item === '...' ? (
          <span key={`ellipsis-${idx}`} style={{ padding: '0 0.5rem', color: 'var(--text-muted)' }}>…</span>
        ) : (
          <button
            key={item}
            className={`wfx-btn ${item === currentPage ? 'wfx-btn-primary' : 'wfx-btn-ghost'}`}
            onClick={() => onPageChange(item)}
            style={{ minWidth: '2.25rem', padding: '0.5rem' }}
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        className="wfx-btn wfx-btn-ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ padding: '0.5rem 0.75rem' }}
        aria-label="Next page"
      >
        <IoChevronForward />
      </button>
    </nav>
  );
}

export default Pagination;
