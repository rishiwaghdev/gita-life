import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import registrationHero from '../assets/registration-hero.png';

const PublicForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', location: '', college: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/leads', formData);
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', location: '', college: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div
        className="registration-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${registrationHero})` }}
      />
      <div className="registration-light absolute inset-0 bg-gradient-to-r from-[#ffffff0d] via-[#ffd27b33] to-[#ffffff0d]" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="devotional-panel p-8 w-full max-w-md relative z-10 backdrop-blur-sm bg-[#fffef9]/95">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary-700 mb-2">Discover Yourself</h1>
            <p className="devotional-muted">Join the Gita Life Program by ISKCON</p>
          </div>
          <Link
            to="/login"
            className="text-sm font-semibold text-primary-700 border border-primary-700 px-4 py-2 rounded-lg hover:bg-primary-700 hover:text-white transition-colors"
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
              <p className="text-red-700 text-sm">Something went wrong. Please try again.</p>
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
