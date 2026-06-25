import React, { useState } from 'react';
import { supabase, supabaseEnabled } from '../supabaseClient';

function Feedback() {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    if (!message) {
      setStatus('Please add a message describing your experience.');
      return;
    }
    if (!supabaseEnabled) {
      setStatus('Supabase is not configured, so feedback cannot be saved.');
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('feedback').insert([
      {
        rating,
        message,
      },
    ]);
    setIsSubmitting(false);
    if (error) {
      setStatus(error.message || 'Unable to submit feedback.');
      return;
    }
    setStatus('Thank you! Your feedback was submitted successfully.');
    setRating(5);
    setMessage('');
  };

  return (
    <section className="section page-section feedback-page" style={{ paddingTop: '64px' }}>
      <div className="section-header">
        <div>
          <div className="section-label">Feedback</div>
          <h1 className="section-title">Help us make your next visit even better</h1>
          <p className="section-copy">
            Share your experience with the team at Doctor Animal Auto. Your feedback helps us deliver faster, cleaner
            and more reliable service every time.
          </p>
        </div>
      </div>

      <div className="feedback-grid">
        <div className="feedback-panel">
          <div className="feedback-intro">
            <h3>How satisfied were you with our service?</h3>
            <p>
              Rate our response, workmanship, and customer care. We take every comment seriously and use it to improve
              service quality.
            </p>
          </div>

          <form className="contact-form feedback-form" onSubmit={handleSubmit}>
            {status && <div className="auth-alert">{status}</div>}
            {!supabaseEnabled && (
              <div className="auth-alert warning">
                Supabase is not configured, so feedback cannot be saved yet.
              </div>
            )}
            <div className="feedback-rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={rating === value ? 'rating active' : 'rating'}
                  onClick={() => setRating(value)}
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label>Tell us what went well</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your experience" rows="6" />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        <aside className="feedback-sidebar">
          <div className="contact-card">
            <h4>Why your feedback matters</h4>
            <p>
              Every review helps us tune our processes, improve vehicle health, and deliver the service you deserve.
            </p>
          </div>
          <div className="contact-card">
            <h4>Quick response</h4>
            <p>Our customer support follows up within 24 hours to ensure your issue was resolved.</p>
          </div>
          <div className="contact-card">
            <h4>Trusted by local drivers</h4>
            <p>We support European, American, and Japanese vehicles with honest diagnostics and repairs.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Feedback;
