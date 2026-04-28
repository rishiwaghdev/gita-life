import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import logo from '../assets/gita-life-logo.png';
import sitaBackground from '../assets/sita-login-bg.png';

const Login = () => {
  const { login, admin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div
        className="auth-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sitaBackground})` }}
      />
      <div className="auth-bg-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-[#08152f]/55" />

      <div className="devotional-panel p-8 w-full max-w-md relative z-10 backdrop-blur-md bg-[#fffef9]/92 shadow-2xl">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Gita Life Program logo"
            className="mx-auto mb-4 h-24 w-24 rounded-[28px] border border-[#f4d8a5] object-cover shadow-lg"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6d4a]">Admin Portal</p>
          <h1 className="mt-2 text-3xl font-bold text-primary-700">Gita Life Program</h1>
          <p className="devotional-muted text-sm mt-1">Sign in to manage students, batches, and attendance.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5e4738] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="devotional-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5e4738] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="devotional-input"
            />
          </div>
          
          {error && <p className="text-red-700 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full devotional-btn"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
