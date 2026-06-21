import React from 'react';
import { SplitLayout } from '../components/ContentLayout';
import { galleryItems } from '../data';

function Gallery() {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Our Work</div>
      <div className="section-title">Gallery</div>
      <p className="section-sub">A look inside our workshop — real jobs, real precision, real results.</p>

      <SplitLayout
        images={[
          { src: galleryItems[0].src, alt: galleryItems[0].caption },
          { src: galleryItems[1].src, alt: galleryItems[1].caption },
        ]}
      >
        <ul className="caption-list">
          {galleryItems.map((item) => (
            <li key={item.caption}>
              <i className="fa-solid fa-wrench"></i>
              <span>{item.caption}</span>
            </li>
          ))}
        </ul>
      </SplitLayout>

      <div className="gallery-strip">
        {galleryItems.map((item) => (
          <figure className="gallery-strip__item" key={item.caption}>
            <img src={item.src} alt={item.caption} loading="lazy" />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
