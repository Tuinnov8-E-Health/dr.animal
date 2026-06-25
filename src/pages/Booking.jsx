import React, { useState } from 'react';
import { bookingPhoto } from '../data';
import { supabase, supabaseEnabled } from '../supabaseClient';

function Booking() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    if (!fullName || !email || !phone || !service) {
      setStatus('Please fill in your name, email, phone, and service request.');
      return;
    }
    if (!supabaseEnabled) {
      setStatus('Supabase is not configured, so booking cannot be saved to the database.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('bookings').insert([
      {
        full_name: fullName,
        email,
        phone,
        vehicle_label: vehicle,
        service_name: service,
        notes,
      },
    ]);
    setIsSubmitting(false);

    if (error) {
      setStatus(error.message || 'Unable to submit booking.');
      return;
    }

    setStatus('Booking request submitted successfully. We will contact you soon.');
    setFullName('');
    setEmail('');
    setPhone('');
    setVehicle('');
    setService('');
    setNotes('');
  };

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Book Service</div>
      <div className="section-title">Schedule Your Appointment</div>
      <div className="book-grid">
        <form onSubmit={handleSubmit}>
          {status && <div className="auth-alert">{status}</div>}
          {!supabaseEnabled && (
            <div className="auth-alert warning">
              Supabase is not configured, so booking cannot be saved to the database.
            </div>
          )}
          <div className="form-group">
            <label>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="John Juma" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+254 720 862 971" />
          </div>
          <div className="form-group">
            <label>Vehicle Make & Model</label>
            <input value={vehicle} onChange={(e) => setVehicle(e.target.value)} type="text" placeholder="e.g. BMW 320i, Ford Ranger" />
          </div>
          <div className="form-group">
            <label>Service Needed</label>
            <select value={service} onChange={(e) => setService(e.target.value)}>
              <option value="" disabled>Select a service</option>
              <option value="Engine Repair">Engine Repair</option>
              <option value="Electrical Systems">Electrical Systems</option>
              <option value="AC Service">AC Service</option>
              <option value="OBD Diagnostics">OBD Diagnostics</option>
              <option value="Brake Service">Brake Service</option>
              <option value="Transmission">Transmission</option>
              <option value="Suspension & Steering">Suspension & Steering</option>
              <option value="General Maintenance">General Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the issue or any special requests" rows={4} />
          </div>
          <button type="submit" className="btn-primary full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Request Booking'}
          </button>
        </form>
        <div className="book-info">
          <div className="book-info-item">
            <div className="book-info-icon"><i className="fa-solid fa-clock"></i></div>
            <div className="book-info-text">
              <h4>Working Hours</h4>
              <p>Monday to Saturday, 8am - 6pm. Emergency slots available on request.</p>
            </div>
          </div>
          <div className="book-info-item">
            <div className="book-info-icon"><i className="fa-solid fa-location-dot"></i></div>
            <div className="book-info-text">
              <h4>Location</h4>
              <p>Corner, Kamakis, Kiambu County, Kenya</p>
            </div>
          </div>
          <div className="book-info-item">
            <div className="book-info-icon"><i className="fa-solid fa-phone"></i></div>
            <div className="book-info-text">
              <h4>Call Us</h4>
              <p>+254 720 862 971</p>
            </div>
          </div>
          <figure className="side-photo">
            <img src={bookingPhoto} alt="Workshop bay" loading="lazy" />
            <figcaption>Our workshop — ready when you are</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default Booking;
