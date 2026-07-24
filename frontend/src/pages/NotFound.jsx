import React from 'react';
import { Link } from 'react-router-dom';
import { IoHomeOutline, IoArrowBack } from 'react-icons/io5';

function NotFound() {
  return (
    <div className="notfound-page" role="main" aria-label="404 Page not found">
      <div className="notfound-content">
        {/* Large 404 Number */}
        <div className="notfound-number" aria-hidden="true">404</div>

        <div className="notfound-glow" aria-hidden="true" />

        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-description">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to the ERP dashboard.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="wfx-btn wfx-btn-primary">
            <IoHomeOutline /> Go to Dashboard
          </Link>
          <button className="wfx-btn wfx-btn-secondary" onClick={() => window.history.back()}>
            <IoArrowBack /> Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="notfound-links">
          <p className="notfound-links-title">Quick Links</p>
          <div className="notfound-links-grid">
            <Link to="/query" className="notfound-link">AI Query</Link>
            <Link to="/search" className="notfound-link">Product Search</Link>
            <Link to="/image-search" className="notfound-link">Image Search</Link>
            <Link to="/explorer" className="notfound-link">Explorer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
