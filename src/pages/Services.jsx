import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data';

function Services() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Our Services</div>
      <div className="section-title">What We Do Best</div>
      <p className="section-sub">From routine maintenance to complex engine rebuilds, our certified technicians handle it all with precision and care.</p>
      <div className="services-list">
        {services.map((s, i) => (
          <div className="service-item" key={s.title}>
            <div className="service-photo">
              <img src={s.photo} alt={s.title} loading="lazy" />
            </div>
            <div className="service-num">DR. ANIMAL / {String(i + 1).padStart(2, '0')}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <Link className="btn-book" to="/booking">Book This Service</Link>
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
