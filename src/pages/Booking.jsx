import React from 'react';
import { bookingPhoto } from '../data';

function Booking() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Book Service</div>
      <div className="section-title">Schedule Your Appointment</div>
      <div className="book-grid">
        <form>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Juma" />
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
            <label>Vehicle Make & Model</label>
            <input type="text" placeholder="e.g. BMW 320i, Ford Ranger" />
          </div>
          <div className="form-group">
            <label>Service Needed</label>
            <select defaultValue="">
              <option value="" disabled>Select a service</option>
              <option>Engine Repair</option>
              <option>Electrical Systems</option>
              <option>AC Service</option>
              <option>OBD Diagnostics</option>
              <option>Brake Service</option>
              <option>Transmission</option>
              <option>Suspension & Steering</option>
              <option>General Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea placeholder="Describe the issue or any special requests" rows={4} />
          </div>
          <button type="submit" className="btn-primary full">Request Booking</button>
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
