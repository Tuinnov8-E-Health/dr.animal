import React from 'react';

function Contact() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Contact</div>
      <div className="section-title">Get In Touch</div>
      <div className="about-grid" style={{ marginTop: '2rem' }}>
        <div>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Email Address" />
            <input type="tel" placeholder="Phone Number" />
            <textarea placeholder="Tell us what you need" rows="6"></textarea>
            <button type="button" className="btn-primary">Send Message</button>
          </form>
        </div>
        <div className="contact-info">
          <h3>Visit Us</h3>
          <p>Corner, Kamakis, Kiambu County, Kenya</p>
          <p><strong>Phone:</strong> +254 700 000 000</p>
          <p><strong>Email:</strong> hello@doctoranimal.co.ke</p>
          <p>Open Monday to Saturday, 8am - 6pm</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
