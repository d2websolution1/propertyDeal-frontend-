// frontend/src/components/common/ClientAuthModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from './Header';

const ClientAuthModal = ({ isOpen, onClose, initialMode = 'login', nextUrl = '/my-listings' }) => {
  const navigate = useNavigate();
  const { login, instantGmailAuth, mobileRegister, mobileLogin } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [authMethod, setAuthMethod] = useState('gmail'); // 'gmail' | 'mobile'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Owner');
  const [password, setPassword] = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setError('');
    setSuccessMsg('');
    setShowPasswordLogin(false);

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

  if (!isOpen) return null;

  // Instant Gmail Auth without OTP
  const handleInstantGmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      const rawDigits = phone.replace(/\D/g, '');
      if (rawDigits.length < 10) {
        setError('Mobile number is mandatory. Please enter a valid 10-digit phone number.');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await instantGmailAuth({
        email: cleanEmail,
        name: name.trim() || undefined,
        phone: phone ? phone.trim() : undefined,
        userType: userType || 'Owner',
      });

      setSuccessMsg(
        mode === 'signup'
          ? `Welcome ${name}! Your account is ready.`
          : `Logged in successfully as ${res?.user?.name || cleanEmail}!`
      );

      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mobile Auth Submit (Registration or Login)
  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const cleanPhone = rawDigits.length === 10 ? `+91${rawDigits}` : `+${rawDigits}`;

    try {
      setLoading(true);
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }

        const res = await mobileRegister({
          phone: cleanPhone,
          name: name.trim(),
          password: password || undefined,
          userType: userType || 'Owner',
        });

        setSuccessMsg(`Welcome ${name}! Your account has been registered with mobile ${cleanPhone}.`);
      } else {
        // Mobile Login
        const res = await mobileLogin({
          phone: cleanPhone,
          password: password || undefined,
        });

        setSuccessMsg(`Welcome back, ${res?.name || 'User'}!`);
      }

      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Mobile authentication failed. Please check your number.');
    } finally {
      setLoading(false);
    }
  };

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
      setSuccessMsg('Logged in with Google successfully!');
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 300);
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Password Login
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setLoading(true);
      await login(email.trim(), password);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
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
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#005744] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
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
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#005744] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account <span className="bg-[#ef4444] text-white text-[9px] font-black px-1.5 py-0.2 rounded ml-1">FREE</span>
            </button>
          </div>

          {/* Auth Method Switcher: Gmail vs Mobile */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('gmail');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'gmail'
                  ? 'bg-[#005744] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent'
              }`}
            >
              <i className="fab fa-google text-xs"></i>
              <span>Gmail / Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('mobile');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'mobile'
                  ? 'bg-[#005744] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent'
              }`}
            >
              <i className="fas fa-mobile-alt text-xs"></i>
              <span>Mobile Number</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-900">
              {mode === 'signup'
                ? authMethod === 'mobile'
                  ? 'Sign Up with Mobile Number'
                  : 'Sign Up with Gmail'
                : authMethod === 'mobile'
                  ? 'Sign In with Mobile Number'
                  : 'Sign In to Property Adda'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Zero OTP Required • Instant Access to Owners & Buyers
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

          {/* METHOD 1: GMAIL / EMAIL AUTH */}
          {authMethod === 'gmail' && (
            <>
              {/* One-Click Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuthClick}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
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

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2 text-[10px] font-bold uppercase text-slate-400 absolute">
                  or enter Gmail
                </span>
              </div>

              {!showPasswordLogin ? (
                /* Instant Gmail Form */
                <form onSubmit={handleInstantGmailSubmit} className="space-y-3.5">
                  {mode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amit Kumar"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#005744] focus:ring-1 focus:ring-[#005744]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-[#005744] focus-within:ring-1 focus-within:ring-[#005744]">
                          <span className="px-3 py-2 bg-slate-100 text-slate-600 text-xs font-bold border-r border-slate-200 flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength="10"
                            placeholder="10-digit mobile number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="w-full px-3 py-2 text-xs text-slate-900 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          User Type:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'Owner', label: '👤 Owner' },
                            { id: 'Dealer / Agent', label: '💼 Agent' },
                            { id: 'Builder', label: '🏗️ Builder' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setUserType(t.id)}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                                userType === t.id
                                  ? 'bg-[#005744] text-white border-[#005744]'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. amit@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#005744] focus:ring-1 focus:ring-[#005744]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <span>
                        {mode === 'signup'
                          ? 'Create Account Instantly →'
                          : 'Sign In Instantly →'}
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                /* Traditional Password Login */
                <form onSubmit={handlePasswordLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@property-adda.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#005744]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#005744]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Signing in...' : 'Sign In with Password'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* METHOD 2: MOBILE NUMBER AUTH */}
          {authMethod === 'mobile' && (
            <form onSubmit={handleMobileSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#005744]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      User Type:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Owner', 'Dealer / Agent', 'Builder'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setUserType(t)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            userType === t
                              ? 'bg-[#005744] text-white border-[#005744]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-[#005744] focus-within:ring-1 focus-within:ring-[#005744]">
                  <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-600 border-r border-slate-200 flex items-center gap-1.5">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2.5 text-xs sm:text-sm text-slate-900 outline-none bg-white font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Enter your 10-digit mobile number</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password <span className="text-slate-400 font-normal">({mode === 'signup' ? 'Optional' : 'If set'})</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#005744]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span>
                    {mode === 'signup'
                      ? '📱 Create Account with Mobile →'
                      : '📱 Sign In with Mobile Number →'}
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Instant and Password */}
          {authMethod === 'gmail' && (
            <div className="text-center pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordLogin(!showPasswordLogin);
                  setError('');
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-[#005744] transition-colors cursor-pointer"
              >
                {showPasswordLogin
                  ? '← Switch back to Instant Gmail login'
                  : 'Have an account password? Sign in with password'}
              </button>
            </div>
          )}

          {/* Terms text */}
          <div className="pt-2 text-center text-[10px] text-slate-400">
            By proceeding, you agree to Property Adda's{' '}
            <span className="text-[#005744] font-semibold">Terms & Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ClientAuthModal;
