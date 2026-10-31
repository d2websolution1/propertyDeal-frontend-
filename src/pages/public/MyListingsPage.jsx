// frontend/src/pages/public/MyListingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

export default function MyListingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'pending' | 'rejected'
  const [listings, setListings] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyListings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_BASE_URL}/properties/user/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setListings(res.data.properties || []);
        setCounts(res.data.counts || { all: 0, active: 0, pending: 0, rejected: 0 });
      }
    } catch (err) {
      console.error('Failed to load my listings:', err);
      setError(err.response?.data?.message || 'Could not load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  const handleDeleteListing = async (property) => {
    if (!window.confirm(`Are you sure you want to delete "${property.title}"? This cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      setDeletingId(property.id || property._id);
      await axios.delete(`${API_BASE_URL}/properties/user/${property.id || property._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state locally
      setListings((prev) => prev.filter((p) => (p.id || p._id) !== (property.id || property._id)));
      setCounts((prev) => ({
        ...prev,
        all: Math.max(0, prev.all - 1),
        active: property.status === 'approved' ? Math.max(0, prev.active - 1) : prev.active,
        pending: property.status === 'pending' ? Math.max(0, prev.pending - 1) : prev.pending,
        rejected: property.status === 'rejected' ? Math.max(0, prev.rejected - 1) : prev.rejected,
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredListings = listings.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return item.status === 'approved';
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'rejected') return item.status === 'rejected';
    return true;
  });

  const getRoleBadgeStyle = (roleType) => {
    switch (roleType) {
      case 'Dealer / Agent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Builder':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* User Profile Bar */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center sm:text-left flex-wrap sm:flex-nowrap justify-center sm:justify-start">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#ecfdf5] border-2 border-[#005744]/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-[#005744]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className="text-xl font-bold text-[#0f172a]">
                  {user?.name || 'Valued Partner'}
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold border ${getRoleBadgeStyle(
                    user?.userType || 'Owner'
                  )}`}
                >
                  {user?.userType || 'Owner'}
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                {user?.email} {user?.phone ? `• +91 ${user.phone}` : ''}
              </p>
              {user?.companyName && (
                <p className="text-xs font-semibold text-[#005744] mt-0.5 flex items-center gap-1 justify-center sm:justify-start">
                  <span>🏢 {user.companyName}</span>
                  {user.city && <span>({user.city})</span>}
                  {user.reraNumber && <span className="text-slate-400 font-mono text-[10px]">RERA: {user.reraNumber}</span>}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#334155] hover:bg-[#f8fafc] transition-colors"
            >
              ✏️ Edit Profile
            </Link>
            <Link
              to="/post-property"
              className="px-5 py-2.5 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>+ Post Property</span>
              <span className="bg-[#ef4444] text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                FREE
              </span>
            </Link>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white border-[#005744] ring-2 ring-[#005744]/10 shadow-sm'
                : 'bg-white/80 border-[#e2e8f0] hover:bg-white'
            }`}
          >
            <p className="text-xs font-semibold text-[#64748b]">Total Properties</p>
            <p className="text-2xl font-black text-[#0f172a] mt-1">{counts.all}</p>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                : 'bg-white/80 border-[#e2e8f0] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-800">Active / Live</p>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-2xl font-black text-emerald-700 mt-1">{counts.active}</p>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/10 shadow-sm'
                : 'bg-white/80 border-[#e2e8f0] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-amber-800">Under Review</p>
              <span className="text-xs">⏳</span>
            </div>
            <p className="text-2xl font-black text-amber-700 mt-1">{counts.pending}</p>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-red-50/50 border-red-500 ring-2 ring-red-500/10 shadow-sm'
                : 'bg-white/80 border-[#e2e8f0] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-red-800">Rejected</p>
              <span className="text-xs">⚠️</span>
            </div>
            <p className="text-2xl font-black text-red-700 mt-1">{counts.rejected}</p>
          </button>
        </div>

        {/* Listings Content */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b border-[#f1f5f9] gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a]">
                {activeTab === 'all' && 'All Listings'}
                {activeTab === 'active' && 'Active Properties (Live on Website)'}
                {activeTab === 'pending' && 'Under Review (Awaiting Admin Permission)'}
                {activeTab === 'rejected' && 'Rejected Listings'}
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                {activeTab === 'pending'
                  ? 'These properties are undergoing verification by the admin team before appearing live.'
                  : 'Manage, review status, and view inquiries for all properties listed under your account.'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl text-xs font-semibold flex-wrap">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'all' ? 'bg-white text-[#005744] shadow-xs' : 'text-[#64748b]'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#64748b]'
                }`}
              >
                Active ({counts.active})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-[#64748b]'
                }`}
              >
                Under Review ({counts.pending})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'rejected' ? 'bg-white text-red-700 shadow-xs' : 'text-[#64748b]'
                }`}
              >
                Rejected ({counts.rejected})
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center text-[#64748b]">
              <div className="w-12 h-12 border-4 border-[#005744]/20 border-t-[#005744] rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-semibold">Loading your property listings...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-500 text-sm font-semibold mb-3">{error}</p>
              <button
                onClick={fetchMyListings}
                className="px-4 py-2 rounded-xl bg-[#005744] text-white text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#ecfdf5] text-[#005744] flex items-center justify-center text-3xl mb-4 shadow-sm">
                {activeTab === 'pending' ? '⏳' : activeTab === 'rejected' ? '📑' : '🏡'}
              </div>
              <h4 className="text-base font-bold text-[#0f172a]">
                {activeTab === 'pending'
                  ? 'No properties under review'
                  : activeTab === 'rejected'
                  ? 'No rejected properties'
                  : activeTab === 'active'
                  ? 'No active property listings yet'
                  : 'No properties posted yet'}
              </h4>
              <p className="text-xs text-[#64748b] max-w-sm mx-auto mt-1 mb-6">
                Reach thousands of prospective buyers & tenants across India. Post your property in under 2 minutes for FREE!
              </p>
              <Link
                to="/post-property"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <span>+ Post Your Property Now</span>
                <span className="bg-[#ef4444] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                  FREE
                </span>
              </Link>
            </div>
          ) : (
            /* Property Listings Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {filteredListings.map((property) => {
                const propId = property.id || property._id;
                const isApproved = property.status === 'approved';
                const isPending = property.status === 'pending';
                const isRejected = property.status === 'rejected';

                return (
                  <div
                    key={propId}
                    className="bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#005744]/40 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-48 bg-[#f1f5f9] overflow-hidden">
                        <img
                          src={
                            property.images?.[0] ||
                            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {isApproved && (
                            <span className="bg-emerald-600/95 text-white text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                              Live on Website
                            </span>
                          )}
                          {isPending && (
                            <span className="bg-amber-500/95 text-white text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm">
                              <span>⏳</span> Under Review
                            </span>
                          )}
                          {isRejected && (
                            <span className="bg-red-600/95 text-white text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm">
                              <span>✕</span> Rejected
                            </span>
                          )}
                        </div>

                        {/* Listing Type & Code */}
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <span className="bg-black/60 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {property.uniqueCode || 'HW-PROP'}
                          </span>
                          <span className="bg-[#005744]/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {property.listingType || 'Sale'}
                          </span>
                        </div>

                        {/* Photo count indicator */}
                        {property.images?.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/65 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                            📷 {property.images.length} photos
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-base font-bold text-[#0f172a] line-clamp-1">
                              {property.title}
                            </h4>
                            <p className="text-xs text-[#64748b] mt-0.5 flex items-center gap-1">
                              <span>📍</span>
                              <span className="line-clamp-1">
                                {property.locality ? `${property.locality}, ` : ''}
                                {property.city}
                                {property.state ? `, ${property.state}` : ''}
                              </span>
                            </p>
                          </div>
                          <p className="text-base font-black text-[#005744] flex-shrink-0">
                            {formatIndianPrice(property.price, property.listingType)}
                          </p>
                        </div>

                        {/* Key Attributes */}
                        <div className="flex items-center gap-3 text-xs text-[#475569] bg-[#f8fafc] p-2.5 rounded-xl border border-[#f1f5f9] flex-wrap">
                          {property.bhk && (
                            <span className="font-semibold">{property.bhk}</span>
                          )}
                          <span className="font-semibold">{property.propertyType}</span>
                          {property.areaSqft && (
                            <span className="font-semibold">{property.areaSqft} sq.ft</span>
                          )}
                          {property.furnishing && (
                            <span className="text-[#64748b]">{property.furnishing}</span>
                          )}
                        </div>

                        {/* Admin Notice for Under Review */}
                        {isPending && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
                            <p className="font-bold flex items-center gap-1">
                              <span>⏳ Awaiting Admin Approval</span>
                            </p>
                            <p className="text-[11px] text-amber-700">
                              Your listing has been submitted and is in the admin verification queue. Once the admin reviews and approves it, it will immediately appear live on the website.
                            </p>
                          </div>
                        )}

                        {/* Admin Rejection Notice */}
                        {isRejected && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 space-y-1">
                            <p className="font-bold flex items-center gap-1">
                              <span>⚠️ Rejection Reason:</span>
                            </p>
                            <p className="text-[11px] text-red-700">
                              {property.rejectionReason || 'Listing did not meet guidelines. Please contact support or post an updated listing.'}
                            </p>
                          </div>
                        )}

                        {/* Quality score and date */}
                        <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-1 border-t border-[#f8fafc]">
                          <span>
                            Posted:{' '}
                            {property.createdAt
                              ? new Date(property.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Recently'}
                          </span>
                          {property.qualityScore > 0 && (
                            <span className="font-bold text-emerald-600">
                              Quality: {property.qualityScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="px-5 pb-5 pt-2 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
                      {isApproved ? (
                        <a
                          href={`/#properties-showcase`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>🌐 View on Website</span>
                        </a>
                      ) : (
                        <span className="text-xs text-[#94a3b8] italic">
                          {isPending ? 'Preview available after approval' : 'Listing inactive'}
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteListing(property)}
                        disabled={deletingId === propId}
                        className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        {deletingId === propId ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
