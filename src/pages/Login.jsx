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
    <main className="auth-page login-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>{tab === 'login' ? 'Login to your account' : 'Register a new account'}</h1>
          <p>
            {tab === 'login'
              ? 'Access your portal to track your car progress and purchased products.'
              : 'Create your account to manage your service requests and purchased products.'}
          </p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={tab === 'login'}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={tab === 'register'}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        {tab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit">
              Login
            </button>

            <p className="auth-footer">
              Don't have an account? <button type="button" className="auth-link" onClick={() => setTab('register')}>Register here</button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="register-name">Your name</label>
              <input
                id="register-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Firstname Lastname"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password-confirm">Confirm Password</label>
              <input
                id="register-password-confirm"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <label className="auth-checkbox">
              <input type="checkbox" required />
              I agree to the <a href="/terms-of-service">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>
            </label>

            <button type="submit" className="btn-primary auth-submit">
              Register
            </button>

            <p className="auth-footer">
              Already have an account? <button type="button" className="auth-link" onClick={() => setTab('login')}>Login here</button>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

export default Login;
