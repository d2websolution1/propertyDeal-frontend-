// frontend/src/components/Homepage/LivePropertiesShowcase.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatPrice = (price, listingType) => {
  const num = Number(price);
  if (isNaN(num)) return `₹${price}`;

  if (listingType === 'rent') {
    return `₹${num.toLocaleString('en-IN')}/month`;
  }
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

const LivePropertiesShowcase = ({ initialFilter = 'all', title = 'Popular Properties Across India' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const queryQ = searchParams.get('q') || '';
  const queryPropertyType = searchParams.get('propertyType') || '';
  const queryListingType = searchParams.get('listingType') || '';
  const queryCity = searchParams.get('city') || '';

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialFilter);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', phone: '', note: '' });

  useEffect(() => {
    fetchProperties();
  }, [filter, location.search]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/properties?limit=24`;
      if (filter === 'sale') url += '&listingType=sale';
      else if (filter === 'rent') url += '&listingType=rent';
      else if (filter === 'commercial') url += '&propertyType=Commercial';
      else if (filter === 'plots') url += '&propertyType=Plot';
      else if (queryListingType) url += `&listingType=${encodeURIComponent(queryListingType)}`;

      if (queryPropertyType) url += `&propertyType=${encodeURIComponent(queryPropertyType)}`;
      if (queryCity && queryCity !== 'All India') url += `&city=${encodeURIComponent(queryCity)}`;
      if (queryQ) url += `&q=${encodeURIComponent(queryQ)}`;

      const res = await axios.get(url);
      if (res.data?.success && res.data?.properties) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error('Error fetching live properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setFilter(initialFilter);
    navigate(location.pathname);
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setSelectedProperty(null);
      setEnquirySuccess(false);
      setEnquiryData({ name: '', phone: '', note: '' });
    }, 2200);
  };

  return (
    <section id="properties-showcase" className="py-12 bg-[#f8fafc] border-t border-[#e2e8f0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Active Search Filter Banner */}
        {(queryQ || queryPropertyType) && (
          <div className="mb-6 p-4 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#1e40af]">
                🔍 Results for:
              </span>
              {queryQ && (
                <span className="bg-[#2563eb] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  "{queryQ}"
                </span>
              )}
              {queryPropertyType && (
                <span className="bg-[#dbeafe] text-[#1e40af] text-xs font-bold px-2.5 py-1 rounded-lg">
                  Type: {queryPropertyType}
                </span>
              )}
              <span className="text-xs text-[#64748b] ml-1">
                ({properties.length} {properties.length === 1 ? 'property' : 'properties'} found)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs font-bold text-[#dc2626] hover:text-[#b91c1c] bg-white px-3 py-1.5 rounded-lg border border-[#fca5a5] shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>Clear Search Filter</span>
              <span>✕</span>
            </button>
          </div>
        )}

        {/* Section Header with Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563eb] mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
              <span>VERIFIED INVENTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              Hand-checked properties directly from verified owners & top builders.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#e2e8f0] shadow-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('sale')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'sale'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => setFilter('rent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'rent'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              For Rent
            </button>
            <button
              type="button"
              onClick={() => setFilter('commercial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'commercial'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-[#e2e8f0] p-4 h-80 animate-pulse">
                <div className="w-full h-44 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Property Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => {
              const imageSrc =
                Array.isArray(prop.images) && prop.images[0]
                  ? prop.images[0]
                  : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={prop.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      {prop.isVerified && (
                        <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-[#2563eb] text-white flex items-center gap-1 shadow-xs">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Verified
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-white/95 text-[#0f172a] backdrop-blur-sm shadow-xs capitalize">
                        {prop.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </div>

                    {prop.uniqueCode && (
                      <div className="absolute bottom-3 right-3 z-10 bg-slate-900/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                        {prop.uniqueCode}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price & BHK */}
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <strong className="text-xl font-extrabold text-[#2563eb]">
                          {formatPrice(prop.price, prop.listingType)}
                        </strong>
                        {prop.bhk && (
                          <span className="text-xs font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-md">
                            {prop.bhk}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-sm sm:text-base text-[#0f172a] line-clamp-1 group-hover:text-[#2563eb] transition-colors mb-1">
                        {prop.title}
                      </h3>

                      {/* Locality */}
                      <p className="text-xs text-[#64748b] flex items-center gap-1 mb-3">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#2563eb]">
                          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                          <circle cx="12" cy="9.5" r="2.5" />
                        </svg>
                        <span>{prop.locality ? `${prop.locality}, ` : ''}{prop.city}</span>
                      </p>

                      {/* Features Row */}
                      <div className="flex items-center gap-3 text-[11.5px] text-[#64748b] py-2.5 border-t border-b border-[#f1f5f9]">
                        {prop.areaSqft && (
                          <span>
                            <strong className="text-[#0f172a]">{prop.areaSqft}</strong> sq.ft
                          </span>
                        )}
                        <span>•</span>
                        <span className="capitalize">{prop.propertyType}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Ready Possession</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProperty(prop)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>Contact Owner</span>
                      </button>

                      <a
                        href={`https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20PropertyDeal%20listing:%20${encodeURIComponent(prop.title)}%20(${prop.uniqueCode || ''})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-emerald-200"
                        title="Chat on WhatsApp"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state fallback */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0] p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              🔍
            </div>
            <p className="text-base font-bold text-[#0f172a]">
              {queryQ ? `No properties found matching "${queryQ}"` : 'No properties found matching this filter.'}
            </p>
            <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
              Try searching for popular terms like <strong className="text-[#0f172a]">"Trump"</strong>, <strong className="text-[#0f172a]">"Noida"</strong>, <strong className="text-[#0f172a]">"Gaur City"</strong>, or browse all verified properties.
            </p>
            <button
              onClick={handleClearSearch}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              Show All Properties
            </button>
          </div>
        )}

        {/* Enquiry Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-hw-fade">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0] relative">
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
              >
                ✕
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-extrabold uppercase text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                  DIRECT PROPERTYDEAL ENQUIRY
                </span>
                <h3 className="text-lg font-extrabold text-[#0f172a] mt-1">
                  Connect with Owner / Dealer
                </h3>
                <p className="text-xs text-[#64748b] truncate mt-0.5">
                  Property: {selectedProperty.title}
                </p>
                <p className="text-sm font-bold text-[#2563eb] mt-1">
                  {formatPrice(selectedProperty.price, selectedProperty.listingType)}
                </p>
              </div>

              {enquirySuccess ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-extrabold text-[#0f172a] text-base">Enquiry Sent Successfully!</h4>
                  <p className="text-xs text-[#64748b]">
                    The property owner and PropertyDeal support team will contact you shortly on WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={enquiryData.name}
                      onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] text-xs outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={enquiryData.phone}
                      onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] text-xs outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">Message / Site Visit Time</label>
                    <textarea
                      rows={2}
                      placeholder="I am interested in scheduling a site visit this week."
                      value={enquiryData.note}
                      onChange={(e) => setEnquiryData({ ...enquiryData, note: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#e2e8f0] text-xs outline-none focus:border-[#2563eb] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-extrabold shadow-sm transition-colors"
                  >
                    Submit & Request Call Back
                  </button>

                  <p className="text-[10px] text-center text-[#64748b]">
                    By submitting, you agree to PropertyDeal terms & direct owner connect.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LivePropertiesShowcase;
