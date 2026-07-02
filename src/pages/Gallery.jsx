import React, { useMemo, useState } from 'react';
import { galleryItems } from '../data';

function Gallery() {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(
    () => ['All', ...new Set(galleryItems.map((item) => item.category))],
    []
  );
  const visibleItems = filter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === filter);

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="products-hero gallery-hero">
        <div className="products-hero-copy">
          <span className="section-label">Gallery</span>
          <h1>Workshop photos and service highlights</h1>
          <p className="section-sub">
            Browse a selection of our best work in the workshop, diagnostics bay, and repair lanes.
          </p>
        </div>
      </div>

      <div className="gallery-filter">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={`type-btn ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {visibleItems.map((item) =>
          item.type === 'video' ? (
            <a
              className="gallery-card gallery-card--video"
              key={item.caption}
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={item.src} alt={item.caption} loading="lazy" />
              <div className="gallery-card__play">
                <i className="fa-solid fa-play"></i>
              </div>
              <figcaption>{item.caption}</figcaption>
            </a>
          ) : (
            <figure className="gallery-card" key={item.caption}>
              <img src={item.src} alt={item.caption} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          )
        )}
      </div>
    </section>
  );
}

export default Gallery;
