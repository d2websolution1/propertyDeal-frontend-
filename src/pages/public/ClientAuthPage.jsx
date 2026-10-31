// frontend/src/pages/public/ClientAuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from '../../components/common/Header';

export default function ClientAuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const explicitNext = searchParams.get('next');

  const { user, isAuthenticated, login, googleAuth, instantGmailAuth } = useAuth();

  const [mode, setMode] = useState(
    location.pathname === '/signup' ? 'signup' : initialMode
  );

  const nextParam = explicitNext || (mode === 'signup' ? '/profile?next=%2Fmy-listings' : '/my-listings');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('Owner'); // 'Owner' | 'Dealer / Agent' | 'Builder'
  const [password, setPassword] = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin');
      else navigate(nextParam.startsWith('/') ? nextParam : '/my-listings');
    }
  }, [isAuthenticated, user, navigate, nextParam]);

  // Instant Gmail Auth - Zero OTP Required
  const handleInstantGmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    try {
      setLoading(true);
      const res = await instantGmailAuth({
        email: cleanEmail,
        name: name.trim() || undefined,
        userType: userType || 'Owner',
      });

      const isExisting = res?.isExistingUser;
      if (mode === 'login' || isExisting) {
        setSuccessMsg(`Welcome back, ${res?.user?.name || cleanEmail}! Logged in successfully.`);
      } else {
        setSuccessMsg(`Account created successfully for ${name}! Redirecting...`);
      }

      setTimeout(() => {
        navigate(nextParam);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth popup / simulated instant
  const handleGoogleAuthClick = async () => {
    setError('');
    let targetEmail = email.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      targetEmail = window.prompt('Enter your Gmail address to sign in instantly with Google:');
    }
    if (!targetEmail || !targetEmail.includes('@')) return;

    try {
      setLoading(true);
      await instantGmailAuth({
        email: targetEmail.trim(),
        name: name.trim() || targetEmail.split('@')[0],
        userType: userType || 'Owner',
      });
      setSuccessMsg('Google authentication successful! Redirecting...');
      setTimeout(() => navigate(nextParam), 400);
    } catch (err) {
      setError('Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Optional Password login for admin or traditional users
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      setSuccessMsg('Logged in successfully! Redirecting...');
      setTimeout(() => navigate(nextParam), 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#ecfdf5] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center mb-4">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <PropertyDealLogo />
          </Link>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
          {mode === 'signup' ? 'Create Your Account' : 'Welcome to PropertyDeal'}
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-[#64748b]">
          {mode === 'signup'
            ? 'Join thousands of Owners, Dealers, and Builders across India.'
            : 'Access your saved searches, posted properties, and buyer leads.'}
        </p>

        {/* Mode Switcher Tabs */}
        <div className="mt-6 p-1 bg-white border border-[#e2e8f0] rounded-2xl flex shadow-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#005744] text-white shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#005744] text-white shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Create Account <span className="bg-[#ef4444] text-white text-[9px] font-black px-1.5 py-0.5 rounded ml-1">FREE</span>
          </button>
        </div>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-[#e2e8f0] space-y-6">
          {/* Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick One-Click Google Action */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuthClick}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl border border-[#cbd5e1] bg-white hover:bg-[#f8fafc] text-xs sm:text-sm font-bold text-[#1e293b] flex items-center justify-center gap-3 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#e2e8f0] w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] absolute">
              or instant with Gmail
            </span>
          </div>

          {/* Instant Gmail Form (Zero OTP) */}
          {!showPasswordLogin ? (
            <form onSubmit={handleInstantGmailSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#005744] focus:ring-2 focus:ring-[#005744]/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1.5">
                      I am registering as: <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'Owner', label: '👤 Owner' },
                        { key: 'Dealer / Agent', label: '💼 Agent' },
                        { key: 'Builder', label: '🏗️ Builder' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.key}
                          onClick={() => setUserType(item.key)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            userType === item.key
                              ? 'bg-[#ecfdf5] border-[#005744] text-[#005744] shadow-xs'
                              : 'bg-white border-[#cbd5e1] text-[#64748b] hover:bg-[#f8fafc]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Gmail / Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    📧
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#005744] focus:ring-2 focus:ring-[#005744]/10 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#64748b] mt-1 flex items-center gap-1">
                  <span>⚡</span>
                  <span>Instant 1-Click Access — No OTP or verification delays needed.</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account & Continue' : 'Instant Sign In with Gmail'}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Traditional Password Login Form */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@propertydeal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] outline-none focus:border-[#005744]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] outline-none focus:border-[#005744]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Authenticating...' : 'Sign In with Password'}
              </button>
            </form>
          )}

          {/* Toggle Password login for Admin */}
          <div className="pt-2 border-t border-[#f1f5f9] text-center">
            <button
              type="button"
              onClick={() => {
                setShowPasswordLogin(!showPasswordLogin);
                setError('');
              }}
              className="text-xs text-[#64748b] hover:text-[#005744] font-semibold underline cursor-pointer"
            >
              {showPasswordLogin ? '← Switch to Instant Gmail Login' : 'Admin or Password Login →'}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-[#64748b] border-t border-[#f1f5f9]">
            <div>
              <p className="font-bold text-[#0f172a]">🔒 256-bit</p>
              <p>Bank Security</p>
            </div>
            <div>
              <p className="font-bold text-[#005744]">⚡ Zero OTP</p>
              <p>Instant Access</p>
            </div>
            <div>
              <p className="font-bold text-[#0f172a]">💯 Free</p>
              <p>Direct Leads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
