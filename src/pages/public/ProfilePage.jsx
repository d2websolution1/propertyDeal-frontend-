// frontend/src/pages/public/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DEALS_IN_OPTIONS = [
  'Resale',
  'Rent / Lease',
  'New booking',
  'Pre-launch',
  'Plots / Land',
  'Commercial',
  'PG / Co-living',
  'Home loans',
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading, updateProfile } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const nextDestination = searchParams.get('next') || '/my-listings';

  // State fields matching HomesWale reference
  const [avatar, setAvatar] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [userType, setUserType] = useState('Owner'); // 'Owner' | 'Dealer / Agent' | 'Builder'

  // Agent / Builder specific fields
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [city, setCity] = useState('');
  const [operatingSince, setOperatingSince] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [localities, setLocalities] = useState('');
  const [dealsIn, setDealsIn] = useState([]);
  const [about, setAbout] = useState('');

  // Status
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const photoInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Pre-fill fields from current user
  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || '');
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      setMobile(user.phone || '');
      setAge(user.age ? String(user.age) : '');
      setGender(user.gender || '');
      setUserType(user.userType || 'Owner');

      setCompanyLogo(user.companyLogo || '');
      setCompanyName(user.companyName || '');
      setReraNumber(user.reraNumber || '');
      setCity(user.city || '');
      setOperatingSince(user.operatingSince || '');
      setTeamSize(user.teamSize || '');
      setLocalities(user.localities || '');
      setDealsIn(Array.isArray(user.dealsIn) ? user.dealsIn : []);
      setAbout(user.about || '');
    }
  }, [user]);

  // Helper to compress and resize an image file into an optimized base64 string
  const compressImageFile = (file, maxWidth = 500, maxHeight = 500, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = (err) => reject(err);
      reader.onload = (event) => {
        const img = new Image();
        img.onerror = (err) => reject(err);
        img.onload = () => {
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          let mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          let result = canvas.toDataURL(mime, quality);
          if (mime === 'image/png' && result.length > 300000) {
            result = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(result);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Helper to ensure any already-loaded large base64 data URL is compressed before submit
  const ensureCompressedDataUrl = async (dataUrl, maxWidth = 500, maxHeight = 500, quality = 0.8) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/') || dataUrl.length < 150000) {
      return dataUrl;
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Handle Photo File Upload (Compressed to lightweight Base64 to prevent 413 Payload Too Large)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      setError('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size should be less than 10MB.');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 500, 500, 0.82);
      setAvatar(compressed);
      setError('');
    } catch (err) {
      console.error('Failed to compress avatar:', err);
      setError('Failed to process image. Please try a different photo.');
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Handle Company Logo Upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      setError('Please upload a valid JPG, PNG, or WebP logo.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size should be less than 10MB.');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 500, 500, 0.82);
      setCompanyLogo(compressed);
      setError('');
    } catch (err) {
      console.error('Failed to compress company logo:', err);
      setError('Failed to process logo. Please try a different image.');
    }
  };

  // Toggle Deals In options
  const toggleDealOption = (option) => {
    setDealsIn((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations matching HomesWale
    if (!firstName.trim()) {
      setError('First name is required.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if ((userType === 'Dealer / Agent' || userType === 'Builder') && !city.trim()) {
      setError('Please specify the city you work in.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSaving(true);
      const safeAvatar = await ensureCompressedDataUrl(avatar, 500, 500, 0.82);
      const safeLogo = await ensureCompressedDataUrl(companyLogo, 500, 500, 0.82);

      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: cleanMobile,
        age: age ? Number(age) : null,
        gender,
        userType,
        avatar: safeAvatar,
        companyLogo: safeLogo,
        companyName: companyName.trim(),
        reraNumber: reraNumber.trim(),
        city: city.trim(),
        operatingSince: operatingSince.trim(),
        teamSize: teamSize.trim(),
        localities: localities.trim(),
        dealsIn,
        about: about.trim(),
      });

      setSuccess('Profile updated successfully! Redirecting...');
      setTimeout(() => {
        navigate(nextDestination);
      }, 700);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#005744] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfb] py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Error Notification Bar (matching HomesWale screenshot 1) */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-[#dc2626] font-bold text-sm hover:opacity-75 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] text-xs font-semibold flex items-center gap-2 shadow-xs">
            <span className="text-base">✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#e2e8f0] border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f1f5f9] text-[#64748b]">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-4 py-1.5 rounded-full border border-[#005744] text-[#005744] text-xs font-bold hover:bg-[#005744]/5 transition-colors cursor-pointer"
                  >
                    Change photo
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 text-xs font-semibold text-[#64748b] hover:text-[#dc2626] transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#94a3b8]">
                  Optional · JPG, PNG or WebP
                </p>
              </div>
            </div>

            {/* 2. First name * & Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  First name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Prince"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] focus:ring-1 focus:ring-[#005744] outline-none transition-all placeholder:text-[#94a3b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] focus:ring-1 focus:ring-[#005744] outline-none transition-all placeholder:text-[#94a3b8]"
                />
              </div>
            </div>

            {/* 3. Mobile number * */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                Mobile number <span className="text-[#dc2626]">*</span>
              </label>
              <div className="flex rounded-xl border border-[#cbd5e1] overflow-hidden focus-within:border-[#005744] focus-within:ring-1 focus-within:ring-[#005744] transition-all">
                <span className="bg-[#f8fafc] text-[#475569] text-xs sm:text-sm font-semibold px-3.5 py-2.5 border-r border-[#cbd5e1] flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1.5">
                Shown to logged-in buyers on your listings, and shared with sellers when you contact them.
              </p>
            </div>

            {/* 4. Age & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="16"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] focus:ring-1 focus:ring-[#005744] outline-none transition-all placeholder:text-[#94a3b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] focus:ring-1 focus:ring-[#005744] outline-none transition-all bg-white"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* 5. "I am a *" selection (Owner / Dealer / Agent / Builder) */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-2">
                I am a <span className="text-[#dc2626]">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Owner', 'Dealer / Agent', 'Builder'].map((role) => {
                  const isSelected = userType === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserType(role)}
                      className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#005744] text-white shadow-sm ring-1 ring-[#005744]'
                          : 'bg-white border border-[#cbd5e1] text-[#334155] hover:border-[#94a3b8]'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. CONDITIONAL SECTION: Agent / Builder details (Screenshots 2 & 3) */}
            {(userType === 'Dealer / Agent' || userType === 'Builder') && (
              <div className="rounded-2xl border border-dashed border-[#005744]/40 bg-[#f7fbf9] p-5 sm:p-6 space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-[#005744]">
                    {userType === 'Dealer / Agent' ? 'Your agent page' : 'Your builder page'}
                  </h4>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Shown on Find an agent so buyers can contact you.
                  </p>
                </div>

                {/* Company Logo Upload */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#cbd5e1] overflow-hidden flex items-center justify-center text-[#94a3b8] text-xs font-bold shadow-xs">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt="Company Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span>Logo</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-1.5 rounded-full border border-[#005744] text-[#005744] text-xs font-bold hover:bg-[#005744]/5 transition-colors cursor-pointer"
                    >
                      Upload company logo
                    </button>
                    <p className="text-[11px] text-[#94a3b8] mt-1">Optional</p>
                  </div>
                </div>

                {/* Company Name & RERA Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Company / firm name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Dream Properties"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      RERA registration no.
                    </label>
                    <input
                      type="text"
                      value={reraNumber}
                      onChange={(e) => setReraNumber(e.target.value)}
                      placeholder="e.g. UPRERAAGT12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>
                </div>

                {/* City, Operating since, Team size */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      City you work in <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Greater Noida"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Operating since
                    </label>
                    <input
                      type="text"
                      value={operatingSince}
                      onChange={(e) => setOperatingSince(e.target.value)}
                      placeholder="e.g. 2015"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Team size
                    </label>
                    <input
                      type="text"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>
                </div>

                {/* Localities you operate in */}
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Localities you operate in
                  </label>
                  <input
                    type="text"
                    value={localities}
                    onChange={(e) => setLocalities(e.target.value)}
                    placeholder="e.g. Greater Noida West, Gaur City, Techzone 4, Sector 16B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                  />
                </div>

                {/* Deals in (Multi-Select Tags) */}
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                    Deals in
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DEALS_IN_OPTIONS.map((deal) => {
                      const isChecked = dealsIn.includes(deal);
                      return (
                        <button
                          key={deal}
                          type="button"
                          onClick={() => toggleDealOption(deal)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#005744] text-white shadow-xs'
                              : 'bg-white border border-[#cbd5e1] text-[#475569] hover:border-[#94a3b8]'
                          }`}
                        >
                          {deal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* About you / your firm */}
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    About you / your firm
                  </label>
                  <textarea
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Experience, specialities, the kind of properties you help with..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* 7. Email (from google) */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                Email (from google)
              </label>
              <input
                type="text"
                disabled
                value={user?.email || 'princerajput5868@gmail.com'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-xs sm:text-sm text-[#64748b] cursor-not-allowed select-none"
              />
            </div>

            {/* 8. Save & continue Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 px-4 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Save & continue</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
