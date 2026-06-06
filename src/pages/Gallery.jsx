import React from 'react';
import { galleryItems } from '../data';

function Gallery() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Our Work</div>
      <div className="section-title">Gallery</div>
      <p className="section-sub">A look inside our workshop - real jobs, real precision, real results.</p>
      <div className="gallery-grid" style={{ marginTop: '2rem' }}>
        {galleryItems.map((item, index) => (
          <div className="gallery-item" key={index}>
            <div className="gallery-img">
              <img src={item.src} alt={item.caption} loading="lazy" />
            </div>
            <div className="gallery-desc">
              <h4>{item.caption}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
