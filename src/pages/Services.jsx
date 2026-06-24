import React from 'react';
import { Link } from 'react-router-dom';
import { SplitLayout } from '../components/ContentLayout';
import { services, heroImages } from '../data';

function Services() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero-img">
          <img src="/images/img6.jpeg" alt="Service workshop" />
        </div>
        <div className="about-hero-content">
          <div className="section-label">Our Services</div>
          <div className="section-title">Premium Car Services & Repairs</div>
          <p className="section-sub" style={{ color: '#fff' }}>
            From routine maintenance to specialized repairs and diagnostics — we cover a wide range of services for premium vehicles.
          </p>
        </div>
      </section>

      <section className="section page-section" style={{ paddingTop: '32px' }}>
        <div className="section-header">
          <div>
            <span className="section-label">Services</span>
            <h2 className="section-title">Our Service Offering</h2>
            <p className="section-sub">Choose a service below and book an appointment online.</p>
          </div>
        </div>

        <div className="services-grid">
          {services.map((s) => (
            <article key={s.title} className="service-card">
              <div className="service-card__icon">
                <i className={s.icon}></i>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="section-actions" style={{ marginTop: 'auto' }}>
                <Link className="btn-outline" to="/services">View Details</Link>
                <Link className="btn-primary" to="/booking" style={{ marginLeft: '0.75rem' }}>Book</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="section-action" style={{ marginTop: '2rem' }}>
          <Link className="btn-primary" to="/booking">Book Your Service</Link>
        </div>
      </section>
    </>
  );
}

export default Services;
