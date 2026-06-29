import { useState } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/auth';

export default function AuthModal({ onAuth, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin
      ? { email: form.email, password: form.password }
      : { username: form.username, email: form.email, password: form.password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth(data.token, data.user);
    } catch {
      setError('Could not connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setForm({ username: '', email: '', password: '' });
    setError('');
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal-card">
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            {isLogin ? <LogIn size={26} /> : <UserPlus size={26} />}
          </div>
          <h2>{isLogin ? 'Sign in to save tasks' : 'Create an account'}</h2>
          <p>{isLogin ? 'Your tasks will be saved to your account' : 'Free forever — no credit card needed'}</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="m-username">Username</label>
              <div className="auth-input-wrap">
                <User size={17} className="auth-input-icon" />
                <input
                  id="m-username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="m-email">Email</label>
            <div className="auth-input-wrap">
              <Mail size={17} className="auth-input-icon" />
              <input
                id="m-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="m-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
              <input
                id="m-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                value={form.password}
                onChange={handleChange}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={switchMode} className="auth-switch-btn">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
