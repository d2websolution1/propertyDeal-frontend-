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
        setError('This account does not have admin privileges.');
        setLoading(false);
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
          'Invalid email or password. Please verify your admin credentials.'
      );
      setLoading(false);
    }
  };

  const fillCredentials = (adminEmail = 'admin@propertydeal.com', adminPass = 'admin123') => {
    setEmail(adminEmail);
    setPassword(adminPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
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
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-8 sm:p-10 animate-hw-fade">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <PropertyDealLogo height={48} className="h-12 w-auto" />
          <span className="mt-2.5 text-[10.5px] font-black uppercase tracking-widest text-[#2563eb] bg-[#eff6ff] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
            ADMINISTRATOR PORTAL
          </span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
            Sign In to Admin Panel
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Manage listings, users, approvals, content & SEO settings.
          </p>
        </div>

        {/* Credentials helper box */}
        <div className="mb-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1">
              <span>🔑</span>
              <span>Admin Credentials:</span>
            </span>
            <button
              type="button"
              onClick={() => fillCredentials('admin@propertydeal.com', 'admin123')}
              className="text-[11px] font-black text-white bg-[#2563eb] hover:bg-[#1d4ed8] px-2.5 py-1 rounded-lg transition-colors shadow-xs"
            >
              1-Click Auto Fill
            </button>
          </div>
          <div className="text-xs space-y-1 font-mono text-[#0f172a]">
            <div>
              <span className="text-[#64748b]">Email:</span>{' '}
              <strong className="text-[#2563eb]">admin@propertydeal.com</strong>
            </div>
            <div>
              <span className="text-[#64748b]">Password:</span>{' '}
              <strong className="text-[#2563eb]">admin123</strong>
            </div>
          </div>
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
              placeholder="admin@propertydeal.com"
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
              placeholder="••••••••"
              className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all bg-[#f8fafc]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Admin Panel →</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#f1f5f9] text-center">
          <p className="text-[11px] text-[#64748b]">
            Need help? Contact support at{' '}
            <a href="tel:+919876543210" className="text-[#2563eb] font-bold hover:underline">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;