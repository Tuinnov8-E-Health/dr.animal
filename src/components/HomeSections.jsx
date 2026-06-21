import React from 'react';
import { Link } from 'react-router-dom';
import { SplitLayout, IconList, shortDesc } from './ContentLayout';
import {
  heroImages,
  services,
  featureCards,
  galleryItems,
  testimonials,
  processSteps,
  trustedBrands,
} from '../data';

export function Hero() {
  return (
    <div className="hero">
      <div className="hero-bg" style={{ '--hero-image': `url(${heroImages.main})` }}></div>
      <div className="hero-overlay"></div>
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Trusted Since 2010 · Kamakis, Kenya</span>
          </div>
          <div className="hero-tag">European & American Specialists</div>
          <h1>
            We Fix <span>Every Beast</span> On The Road
          </h1>
          <p className="hero-sub">
            Doctor Animal Auto delivers precision diagnostics, expert repairs, and genuine spare parts —
            all under one roof with total transparency.
          </p>
          <div className="hero-btns">
            <Link className="btn-primary" to="/booking">
              <i className="fa-solid fa-calendar-days"></i> Book a Service
            </Link>
            <Link className="btn-outline" to="/services">
              <i className="fa-solid fa-arrow-right"></i> Explore Services
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
        <figure className="hero-visual hero-visual--single">
          <img src={heroImages.workshop} alt="Doctor Animal Auto workshop" loading="eager" />
        </figure>
      </div>
    </div>
  );
}

export function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="trust-strip-inner">
        <span className="trust-label">We Service</span>
        <div className="trust-brands">
          {trustedBrands.map((brand) => (
            <span key={brand} className="trust-brand">{brand}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const listItems = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    shortDesc: shortDesc(s.desc),
  }));

  return (
    <section className="section home-services">
      <div className="section-label">What We Do</div>
      <div className="section-title">Our Services</div>
      <p className="section-sub">
        Expert care for every system in your vehicle — backed by genuine parts and transparent pricing.
      </p>
      <SplitLayout
        images={[
          { src: heroImages.workshop, alt: 'Workshop bay', label: 'Our workshop' },
          { src: heroImages.engine, alt: 'Engine repair', label: 'Precision engine work' },
        ]}
      >
        <IconList items={listItems} />
        <Link className="btn-outline split-cta" to="/services">
          View full service details <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </SplitLayout>
    </section>
  );
}

export function Difference() {
  const items = featureCards.map((card) => ({
    icon: card.icon,
    title: card.title,
    shortDesc: shortDesc(card.desc, 120),
  }));

  return (
    <section className="section home-difference">
      <div className="section-label">Why Choose Us</div>
      <div className="section-title">The Doctor Difference</div>
      <SplitLayout
        reverse
        images={[
          { src: heroImages.diagnostic, alt: 'OBD diagnostics', label: 'State-of-the-art diagnostics' },
        ]}
      >
        <IconList items={items} />
        <Link className="btn-primary split-cta" to="/about">
          Learn more about us
        </Link>
      </SplitLayout>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="section home-process">
      <div className="section-label">How It Works</div>
      <div className="section-title">Simple. Transparent. Stress-Free.</div>
      <ul className="process-list">
        {processSteps.map((step) => (
          <li className="process-list__item" key={step.step}>
            <span className="process-list__icon">
              <i className={step.icon}></i>
            </span>
            <div>
              <span className="process-list__num">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GalleryPreview() {
  return (
    <section className="section home-gallery-preview">
      <div className="section-header-row">
        <div>
          <div className="section-label">Our Work</div>
          <div className="section-title">Workshop Gallery</div>
        </div>
        <Link className="btn-outline section-header-cta" to="/gallery">Full Gallery</Link>
      </div>
      <SplitLayout
        reverse
        images={[
          { src: galleryItems[0].src, alt: galleryItems[0].caption },
          { src: galleryItems[1].src, alt: galleryItems[1].caption },
        ]}
      >
        <ul className="caption-list">
          {galleryItems.slice(0, 6).map((item) => (
            <li key={item.caption}>
              <i className="fa-solid fa-camera"></i>
              <span>{item.caption}</span>
            </li>
          ))}
        </ul>
      </SplitLayout>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="section home-testimonials">
      <div className="section-label">Client Stories</div>
      <div className="section-title">What Drivers Say</div>
      <ul className="testimonial-list">
        {testimonials.map((t) => (
          <li className="testimonial-list__item" key={t.name}>
            <div className="testimonial-list__stars">
              {Array.from({ length: t.rating }).map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p>&ldquo;{t.quote}&rdquo;</p>
            <div className="testimonial-list__author">
              <span className="testimonial-list__avatar">
                <i className="fa-solid fa-user"></i>
              </span>
              <div>
                <strong>{t.name}</strong>
                <span>{t.vehicle}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CtaStrip() {
  return (
    <div className="cta-strip">
      <div className="cta-strip-content">
        <div className="cta-title">Ready to Book Your Service?</div>
        <p>Join 2,400+ satisfied customers. Book online in under 2 minutes.</p>
        <div className="cta-btns">
          <Link className="btn-primary" to="/booking">
            <i className="fa-solid fa-calendar-check"></i> Book a Service Now
          </Link>
          <Link className="btn-outline" to="/contact">
            <i className="fa-solid fa-phone"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
