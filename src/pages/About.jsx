import React from 'react';
import { Link } from 'react-router-dom';
import { aboutPhotos } from '../data';

function About() {
  return (
    <section className="section page-section" style={{ paddingTop: 0 }}>
      <div className="about-hero">
        <div className="about-hero-img">
          <img src={aboutPhotos.hero} alt="Doctor Animal Auto workshop" />
        </div>
        <div className="about-hero-content">
          <div className="section-label">Our Story</div>
          <div className="section-title">About Doctor<br />Animal Auto</div>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,.82)', marginBottom: 0 }}>
            A focused workshop team delivering precise diagnostics, repairs, and care for European and American vehicles in Kamakis, Kenya.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="about-grid">
          <div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.25rem' }}>
              Founded in 2010 at Corner, Kamakis in Kiambu County, Doctor Animal Auto started as a small two-bay workshop with one mechanic and a dream: to give every Kenyan driver access to honest, expert automotive care.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '.9rem', marginBottom: '1.25rem' }}>
              Today, we operate a 20-bay facility with over 30 certified technicians, modern OBD diagnostic equipment, and a strong specialization in European and American vehicles including Volvo, Mercedes-Benz, BMW, Ford, Range Rover and Jeep.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '.9rem' }}>
              We believe your car is more than a machine - it is your livelihood, your freedom, and your family's safety. That is why we treat every vehicle with surgical precision and genuine care.
            </p>
            <div className="about-points">
              <div className="about-point"><div className="about-point-dot"></div><p>Certified by Kenya Motor Industry Association</p></div>
              <div className="about-point"><div className="about-point-dot"></div><p>Specialized sourcing for Volvo, Mercedes-Benz, BMW, Ford, Range Rover, Jeep and other European and American parts</p></div>
              <div className="about-point"><div className="about-point-dot"></div><p>Final diagnostic checks and road-test review before every vehicle handover</p></div>
              <div className="about-point"><div className="about-point-dot"></div><p>24-hour emergency breakdown support</p></div>
              <div className="about-point"><div className="about-point-dot"></div><p>Digital repair tracking for full transparency</p></div>
            </div>
            <Link className="btn-primary" to="/contact" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              Get In Touch
            </Link>
          </div>
          <div className="about-img">
            <div className="about-img-bg"><img src={aboutPhotos.workshop} alt="Doctor Animal Auto workshop interior" /></div>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-label">The Team</div>
        <div className="section-title">Meet Our Experts</div>
        <div className="cards-grid" style={{ marginTop: '2rem' }}>
          {aboutPhotos.team.map((member) => (
            <div className="card" key={member.name} style={{ textAlign: 'center' }}>
              <div className="profile-avatar"><img src={member.photo} alt={member.name} /></div>
              <h3>{member.name}</h3>
              <p style={{ color: 'var(--red)', fontSize: '.8rem', margin: '.3rem 0 .75rem' }}>{member.role}</p>
              <p>{member.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
