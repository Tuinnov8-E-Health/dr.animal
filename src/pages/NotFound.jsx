import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Page Not Found</div>
      <div className="section-title">404 — We Couldn’t Find That</div>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
        The page you are looking for does not exist. Use the menu to continue browsing the React app.
      </p>
      <Link className="btn-primary" to="/">Back to Home</Link>
    </section>
  );
}

export default NotFound;
