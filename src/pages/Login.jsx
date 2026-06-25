import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo, heroImages } from '../data';

const perks = [
  { icon: 'fa-solid fa-gauge-high', text: 'Track repair progress in real time' },
  { icon: 'fa-solid fa-file-invoice', text: 'View invoices and service history' },
  { icon: 'fa-solid fa-calendar-check', text: 'Book appointments in under 2 minutes' },
];

function Login({ onLogin, onRegister, supabaseEnabled }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthStatus('');
    const result = await onLogin(email, password);
    if (result?.user) {
      setAuthStatus('Login successful! Redirecting...');
      window.setTimeout(() => {
        navigate(result.user.role === 'admin' ? '/admin' : '/portal');
      }, 700);
      return;
    }
    const errorMessage = result?.error || 'Login failed. Check your email, password, or connection.';
    if (errorMessage.toLowerCase().includes('confirm') || errorMessage.toLowerCase().includes('confirmed')) {
      setAuthError('Your email has not been confirmed. Please verify your account from the confirmation email.');
      return;
    }
    setAuthError(errorMessage);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthStatus('');
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    const result = await onRegister(name, email, password);
    if (result?.requiresEmailConfirmation) {
      setAuthStatus('Registration successful. Check your email and confirm your account before logging in.');
      return;
    }
    if (result?.user) {
      setAuthStatus('Registration successful! Redirecting to your portal...');
      window.setTimeout(() => {
        navigate('/portal');
      }, 900);
      return;
    }
    setAuthError(result?.error || 'Registration failed. Check your details or connection.');
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
            {authError && <div className="auth-alert error">{authError}</div>}
            {authStatus && <div className="auth-alert success">{authStatus}</div>}
            {!supabaseEnabled && (
              <div className="auth-alert warning">
                Supabase is not configured. Only demo login is available locally.
              </div>
            )}
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

            <div className="form-group password-field">
              <label htmlFor="login-password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
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
            {authError && <div className="auth-alert error">{authError}</div>}
            {authStatus && <div className="auth-alert success">{authStatus}</div>}
            {!supabaseEnabled && (
              <div className="auth-alert warning">
                Supabase is not configured. Only demo registration is available locally.
              </div>
            )}
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

            <div className="form-group password-field">
              <label htmlFor="register-password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
            </div>

            <div className="form-group password-field">
              <label htmlFor="register-password-confirm">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  id="register-password-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <i className={showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
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
