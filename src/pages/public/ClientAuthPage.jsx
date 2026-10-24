// frontend/src/pages/public/ClientAuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PropertyDealLogo } from '../../components/common/Header';

function ClientAuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, register, sendOtp, verifyOtp, googleAuth } = useAuth();

  const [mode, setMode] = useState(
    location.pathname === '/signup' ? 'signup' : initialMode
  );
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'

  // Form inputs
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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      setSuccessMsg('Authentication successful! Redirecting...');
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

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

      setSuccessMsg(`${mode === 'signup' ? 'Account created' : 'Logged in'} successfully! Redirecting...`);
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await googleAuth({
        email: email || 'client.user@gmail.com',
        name: name || 'Google Verified Client',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
      setSuccessMsg('Logged in via Google successfully! Redirecting...');
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] p-6 text-white text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-md">
              <PropertyDealLogo size={28} />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {mode === 'signup' ? 'Client Sign Up' : 'Client Sign In'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Access verified properties, contact owners directly & track inquiries.
          </p>

          {/* Auth Method Pills */}
          <div className="mt-4 flex items-center justify-center gap-1.5 bg-white/15 p-1 rounded-xl backdrop-blur-xs max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => { setAuthMethod('otp'); setOtpStep(1); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMethod === 'otp' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              ✉️ Gmail OTP
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMethod === 'password' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              🔑 Password
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
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

          {/* METHOD 1: OTP */}
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
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
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
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
                    />
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    {loading ? 'Sending OTP to Email...' : 'Send OTP to Email →'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-[#eff6ff] rounded-xl border border-[#bfdbfe] text-center">
                    <p className="text-xs text-[#1e40af]">
                      6-digit code sent to:
                    </p>
                    <strong className="block text-xs sm:text-sm text-[#0f172a] mt-0.5 truncate">
                      {email}
                    </strong>
                    {previewOtp && (
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-md">
                        Code for testing: {previewOtp}
                      </span>
                    )}
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
                      className="w-full text-center tracking-[10px] text-xl font-black py-3 rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    {loading ? 'Verifying OTP...' : 'Verify & Log In'}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#64748b]">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="hover:text-[#2563eb] underline cursor-pointer"
                    >
                      Change Email
                    </button>
                    {timer > 0 ? (
                      <span>Resend in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#2563eb] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* METHOD 2: PASSWORD */}
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
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
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
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
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
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:border-[#2563eb] outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign In with Password'}
              </button>
            </form>
          )}

          {/* Social / One Click */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2e8f0]"></div>
            </div>
            <span className="relative bg-white px-2 text-[11px] font-bold text-[#94a3b8] uppercase">
              Or
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-3 rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] text-xs font-bold text-[#0f172a] flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('client@propertydeal.com');
                setName('Demo Client');
                handleGoogleLogin();
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] hover:bg-[#dbeafe] text-xs font-bold text-[#2563eb] cursor-pointer"
            >
              <span>⚡ Demo Client</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-[#64748b]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setOtpStep(1); setError(''); }}
                  className="font-bold text-[#2563eb] hover:underline cursor-pointer"
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
                  className="font-bold text-[#2563eb] hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#94a3b8] hover:text-[#2563eb]"
            >
              <span>🛡️ Are you an Administrator? Access Admin Portal →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAuthPage;
