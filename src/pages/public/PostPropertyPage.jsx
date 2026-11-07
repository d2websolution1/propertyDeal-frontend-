// frontend/src/pages/public/PostPropertyPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const INDIAN_STATES = [
  'Uttar Pradesh', 'Delhi NCR', 'Maharashtra', 'Haryana', 'Karnataka', 
  'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'West Bengal',
  'Punjab', 'Madhya Pradesh', 'Kerala', 'Goa', 'Uttarakhand', 'Chandigarh'
];

const PROPERTY_TYPES = [
  { value: 'Flat', label: 'Flat / Apartment' },
  { value: 'House/villa', label: 'House / Villa' },
  { value: 'Plot', label: 'Plot / Land' },
  { value: 'Farm house', label: 'Farm house' },
  { value: 'Building', label: 'Building' },
  { value: 'Studio Apartment', label: 'Studio Apartment' },
  { value: 'room', label: 'Room' },
  { value: 'Pg/hostel', label: 'PG / Hostel' },
  { value: 'office space', label: 'Office Space' },
  { value: 'Commercial space', label: 'Commercial Space' },
  { value: 'Other', label: 'Other (mention manually)' },
];

const FACILITY_OPTIONS = [
  'Gated society',
  'Park',
  'Security',
  'Clubhouse',
  'Gym',
  'Home theater',
  'Swimming pool',
  'Lift'
];

const AMENITY_OPTIONS = [
  'Bed',
  'Almirah',
  'Dining table',
  'AC',
  'Fan',
  'Lights',
  'Geyser',
  'Modular kitchen',
  'RO water',
  'Fridge',
  'Chimney',
  'Gas connection',
  'Gas stove',
  'Sofa',
  'TV',
  'Wi-Fi'
];

const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];

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

// Client-side image compressor using HTML5 canvas
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

  // Auto-generated Property ID (display preview)
  const [autoPropertyId] = useState(() => 'PA-' + Math.floor(100000 + Math.random() * 900000));

  // 1. Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('Sale'); // 'Sale' | 'Rent'
  const [propertyCategory, setPropertyCategory] = useState('Residential'); // 'Residential' | 'Commercial'
  const [propertyType, setPropertyType] = useState('Flat');
  const [otherPropertyType, setOtherPropertyType] = useState('');

  // 2. Size & Dimensions
  const [sizeType, setSizeType] = useState('super built-up area'); // 'carpet area' | 'super built-up area' | 'plot area'
  const [sizeValue, setSizeValue] = useState('');
  const [sizeUnit, setSizeUnit] = useState('sqft'); // 'sqft' | 'sq yard' | 'acre'
  const [plotFrontFt, setPlotFrontFt] = useState('');
  const [plotDepthFt, setPlotDepthFt] = useState('');
  const [frontRoadFt, setFrontRoadFt] = useState('');
  const [isCorner, setIsCorner] = useState(false);
  const [isParkFacing, setIsParkFacing] = useState(false);
  const [isTwoSideOpen, setIsTwoSideOpen] = useState(false);
  const [facing, setFacing] = useState(['East']);

  // 3. Price & Commercials
  const [expectedPrice, setExpectedPrice] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [maintenanceCharges, setMaintenanceCharges] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);

  // 4. Status, Furnishing, Facilities & Amenities
  const [constructionStatus, setConstructionStatus] = useState('Ready to move'); // 'Ready to move' | 'Under construction'
  const [furnishing, setFurnishing] = useState('Semi-furnished'); // 'Non-furnished' | 'Semi-furnished' | 'Fully furnished'
  const [facilities, setFacilities] = useState(['Gated society', 'Security', 'Lift']);
  const [amenities, setAmenities] = useState(['Fan', 'Lights', 'Modular kitchen', 'RO water']);

  // 5. Room counts
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [hall, setHall] = useState('1');
  const [kitchen, setKitchen] = useState('1');
  const [balcony, setBalcony] = useState('1');
  const [parking, setParking] = useState('Car');

  // 6. Location
  const [state, setState] = useState('Rajasthan');
  const [city, setCity] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [subAreas, setSubAreas] = useState('');
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  // Dynamic locations from Admin
  const [locationsData, setLocationsData] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/locations`)
      .then((res) => {
        if (res.data?.locations?.length > 0) {
          setLocationsData(res.data.locations);
          if (!city && res.data.locations[0]?.city) {
            setCity(res.data.locations[0].city);
            if (res.data.locations[0].state) setState(res.data.locations[0].state);
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentCityAreas = useMemo(() => {
    if (!city) return [];
    const matched = locationsData.find(
      (l) => l.city.toLowerCase() === city.trim().toLowerCase()
    );
    return matched?.areas || ['Sector 62', 'Indirapuram', 'Vaishali', 'Gomti Nagar', 'Mansarovar', 'Malviya Nagar'];
  }, [locationsData, city]);

  // 7. Photos
  const [selectedCategory, setSelectedCategory] = useState('Exterior view');
  const [photos, setPhotos] = useState([]); // array of { url: string, category: string, isFeatured: boolean }
  const [photoError, setPhotoError] = useState('');

  // 8. Contact Info
  const [contactName, setContactName] = useState(user?.name || user?.firstName || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [reraNumber, setReraNumber] = useState(user?.reraNumber || '');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);

  // Fetch subscription plans if needed
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/subscriptions/plans`)
      .then((res) => {
        if (res.data?.plans) setAvailablePlans(res.data.plans);
      })
      .catch(() => {});
  }, []);

  // Calculate Price Per Unit
  const pricePerUnit = useMemo(() => {
    const p = Number(expectedPrice);
    const s = Number(sizeValue);
    if (!p || !s || s <= 0) return null;
    return Math.round(p / s);
  }, [expectedPrice, sizeValue]);

  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name || user.firstName || '');
      if (!contactPhone && user.phone) setContactPhone(user.phone);
      if (!contactEmail && user.email) setContactEmail(user.email);
      if (!reraNumber && user.reraNumber) setReraNumber(user.reraNumber);
    }
  }, [user]);

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
          isFeatured: photos.length === 0 && compressedList.length === 0,
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
    setPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((p) => p.isFeatured)) {
        updated[0].isFeatured = true;
      }
      return updated;
    });
  };

  const setAsFeaturedPhoto = (index) => {
    setPhotos((prev) =>
      prev.map((photo, i) => ({
        ...photo,
        isFeatured: i === index,
      }))
    );
  };

  const toggleFacility = (facility) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleFacing = (direction) => {
    setFacing((prev) =>
      prev.includes(direction) ? prev.filter((d) => d !== direction) : [...prev, direction]
    );
  };

  const toggleArea = (areaName) => {
    setSelectedAreas((prev) =>
      prev.includes(areaName) ? prev.filter((a) => a !== areaName) : [...prev, areaName]
    );
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!city.trim()) {
      setSubmitError('Please select or enter the City.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!expectedPrice || Number(expectedPrice) <= 0) {
      setSubmitError('Please enter a valid Price.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!agreeTerms) {
      setSubmitError('Please agree to the Terms and confirmation statement.');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const featuredPhoto = photos.find((p) => p.isFeatured)?.url || photos[0]?.url || '';

      const payload = {
        title: title.trim() || `${propertyType} in ${city}`,
        description: description.trim(),
        purpose: purpose.toLowerCase(),
        listingType: purpose.toLowerCase() === 'rent' ? 'rent' : 'sale',
        propertyCategory,
        propertyType: propertyType === 'Other' && otherPropertyType ? otherPropertyType : propertyType,
        otherPropertyType: propertyType === 'Other' ? otherPropertyType : '',
        sizeType,
        size: Number(sizeValue) || null,
        areaSqft: Number(sizeValue) || null,
        sizeUnit,
        plotFrontFt: plotFrontFt ? Number(plotFrontFt) : null,
        plotDepthFt: plotDepthFt ? Number(plotDepthFt) : null,
        frontRoadFt: frontRoadFt ? Number(frontRoadFt) : null,
        isCorner,
        isParkFacing,
        isTwoSideOpen,
        facing,
        price: Number(expectedPrice),
        bookingAmount: bookingAmount ? Number(bookingAmount) : null,
        maintenanceCharges: maintenanceCharges ? Number(maintenanceCharges) : null,
        isNegotiable,
        constructionStatus,
        furnishing,
        facilities,
        amenities,
        bedrooms,
        bathrooms,
        hall,
        kitchen,
        balcony,
        parking,
        images: photos.map((p) => p.url),
        featuredImage: featuredPhoto,
        state,
        city: city.trim(),
        locality: selectedAreas[0] || (currentCityAreas[0] || 'Central Area'),
        areas: selectedAreas,
        subAreas: subAreas ? subAreas.split(',').map((s) => s.trim()).filter(Boolean) : [],
        projectName: projectName.trim(),
        pincode: pincode.trim(),
        address: address.trim(),
        reraNumber: reraNumber.trim(),
        contactName: contactName.trim() || user?.name || 'Property Adda Partner',
        whatsappAlerts,
        ownerName: contactName.trim() || user?.name || 'Property Adda Partner',
        ownerPhone: contactPhone.trim() || user?.phone || '',
        ownerEmail: contactEmail.trim() || user?.email || '',
        postedByType: user?.userType || 'Owner',
      };

      const res = await axios.post(`${API_BASE_URL}/properties`, payload, { headers });
      setSuccessData(res.data.property || { uniqueCode: autoPropertyId, status: 'pending' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to post property:', err);
      if (err.response?.data?.quotaExceeded) {
        setShowSubscriptionModal(true);
      }
      setSubmitError(
        err.response?.data?.message || 'Failed to post property. Please check your inputs and try again.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Subscribe Handler for Quota Modal
  const handleUpgradePlan = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first to activate your subscription plan.');
      navigate('/login?next=/post-property');
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/subscriptions/subscribe`,
        { planId: plan.id || plan._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data?.message || 'Plan activated successfully!');
      setShowSubscriptionModal(false);
      setSubmitError('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to activate plan.');
    }
  };

  // Success view
  if (successData) {
    const isApproved = successData.status === 'approved';
    return (
      <div className="min-h-screen bg-[#f8fafc] py-14 px-4 sm:px-6 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
            🎉
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">
            {isApproved ? 'Property Posted & Live!' : 'Property Submitted for Review!'}
          </h2>
          <p className="text-sm text-[#475569] mt-2">
            {isApproved
              ? 'Your listing is live on Property Adda. Buyers and tenants can now view and contact you.'
              : 'Your listing is submitted successfully and is under verification. Once approved, it will be visible to thousands of buyers and tenants across India.'}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-left w-full space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-xs text-[#64748b]">Property ID / Code:</span>
              <span className="text-xs font-black text-[#005744] bg-[#ecfdf5] px-2.5 py-0.5 rounded-md font-mono">
                {successData.uniqueCode || autoPropertyId}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-xs text-[#64748b]">Type & Purpose:</span>
              <span className="text-xs font-bold text-[#0f172a] capitalize">
                {successData.propertyType} • {successData.purpose || successData.listingType}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-[#64748b]">City:</span>
              <span className="text-xs font-bold text-[#0f172a]">{successData.city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/my-listings"
              className="w-full py-3 px-4 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] shadow-md transition-all text-center"
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
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 font-sans text-[#0f172a]">
      <div className="max-w-5xl mx-auto">
        {/* Main Title Banner */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a]">
                Post Property on Property Adda
              </h1>
              <span className="bg-[#2563eb] text-white text-[11px] font-black px-2 py-0.5 rounded-md tracking-wide">
                FREE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              Reach thousands of verified buyers & tenants with zero brokerage.
            </p>
          </div>

          {/* Auto-generated Property ID Badge */}
          <div className="px-4 py-2 rounded-2xl bg-white border border-[#cbd5e1] shadow-2xs flex items-center gap-2">
            <span className="text-xs text-[#64748b]">Property ID:</span>
            <span className="font-mono font-black text-xs text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-md">
              {autoPropertyId}
            </span>
          </div>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{submitError}</span>
            </div>
            {submitError.includes('Listing limit reached') && (
              <button
                type="button"
                onClick={() => setShowSubscriptionModal(true)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs cursor-pointer ml-3"
              >
                Upgrade Plan →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── 1. PROPERTY OVERVIEW & PURPOSE ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Property Purpose & Type</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dropdown - Purpose */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Purpose <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] outline-none focus:border-[#2563eb]"
                >
                  <option value="Sale">Sale (Buy / Resale)</option>
                  <option value="Rent">Rent / Lease</option>
                </select>
              </div>

              {/* Dropdown - Commercial / Residential */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] outline-none focus:border-[#2563eb]"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Dropdown - Property Type */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] outline-none focus:border-[#2563eb]"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Other Property Type Manual Mention */}
            {propertyType === 'Other' && (
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Mention Property Type Manually <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={otherPropertyType}
                  onChange={(e) => setOtherPropertyType(e.target.value)}
                  placeholder="e.g. Penthouse, Triplex, Institutional Plot, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Property Title (Text)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spacious 3 BHK Luxury Apartment with Open Garden View"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Description (Text) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property, ventilation, society amenities, nearby metro/schools, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb] resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── 2. SIZE, DIMENSIONS & ROAD ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Size, Dimensions & Facing</h2>
            </div>

            {/* Size Type, Value, Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Size Type
                </label>
                <select
                  value={sizeType}
                  onChange={(e) => setSizeType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="super built-up area">Super Built-up Area</option>
                  <option value="carpet area">Carpet Area</option>
                  <option value="plot area">Plot Area</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Size Value <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={sizeValue}
                  onChange={(e) => setSizeValue(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Unit Dropdown
                </label>
                <select
                  value={sizeUnit}
                  onChange={(e) => setSizeUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="sqft">sq. ft.</option>
                  <option value="sq yard">sq. yard (Gaj)</option>
                  <option value="acre">acre</option>
                </select>
              </div>
            </div>

            {/* Plot Dimensions & Road Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Front in ft (Plot dimensions)
                </label>
                <input
                  type="number"
                  value={plotFrontFt}
                  onChange={(e) => setPlotFrontFt(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Depth in ft (Plot dimensions)
                </label>
                <input
                  type="number"
                  value={plotDepthFt}
                  onChange={(e) => setPlotDepthFt(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Front Road size in ft
                </label>
                <input
                  type="number"
                  value={frontRoadFt}
                  onChange={(e) => setFrontRoadFt(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Checkboxes: Corner / park facing / 2 sides open */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-2">
                Property Highlights (Checkboxes)
              </label>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCorner}
                    onChange={(e) => setIsCorner(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb]"
                  />
                  <span>Corner Plot / Unit</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isParkFacing}
                    onChange={(e) => setIsParkFacing(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb]"
                  />
                  <span>Park Facing</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTwoSideOpen}
                    onChange={(e) => setIsTwoSideOpen(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb]"
                  />
                  <span>2 Sides Open</span>
                </label>
              </div>
            </div>

            {/* Facing (Multi-select) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Facing (Multi-select)
              </label>
              <div className="flex flex-wrap gap-2">
                {FACING_OPTIONS.map((dir) => {
                  const isChecked = facing.includes(dir);
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => toggleFacing(dir)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{dir}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 3. PRICE & AUTO-CALCULATED RATE ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Pricing & Rates</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  {purpose === 'Rent' ? 'Rent value / month' : 'Expected Sale Price'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#64748b] font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    placeholder={purpose === 'Rent' ? 'e.g. 25000' : 'e.g. 6500000'}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#0f172a] outline-none focus:border-[#2563eb]"
                  />
                </div>
                {expectedPrice && (
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#2563eb]">
                      {formatIndianPrice(expectedPrice)} {purpose === 'Rent' ? '/ month' : ''}
                    </span>
                    {pricePerUnit && purpose !== 'Rent' && (
                      <span className="text-[#059669] font-bold bg-[#ecfdf5] px-2 py-0.5 rounded">
                        ⚡ Rate: ₹{pricePerUnit.toLocaleString('en-IN')} / {sizeUnit}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Booking / Security Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#64748b] font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={bookingAmount}
                    onChange={(e) => setBookingAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563eb]"
                />
                <span>Price is Negotiable</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b]">Monthly maintenance:</span>
                <input
                  type="number"
                  value={maintenanceCharges}
                  onChange={(e) => setMaintenanceCharges(e.target.value)}
                  placeholder="₹ Optional"
                  className="w-28 px-2 py-1 rounded-lg border border-[#cbd5e1] text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── 4. STATUS, FURNISHING & ROOM COUNTS ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Status, Furnishing & Rooms</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Dropdown - Construction Status
                </label>
                <select
                  value={constructionStatus}
                  onChange={(e) => setConstructionStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="Ready to move">Ready to move</option>
                  <option value="Under construction">Under construction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Dropdown - Furnishing
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="Non-furnished">Non-furnished</option>
                  <option value="Semi-furnished">Semi-furnished</option>
                  <option value="Fully furnished">Fully furnished</option>
                </select>
              </div>
            </div>

            {/* Room details dropdowns */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-2">
                Room & Parking Details (Dropdowns)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Bedrooms</span>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['1', '2', '3', '4', '4+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Bathrooms</span>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['1', '2', '3', '3+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Hall</span>
                  <select
                    value={hall}
                    onChange={(e) => setHall(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['1', '2', '2+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Kitchen</span>
                  <select
                    value={kitchen}
                    onChange={(e) => setKitchen(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['1', '2', '2+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Balcony</span>
                  <select
                    value={balcony}
                    onChange={(e) => setBalcony(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['1', '2', '3', '3+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Parking</span>
                  <select
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Car & Bike">Car & Bike</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Facilities Multiple Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-2">
                Facilities (Multiple Checkboxes: Gated society, park, security, clubhouse, gym, home theater, swimming pool, lift)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FACILITY_OPTIONS.map((fac) => {
                  const isChecked = facilities.includes(fac);
                  return (
                    <label
                      key={fac}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#2563eb] bg-[#eff6ff] text-[#1e40af]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFacility(fac)}
                        className="w-4 h-4 rounded text-[#2563eb]"
                      />
                      <span>{fac}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Amenities Multiple Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-2">
                Amenities (Multiple Checkboxes: Bed, almirah, dining table, AC, fan, lights, geyser, modular kitchen, RO water, fridge, chimney, gas connection, gas stove, sofa, TV, wi-fi)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AMENITY_OPTIONS.map((am) => {
                  const isChecked = amenities.includes(am);
                  return (
                    <label
                      key={am}
                      className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(am)}
                        className="w-3.5 h-3.5 rounded text-emerald-600"
                      />
                      <span className="truncate">{am}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 5. LOCATION (DROPDOWNS, AREAS, ADDRESS) ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                5
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Location & Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  City (Select from dropdown) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-bold outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Select City --</option>
                  {locationsData.map((l) => (
                    <option key={l.id || l._id || l.city} value={l.city}>
                      {l.city} ({l.state || 'India'})
                    </option>
                  ))}
                  {/* Fallbacks */}
                  {!locationsData.some((l) => l.city === 'Mumbai') && <option value="Mumbai">Mumbai</option>}
                  {!locationsData.some((l) => l.city === 'Delhi NCR') && <option value="Delhi NCR">Delhi NCR</option>}
                  {!locationsData.some((l) => l.city === 'Noida') && <option value="Noida">Noida</option>}
                  {!locationsData.some((l) => l.city === 'Gurgaon') && <option value="Gurgaon">Gurgaon</option>}
                  {!locationsData.some((l) => l.city === 'Jaipur') && <option value="Jaipur">Jaipur</option>}
                </select>
              </div>

              {/* Township / Apartment / Project Name */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Township / Apartment / Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. ATS Knightsbridge, Gaur City, DLF Phase 5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Area Multi-select */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Area (Multi-select from available areas in {city || 'City'})
              </label>
              <div className="flex flex-wrap gap-2">
                {currentCityAreas.map((areaName) => {
                  const isChecked = selectedAreas.includes(areaName);
                  return (
                    <button
                      key={areaName}
                      type="button"
                      onClick={() => toggleArea(areaName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{areaName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub area & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Sub Area (Multi-select / comma-separated)
                </label>
                <input
                  type="text"
                  value={subAreas}
                  onChange={(e) => setSubAreas(e.target.value)}
                  placeholder="e.g. Block C, Sector 18 Pocket 2, Metro Gate 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 201301"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Full Address (Text)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tower, flat number or landmark details"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          {/* ── 6. PICTURES UPLOAD & SELECT FEATURED IMAGE ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                  6
                </span>
                <h2 className="text-base font-bold text-[#0f172a]">
                  Pictures Upload & Select Featured Image
                </h2>
              </div>
              <span className="text-xs text-[#64748b]">
                {photos.length} / 20 uploaded
              </span>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {PHOTO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#2563eb] text-white shadow-xs'
                      : 'bg-[#f8fafc] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Drag and Drop Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#cbd5e1] hover:border-[#2563eb] bg-[#f8fafc] rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#e2e8f0] mb-2 group-hover:scale-105 transition-transform text-2xl">
                📷
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#0f172a]">
                Click or drag images to upload under <span className="text-[#2563eb]">"{selectedCategory}"</span>
              </p>
              <p className="text-[11px] text-[#64748b] mt-1">
                Supports JPG, PNG, WebP (auto-compressed for fast loading)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {photoError && <p className="text-xs text-rose-600 font-semibold">{photoError}</p>}

            {/* Photo List & Select Featured Image */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-4/3 bg-[#f1f5f9] group transition-all ${
                      photo.isFeatured ? 'border-[#2563eb] shadow-md ring-2 ring-[#2563eb]/20' : 'border-slate-200'
                    }`}
                  >
                    <img src={photo.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                    {/* Featured Star Badge */}
                    {photo.isFeatured ? (
                      <span className="absolute top-1.5 left-1.5 bg-[#2563eb] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        ⭐ Featured Image
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAsFeaturedPhoto(idx);
                        }}
                        className="absolute inset-x-2 bottom-2 bg-white/90 hover:bg-white text-[#2563eb] text-[10px] font-bold py-1 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center"
                      >
                        Set as Featured ⭐
                      </button>
                    )}

                    {/* Category Label */}
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                      {photo.category}
                    </span>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(idx);
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 7. ADMIN BADGE NOTICE & CONTACT ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                7
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Contact & Admin Badges</h2>
            </div>

            {/* Featured / Verified Notice */}
            <div className="p-3.5 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-xs flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-bold text-[#1e40af]">
                  Featured & Verified Badges — Reviewed by Admin Only
                </p>
                <p className="text-[11px] text-[#3b82f6] mt-0.5">
                  To ensure quality & authenticity for buyers, only verified accounts and properties inspected by Property Adda administrators carry the Verified & Featured badges.
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Contact Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 9672056670"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  RERA Registration No. (Optional)
                </label>
                <input
                  type="text"
                  value={reraNumber}
                  onChange={(e) => setReraNumber(e.target.value)}
                  placeholder="e.g. RAJ/P/2023/1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0f172a]">
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563eb]"
                />
                <span>Send me enquiry alerts on WhatsApp</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0f172a]">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563eb]"
                />
                <span>
                  I confirm that all details provided are accurate and I agree to Property Adda Terms of Use.
                </span>
              </label>
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-base shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Publishing Property Listing...</span>
              ) : (
                <span>Post Property Listing Now →</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── SUBSCRIPTION QUOTA MODAL ── */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 font-sans max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Listing Limit Reached — Upgrade Your Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a subscription plan to continue posting and boost your real estate deals.
                </p>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {/* Plan 1: Free Starter */}
              <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-200 px-2 py-0.5 rounded">
                    STARTER
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-2">फ्री में दो लिस्टिंग</h4>
                  <p className="text-xs text-slate-600 mt-1">2 Free property listings for 1 month (30 days validity).</p>
                  <p className="text-2xl font-black text-slate-900 mt-3">₹0</p>
                </div>
                <button
                  onClick={() => handleUpgradePlan({ _id: availablePlans[0]?._id || 'free', name: 'Free Starter' })}
                  className="mt-4 w-full py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-white cursor-pointer"
                >
                  Activate Free Plan
                </button>
              </div>

              {/* Plan 2: ₹99 Featured */}
              <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-amber-800 uppercase bg-amber-200 px-2 py-0.5 rounded">
                    FEATURED BOOST
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-2">₹99 में 1 featured लिस्टिंग</h4>
                  <p className="text-xs text-slate-600 mt-1">Get 1 premium featured tag with 5x enquiry boost for 1 month.</p>
                  <p className="text-2xl font-black text-amber-700 mt-3">₹99</p>
                </div>
                <button
                  onClick={() => handleUpgradePlan(availablePlans.find((p) => p.price === 99) || { price: 99 })}
                  className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Pay ₹99 Online →
                </button>
              </div>

              {/* Plan 3: ₹499 Standard */}
              <div className="p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/50 flex flex-col justify-between relative">
                <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  MOST POPULAR
                </span>
                <div>
                  <span className="text-[10px] font-black text-blue-800 uppercase bg-blue-200 px-2 py-0.5 rounded">
                    QUARTERLY
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-2">₹499 में 10 लिस्टिंग</h4>
                  <p className="text-xs text-slate-600 mt-1">10 listings for 3 months (90 days) + 2 featured boosts.</p>
                  <p className="text-2xl font-black text-blue-700 mt-3">₹499</p>
                </div>
                <button
                  onClick={() => handleUpgradePlan(availablePlans.find((p) => p.price === 499) || { price: 499 })}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Pay ₹499 Online →
                </button>
              </div>

              {/* Plan 4: ₹999 Pro Agency */}
              <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase bg-emerald-200 px-2 py-0.5 rounded">
                    BEST VALUE (9 MONTHS)
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-2">₹999 में 30 लिस्टिंग</h4>
                  <p className="text-xs text-slate-600 mt-1">30 listings for 9 months (270 days) + 5 featured boosts.</p>
                  <p className="text-2xl font-black text-emerald-700 mt-3">₹999</p>
                </div>
                <button
                  onClick={() => handleUpgradePlan(availablePlans.find((p) => p.price === 999) || { price: 999 })}
                  className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Pay ₹999 Online →
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Instant activation • Listing limits updated immediately upon online payment
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
