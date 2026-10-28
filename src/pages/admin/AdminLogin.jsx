// frontend/src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from '../../components/common/Header';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser?.role !== 'admin') {
        setError('Access denied. This account does not have administrator privileges.');
        setLoading(false);
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
          'Invalid credentials. Please verify your administrator email and password.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Decorative ambient subtle background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top back link */}
      <div className="relative z-10 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748b] hover:text-[#0f172a] transition-colors bg-white px-3.5 py-1.5 rounded-full border border-[#e2e8f0] shadow-xs"
        >
          <span>←</span>
          <span>Back to PropertyDeal Website</span>
        </Link>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-8 sm:p-10 animate-hw-fade">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <PropertyDealLogo height={48} className="h-12 w-auto" />
          <span className="mt-2.5 text-[10.5px] font-black uppercase tracking-widest text-[#2563eb] bg-[#eff6ff] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
            SECURE ADMIN PORTAL
          </span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Enter your credentials to access the administrative control dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl mb-5 flex items-start gap-2">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="name@domain.com"
              className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all bg-[#f8fafc]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all bg-[#f8fafc]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 mt-2 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Admin Panel →</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#f1f5f9] text-center">
          <p className="text-[11px] text-[#64748b]">
            Protected by PropertyDeal Authentication & SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;