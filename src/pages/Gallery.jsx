import React from 'react';
import { galleryItems } from '../data';

function Gallery() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Our Work</div>
      <div className="section-title">Gallery</div>
      <div className="gallery-grid" style={{ gap: '1rem', marginTop: '2rem' }}>
        {galleryItems.map((src, index) => (
          <div className="gallery-card" key={index}>
            <img src={src} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
