import React from 'react';
import { Link } from 'react-router-dom';
import { SplitLayout } from '../components/ContentLayout';
import { aboutPhotos, featureCards } from '../data';

function About() {
  const founder = aboutPhotos.team[0];

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

      <div className="section mission-vision">
        <div className="section-label">Our Direction</div>
        <div className="section-title">Mission, Vision & Values</div>
        <div className="mv-grid">
          <div className="mv-item">
            <h4>Our Mission</h4>
            <p>Deliver transparent, expert automotive repairs using genuine parts and modern diagnostics so every client regains confidence in their vehicle.</p>
          </div>
          <div className="mv-item">
            <h4>Our Vision</h4>
            <p>To be the trusted leader in premium vehicle care in East Africa — setting standards for honesty, technical excellence, and customer experience.</p>
          </div>
          <div className="mv-item">
            <h4>Our Values</h4>
            <p>Integrity, technical excellence, customer-first communication, and uncompromising safety.</p>
          </div>
        </div>
      </div>

      <div className="section founder-section">
        <div className="founder-grid">
          <div className="founder-photo">
            <img src={founder.photo} alt={founder.name} />
          </div>
          <div className="founder-bio">
            <div className="section-label">Founder</div>
            <div className="section-title">{founder.name}</div>
            <p className="section-sub">{founder.desc}</p>
            <p>
              Ronald Reagan began his career as an automotive technician and worked his way up to leadership through a focus on technical excellence and customer service. Under his guidance the workshop expanded services, invested in diagnostic equipment, and established a client portal for transparent repair tracking.
            </p>
          </div>
        </div>
      </div>

      <div className="section why-choose">
        <div className="section-label">Why Choose Us</div>
        <div className="section-title">A Service Experience Built Around Trust</div>
        <p className="section-sub">We focus on accurate diagnosis, genuine parts, and clear communication so you only pay for what your vehicle needs.</p>
        <div className="why-grid">
          {featureCards.slice(0, 4).map((item) => (
            <article key={item.title} className="feature-card">
              <div className="feature-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
