import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo, heroImages } from '../data';

const perks = [
  { icon: 'fa-solid fa-gauge-high', text: 'Track repair progress in real time' },
  { icon: 'fa-solid fa-file-invoice', text: 'View invoices and service history' },
  { icon: 'fa-solid fa-calendar-check', text: 'Book appointments in under 2 minutes' },
];

function Login({ onLogin, onRegister }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = onLogin(email, password);
    if (user) navigate(user.role === 'admin' ? '/admin' : '/portal');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const user = onRegister(name, email);
    if (user) navigate('/portal');
  };

  return (
    <div className="auth-page">
      <aside className="auth-panel">
        <div className="auth-panel__bg" style={{ '--auth-image': `url(${heroImages.workshop})` }}></div>
        <div className="auth-panel__content">
          <Link className="auth-panel__logo" to="/">
            <img src={logo} alt="Dr. Animal Autotune" />
            <span>Dr. Animal Autotune</span>
          </Link>
          <h1>Your vehicle.<br />Your portal.<br /><span>Total control.</span></h1>
          <p className="auth-panel__lead">
            Sign in to track repairs, view invoices, and book services — all from one place.
          </p>
          <ul className="auth-perks">
            {perks.map((perk) => (
              <li key={perk.text}>
                <i className={perk.icon}></i>
                <span>{perk.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card__header">
            <h2>{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <p>{tab === 'login' ? 'Sign in to access your client portal' : 'Register to start managing your vehicle services'}</p>
          </div>

          <div className="auth-tabs" role="tablist">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              onClick={() => setTab('login')}
            >
              <i className="fa-solid fa-right-to-bracket"></i> Login
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              onClick={() => setTab('register')}
            >
              <i className="fa-solid fa-user-plus"></i> Register
            </button>
          </div>

          {tab === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">Email address</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary auth-submit">
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign in
              </button>
              <div className="auth-demo">
                <span className="auth-demo__label">Demo accounts</span>
                <div className="auth-demo__row">
                  <i className="fa-solid fa-user"></i>
                  <code>client@test.com</code>
                  <span>/</span>
                  <code>client123</code>
                </div>
                <div className="auth-demo__row">
                  <i className="fa-solid fa-crown"></i>
                  <code>admin@doctoranimal.co.ke</code>
                  <span>/</span>
                  <code>admin123</code>
                </div>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="register-name">Full name</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-user"></i>
                  <input
                    id="register-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="John Kamau"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="register-email">Email address</label>
                <div className="auth-input-wrap">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary auth-submit">
                <i className="fa-solid fa-user-plus"></i> Create account
              </button>
              <p className="auth-note">
                By registering you agree to receive service updates about your vehicle.
              </p>
            </form>
          )}

          <p className="auth-back">
            <Link to="/"><i className="fa-solid fa-arrow-left"></i> Back to homepage</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
