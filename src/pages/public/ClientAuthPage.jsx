// frontend/src/pages/public/ClientAuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from '../../components/common/Header';

const ClientAuthPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, sendOtp, verifyOtp } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const nextParam = searchParams.get('next') || '/my-listings';

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [step, setStep] = useState('form'); // 'form' | 'otp'

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Owner');
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Free Starter (30 Days)', days: 30, price: '₹0' });
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // OTP Countdown timer
  const [timer, setTimer] = useState(60);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (
        user?.role === 'admin' &&
        (user?.email?.toLowerCase().includes('admin@property') ||
          user?.email?.toLowerCase().endsWith('@property-adda.com'))
      ) {
        navigate('/admin');
      } else {
        navigate(nextParam.startsWith('/') ? nextParam : '/my-listings');
      }
    }
  }, [isAuthenticated, user, navigate, nextParam]);

  // Adjust default plan when userType changes
  useEffect(() => {
    if (userType === 'Dealer / Agent') {
      setSelectedPlan({ name: 'Pro Agent Plan (90 Days)', days: 90, price: '₹999' });
    } else {
      setSelectedPlan({ name: 'Free Starter (30 Days)', days: 30, price: '₹0' });
    }
  }, [userType]);

  // Timer effect for OTP
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Direct Login (Gmail & Password)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both Gmail / Email and Password.');
      return;
    }

    try {
      setLoading(true);
      await login(cleanEmail, cleanPassword);
      setSuccessMsg('Welcome back! Logged in successfully.');
      setTimeout(() => {
        navigate(nextParam);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Gmail or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Initiate Signup -> Validate details & Send OTP to Gmail
  const handleInitiateSignup = async (e) => {
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
      setError('Mobile number is mandatory. Please enter a valid 10-digit number.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Please set a password of at least 6 characters.');
      return;
    }

    const cleanPhone = rawDigits.length === 10 ? `+91${rawDigits}` : `+${rawDigits}`;

    try {
      setLoading(true);
      const res = await sendOtp({
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: password.trim(),
        userType: userType || 'Owner',
        type: 'signup',
      });

      setStep('otp');
      setOtp('');
      setTimer(60);
      setSuccessMsg(res?.message || `A 6-digit verification code has been sent to ${cleanEmail}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and create user account
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim().replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code sent to your Gmail.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const rawDigits = phone.replace(/\D/g, '');
    const cleanPhone = rawDigits.length === 10 ? `+91${rawDigits}` : `+${rawDigits}`;

    try {
      setLoading(true);
      await verifyOtp({
        name: name.trim(),
        email: cleanEmail,
        otp: cleanOtp,
        password: password.trim(),
        phone: cleanPhone,
        userType: userType || 'Owner',
        activePlan: selectedPlan.name,
        validityDays: selectedPlan.days,
      });

      setSuccessMsg(`Welcome ${name}! Your account has been verified and created successfully.`);
      setTimeout(() => {
        navigate(nextParam);
      }, 400);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0 || loading) return;
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const rawDigits = phone.replace(/\D/g, '');
    const cleanPhone = rawDigits.length === 10 ? `+91${rawDigits}` : `+${rawDigits}`;

    try {
      setLoading(true);
      const res = await sendOtp({
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: password.trim(),
        userType: userType || 'Owner',
        type: 'signup',
      });
      setTimer(60);
      setSuccessMsg(res?.message || `New 6-digit OTP sent to ${cleanEmail}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col justify-center items-center py-12 px-4 sm:px-6 select-none font-sans">
      {/* Back button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xs font-bold text-[#64748B] hover:text-[#142D4E] flex items-center gap-1.5 transition-colors"
        >
          <span>←</span> Back to Website
        </Link>
        <PropertyDealLogo height={32} />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-5">
        {/* Sign In vs Sign Up Tabs */}
        <div className="flex bg-[#F3F5F8] p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setStep('form');
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
              setStep('form');
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
          <h2 className="text-2xl font-black text-[#142D4E]">
            {mode === 'login'
              ? 'Sign In to Property Adda'
              : step === 'otp'
                ? 'Verify Your Gmail'
                : 'Create Your Account'}
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            {mode === 'login'
              ? 'Enter your registered Gmail & password to continue'
              : step === 'otp'
                ? `Enter the 6-digit OTP code sent to ${email}`
                : 'Fill in your details to receive an OTP on your Gmail'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <span>🎉</span>
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* ── SIGN IN FORM: GMAIL & PASSWORD ── */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  setStep('form');
                  setError('');
                }}
                className="text-xs font-bold text-[#D62839] hover:underline cursor-pointer"
              >
                Create Account FREE
              </button>
            </div>
          </form>
        ) : step === 'otp' ? (
          /* ── STEP 2: OTP VERIFICATION FORM ── */
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">✉️</div>
              <div className="text-xs font-bold text-[#142D4E]">OTP sent to your Gmail</div>
              <div className="text-[11px] text-slate-600 mt-0.5 font-medium break-all">{email}</div>
              <div className="text-[10px] text-slate-500 mt-1 italic">
                (Check your Inbox as well as Spam / Junk folder)
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142D4E] mb-1.5 text-center">
                Enter 6-Digit Verification Code <span className="text-[#D62839]">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-center text-2xl font-black text-[#142D4E] tracking-[0.4em] outline-none focus:border-[#D62839] focus:ring-2 focus:ring-[#D62839]/20 bg-[#F3F5F8]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.trim().length !== 6}
              className="w-full py-3 px-4 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? 'Verifying OTP & Creating Account...' : 'Verify OTP & Create Account ✓'}
            </button>

            {/* Resend and Edit options */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-slate-500 hover:text-[#142D4E] font-medium flex items-center gap-1 cursor-pointer"
              >
                ← Edit Details
              </button>

              {timer > 0 ? (
                <span className="text-slate-400 font-medium text-[11px]">
                  Resend code in <strong className="text-slate-600">{timer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-[#D62839] hover:underline font-bold cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        ) : (
          /* ── STEP 1: SIGN UP DETAILS FORM (SEND OTP TO GMAIL) ── */
          <form onSubmit={handleInitiateSignup} className="space-y-3.5">
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

            {/* Account Type Selection */}
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
              {loading ? 'Sending OTP to Gmail...' : 'Get OTP on Gmail →'}
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setStep('form');
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
  );
};

export default ClientAuthPage;
