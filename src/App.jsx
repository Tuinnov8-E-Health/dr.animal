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
      return false;
    }
    setCurrentUser(user);
    showNotif(`Welcome back, ${user.name}!`, 'success');
    return true;
  };

  const register = (name, email) => {
    if (!name || !email) {
      showNotif('Please provide your name and email.', 'error');
      return false;
    }
    const user = { email, name, role: 'client' };
    setCurrentUser(user);
    showNotif('Account created! Welcome to Doctor Animal Auto.', 'success');
    return true;
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

  const clientLinks = [['Portal', '/portal']];
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
      />

      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLogin={login} onRegister={register} />} />
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

function Nav({ currentUser, menuOpen, setMenuOpen, logout, clientLinks, adminLinks }) {
  const role = currentUser?.role;

  return (
    <nav>
      <Link className="nav-logo" to="/" onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="Dr. Animal Autotune" />
        <span>Dr. Animal Autotune</span>
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
            <img src={logo} alt="Dr. Animal Autotune" />
            <span>Dr. Animal Autotune</span>
          </h3>
          <p>Your trusted European and American car care partner since 2010. Expert mechanics, genuine parts, and transparent pricing - all under one roof.</p>
          <p className="footer-location">📍 Corner, Kamakis, Kiambu County, Kenya</p>
        </div>
        <FooterColumn title="Services" links={['Engine Repair', 'Diagnostics', 'Electrical', 'AC Service', 'Transmission']} basePath="/services" />
        <FooterColumn title="Company" links={['About Us', 'Gallery', 'Feedback', 'Contact']} basePath="/" />
        <FooterColumn title="Client" links={['Login', 'Book Service', 'Spare Parts']} basePath="/" />
      </div>
      <div className="footer-bottom">
        <span>© 2025 Doctor Animal Auto. All rights reserved.</span>
        <a href="https://tuinnov8.com" target="_blank" rel="noopener noreferrer" className="builder-link">
          Built with care by Tuinnov8
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, basePath }) {
  const pathMap = {
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
