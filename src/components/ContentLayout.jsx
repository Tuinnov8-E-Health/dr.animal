import React from 'react';

export function SideImages({ images }) {
  if (!images?.length) return null;
  return (
    <div className="side-images">
      {images.map((image) => (
        <figure className="side-image" key={image.src}>
          <img src={image.src} alt={image.alt} loading="lazy" />
          {image.label && <figcaption>{image.label}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

export function SplitLayout({ children, images, reverse = false, className = '' }) {
  return (
    <div className={`split-layout ${reverse ? 'split-layout--reverse' : ''} ${className}`.trim()}>
      <div className="split-layout__main">{children}</div>
      <SideImages images={images} />
    </div>
  );
}

export function IconList({ items, numbered = false }) {
  return (
    <ul className="icon-list">
      {items.map((item, i) => (
        <li className="icon-list__item" key={item.title || item.name}>
          {numbered ? (
            <span className="icon-list__num">{String(i + 1).padStart(2, '0')}</span>
          ) : (
            <span className="icon-list__icon">
              <i className={item.icon || 'fa-solid fa-circle'}></i>
            </span>
          )}
          <div className="icon-list__body">
            <h3>{item.title || item.name}</h3>
            {item.role && <p className="icon-list__meta">{item.role}</p>}
            <p>{item.desc || item.shortDesc}</p>
          </div>
          {item.action}
        </li>
      ))}
    </ul>
  );
}

export function shortDesc(text, max = 100) {
  const sentence = text.split('.')[0];
  if (sentence.length <= max) return `${sentence}.`;
  return `${sentence.slice(0, max).trim()}…`;
}
