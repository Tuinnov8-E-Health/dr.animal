import React, { useMemo, useState } from 'react';
import { galleryItems } from '../data';

function Gallery() {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(
    () => ['All', ...new Set(galleryItems.map((item) => item.category))],
    []
  );
  const visibleItems = filter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === filter);

  const getEmbedUrl = (url) => {
    try {
      // Expect YouTube shorts like: https://www.youtube.com/shorts/<id>
      const m = url.match(/shorts\/(.+?)(\?|$)/);
      const id = m ? m[1] : null;
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
    } catch (e) {
      return url;
    }
  };

  const [showVideoUrl, setShowVideoUrl] = useState(null);

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
            <button
              className="gallery-card gallery-card--video"
              key={item.caption}
              type="button"
              onClick={() => setShowVideoUrl(item.url)}
              aria-label={`Play video: ${item.caption}`}
            >
              <img src={item.src} alt={item.caption} loading="lazy" />
              <div className="gallery-card__play">
                <i className="fa-solid fa-play"></i>
              </div>
              <figcaption>{item.caption}</figcaption>
            </button>
          ) : (
            <figure className="gallery-card" key={item.caption}>
              <img src={item.src} alt={item.caption} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          )
        )}
      </div>
      {showVideoUrl && (
        <div className="hero-video-modal" onClick={() => setShowVideoUrl(null)} role="dialog" aria-modal="true">
          <div className="hero-video-container" onClick={(e) => e.stopPropagation()}>
            <button className="hero-video-close" type="button" onClick={() => setShowVideoUrl(null)} aria-label="Close video">
              <span aria-hidden="true">×</span>
            </button>
            <iframe
              src={getEmbedUrl(showVideoUrl)}
              title="Gallery video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
