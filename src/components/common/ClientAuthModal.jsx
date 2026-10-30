// frontend/src/components/common/ClientAuthModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from './Header';

const ClientAuthModal = ({ isOpen, onClose, initialMode = 'login', nextUrl = '/profile?next=%2Fmy-listings' }) => {
  const navigate = useNavigate();
  const { login, register, sendOtp, verifyOtp, googleAuth, instantGmailAuth } = useAuth();

  // 'instant' | 'otp' | 'password'
  const [authMethod, setAuthMethod] = useState('instant');
  // 'login' or 'signup'
  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // OTP flow state
  const [otpStep, setOtpStep] = useState(1);
  const [previewOtp, setPreviewOtp] = useState('');
  const [timer, setTimer] = useState(0);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setError('');
    setSuccessMsg('');
    setOtpStep(1);

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

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  // 1. Instant Gmail Auth without OTP
  const handleInstantGmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    try {
      setLoading(true);
      await instantGmailAuth({
        email: email.trim(),
        name: name?.trim() || undefined,
      });

      setSuccessMsg('Account verified instantly! Opening profile...');
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp({
        email,
        name: mode === 'signup' ? name : undefined,
        phone,
        type: mode,
      });

      setOtpStep(2);
      setTimer(30);
      setSuccessMsg(res.message || `Verification OTP sent to ${email}`);
      if (res.previewOtp) {
        setPreviewOtp(res.previewOtp);
        setOtp(String(res.previewOtp));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      await verifyOtp({
        email,
        otp: otp.trim(),
        name: mode === 'signup' ? name : undefined,
        phone,
      });

      setSuccessMsg('Authentication successful!');
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Email + Password Login / Register
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'signup') {
        if (!name) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        await register({ name, email, password, phone, role: 'user' });
      } else {
        await login(email, password);
      }

      setSuccessMsg(`${mode === 'signup' ? 'Account created' : 'Logged in'} successfully!`);
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Quick Google Client Authentication
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const targetEmail = email || 'princerajput5868@gmail.com';
      await googleAuth({
        email: targetEmail,
        name: name || 'Google Verified Client',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
      setSuccessMsg('Logged in via Google successfully!');
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 z-[100000] w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="Close modal"
        title="Close (Esc)"
      >
        ✕
      </button>

      <div
        className="relative w-full max-w-md my-auto bg-white rounded-3xl shadow-2xl border border-[#e2e8f0] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-[#005744] to-[#043d30] p-5 sm:p-6 text-white text-center relative flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center font-bold text-base transition-transform hover:scale-110 active:scale-90 cursor-pointer shadow-sm"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="flex justify-center mb-2">
            <div className="bg-white px-3.5 py-1.5 rounded-xl shadow-md">
              <PropertyDealLogo height={38} className="h-9 w-auto" />
            </div>
          </div>
          <h3 className="text-xl font-black tracking-tight">
            {mode === 'signup' ? 'Create Account' : 'Welcome to HomesWale'}
          </h3>
          <p className="text-xs text-[#a7f3d0] mt-1">
            Access verified properties, contact owners directly & track inquiries.
          </p>

          {/* Auth Method Pills */}
          <div className="mt-4 flex items-center justify-center gap-1.5 bg-white/15 p-1 rounded-xl backdrop-blur-xs max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => { setAuthMethod('instant'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMethod === 'instant' ? 'bg-white text-[#005744] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              ⚡ Instant Gmail
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('otp'); setOtpStep(1); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMethod === 'otp' ? 'bg-white text-[#005744] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              ✉️ OTP
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMethod === 'password' ? 'bg-white text-[#005744] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              🔑 Password
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── METHOD 1: INSTANT GMAIL AUTH (NO OTP) ── */}
          {authMethod === 'instant' && (
            <form onSubmit={handleInstantGmailSubmit} className="space-y-4">
              <div className="p-3 bg-[#ecfdf5] rounded-xl border border-[#a7f3d0] text-center">
                <span className="text-xs font-bold text-[#005744] flex items-center justify-center gap-1.5">
                  <span>⚡</span> Instant Login & Sign Up (No OTP)
                </span>
                <p className="text-[11px] text-[#065f46] mt-0.5">
                  Enter your Gmail to create or access your profile immediately.
                </p>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prince Kumar"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Gmail / Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. princerajput5868@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <span>Authenticating...</span> : <span>Continue with Gmail (No OTP) →</span>}
              </button>
            </form>
          )}

          {/* ── METHOD 2: GMAIL OTP AUTH ── */}
          {authMethod === 'otp' && (
            <div>
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Prince Kumar"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Email Address (Gmail) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? <span>Sending OTP...</span> : <span>Send OTP to Email →</span>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-[#eff6ff] rounded-xl border border-[#bfdbfe] text-center">
                    <p className="text-xs text-[#1e40af]">
                      6-digit verification code sent to:
                    </p>
                    <strong className="block text-xs sm:text-sm text-[#0f172a] mt-0.5 truncate">
                      {email}
                    </strong>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1 text-center">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[10px] text-xl font-black py-3 rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? <span>Verifying OTP...</span> : <span>Verify & Log In</span>}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#64748b] pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="hover:text-[#005744] underline cursor-pointer"
                    >
                      Change Email
                    </button>
                    {timer > 0 ? (
                      <span>Resend in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#005744] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── METHOD 3: PASSWORD AUTH ── */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. client@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#005744] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span>{mode === 'signup' ? 'Create Account' : 'Sign In with Password'}</span>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2e8f0]"></div>
            </div>
            <span className="relative bg-white px-2 text-[11px] font-bold text-[#94a3b8] uppercase">
              Or continue with
            </span>
          </div>

          {/* Social Login */}
          <div className="w-full">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] text-xs font-bold text-[#0f172a] flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-[#64748b]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setOtpStep(1); setError(''); }}
                  className="font-bold text-[#005744] hover:underline cursor-pointer"
                >
                  Sign Up Free
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#64748b]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setOtpStep(1); setError(''); }}
                  className="font-bold text-[#005744] hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>

          {/* Subtle Admin Portal Link & Cancel Action */}
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex flex-col items-center gap-2 text-center">
            <Link
              to="/admin/login"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#94a3b8] hover:text-[#005744] transition-colors"
            >
              <span>🛡️ Are you an Administrator? Access Admin Portal →</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              ✕ Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};

export default ClientAuthModal;
