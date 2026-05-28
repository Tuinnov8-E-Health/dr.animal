import React from 'react';
import { Link } from 'react-router-dom';

function Portal({ currentUser, cartItems }) {
  const total = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Client Portal</div>
      <div className="section-title">Welcome back, {currentUser.name}</div>
      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3>Your Summary</h3>
          <p>Role: {currentUser.role}</p>
          <p>Cart items: {total}</p>
          <p>Member since: 2025</p>
        </div>
        <div className="card">
          <h3>Quick Actions</h3>
          <Link className="btn-primary" to="/booking">
            Book a Service
          </Link>
          <Link className="btn-outline" to="/contact">
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Portal;
