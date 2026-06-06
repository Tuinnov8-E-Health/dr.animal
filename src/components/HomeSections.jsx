import React from 'react';
import { Link } from 'react-router-dom';
import { heroImage, services, featureCards } from '../data';

export function Hero() {
  return (
    <div className="hero">
      <div className="hero-bg" style={{ '--hero-image': `url(${heroImage})` }}></div>
      <div className="hero-grid"></div>
      <div className="hero-accent"></div>
      <div className="hero-content">
        <div className="hero-tag">Est. 2010 - Corner, Kamakis, Kenya</div>
        <h1>
          We Fix<span>Every Beast</span>On The Road
        </h1>
        <p className="hero-sub">
          Doctor Animal Auto is your trusted partner for precision European and American car repair, diagnostics, maintenance, and genuine spare parts.
        </p>
        <div className="hero-btns">
          <Link className="btn-primary" to="/booking">
            Book a Service
          </Link>
          <Link className="btn-outline" to="/services">
            Explore Services
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <h3>2,400+</h3>
            <p>Vehicles Serviced</p>
          </div>
          <div className="hero-stat">
            <h3>14+</h3>
            <p>Years Experience</p>
          </div>
          <div className="hero-stat">
            <h3>98%</h3>
            <p>Client Satisfaction</p>
          </div>
          <div className="hero-stat">
            <h3>30+</h3>
            <p>Expert Mechanics</p>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span>scroll</span>
      </div>
    </div>
  );
}

export function MiniServices() {
  return (
    <section className="mini-services">
      <div className="mini-services-inner">
        <div className="mini-services-grid">
          {services.map((s) => (
            <div key={s.title}>
              <div className="mini-service-icon">
                <i className={s.icon}></i>
              </div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Difference() {
  return (
    <section className="section">
      <div className="section-label">Why Choose Us</div>
      <div className="section-title">The Doctor<br />Difference</div>
      <div className="cards-grid difference-grid">
        {featureCards.map((card) => (
          <div className="card" key={card.title}>
            <div className="card-icon">
              <i className={card.icon}></i>
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
      <div className="section-action">
        <Link className="btn-primary" to="/about">
          Learn More About Us
        </Link>
      </div>
    </section>
  );
}

export function CtaStrip() {
  return (
    <div className="cta-strip">
      <div className="cta-title">Ready to Book Your Service?</div>
      <p>Join 2,400+ satisfied customers. Book online in under 2 minutes.</p>
      <Link className="btn-primary" to="/booking">
        Book a Service Now
      </Link>
    </div>
  );
}
