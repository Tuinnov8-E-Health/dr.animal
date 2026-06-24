import React, { useState } from 'react';
import { products as productData, vehicles } from '../data';

const viewCategories = [
  { id: 'spare parts', title: 'Spare Parts' },
  { id: 'cars', title: 'Cars' },
];

function Products({ addToCart }) {
  const [filter, setFilter] = useState('spare parts');
  const filtered = filter === 'cars' ? vehicles : productData;

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div
        className="products-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 39, 0.72), rgba(15, 23, 39, 0.18)), url(/images/part1.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="products-hero-copy">
          <span className="section-label">Shop Parts</span>
          <h1>Buy genuine car parts and accessories</h1>
          <p className="section-sub">
            Explore brand new and second-hand cars to find the perfect ride for you, then shop premium parts and accessories to keep it running great.
          </p>
        </div>
      </div>

      <div className="type-filter">
        {viewCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`type-btn ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map((item) => (
          <article key={item.id} className="product-card">
            <div className="product-thumb">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="product-body">
              <span className="product-category">{filter === 'cars' ? item.category : item.make}</span>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
            <div className="product-footer">
              <strong className="product-price">KES {item.price.toLocaleString()}</strong>
              <button className="product-link" type="button" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;
