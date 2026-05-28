import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data';

function Services() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Our Services</div>
      <div className="section-title">What We Do Best</div>
      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        {services.map(([icon, title, description]) => (
          <div className="card" key={title}>
            <div className="card-icon"><i className={icon}></i></div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <div className="section-action">
        <Link className="btn-primary" to="/booking">
          Book Your Service
        </Link>
      </div>
    </section>
  );
}

export default Services;
