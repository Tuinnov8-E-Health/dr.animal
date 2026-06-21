import React from 'react';
import { Link } from 'react-router-dom';
import { SplitLayout, IconList } from '../components/ContentLayout';
import { services, heroImages } from '../data';

function Services() {
  const listItems = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    desc: s.desc,
    action: (
      <Link className="btn-book btn-book--inline" to="/booking">
        Book
      </Link>
    ),
  }));

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Our Services</div>
      <div className="section-title">What We Do Best</div>
      <p className="section-sub">
        From routine maintenance to complex engine rebuilds — handled with precision and care.
      </p>
      <SplitLayout
        images={[
          { src: heroImages.workshop, alt: 'Workshop interior', label: '6-bay workshop' },
          { src: heroImages.diagnostic, alt: 'Diagnostics', label: 'OBD diagnostics' },
        ]}
      >
        <IconList items={listItems} numbered />
      </SplitLayout>
      <div className="section-action">
        <Link className="btn-primary" to="/booking">Book Your Service</Link>
      </div>
    </section>
  );
}

export default Services;
