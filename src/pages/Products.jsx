import React, { useMemo, useState } from 'react';
import { products as productData } from '../data';

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
      <div className="products-grid" id="products-grid">
        {filtered.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-img">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <div className="product-title-row">
                <h4>{product.name}</h4>
              </div>
              <p>{product.desc}</p>
              <div className="product-footer">
                <span className="product-price">KES {product.price.toLocaleString()}</span>
                <button className="cart-btn" type="button" onClick={() => addToCart(product)}>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
