// frontend/src/pages/public/PropertyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://propertydeal-backend-w3yk.onrender.com/api';

const formatIndianPrice = (price, listingType) => {
  const num = Number(price);
  if (!num || isNaN(num)) return '₹ Call for Price';
  if (listingType === 'rent') {
    return `₹ ${num.toLocaleString('en-IN')}/month`;
  }
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Enquiry form state
  const [enquiryName, setEnquiryName] = useState(user?.name || '');
  const [enquiryPhone, setEnquiryPhone] = useState(user?.phone || '');
  const [enquiryEmail, setEnquiryEmail] = useState(user?.email || '');
  const [enquiryMessage, setEnquiryMessage] = useState('Hi, I am interested in this property. Please share full details and schedule a site visit.');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  // Favorites
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Similar properties
  const [similarProperties, setSimilarProperties] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!enquiryName && user.name) setEnquiryName(user.name);
      if (!enquiryPhone && user.phone) setEnquiryPhone(user.phone);
      if (!enquiryEmail && user.email) setEnquiryEmail(user.email);
    }
  }, [user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE_URL}/properties/${id}`);
      if (res.data?.success && res.data.property) {
        const prop = res.data.property;
        setProperty(prop);

        // Fetch similar properties in same city or category
        if (prop.city) {
          axios
            .get(`${API_BASE_URL}/properties?city=${encodeURIComponent(prop.city)}&limit=4`)
            .then((simRes) => {
              if (simRes.data?.success) {
                const filtered = (simRes.data.properties || []).filter(
                  (p) => String(p._id || p.id) !== String(prop._id || prop.id)
                );
                setSimilarProperties(filtered.slice(0, 3));
              }
            })
            .catch(() => {});
        }
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Error fetching property details:', err);
      setError(err.response?.data?.message || 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add this property to your Favorites.');
      navigate(`/login?next=/property/${id}`);
      return;
    }

    const propId = property?._id || property?.id;
    if (!propId) return;

    try {
      setFavLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/users/favorites/${propId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setIsFavorited(!isFavorited);
      }
    } catch (err) {
      console.error('Error saving favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryError('');

    if (!enquiryPhone.trim() && !enquiryEmail.trim()) {
      setEnquiryError('Please enter your phone number or email address');
      return;
    }

    try {
      setSubmittingEnquiry(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        `${API_BASE_URL}/enquiries`,
        {
          name: enquiryName.trim() || 'Prospective Buyer',
          phone: enquiryPhone.trim(),
          email: enquiryEmail.trim(),
          message: enquiryMessage.trim(),
          propertyId: property?._id || property?.id,
          propertyTitle: property?.title,
          propertyLocation: property?.locality ? `${property.locality}, ${property.city}` : property?.city,
        },
        { headers }
      );

      if (res.data?.success || res.status === 201) {
        setEnquirySuccess(true);
        // Automatically direct user to call the posted contact number
        if (ownerPhone) {
          setTimeout(() => {
            window.location.href = `tel:${ownerPhone}`;
          }, 600);
        }
        setTimeout(() => {
          setEnquirySuccess(false);
        }, 6000);
      }
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      setEnquiryError(err.response?.data?.message || 'Failed to send enquiry. Please try again.');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F5F8] py-12 px-4 sm:px-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-slate-200 rounded w-3/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full h-96 bg-slate-200 rounded-2xl"></div>
            <div className="h-40 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#F3F5F8] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-[#D62839] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✕
          </div>
          <h2 className="text-xl font-bold text-[#142D4E] mb-2">Property Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            {error || 'The property you are looking for is either removed or currently under review.'}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-[#D62839] hover:bg-[#b81d2c] text-white font-bold rounded-xl text-sm transition-colors"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Rate Per Square Foot
  const sizeVal = Number(property.areaSqft || property.size || 0);
  const priceVal = Number(property.price || 0);
  const calculatedRatePerSqft = priceVal && sizeVal > 0 ? Math.round(priceVal / sizeVal) : (property.pricePerSqft || null);

  const imagesList = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : [property.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const ownerInfo = property.owner || {};
  const postedByType = property.postedByType || ownerInfo.userType || 'Owner';
  const ownerName = property.contactName || property.ownerName || ownerInfo.name || 'Property Owner';
  const ownerPhone = property.contactPhone || property.ownerPhone || ownerInfo.phone || '9509505892';
  const ownerEmail = property.contactEmail || property.ownerEmail || ownerInfo.email || '';
  const reraNumber = property.reraNumber || ownerInfo.reraNumber || '';

  return (
    <div className="min-h-screen bg-[#F3F5F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 flex-wrap">
          <Link to="/" className="hover:text-[#D62839] font-medium">Home</Link>
          <span>/</span>
          <Link to={`/?city=${encodeURIComponent(property.city || '')}`} className="hover:text-[#D62839] font-medium">
            {property.city || 'Properties'}
          </Link>
          <span>/</span>
          <span className="text-[#142D4E] font-semibold truncate max-w-xs">{property.title}</span>
        </nav>

        {/* Top Header Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#142D4E] text-white">
                  {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-[#142D4E]">
                  {property.propertyType}
                </span>
                {property.isVerified && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Verified Listing
                  </span>
                )}
                {property.isFeatured && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    ⭐ Featured
                  </span>
                )}
                {property.uniqueCode && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-600">
                    ID: {property.uniqueCode}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] tracking-tight">
                {property.title}
              </h1>

              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#D62839]">
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <span>{property.locality ? `${property.locality}, ` : ''}{property.city}, {property.state || 'India'}</span>
                {property.pincode && <span>- {property.pincode}</span>}
              </p>
            </div>

            {/* Price & Rate Per Sq.Ft Card */}
            <div className="md:text-right bg-[#fff1f2] border border-[#fecdd3] p-4 rounded-xl flex-shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Price
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D62839]">
                {formatIndianPrice(property.price, property.listingType)}
              </div>

              {/* RATE PER SQUARE FOOT DISPLAY (USER REQUIREMENT) */}
              {calculatedRatePerSqft && (
                <div className="mt-1.5 inline-flex items-center gap-1 bg-white border border-[#D62839]/30 text-[#D62839] px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span>₹{calculatedRatePerSqft.toLocaleString('en-IN')} / sq.ft</span>
                </div>
              )}

              {sizeVal > 0 && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Calculated on {sizeVal.toLocaleString('en-IN')} sq.ft area
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Photos, Specs, Description, Facilities */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Photo Gallery Carousel */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="relative aspect-[16/10] bg-slate-900">
                <img
                  src={imagesList[activePhotoIdx]}
                  alt={`${property.title} photo ${activePhotoIdx + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Photo counter */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                  📷 {activePhotoIdx + 1} / {imagesList.length} Photos
                </div>

                {/* Prev / Next controls if multiple photos */}
                {imagesList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center font-bold text-lg shadow-md transition-all"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center font-bold text-lg shadow-md transition-all"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {imagesList.length > 1 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5 overflow-x-auto">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activePhotoIdx === idx ? 'border-[#D62839] scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Key Specifications Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-[#142D4E] mb-4 pb-2 border-b border-slate-100">
                Property Overview & Specs
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bedrooms / BHK</span>
                  <span className="text-base font-extrabold text-[#142D4E] mt-0.5 block">
                    {property.propertyType?.toLowerCase().includes('plot') || property.category?.toLowerCase().includes('plot')
                      ? 'N/A (Plot)'
                      : (property.bhk || (property.bedrooms && property.bedrooms !== '0' ? `${property.bedrooms} BHK` : '0'))}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Super Built-up Area</span>
                  <span className="text-base font-extrabold text-[#142D4E] mt-0.5 block">
                    {sizeVal > 0 ? `${sizeVal.toLocaleString('en-IN')} sq.ft` : 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Price / Sq.Ft</span>
                  <span className="text-base font-extrabold text-[#D62839] mt-0.5 block">
                    {calculatedRatePerSqft ? `₹${calculatedRatePerSqft.toLocaleString('en-IN')}` : 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="text-base font-extrabold text-emerald-600 mt-0.5 block capitalize">
                    {property.constructionStatus || (property.propertyType?.toLowerCase().includes('plot') ? 'Ready for Possession' : 'Ready to Move')}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Furnishing</span>
                  <span className="text-sm font-bold text-[#142D4E] mt-0.5 block capitalize">
                    {property.propertyType?.toLowerCase().includes('plot') ? 'N/A (Plot)' : (property.furnishing || 'Semi-furnished')}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Facing</span>
                  <span className="text-sm font-bold text-[#142D4E] mt-0.5 block">
                    {Array.isArray(property.facing) ? property.facing.join(', ') : (property.facing || 'East')}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bathrooms</span>
                  <span className="text-sm font-bold text-[#142D4E] mt-0.5 block">
                    {property.propertyType?.toLowerCase().includes('plot') || property.category?.toLowerCase().includes('plot')
                      ? '0 (Plot)'
                      : (property.bathrooms !== undefined && property.bathrooms !== null && property.bathrooms !== '' ? property.bathrooms : '0')}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Parking</span>
                  <span className="text-sm font-bold text-[#142D4E] mt-0.5 block">
                    {property.parking || 'Reserved Car Parking'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Approval Authority / Recognition</span>
                  <span className="text-sm font-extrabold text-[#142D4E] mt-0.5 flex items-center gap-1.5">
                    <span className="text-emerald-600">🏛️</span>
                    <span>{property.approvedAuthority || 'JDA Approved'}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified Authority
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Description */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-[#142D4E] mb-3">About This Property</h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description || 'No description provided by the owner. Contact the owner or dealer directly for verified layout, carpet area details, and site visit arrangements.'}
              </div>

              {property.projectName && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong>Project / Society Name:</strong> {property.projectName}
                </div>
              )}
            </div>

            {/* 4. Facilities & Amenities */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-[#142D4E] mb-4 pb-2 border-b border-slate-100">
                Facilities & Modern Amenities
              </h2>

              {/* Society Facilities */}
              {Array.isArray(property.facilities) && property.facilities.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    Society / Building Facilities
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.facilities.map((fac, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-[#142D4E]">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In-Home Amenities */}
              {Array.isArray(property.amenities) && property.amenities.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    In-Home Amenities & Appliances
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.amenities.map((am, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-xs font-medium text-[#142D4E]">
                        <span className="text-[#D62839] font-bold">★</span>
                        <span>{am}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!property.facilities?.length && !property.amenities?.length) && (
                <p className="text-xs text-slate-400">
                  Standard society amenities included: 24/7 Security, Water supply, Power backup, and Dedicated Lift.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Owner/Dealer Contact & Direct Inquiry Form */}
          <div className="space-y-6">
            {/* Owner / Dealer Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs sticky top-24">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-[#142D4E] text-white flex items-center justify-center font-bold text-lg">
                  {ownerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#fff1f2] text-[#D62839] px-2 py-0.5 rounded">
                      {postedByType}
                    </span>
                    {reraNumber && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                        RERA
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base text-[#142D4E] mt-0.5">{ownerName}</h3>
                  {reraNumber && <p className="text-[11px] text-slate-400">RERA: {reraNumber}</p>}
                </div>
              </div>

              {/* Direct Call Button (Full-width Call Now) */}
              <div className="my-4">
                <a
                  href={`tel:${ownerPhone}`}
                  className="w-full py-3 px-4 rounded-xl bg-[#142D4E] hover:bg-[#0f233d] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Call Now ({ownerPhone || 'Contact Poster'})</span>
                </a>
              </div>

              {/* Direct Enquiry Form (Leads go to Owner/Dealer AND Admin) */}
              <div className="pt-2">
                <span className="text-xs font-bold text-[#142D4E] block mb-2">
                  Send Direct Enquiry to {postedByType}
                </span>

                {enquirySuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                    <span className="text-2xl text-emerald-600 font-bold block">✓</span>
                    <strong className="text-xs font-bold text-emerald-800 block">Enquiry Sent Successfully!</strong>
                    <p className="text-[11px] text-emerald-700">
                      The {postedByType.toLowerCase()} has received your contact request and will connect shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-3">
                    {enquiryError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 text-[#D62839] text-xs rounded-lg">
                        {enquiryError}
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        placeholder="Your Full Name *"
                        required
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D62839] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number (10 digits) *"
                        required
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D62839] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={enquiryEmail}
                        onChange={(e) => setEnquiryEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D62839] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        placeholder="Your message / site visit request..."
                        value={enquiryMessage}
                        onChange={(e) => setEnquiryMessage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D62839] focus:bg-white transition-all"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingEnquiry}
                      className="w-full py-2.5 bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {submittingEnquiry ? 'Sending Enquiry...' : `Send Inquiry to ${postedByType}`}
                    </button>

                    <p className="text-[10px] text-slate-400 text-center">
                      🔒 Your contact information is shared directly with this verified {postedByType.toLowerCase()}.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-[#142D4E] mb-6">
              Similar Properties in {property.city}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((sim) => {
                const simImg = Array.isArray(sim.images) && sim.images[0]
                  ? sim.images[0]
                  : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
                const simSize = Number(sim.areaSqft || sim.size);
                const simRate = sim.price && simSize > 0 ? Math.round(Number(sim.price) / simSize) : null;

                return (
                  <Link
                    key={sim._id || sim.id}
                    to={`/property/${sim._id || sim.id}`}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img src={simImg} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3 bg-[#142D4E] text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {sim.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <strong className="text-base font-extrabold text-[#D62839]">
                            {formatIndianPrice(sim.price, sim.listingType)}
                          </strong>
                          {simRate && (
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              ₹{simRate.toLocaleString('en-IN')}/sq.ft
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-[#142D4E] line-clamp-1 group-hover:text-[#D62839]">
                          {sim.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {sim.locality ? `${sim.locality}, ` : ''}{sim.city}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
