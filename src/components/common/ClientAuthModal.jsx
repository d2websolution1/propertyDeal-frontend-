// frontend/src/components/common/ClientAuthModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from './Header';

const ClientAuthModal = ({ isOpen, onClose, initialMode = 'login', nextUrl = '/my-listings' }) => {
  const navigate = useNavigate();
  const { login, sendOtp, verifyOtp, mobileRegister, mobileLogin } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [authMethod, setAuthMethod] = useState('gmail'); // 'gmail' | 'mobile'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Owner');
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Free Starter (30 Days)', days: 30, price: '₹0' });
  const [password, setPassword] = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  // OTP Verification States
  const [otpStep, setOtpStep] = useState('input'); // 'input' | 'otp'
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setError('');
    setSuccessMsg('');
    setShowPasswordLogin(initialMode === 'login');
    setOtpStep('input');
    setOtp('');

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

  if (!isOpen) return null;

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
        setError('Mobile number is mandatory. Please enter a valid 10-digit phone number.');
        return;
      }
      if (!password || password.length < 6) {
        setError('Please choose a password of at least 6 characters for future sign-ins.');
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
        password: password || undefined,
      });

      setOtpStep('otp');
      setTimer(30);
      setSuccessMsg(res?.message || `6-digit verification code sent to ${cleanEmail}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP and login
  const handleVerifyOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
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
        password: password || undefined,
        activePlan: selectedPlan.name,
        validityDays: selectedPlan.days,
      });

      setSuccessMsg(
        mode === 'signup'
          ? `Welcome ${name}! Your account is verified.`
          : `Logged in successfully as ${res?.user?.name || cleanEmail}!`
      );

      setTimeout(() => {
        onClose();
        navigate(nextUrl);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please enter the correct code.');
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
      setSuccessMsg(`New 6-digit OTP sent to ${cleanEmail}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // One-click Google flow (triggers OTP verification for the entered or prompted email)
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
      setSuccessMsg(`Verification code sent to ${targetEmail}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP code.');
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
                setShowPasswordLogin(true);
                setOtpStep('input');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login'
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
                setShowPasswordLogin(false);
                setOtpStep('input');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#142D4E] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#142D4E]'
              }`}
            >
              Create Account <span className="bg-[#D62839] text-white text-[9px] font-black px-1.5 py-0.2 rounded ml-1">FREE</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-xl font-black text-[#142D4E]">
              {otpStep === 'otp'
                ? 'Verify 6-Digit OTP'
                : mode === 'signup'
                  ? 'Create Client Account'
                  : showPasswordLogin
                    ? 'Sign In with Gmail & Password'
                    : 'Sign In via Gmail OTP'}
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              {otpStep === 'otp'
                ? `Enter the 6-digit verification code sent to ${email}`
                : mode === 'signup'
                  ? 'Sign up with Name, Mobile & Gmail OTP verification'
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

          {/* METHOD 1: GMAIL / EMAIL AUTH */}
          {authMethod === 'gmail' && (
            <>
              {otpStep === 'input' ? (
                <>
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={handleGoogleAuthClick}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-[#142D4E] flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
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

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-2 text-[10px] font-bold uppercase text-[#64748B] absolute">
                      or enter Gmail
                    </span>
                  </div>

                  {mode === 'login' ? (
                    showPasswordLogin ? (
                      /* Traditional Gmail & Password Login */
                      <form onSubmit={handlePasswordLoginSubmit} className="space-y-3.5">
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
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] bg-[#F3F5F8]"
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
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] bg-[#F3F5F8]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {loading ? 'Signing in...' : 'Sign In with Password →'}
                        </button>
                      </form>
                    ) : (
                      /* Gmail OTP Login Form */
                      <form onSubmit={handleSendOtpSubmit} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#142D4E] mb-1">
                            Registered Gmail / Email <span className="text-[#D62839]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. yourname@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] bg-[#F3F5F8]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {loading ? 'Sending OTP code...' : 'Get 6-Digit OTP via Email →'}
                        </button>
                      </form>
                    )
                  ) : (
                    /* Account Creation / Signup Form: Name + Mobile + Gmail + Password + UserType + Plan */
                    <form onSubmit={handleSendOtpSubmit} className="space-y-3">
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
                          Create Account Password <span className="text-[#D62839]">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Choose password (min 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#142D4E] outline-none focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] bg-[#F3F5F8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#142D4E] mb-1">
                          User Type:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'Owner', label: '👤 Individual Owner' },
                            { id: 'Dealer / Agent', label: '💼 Dealer / Agent' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setUserType(t.id);
                                if (t.id === 'Dealer / Agent') {
                                  setSelectedPlan({ name: 'Pro Agent Plan (90 Days)', days: 90, price: '₹1999' });
                                } else {
                                  setSelectedPlan({ name: 'Free Starter (30 Days)', days: 30, price: '₹0' });
                                }
                              }}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                userType === t.id
                                  ? 'bg-[#142D4E] text-white border-[#142D4E]'
                                  : 'bg-[#F3F5F8] text-[#64748B] border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#142D4E] mb-1">
                          Select Account Plan ({userType}):
                        </label>
                        <div className="grid grid-cols-1 gap-1.5">
                          {(userType === 'Dealer / Agent'
                            ? [
                                { name: 'Standard Agent Plan (45 Days)', days: 45, price: '₹999' },
                                { name: 'Pro Agent Plan (90 Days)', days: 90, price: '₹1999' },
                                { name: 'Annual Agent Plan (365 Days)', days: 365, price: '₹4999' },
                              ]
                            : [
                                { name: 'Free Starter (30 Days)', days: 30, price: '₹0' },
                                { name: 'Gold Owner Plan (60 Days)', days: 60, price: '₹499' },
                                { name: 'Annual Owner Plan (365 Days)', days: 365, price: '₹1499' },
                              ]
                          ).map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => setSelectedPlan(p)}
                              className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between text-xs ${
                                selectedPlan.name === p.name
                                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPlan.name === p.name ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                  {selectedPlan.name === p.name && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                </span>
                                <span>{p.name}</span>
                              </div>
                              <span className="font-extrabold text-[#D62839]">{p.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-98"
                      >
                        {loading ? (
                          <span>Sending OTP code...</span>
                        ) : (
                          <span>Get 6-Digit OTP via Email →</span>
                        )}
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
                    className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
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

          {/* Toggle between OTP and Password for Login */}
          {mode === 'login' && otpStep === 'input' && (
            <div className="text-center pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordLogin(!showPasswordLogin);
                  setError('');
                }}
                className="text-[11px] font-bold text-[#64748B] hover:text-[#D62839] transition-colors cursor-pointer"
              >
                {showPasswordLogin
                  ? '🔑 Forgot password or prefer OTP? Sign in via Gmail OTP'
                  : '← Switch back to Gmail & Password sign in'}
              </button>
            </div>
          )}

          {/* Terms text */}
          <div className="pt-2 text-center text-[10px] text-[#64748B]">
            By proceeding, you agree to Property Adda's{' '}
            <span className="text-[#142D4E] font-bold">Terms & Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ClientAuthModal;
