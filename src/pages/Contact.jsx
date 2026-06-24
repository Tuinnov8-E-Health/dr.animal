import React from 'react';
import { contactPhoto } from '../data';

function Contact() {
  return (
    <section className="section page-section contact-page" style={{ paddingTop: '64px' }}>
      <div className="section-header contact-header">
        <div>
          <div className="section-label">Contact</div>
          <h1 className="section-title">Book a service or request a quote</h1>
          <p className="section-copy">
            Reach out to Doctor Animal Auto for diagnostics, repair, servicing and spare parts. Fast response, clear
            pricing and expert auto care for your vehicle.
          </p>
        </div>
      </div>

      <div className="contact-hero">
        <div className="contact-hero-copy">
          <p className="hero-tag">Visit our workshop in Kamakis</p>
          <h2>Accurate location map for fast, easy drop-off</h2>
          <p>
            Our facility is located in Kamakis, Kiambu County. Use the map below to navigate directly to our workshop and
            arrange your service visit.
          </p>
          <div className="contact-hero-meta">
            <div>
              <strong>Location</strong>
              <p>Kamakis, Kiambu County, Kenya</p>
            </div>
            <div>
              <strong>Working Hours</strong>
              <p>Mon - Sat · 8:00am - 6:00pm</p>
            </div>
          </div>
        </div>
        <div className="contact-hero-map">
          <iframe
            title="Kamakis location map"
            src="https://maps.google.com/maps?q=Kamakis%2C%20Kenya&z=15&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="contact-page-grid">
        <div className="contact-form-panel">
          <div className="contact-box contact-box-highlight">
            <h3>Need help now?</h3>
            <p>Send us a message and our service advisors will get back to you within minutes.</p>
          </div>

          <form className="contact-form">
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" placeholder="John Kamau" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+254 720 862 971" />
            </div>
            <div className="form-group">
              <label>Vehicle / Service Request</label>
              <textarea placeholder="Tell us what you need" rows={5} />
            </div>
            <button type="button" className="btn-primary btn-block">
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-info-panel">
          <div className="contact-grid-cards">
            <div className="contact-card">
              <div className="contact-card-icon"><i className="fa-solid fa-location-dot"></i></div>
              <div>
                <h4>Our Location</h4>
                <p>Corner, Kamakis, Kiambu County, Kenya</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon"><i className="fa-solid fa-phone"></i></div>
              <div>
                <h4>Call / WhatsApp</h4>
                <p>+254 720 862 971</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon"><i className="fa-solid fa-envelope"></i></div>
              <div>
                <h4>Email</h4>
                <p>hello@doctoranimal.co.ke</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon"><i className="fa-solid fa-clock"></i></div>
              <div>
                <h4>Hours</h4>
                <p>Mon - Sat: 8am - 6pm</p>
              </div>
            </div>
          </div>

          <div className="contact-map-panel">
            <img src={contactPhoto} alt="Doctor Animal Auto workshop" loading="lazy" />
            <div className="map-placeholder">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8!2d36.8!3d-1.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTInMDAuMCJTIDM2wrA0OCcwMC4wIkU!5e0!3m2!1sen!2ske!4v1"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Doctor Animal Auto location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
