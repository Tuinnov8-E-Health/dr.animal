import React from 'react';

function Booking() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Book Service</div>
      <div className="section-title">Schedule Your Appointment</div>
      <form className="contact-form" style={{ marginTop: '2rem' }}>
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email Address" />
        <input type="text" placeholder="Vehicle Make & Model" />
        <input type="text" placeholder="Service Needed" />
        <button type="button" className="btn-primary">Request Booking</button>
      </form>
    </section>
  );
}

export default Booking;
