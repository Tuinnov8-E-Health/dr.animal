import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { logo, publicLinks, products as productData, demoUsers } from './data';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Portal from './pages/Portal';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = window.setTimeout(() => setNotification(null), 3400);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const logout = () => {
    setMenuOpen(false);
    setCurrentUser(null);
    showNotif('You have been logged out.', 'success');
  };

  const login = (email, password) => {
    const user = demoUsers.find((item) => item.email === email && item.password === password);
    if (!user) {
      showNotif('Invalid email or password.', 'error');
      return null;
    }
    setCurrentUser(user);
    showNotif(`Welcome back, ${user.name}!`, 'success');
    return user;
  };

  const register = (name, email) => {
    if (!name || !email) {
      showNotif('Please provide your name and email.', 'error');
      return null;
    }
    const user = { email, name, role: 'client' };
    setCurrentUser(user);
    showNotif('Account created! Welcome to Doctor Animal Auto.', 'success');
    return user;
  };

  const addToCart = (product) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...items, { ...product, qty: 1 }];
    });
    showNotif(`${product.name} added to cart.`, 'success');
  };

  const clientLinks = [['Dashboard', '/portal']];
  const adminLinks = [['Dashboard', '/admin']];

  return (
    <Router>
      <div className={`notif ${notification ? 'show' : ''} ${notification?.type === 'error' ? 'error' : ''}`}>
        {notification ? `${notification.type === 'success' ? '✓ ' : ''}${notification.message}` : ''}
      </div>

      <Nav
        currentUser={currentUser}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        logout={logout}
        clientLinks={clientLinks}
        adminLinks={adminLinks}
        cartItems={cartItems}
      />

      <a
        className="whatsapp-float"
        href="https://wa.me/254735548605"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin' : '/portal'} replace /> : <Login onLogin={login} onRegister={register} />}
          />
          <Route
            path="/portal"
            element={currentUser?.role === 'client' ? <Portal currentUser={currentUser} cartItems={cartItems} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={currentUser?.role === 'admin' ? <AdminDashboard products={productData} /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

function Nav({ currentUser, menuOpen, setMenuOpen, logout, clientLinks, adminLinks, cartItems }) {
  const role = currentUser?.role;
  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <nav>
      <Link className="nav-logo" to="/" onClick={() => setMenuOpen(false)}>
        {logo && <img src={logo} alt="Dr. Animal Auto Tune" />}
        <span>Dr. Animal Auto Tune</span>
      </Link>
      <button
        className={`nav-hamburger ${menuOpen ? 'active' : ''}`}
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {!role && (
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {publicLinks.map(([label, path]) => (
            <NavLink key={label} to={path} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <NavLink className="nav-cart" to="/cart" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && <span>{cartCount}</span>}
          </NavLink>
          <NavLink className="nav-cta" to="/login" onClick={() => setMenuOpen(false)}>
            Login / Register
          </NavLink>
        </div>
      )}

      {role === 'client' && (
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {clientLinks.map(([label, path]) => (
            <NavLink key={label} to={path} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <NavLink className="nav-cart" to="/cart" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && <span>{cartCount}</span>}
          </NavLink>
          <div className="nav-user">
            <span id="client-name-nav">👤 {currentUser.name}</span>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {adminLinks.map(([label, path]) => (
            <NavLink key={label} to={path} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <NavLink className="nav-cart" to="/cart" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && <span>{cartCount}</span>}
          </NavLink>
          <div className="nav-user nav-user-admin">
            <span>👑 Admin</span>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3 className="footer-logo">
            {logo && <img src={logo} alt="Dr. Animal Auto Tune" />}
            <span>Dr. Animal Auto Tune</span>
          </h3>
          <p>Your trusted European and American car care partner since 2010. Expert mechanics, genuine parts, and transparent pricing — all under one roof.</p>
          <p className="footer-location">📍 Corner, Kamakis, Kiambu County, Kenya</p>
        </div>
        <FooterColumn title="Quick Links" links={['Home', 'Services', 'Gallery', 'Book Now']} basePath="/" />
        <FooterColumn title="Services" links={['Engine Repair', 'Diagnostics', 'Electrical', 'AC Service', 'Transmission']} basePath="/services" />
        <div className="footer-col footer-contact">
          <h4>Contact</h4>
          <a href="tel:+254720862971">+254 720 862 971</a>
          <a href="mailto:info@doctoranimal.co.ke">info@doctoranimal.co.ke</a>
          <p>Karen / Kamakis, Nairobi metropolitan area.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Doctor Animal Auto. All rights reserved.</span>
        <a href="https://tuinnov8.com" target="_blank" rel="noopener noreferrer" className="builder-link">
          Built with care by Tuinnov8
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, basePath }) {
  const pathMap = {
    Home: '/',
    'About Us': '/about',
    Gallery: '/gallery',
    Feedback: '/feedback',
    Contact: '/contact',
    Login: '/login',
    'Book Service': '/booking',
    'Spare Parts': '/products',
  };

  return (
    <div className="footer-col">
      <h4>{title}</h4>
      {links.map((label) => (
        <Link key={label} to={pathMap[label] ?? basePath}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export default App;
