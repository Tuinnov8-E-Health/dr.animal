import React from 'react';
import { contactPhoto } from '../data';

function Contact() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Contact</div>
      <div className="section-title">Get In Touch</div>
      <div className="contact-grid" style={{ marginTop: '2rem' }}>
        <form>
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
            <input type="tel" placeholder="+254 700 000 000" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Tell us what you need" rows={5} />
          </div>
          <button type="button" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
        </form>
        <div>
          <div className="contact-detail">
            <div className="contact-detail-icon"><i className="fa-solid fa-location-dot"></i></div>
            <div>
              <h4>Visit Us</h4>
              <p>Corner, Kamakis, Kiambu County, Kenya</p>
            </div>
          </div>
          <div className="contact-detail">
            <div className="contact-detail-icon"><i className="fa-solid fa-phone"></i></div>
            <div>
              <h4>Phone</h4>
              <p>+254 700 000 000</p>
            </div>
          </div>
          <div className="contact-detail">
            <div className="contact-detail-icon"><i className="fa-solid fa-envelope"></i></div>
            <div>
              <h4>Email</h4>
              <p>hello@doctoranimal.co.ke</p>
            </div>
          </div>
          <div className="contact-detail">
            <div className="contact-detail-icon"><i className="fa-solid fa-clock"></i></div>
            <div>
              <h4>Working Hours</h4>
              <p>Monday to Saturday, 8am - 6pm</p>
            </div>
          </div>
          <figure className="side-photo">
            <img src={contactPhoto} alt="Doctor Animal Auto workshop" loading="lazy" />
            <figcaption>Visit us at Corner, Kamakis</figcaption>
          </figure>
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
    </section>
  );
}

export default Contact;
