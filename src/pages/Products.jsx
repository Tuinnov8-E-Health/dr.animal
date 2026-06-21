import React, { useMemo, useState } from 'react';
import { products as productData } from '../data';

const categoryIcons = {
  filters: 'fa-solid fa-filter',
  engine: 'fa-solid fa-gears',
  brakes: 'fa-solid fa-circle-stop',
  electrical: 'fa-solid fa-bolt',
};

function Products({ addToCart }) {
  const [filter, setFilter] = useState('all');
  const categories = useMemo(() => ['all', ...new Set(productData.map((product) => product.cat))], []);
  const filtered = filter === 'all' ? productData : productData.filter((item) => item.cat === filter);

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Shop Parts</div>
      <div className="section-title">Genuine Car Parts</div>
      <div className="type-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`type-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>
      <ul className="product-list">
        {filtered.map((product) => (
          <li className="product-list__item" key={product.id}>
            <span className="product-list__icon">
              <i className={categoryIcons[product.cat] || 'fa-solid fa-box'}></i>
            </span>
            <div className="product-list__body">
              <div className="product-list__header">
                <h4>{product.name}</h4>
                <span className="product-price">KES {product.price.toLocaleString()}</span>
              </div>
              <p className="product-list__meta">{product.make} · {product.partNo}</p>
              <p>{product.desc}</p>
            </div>
            <button className="cart-btn" type="button" onClick={() => addToCart(product)}>
              Add
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Products;
