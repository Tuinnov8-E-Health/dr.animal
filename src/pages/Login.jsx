import React, { useState } from 'react';

function Login({ onLogin, onRegister }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <section className="section page-section" style={{ paddingTop: '64px' }}>
      <div className="section-label">Login / Register</div>
      <div className="section-title">Access Your Account</div>
      <div className="auth-tabs" style={{ marginTop: '2rem' }}>
        <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} type="button" onClick={() => setTab('login')}>
          Login
        </button>
        <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} type="button" onClick={() => setTab('register')}>
          Register
        </button>
      </div>
      {tab === 'login' ? (
        <form className="contact-form" style={{ marginTop: '1.5rem' }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button type="button" className="btn-primary" onClick={() => onLogin(email, password)}>
            Login
          </button>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Use <strong>client@test.com / client123</strong> or <strong>admin@doctoranimal.co.ke / admin123</strong>.
          </p>
        </form>
      ) : (
        <form className="contact-form" style={{ marginTop: '1.5rem' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" />
          <button type="button" className="btn-primary" onClick={() => onRegister(name, email)}>
            Create Account
          </button>
        </form>
      )}
    </section>
  );
}

export default Login;
