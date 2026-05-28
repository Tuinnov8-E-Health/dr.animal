import React from 'react';

function AdminDashboard({ products }) {
  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Admin Dashboard</div>
      <div className="section-title">Manage Inventory & Overview</div>
      <div className="section" style={{ marginTop: '2rem' }}>
        <div className="cards-grid">
          <div className="card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="card">
            <h3>Active Categories</h3>
            <p>{new Set(products.map((product) => product.cat)).size}</p>
          </div>
          <div className="card">
            <h3>Top Service</h3>
            <p>Engine Repair</p>
          </div>
        </div>
        <div className="card" style={{ marginTop: '2rem' }}>
          <h4>Part Catalog</h4>
          <div className="table-responsive">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.cat}</td>
                    <td>KES {product.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
