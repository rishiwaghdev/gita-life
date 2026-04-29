import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/gita-life-logo.png';
import sitaBackground from '../assets/sita-login-bg.png';

const PublicForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', location: '', college: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      await api.post('/leads', formData);
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', location: '', college: '' });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
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
      <div className="devotional-panel p-6 sm:p-8 w-full max-w-xl relative z-10 bg-[#fffef9]/94 shadow-2xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Gita Life Program logo"
              className="h-20 w-20 rounded-[24px] border border-[#f4d8a5] object-cover shadow-lg"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6d4a]">Student Registration</p>
              <h1 className="mb-2 text-3xl sm:text-4xl font-bold text-primary-700">Discover Yourself</h1>
              <p className="devotional-muted">Join the Gita Life Program by ISKCON</p>
            </div>
          </div>
          <Link
            to="/login"
            className="text-sm font-semibold text-primary-700 border border-primary-700 px-4 py-2 rounded-lg hover:bg-primary-700 hover:text-white transition-colors shrink-0"
          >
            Admin Login
          </Link>
        </div>
        {status === 'success' ? (
          <div className="bg-[#eef8e8] text-[#315d17] p-4 rounded-lg text-center border border-[#c6e2b6]">
            <p className="font-semibold">Thank you for registering!</p>
            <p className="text-sm mt-1">We will contact you by email shortly.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-4 text-primary-700 hover:text-primary-600 text-sm font-medium"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5e4738] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="devotional-input"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5e4738] mb-1">WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="devotional-input"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5e4738] mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="devotional-input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5e4738] mb-1">Current Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="devotional-input"
                placeholder="City, Area"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5e4738] mb-1">College/University</label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData({...formData, college: e.target.value})}
                className="devotional-input"
                placeholder="Name of your college"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-700 text-sm">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full devotional-btn py-3 flex justify-center items-center"
            >
              {status === 'loading' ? 'Submitting...' : 'Register Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PublicForm;
