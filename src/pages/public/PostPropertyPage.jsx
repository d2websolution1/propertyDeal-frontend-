// frontend/src/pages/public/PostPropertyPage.jsx
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const INDIAN_STATES = [
  'Uttar Pradesh', 'Delhi NCR', 'Maharashtra', 'Haryana', 'Karnataka', 
  'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'West Bengal',
  'Punjab', 'Madhya Pradesh', 'Kerala', 'Goa', 'Uttarakhand', 'Chandigarh'
];

const RESIDENTIAL_TYPES = [
  'Flat / Apartment',
  'Independent House / Villa',
  'Builder Floor',
  'Plot / Land',
  '1 RK / Studio Apartment',
  'Penthouse',
  'Farmhouse'
];

const COMMERCIAL_TYPES = [
  'Commercial Office Space',
  'Commercial Shop',
  'Commercial Showroom',
  'Warehouse / Godown',
  'Industrial Land / Plot',
  'Industrial Building / Shed'
];

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

const PHOTO_CATEGORIES = [
  'Exterior view',
  'Living room',
  'Bedrooms',
  'Bathrooms',
  'Kitchen',
  'Floor plan',
  'Master plan',
  'Location map'
];

const AMENITIES_LIST = [
  'Power Backup',
  'Lift',
  'Reserved Parking',
  '24x7 Security / CCTV',
  'Gymnasium',
  'Swimming Pool',
  'Club House',
  'Park / Garden',
  'Piped Gas (PNG)',
  'Visitor Parking',
  'Intercom Facility',
  'Water Storage'
];

// Helper to format Indian currency in words
const formatIndianPrice = (num) => {
  const val = Number(num);
  if (!val || isNaN(val)) return '';
  if (val >= 10000000) {
    return `₹ ${(val / 10000000).toFixed(2)} Crore`;
  }
  if (val >= 100000) {
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  }
  if (val >= 1000) {
    return `₹ ${(val / 1000).toFixed(1)} Thousand`;
  }
  return `₹ ${val.toLocaleString('en-IN')}`;
};

// Client-side image compressor using HTML5 canvas (guarantees fast upload and prevents 413 error)
const compressPhoto = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
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

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function PostPropertyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // 1. Property Details
  const [listingFor, setListingFor] = useState('Sale'); // 'Sale' | 'Rent / Lease' | 'PG / Hostel'
  const [propertyCategory, setPropertyCategory] = useState('RESIDENTIAL'); // 'RESIDENTIAL' | 'COMMERCIAL'
  const [propertyType, setPropertyType] = useState('Flat / Apartment');
  const [bhk, setBhk] = useState('3 BHK');
  const [propertyAge, setPropertyAge] = useState('Ready to move');
  const [areaSqft, setAreaSqft] = useState('');

  // 2. Location
  const [state, setState] = useState('Uttar Pradesh');
  const [city, setCity] = useState('');
  const [projectName, setProjectName] = useState('');
  const [locality, setLocality] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');

  // 3. Price
  const [expectedPrice, setExpectedPrice] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [maintenanceCharges, setMaintenanceCharges] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);

  // 4. Photos
  const [selectedCategory, setSelectedCategory] = useState('Exterior view');
  const [photos, setPhotos] = useState([]); // array of { url: string, category: string }
  const [photoError, setPhotoError] = useState('');

  // 5. Description & Contact
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [amenities, setAmenities] = useState(['Power Backup', 'Lift', '24x7 Security / CCTV']);
  const [contactName, setContactName] = useState(user?.name || user?.firstName || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [reraNumber, setReraNumber] = useState(user?.reraNumber || '');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Handle Photo Upload with Compression
  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 20) {
      setPhotoError('You can upload a maximum of 20 photos.');
      return;
    }
    setPhotoError('');

    try {
      const compressedList = [];
      for (const file of files) {
        if (!file.type.match(/^image\//i)) continue;
        const compressed = await compressPhoto(file, 1000, 1000, 0.82);
        compressedList.push({
          url: compressed,
          category: selectedCategory,
        });
      }
      setPhotos((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Error compressing photos:', err);
      setPhotoError('Failed to process image. Please try another photo.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsCoverPhoto = (index) => {
    if (index === 0) return;
    setPhotos((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Real-time Listing Quality Calculation
  const checklist = useMemo(() => {
    return [
      { key: 'typeLocation', label: 'Type & location', done: !!(propertyType && city && locality) },
      { key: 'price', label: 'Expected price', done: !!(expectedPrice && Number(expectedPrice) > 0) },
      { key: 'area', label: 'Area', done: !!(areaSqft && Number(areaSqft) > 0) },
      { key: 'photo1', label: 'At least 1 photo', done: photos.length >= 1 },
      { key: 'photo5', label: '5+ photos (get up to 10x more enquiries)', done: photos.length >= 5 },
      { key: 'description', label: 'Detailed description (120+ characters)', done: description.trim().length >= 120 },
      { key: 'furnishing', label: 'Furnishing status', done: !!furnishing },
      { key: 'amenities', label: '3+ amenities', done: amenities.length >= 3 },
      { key: 'society', label: 'Society / project name', done: !!projectName.trim() },
    ];
  }, [propertyType, city, locality, expectedPrice, areaSqft, photos, description, furnishing, amenities, projectName]);

  const qualityScore = useMemo(() => {
    const completedCount = checklist.filter((item) => item.done).length;
    return Math.round((completedCount / checklist.length) * 100);
  }, [checklist]);

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!city.trim()) {
      setSubmitError('Please enter the City.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!locality.trim()) {
      setSubmitError('Please enter the Locality / Sector.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!expectedPrice || Number(expectedPrice) <= 0) {
      setSubmitError('Please enter a valid Expected Price.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!agreeTerms) {
      setSubmitError('Please agree to the Terms and confirmation statement.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(expectedPrice),
        propertyType,
        listingType: listingFor === 'Sale' ? 'sale' : (listingFor === 'Rent / Lease' ? 'rent' : 'pg'),
        state,
        city: city.trim(),
        locality: locality.trim(),
        projectName: projectName.trim(),
        pincode: pincode.trim(),
        address: address.trim(),
        bhk: propertyCategory === 'RESIDENTIAL' ? bhk : '',
        areaSqft: areaSqft ? Number(areaSqft) : null,
        bookingAmount: bookingAmount ? Number(bookingAmount) : null,
        maintenanceCharges: maintenanceCharges ? Number(maintenanceCharges) : null,
        isNegotiable,
        furnishing,
        amenities,
        images: photos.map((p) => p.url),
        reraNumber: reraNumber.trim(),
        contactName: contactName.trim() || user?.name || 'Property Owner',
        whatsappAlerts,
        qualityScore,
        ownerName: contactName.trim() || user?.name || 'Property Owner',
        ownerPhone: contactPhone.trim() || user?.phone || '',
        ownerEmail: contactEmail.trim() || user?.email || '',
      };

      const res = await axios.post(`${API_BASE_URL}/properties`, payload);
      setSuccessData(res.data.property || { uniqueCode: 'HW-POSTED' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to post property:', err);
      setSubmitError(err.response?.data?.message || 'Failed to post property. Please check your inputs and try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  // Success view
  if (successData) {
    return (
      <div className="min-h-screen bg-[#fbfcfb] py-14 px-4 sm:px-6 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#a7f3d0] p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-[#ecfdf5] border-2 border-[#10b981] rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
            🎉
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">Property Posted Successfully!</h2>
          <p className="text-sm text-[#475569] mt-2">
            Your listing is live on HomesWale. Interested buyers and tenants will contact you directly via call and WhatsApp.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] inline-block text-left w-full">
            <div className="flex items-center justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-xs text-[#64748b]">Listing Code:</span>
              <span className="text-xs font-black text-[#005744] bg-[#ecfdf5] px-2 py-0.5 rounded-md">
                {successData.uniqueCode || 'HW-NEW'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-xs text-[#64748b]">Listing Quality:</span>
              <span className="text-xs font-bold text-emerald-600">{qualityScore}% Score</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-[#64748b]">Total Photos:</span>
              <span className="text-xs font-bold text-[#0f172a]">{photos.length} uploaded</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/my-listings"
              className="w-full py-3 px-4 rounded-xl bg-[#005744] text-white font-bold text-xs hover:bg-[#004737] shadow-md transition-all text-center"
            >
              View in My Listings →
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setPhotos([]);
                setExpectedPrice('');
                setDescription('');
              }}
              className="w-full py-3 px-4 rounded-xl border border-[#cbd5e1] text-[#334155] font-bold text-xs hover:bg-[#f8fafc] transition-all cursor-pointer"
            >
              + Post Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfb] py-8 px-4 sm:px-6 font-sans text-[#0f172a]">
      <div className="max-w-6xl mx-auto">
        {/* Main Title & Subtitle */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f172a]">
              Sell or rent your property
            </h1>
            <span className="bg-[#f59e0b] text-white text-[11px] font-black px-2 py-0.5 rounded-md tracking-wide">
              FREE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            Reach buyers and tenants across India. Fill in the details below — it takes about 3 minutes.
          </p>

          {/* Top Status Strip */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#e2e8f0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#64748b]">Listing package</span>
              <span className="text-xs font-bold text-[#0f172a]">Standard listing —</span>
              <span className="text-xs font-black text-[#005744] bg-[#ecfdf5] px-2 py-0.5 rounded-md border border-[#a7f3d0]">
                FREE
              </span>
            </div>
            <div className="text-xs text-[#64748b]">
              Posting as <span className="font-bold text-[#0f172a]">{user?.userType || 'Dealer / Agent'}</span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="mb-6 p-4 rounded-2xl bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{submitError}</span>
            </div>
            <button onClick={() => setSubmitError('')} className="font-bold text-sm cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: 5 Form Sections */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

            {/* ── SECTION 1: PROPERTY DETAILS ── */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#005744] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Property details</h2>
                  <p className="text-xs text-[#64748b]">What are you listing?</p>
                </div>
              </div>

              {/* Listing for: Sale / Rent / PG */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#0f172a] mb-2">
                  Listing for
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Sale', title: 'Sale', desc: 'Sell your property' },
                    { id: 'Rent / Lease', title: 'Rent / Lease', desc: 'Find a tenant' },
                    { id: 'PG / Hostel', title: 'PG / Hostel', desc: 'Rent out beds or rooms' },
                  ].map((item) => {
                    const isSelected = listingFor === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setListingFor(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#005744] bg-[#f0fdf4] shadow-xs'
                            : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                        }`}
                      >
                        <p className={`text-sm font-bold ${isSelected ? 'text-[#005744]' : 'text-[#0f172a]'}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#64748b] mt-0.5">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Category & Type */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#0f172a] mb-2">
                  Property type
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => { setPropertyCategory('RESIDENTIAL'); setPropertyType(RESIDENTIAL_TYPES[0]); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      propertyCategory === 'RESIDENTIAL'
                        ? 'bg-[#005744] text-white shadow-xs'
                        : 'bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    RESIDENTIAL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPropertyCategory('COMMERCIAL'); setPropertyType(COMMERCIAL_TYPES[0]); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      propertyCategory === 'COMMERCIAL'
                        ? 'bg-[#005744] text-white shadow-xs'
                        : 'bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    COMMERCIAL
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(propertyCategory === 'RESIDENTIAL' ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES).map((type) => {
                    const isSelected = propertyType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPropertyType(type)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#005744] text-white shadow-xs'
                            : 'bg-white border border-[#cbd5e1] text-[#334155] hover:border-[#94a3b8]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BHK & Area (for residential) */}
              {propertyCategory === 'RESIDENTIAL' && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[#0f172a] mb-2">
                    BHK Configuration
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BHK_OPTIONS.map((opt) => {
                      const isSelected = bhk === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setBhk(opt)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#005744] text-white shadow-xs'
                              : 'bg-white border border-[#cbd5e1] text-[#334155] hover:border-[#94a3b8]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Area & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Super Built-up Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(e.target.value)}
                    placeholder="e.g. 1450"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Property Status
                  </label>
                  <select
                    value={propertyAge}
                    onChange={(e) => setPropertyAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                  >
                    <option value="Ready to move">Ready to move</option>
                    <option value="Under construction">Under construction</option>
                    <option value="New Launch">New Launch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── SECTION 2: PROPERTY LOCATION ── */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#005744] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Property location</h2>
                  <p className="text-xs text-[#64748b]">Buyers search by city, locality and society.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      City <span className="text-rose-500">*</span>
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Name of project / society
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Ajnara Homes"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                  />
                  <span className="text-[11px] text-[#94a3b8] mt-1 block">
                    Leave blank for independent houses.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Locality / sector <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Sector 16B, Greater Noida West"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 201306"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Tower / block / landmark. The full address is never shown publicly."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                  />
                  <span className="text-[11px] text-[#94a3b8] mt-1 block">
                    Tower / block / landmark. The full address is never shown publicly.
                  </span>
                </div>
              </div>
            </div>

            {/* ── SECTION 3: PRICE DETAILS ── */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#005744] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Price details</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Expected price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-[#64748b] font-bold text-sm">₹</span>
                      <input
                        type="number"
                        required
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        placeholder="e.g. 5500000"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none font-semibold"
                      />
                    </div>
                    {expectedPrice && (
                      <span className="text-xs font-extrabold text-[#005744] mt-1 block">
                        {formatIndianPrice(expectedPrice)}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Booking / token amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-[#64748b] font-bold text-sm">₹</span>
                      <input
                        type="number"
                        value={bookingAmount}
                        onChange={(e) => setBookingAmount(e.target.value)}
                        placeholder="Optional"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-[#94a3b8] mt-1 block">Optional</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Maintenance charges (per month)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-[#64748b] font-bold text-sm">₹</span>
                      <input
                        type="number"
                        value={maintenanceCharges}
                        onChange={(e) => setMaintenanceCharges(e.target.value)}
                        placeholder="Optional"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-[#94a3b8] mt-1 block">Optional</span>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isNegotiable}
                        onChange={(e) => setIsNegotiable(e.target.checked)}
                        className="w-4 h-4 rounded text-[#005744] focus:ring-[#005744] border-gray-300"
                      />
                      <span className="text-xs font-semibold text-[#0f172a]">Price is negotiable</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 4: PHOTOS ── */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#005744] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  4
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Photos</h2>
                </div>
              </div>
              <p className="text-xs text-[#64748b] mb-4">
                Listings with photos get up to 10x more enquiries. Up to 20 photos — the first one is the cover.
              </p>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pb-3 border-b border-[#f1f5f9] mb-4">
                {PHOTO_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#005744] text-white shadow-xs'
                          : 'bg-[#f8fafc] text-[#475569] hover:bg-[#e2e8f0]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#cbd5e1] hover:border-[#005744] bg-[#f8fafc] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#e2e8f0] mb-2 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#0f172a]">
                  Click or drag photos here to upload under <span className="text-[#005744]">"{selectedCategory}"</span>
                </p>
                <p className="text-[11px] text-[#64748b] mt-1">
                  JPG, PNG or WebP — automatically compressed for lightning-fast loading
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              {photoError && (
                <p className="text-xs text-rose-600 font-semibold mt-2">{photoError}</p>
              )}

              {/* Photo Thumbnails */}
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#e2e8f0] aspect-4/3 bg-[#f1f5f9]">
                      <img src={photo.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {/* Cover Badge */}
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#005744] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                          Cover Photo
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9.5px] font-semibold px-1.5 py-0.5 rounded truncate max-w-[85%]">
                        {photo.category}
                      </span>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        ✕
                      </button>

                      {/* Set as Cover */}
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setAsCoverPhoto(idx); }}
                          className="absolute inset-x-2 bottom-8 opacity-0 group-hover:opacity-100 bg-white/95 text-[#005744] text-[10px] font-bold py-1 rounded text-center shadow-xs transition-opacity cursor-pointer"
                        >
                          Make Cover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Quality Checklist for Photos */}
              <div className="mt-4 p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <span>✓</span> Real, bright photos of this property
                </div>
                <div className="flex items-center gap-1.5 text-rose-600">
                  <span>✗</span> No text or phone numbers on images
                </div>
                <div className="flex items-center gap-1.5 text-rose-600">
                  <span>✗</span> No watermarks or logos
                </div>
                <div className="flex items-center gap-1.5 text-rose-600">
                  <span>✗</span> No blurry or dark photos
                </div>
              </div>
            </div>

            {/* ── SECTION 5: DESCRIPTION & CONTACT ── */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#005744] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  5
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Description & contact</h2>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spacious 3 BHK with park view in Gaur City 2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                  />
                  <span className="text-[11px] text-[#94a3b8] mt-1 block">
                    Optional — we create a clear title automatically if you leave this blank.
                  </span>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe layout, condition, view, nearby schools / metro / markets, and what is included..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#64748b] mt-1">
                    <span>{description.trim().length} characters · 120+ recommended. Please don't add phone numbers here.</span>
                    <span className={description.trim().length >= 120 ? 'text-emerald-600 font-bold' : ''}>
                      {description.trim().length >= 120 ? '✓ Good length' : ''}
                    </span>
                  </div>
                </div>

                {/* Furnishing */}
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                    Furnishing status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Furnished', 'Semi-Furnished', 'Unfurnished'].map((fur) => (
                      <button
                        key={fur}
                        type="button"
                        onClick={() => setFurnishing(fur)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          furnishing === fur
                            ? 'bg-[#005744] text-white shadow-xs'
                            : 'bg-white border border-[#cbd5e1] text-[#334155]'
                        }`}
                      >
                        {fur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                    Amenities ({amenities.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_LIST.map((am) => {
                      const isChecked = amenities.includes(am);
                      return (
                        <button
                          key={am}
                          type="button"
                          onClick={() => toggleAmenity(am)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#005744] text-white shadow-xs'
                              : 'bg-white border border-[#cbd5e1] text-[#475569] hover:border-[#94a3b8]'
                          }`}
                        >
                          {isChecked ? '✓ ' : '+ '}{am}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Name & RERA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Contact name shown to buyers <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Prince Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Project RERA registration no.
                    </label>
                    <input
                      type="text"
                      value={reraNumber}
                      onChange={(e) => setReraNumber(e.target.value)}
                      placeholder="e.g. UPRERAPRJ123456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                    <span className="text-[11px] text-[#94a3b8] mt-1 block">
                      Recommended - buyers trust listings with a RERA number and are more likely to contact you.
                    </span>
                  </div>
                </div>

                {/* Phone & Email for unauthenticated or updating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. owner@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs sm:text-sm text-[#0f172a] focus:border-[#005744] outline-none"
                    />
                  </div>
                </div>

                {/* Agreement Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#005744] focus:ring-[#005744] border-gray-300"
                    />
                    <span className="text-xs font-bold text-[#0f172a]">
                      I want to receive responses on WhatsApp
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#005744] focus:ring-[#005744] border-gray-300"
                    />
                    <span className="text-xs text-[#475569]">
                      I am the owner or I have the authority to post this property. The details are correct and I agree to the <span className="underline text-[#005744]">Terms</span>.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting property...</span>
                  </>
                ) : (
                  <span>Post property — FREE</span>
                )}
              </button>
              <p className="text-xs text-[#64748b] mt-2">
                Every listing is checked by our team before it goes live.
              </p>
            </div>
          </form>

          {/* Right Column: Listing Quality & Buyer Tips */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* 1. Listing Quality Card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f172a]">Listing quality</h3>
                <span className={`text-base font-black ${qualityScore >= 80 ? 'text-emerald-600' : 'text-[#005744]'}`}>
                  {qualityScore}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden mb-5">
                <div
                  className="bg-[#005744] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${qualityScore}%` }}
                ></div>
              </div>

              {/* Dynamic Checklist */}
              <div className="space-y-2.5 text-xs text-[#475569]">
                {checklist.map((item) => (
                  <div key={item.key} className="flex items-center gap-2.5">
                    {item.done ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        ✓
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-[#cbd5e1] flex items-center justify-center flex-shrink-0"></span>
                    )}
                    <span className={item.done ? 'text-[#0f172a] font-medium' : 'text-[#64748b]'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. How to find the right Buyer Card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0f172a]">
                How to find the right <span className="text-[#005744]">Buyer</span>?
              </h3>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-sm flex-shrink-0">
                  📞
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">Respond to buyer enquiries fast</h4>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Every contact shows up in My Listings with name and number.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">
                  📷
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">Add 5+ real photos</h4>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Living room, bedrooms, kitchen and the view sell a home.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">Quote a realistic price</h4>
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Fairly priced listings get contacted first.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Need help posting Card */}
            <div className="bg-[#f0fdf4] rounded-2xl border border-[#a7f3d0] p-4 text-xs">
              <h4 className="font-bold text-[#005744]">Need help posting?</h4>
              <p className="text-[#065f46] text-[11px] mt-0.5">
                Our support team is available on WhatsApp to assist you.
              </p>
              <a
                href="https://wa.me/919084486898?text=Hello%20HomesWale,%20I%20need%20help%20posting%20my%20property"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 font-bold text-[#005744] underline hover:opacity-80"
              >
                Send our team a message →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
