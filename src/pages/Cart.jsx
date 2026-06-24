import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Cart({ cartItems, setCartItems }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const updateQty = (productId, delta) => {
    setCartItems((items) =>
      items
        .map((item) => (item.id === productId ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const whatsappMessage = cartItems.length
    ? `Is this ${cartItems[0].name} available?`
    : 'Hello, is this item available?';
  const whatsappLink = `https://wa.me/254720862971?text=${encodeURIComponent(whatsappMessage)}`;

  const handleProceedCheckout = () => {
    setShowDisclaimer(true);
    window.setTimeout(() => setShowDisclaimer(false), 4200);
  };

  return (
    <section className="section page-section cart-page" style={{ paddingTop: '64px' }}>
      <div className="section-header">
        <div>
          <div className="section-label">Your Cart</div>
          <h1 className="section-title">Review items before checkout</h1>
          <p className="section-copy">Confirm quantities, update your selection, or request availability by WhatsApp.</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Browse products and add items to get started.</p>
          <Link className="btn-primary" to="/products">
            Shop Products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-table">
            <div className="cart-headings">
              <span>Product</span>
              <span>Qty</span>
              <span>Price</span>
              <span></span>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-row">
                <div className="cart-product">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.make || item.category}</p>
                  </div>
                </div>
                <div className="cart-qty">
                  <button type="button" onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                <div className="cart-price">KES {(item.price * item.qty).toLocaleString()}</div>
                <button className="cart-remove" type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <div className="cart-summary">
              <span>Total</span>
              <strong>KES {total.toLocaleString()}</strong>
            </div>
            <div className="action-buttons">
              <button className="btn-primary" type="button" onClick={handleProceedCheckout}>
                Proceed to Checkout
              </button>
              <a className="btn-secondary whatsapp-btn" href={whatsappLink} target="_blank" rel="noreferrer noopener">
                Request on WhatsApp
              </a>
            </div>
          </div>
          {showDisclaimer && (
            <div className="checkout-disclaimer">
              Checkout is coming soon. Please request your items on WhatsApp instead.
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Cart;
