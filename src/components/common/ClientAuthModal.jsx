// frontend/src/components/common/ClientAuthModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from './Header';

const ClientAuthModal = ({ isOpen, onClose, initialMode = 'login', nextUrl = '/my-listings' }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Owner');
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Free Starter (30 Days)', days: 30, price: '₹0' });
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setError('');
    setSuccessMsg('');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, initialMode, onClose]);

  // Adjust default plan when userType changes
  useEffect(() => {
    if (userType === 'Dealer / Agent') {
      setSelectedPlan({ name: 'Pro Agent Plan (90 Days)', days: 90, price: '₹999' });
    } else {
      setSelectedPlan({ name: 'Free Starter (30 Days)', days: 30, price: '₹0' });
    }
  }, [userType]);

  if (!isOpen) return null;

  // Sign In with Gmail & Password
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your Gmail / Email and Password.');
      return;
    }

    try {
      setLoading(true);
      await login(cleanEmail, cleanPassword);
      setSuccessMsg('Welcome back! Logged in successfully.');
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Gmail or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Direct Account Creation (Name + Mobile + Gmail + Password - No OTP)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Please set a password of at least 6 characters.');
      return;
    }

    const cleanPhone = rawDigits.length === 10 ? `+91${rawDigits}` : `+${rawDigits}`;

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: cleanEmail,
        password: password.trim(),
        phone: cleanPhone,
        userType: userType || 'Owner',
        activePlan: selectedPlan.name,
        validityDays: selectedPlan.days,
      });

      setSuccessMsg(`Welcome ${name}! Your account has been created successfully.`);
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#142D4E]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 font-sans max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
          <PropertyDealLogo height={38} />
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F5F8] hover:bg-slate-200 flex items-center justify-center text-[#64748B] font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex bg-[#F3F5F8] p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${mode === 'login'
                ? 'bg-[#142D4E] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#142D4E]'
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
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${mode === 'signup'
                ? 'bg-[#142D4E] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#142D4E]'
                }`}
            >
              Create Account <span className="bg-[#D62839] text-white text-[9px] font-black px-1.5 py-0.2 rounded ml-1">FREE</span>
            </button>
          </div>

          {/* Title Header */}
          <div className="text-center">
            <h3 className="text-xl font-black text-[#142D4E]">
              {mode === 'signup' ? 'Create Your Account' : 'Sign In with Gmail & Password'}
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              {mode === 'signup'
                ? 'Enter your name, mobile number, Gmail & password to start posting'
                : 'Enter your registered Gmail & password to access your dashboard'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <span>🎉</span>
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* ── SIGN IN FORM: GMAIL & PASSWORD ── */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">
                  Gmail / Email Address <span className="text-[#D62839]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">
                  Password <span className="text-[#D62839]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : 'Sign In with Password →'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="text-xs font-bold text-[#D62839] hover:underline cursor-pointer"
                >
                  Create Account FREE
                </button>
              </div>
            </form>
          ) : (
            /* ── SIGN UP FORM: NAME + MOBILE + GMAIL + PASSWORD (NO OTP) ── */
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">
                  Full Name <span className="text-[#D62839]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">
                  Mobile Number <span className="text-[#D62839]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 border-r border-slate-300 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-14 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">
                  Gmail / Email Address <span className="text-[#D62839]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. amit@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1">
                  Set Password <span className="text-[#D62839]">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Choose password (minimum 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                />
              </div>

              {/* Account Type Selection: Owner vs Dealer / Agent */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                  I am registering as: <span className="text-[#D62839]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserType('Owner')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${userType === 'Owner'
                      ? 'border-[#D62839] bg-[#fff1f2] text-[#D62839] font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className="text-base mb-0.5">🏡</div>
                    <div className="text-xs font-bold">Individual Owner</div>
                    <div className="text-[10px] text-slate-500">Post own property</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType('Dealer / Agent')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${userType === 'Dealer / Agent'
                      ? 'border-[#D62839] bg-[#fff1f2] text-[#D62839] font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className="text-base mb-0.5">🤝</div>
                    <div className="text-xs font-bold">Dealer / Agent</div>
                    <div className="text-[10px] text-slate-500">Broker / Real Estate</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-98"
              >
                {loading ? 'Creating Account...' : 'Create Account & Sign In →'}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                >
                  Sign In with Password
                </button>
              </div>
            </form>
          )}

          {/* Terms text */}
          <div className="pt-2 text-center text-[10.5px] text-[#64748B]">
            By proceeding, you agree to Property Adda's{' '}
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#142D4E] font-bold underline hover:text-[#D62839]"
            >
              Terms of Use
            </a>{' '}
            &{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#142D4E] font-bold underline hover:text-[#D62839]"
            >
              Privacy Policy
            </a>.
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ClientAuthModal;
