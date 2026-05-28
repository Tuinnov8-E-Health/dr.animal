import React, { useState } from 'react';

function Feedback() {
  const [rating, setRating] = useState(5);

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Feedback</div>
      <div className="section-title">Tell Us About Your Experience</div>
      <form className="contact-form" style={{ marginTop: '2rem' }}>
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
        <textarea placeholder="Your feedback" rows="6"></textarea>
        <button type="button" className="btn-primary">Submit Feedback</button>
      </form>
    </section>
  );
}

export default Feedback;
