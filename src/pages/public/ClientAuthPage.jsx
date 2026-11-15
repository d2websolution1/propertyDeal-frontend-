// frontend/src/pages/public/ClientAuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from '../../components/common/Header';

const ClientAuthPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, sendOtp, verifyOtp, mobileRegister, mobileLogin } = useAuth();

  // Search params for redirect after login
  const searchParams = new URLSearchParams(location.search);
  const nextParam = searchParams.get('next') || '/my-listings';

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState(initialMode);
  // Auth Method: 'gmail' | 'mobile'
  const [authMethod, setAuthMethod] = useState('gmail');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Owner');
  const [password, setPassword] = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  // OTP Verification States
  const [otpStep, setOtpStep] = useState('input'); // 'input' | 'otp'
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [devOtpPreview, setDevOtpPreview] = useState('');

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

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (otpStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpStep, timer]);

  // Step 1: Send OTP to Gmail
  const handleSendOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
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
        setError('Mobile number is mandatory. Please enter a valid 10-digit number.');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await sendOtp({
        email: cleanEmail,
        name: name.trim() || undefined,
        phone: phone ? phone.trim() : undefined,
        userType: userType || 'Owner',
      });

      setOtpStep('otp');
      setTimer(30);
      setDevOtpPreview(res?.previewOtp || '');
      setSuccessMsg(res?.message || `6-digit verification code sent to ${cleanEmail}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      setLoading(true);
      const res = await verifyOtp({
        email: cleanEmail,
        otp: cleanOtp,
        name: name.trim() || undefined,
        phone: phone ? phone.trim() : undefined,
        userType: userType || 'Owner',
      });

      setSuccessMsg(
        mode === 'signup'
          ? `Welcome ${name}! Your account is verified.`
          : `Welcome back, ${res?.user?.name || cleanEmail}!`
      );

      setTimeout(() => {
        navigate(nextParam);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please check and re-enter.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setError('');
    setSuccessMsg('');
    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const res = await sendOtp({
        email: cleanEmail,
        name: name.trim() || undefined,
        phone: phone ? phone.trim() : undefined,
        userType: userType || 'Owner',
      });
      setTimer(30);
      setDevOtpPreview(res?.previewOtp || '');
      setSuccessMsg(`New OTP resent to ${cleanEmail}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Mobile Auth Submit
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

        await mobileRegister({
          phone: cleanPhone,
          name: name.trim(),
          password: password || undefined,
          userType: userType || 'Owner',
        });

        setSuccessMsg(`Account created successfully for ${name} with mobile ${cleanPhone}!`);
      } else {
        const res = await mobileLogin({
          phone: cleanPhone,
          password: password || undefined,
        });

        setSuccessMsg(`Welcome back, ${res?.name || 'User'}!`);
      }

      setTimeout(() => {
        navigate(nextParam);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Mobile authentication failed. Please check your number.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth button (triggers OTP verification)
  const handleGoogleAuthClick = async () => {
    setError('');
    let targetEmail = email.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      targetEmail = window.prompt('Enter your Gmail address for OTP verification:');
    }
    if (!targetEmail || !targetEmail.includes('@')) return;

    setEmail(targetEmail);
    try {
      setLoading(true);
      const res = await sendOtp({
        email: targetEmail.trim().toLowerCase(),
        name: name.trim() || targetEmail.split('@')[0],
        userType: userType || 'Owner',
      });
      setOtpStep('otp');
      setTimer(30);
      setDevOtpPreview(res?.previewOtp || '');
      setSuccessMsg(`Verification code sent to ${targetEmail}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Traditional Email/Password Login
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setLoading(true);
      await login(email.trim(), password);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => navigate(nextParam), 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center mb-4">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <PropertyDealLogo height={46} />
          </Link>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-black text-[#142D4E] tracking-tight">
          {otpStep === 'otp'
            ? 'Verify 6-Digit OTP'
            : mode === 'signup'
              ? 'Create Your Account'
              : 'Welcome to Property Adda'}
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-[#64748B]">
          {otpStep === 'otp'
            ? `We have sent a verification code to ${email}`
            : mode === 'signup'
              ? 'Join thousands of Owners, Dealers, and Builders across India.'
              : 'Access your saved searches, posted properties, and buyer leads.'}
        </p>

        {/* Mode Switcher Tabs */}
        <div className="mt-6 p-1 bg-white border border-[#e2e8f0] rounded-2xl flex shadow-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setOtpStep('input');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#142D4E] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#142D4E]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setOtpStep('input');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#142D4E] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#142D4E]'
            }`}
          >
            Create Account <span className="bg-[#D62839] text-white text-[9px] font-black px-1.5 py-0.5 rounded ml-1">FREE</span>
          </button>
        </div>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-[#e2e8f0] space-y-5">
          {/* Auth Method Switcher (Gmail OTP vs Mobile) */}
          <div className="flex items-center gap-2 bg-[#F3F5F8] p-1.5 rounded-2xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('gmail');
                setOtpStep('input');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'gmail'
                  ? 'bg-[#D62839] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#142D4E] bg-transparent'
              }`}
            >
              <i className="fab fa-google text-xs"></i>
              <span>Gmail OTP Verification</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('mobile');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'mobile'
                  ? 'bg-[#D62839] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#142D4E] bg-transparent'
              }`}
            >
              <i className="fas fa-mobile-alt text-xs"></i>
              <span>Mobile Number</span>
            </button>
          </div>

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

          {/* Dev OTP Preview */}
          {devOtpPreview && otpStep === 'otp' && (
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between">
              <span>Code received: <strong className="font-mono text-sm tracking-wider text-[#142D4E]">{devOtpPreview}</strong></span>
              <button
                type="button"
                onClick={() => setOtp(devOtpPreview)}
                className="text-[11px] font-bold text-[#D62839] underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* METHOD 1: GMAIL / EMAIL */}
          {authMethod === 'gmail' && (
            <>
              {otpStep === 'input' ? (
                <>
                  {/* Google Action */}
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleAuthClick}
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-2xl border border-[#cbd5e1] bg-white hover:bg-[#F3F5F8] text-xs sm:text-sm font-bold text-[#142D4E] flex items-center justify-center gap-3 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
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
                      <span>Verify & Continue with Google</span>
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-[#e2e8f0] w-full"></div>
                    <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#64748B] absolute">
                      or enter Gmail
                    </span>
                  </div>

                  {!showPasswordLogin ? (
                    <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                      {mode === 'signup' && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                              Your Full Name <span className="text-[#D62839]">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Sharma"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                              Mobile Number <span className="text-[#D62839]">*</span>
                            </label>
                            <div className="flex rounded-xl border border-[#cbd5e1] overflow-hidden focus-within:border-[#D62839] focus-within:ring-1 focus-within:ring-[#D62839]">
                              <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-[#64748B] border-r border-[#cbd5e1] flex items-center gap-1.5">
                                <span>🇮🇳</span>
                                <span>+91</span>
                              </span>
                              <input
                                type="tel"
                                required
                                maxLength={10}
                                placeholder="98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 px-3 py-2 text-xs sm:text-sm text-[#142D4E] outline-none bg-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                              I am a:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Owner', 'Dealer / Agent', 'Builder'].map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setUserType(t)}
                                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    userType === t
                                      ? 'bg-[#142D4E] text-white border-[#142D4E]'
                                      : 'bg-[#F3F5F8] text-[#64748B] border-[#cbd5e1] hover:bg-slate-200'
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
                        <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                          Gmail / Email Address <span className="text-[#D62839]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. rahul@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#D62839] hover:bg-[#b81d2c] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-98"
                      >
                        {loading ? (
                          <span>Sending OTP code...</span>
                        ) : (
                          <span>Get 6-Digit OTP via Email →</span>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Password Login Form */
                    <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#142D4E] mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#142D4E] outline-none focus:border-[#D62839] bg-[#F3F5F8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#142D4E] mb-1.5">Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#142D4E] outline-none focus:border-[#D62839] bg-[#F3F5F8]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#D62839] hover:bg-[#b81d2c] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
                      >
                        {loading ? 'Signing in...' : 'Sign In with Password'}
                      </button>
                    </form>
                  )}
                </>
              ) : (
                /* Step 2: 6-Digit OTP Verification Form */
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#F3F5F8] border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[#64748B] block">Recipient Email</span>
                      <strong className="text-xs font-bold text-[#142D4E]">{email}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpStep('input')}
                      className="text-xs font-bold text-[#D62839] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142D4E] mb-1.5 text-center">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full py-3 px-4 rounded-2xl border-2 border-slate-300 text-center text-2xl font-mono font-black tracking-[8px] text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-2 focus:ring-[#D62839]/20 transition-all bg-[#F3F5F8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#D62839] hover:bg-[#b81d2c] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
                  >
                    {loading ? <span>Verifying OTP...</span> : <span>Verify & Proceed →</span>}
                  </button>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setOtpStep('input')}
                      className="text-[#64748B] hover:text-[#142D4E] font-semibold cursor-pointer"
                    >
                      ← Back
                    </button>
                    {timer > 0 ? (
                      <span className="text-[#64748B] font-semibold text-[11px]">
                        Resend code in <strong className="text-[#142D4E] font-mono">{timer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-[#D62839] hover:underline font-bold text-xs cursor-pointer"
                      >
                        🔄 Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </>
          )}

          {/* METHOD 2: MOBILE NUMBER AUTH */}
          {authMethod === 'mobile' && (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                      Your Full Name <span className="text-[#D62839]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#142D4E] outline-none focus:border-[#D62839] bg-[#F3F5F8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                      I am a:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Owner', 'Dealer / Agent', 'Builder'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setUserType(t)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            userType === t
                              ? 'bg-[#142D4E] text-white border-[#142D4E]'
                              : 'bg-[#F3F5F8] text-[#64748B] border-[#cbd5e1] hover:bg-slate-200'
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
                <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                  Mobile Number <span className="text-[#D62839]">*</span>
                </label>
                <div className="flex rounded-xl border border-[#cbd5e1] overflow-hidden focus-within:border-[#D62839] focus-within:ring-1 focus-within:ring-[#D62839]">
                  <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-[#64748B] border-r border-[#cbd5e1] flex items-center gap-1.5">
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
                    className="flex-1 px-3 py-2 text-xs sm:text-sm text-[#142D4E] outline-none bg-white font-mono"
                  />
                </div>
                <p className="text-[10px] text-[#64748B] mt-1">Enter your 10-digit mobile number</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142D4E] mb-1.5">
                  Password <span className="text-[#64748B] font-normal">({mode === 'signup' ? 'Optional' : 'If set'})</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#142D4E] outline-none focus:border-[#D62839] bg-[#F3F5F8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#D62839] hover:bg-[#b81d2c] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-98"
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

          {/* Toggle Password vs OTP */}
          {authMethod === 'gmail' && otpStep === 'input' && (
            <div className="text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordLogin(!showPasswordLogin);
                  setError('');
                }}
                className="text-xs font-bold text-[#64748B] hover:text-[#D62839] transition-colors cursor-pointer"
              >
                {showPasswordLogin
                  ? '← Switch back to Gmail OTP login'
                  : 'Have an account password? Sign in with password'}
              </button>
            </div>
          )}

          {/* Terms Footer */}
          <div className="text-center text-[11px] text-[#64748B] pt-2">
            By signing in, you agree to Property Adda's{' '}
            <span className="text-[#142D4E] font-bold">Terms of Use</span> and{' '}
            <span className="text-[#142D4E] font-bold">Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAuthPage;
