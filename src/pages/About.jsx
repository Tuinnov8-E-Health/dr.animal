import React from 'react';
import { Link } from 'react-router-dom';
import { SplitLayout, IconList } from '../components/ContentLayout';
import { aboutPhotos } from '../data';

function About() {
  const teamItems = aboutPhotos.team.map((member) => ({
    icon: 'fa-solid fa-user-gear',
    title: member.name,
    role: member.role,
    desc: member.desc,
  }));

  return (
    <section className="section page-section" style={{ paddingTop: 0 }}>
      <div className="about-hero">
        <div className="about-hero-img">
          <img src={aboutPhotos.hero} alt="Doctor Animal Auto workshop" />
        </div>
        <div className="about-hero-content">
          <div className="section-label">Our Story</div>
          <div className="section-title">About Doctor Animal Auto</div>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,.82)', marginBottom: 0 }}>
            A focused workshop team delivering precise diagnostics, repairs, and care for European and American vehicles in Kamakis, Kenya.
          </p>
        </div>
      </div>

      <div className="section">
        <SplitLayout
          images={[
            { src: aboutPhotos.workshop, alt: 'Workshop interior', label: 'Corner, Kamakis' },
          ]}
        >
          <div className="prose-block">
            <p>
              Founded in 2010 at Corner, Kamakis in Kiambu County, Doctor Animal Auto started as a small two-bay workshop with one mechanic and a dream: to give every Kenyan driver access to honest, expert automotive care.
            </p>
            <p>
              Today, we operate a 20-bay facility with over 30 certified technicians, modern OBD diagnostic equipment, and a strong specialization in European and American vehicles including Volvo, Mercedes-Benz, BMW, Ford, Range Rover and Jeep.
            </p>
            <ul className="check-list">
              <li><i className="fa-solid fa-check"></i> Certified by Kenya Motor Industry Association</li>
              <li><i className="fa-solid fa-check"></i> Specialized sourcing for European and American parts</li>
              <li><i className="fa-solid fa-check"></i> Final diagnostic checks and road-test before every handover</li>
              <li><i className="fa-solid fa-check"></i> 24-hour emergency breakdown support</li>
              <li><i className="fa-solid fa-check"></i> Digital repair tracking for full transparency</li>
            </ul>
            <Link className="btn-primary" to="/contact">Get In Touch</Link>
          </div>
        </SplitLayout>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-label">The Team</div>
        <div className="section-title">Meet Our Experts</div>
        <IconList items={teamItems} />
      </div>
    </section>
  );
}

export default About;
