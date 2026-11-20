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

  // Navigation Tabs: 'listings' | 'favorites' | 'subscription' | 'agent-upgrade'
  const [navTab, setNavTab] = useState('listings');

  // Listings state
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'pending' | 'rejected'
  const [listings, setListings] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Enquiries / Leads state (User Requirement: leads for Dealer & Owner)
  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  // Subscription state
  const [plans, setPlans] = useState([]);
  const [subscribingPlanId, setSubscribingPlanId] = useState(null);
  const [subSuccessMsg, setSubSuccessMsg] = useState('');

  // Agent Upgrade Request state
  const [agentForm, setAgentForm] = useState({
    companyName: user?.companyName || '',
    reraNumber: user?.reraNumber || '',
    city: user?.city || '',
    experience: '',
    operatingLocalities: '',
  });
  const [submittingAgentReq, setSubmittingAgentReq] = useState(false);
  const [agentReqSuccess, setAgentReqSuccess] = useState('');
  const [agentReqStatus, setAgentReqStatus] = useState(user?.agentRequestStatus || 'none');

  // 1. Fetch My Listings
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

  // 2. Fetch Favorites
  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoadingFavorites(true);
      const res = await axios.get(`${API_BASE_URL}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setFavorites(res.data.favorites || []);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoadingFavorites(false);
    }
  }, []);

  // 3. Fetch Subscription Plans
  const fetchPlans = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
      if (res.data?.success) {
        setPlans(res.data.plans || []);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    }
  }, []);

  // 4. Fetch My Enquiries / Leads (User Requirement)
  const fetchMyEnquiries = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoadingEnquiries(true);
      setEnquiryError('');
      const res = await axios.get(`${API_BASE_URL}/enquiries/my-enquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setEnquiries(res.data.enquiries || []);
      }
    } catch (err) {
      console.error('Failed to load my enquiries:', err);
      setEnquiryError(err.response?.data?.message || 'Could not load buyer enquiries.');
    } finally {
      setLoadingEnquiries(false);
    }
  }, []);

  useEffect(() => {
    fetchMyListings();
    fetchPlans();
    fetchMyEnquiries();
  }, [fetchMyListings, fetchPlans, fetchMyEnquiries]);

  useEffect(() => {
    if (navTab === 'favorites') {
      fetchFavorites();
    } else if (navTab === 'enquiries') {
      fetchMyEnquiries();
    }
  }, [navTab, fetchFavorites, fetchMyEnquiries]);

  // Remove property from favorites
  const handleRemoveFavorite = async (propId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post(`${API_BASE_URL}/users/favorites/${propId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((p) => (p.id || p._id) !== propId));
    } catch (err) {
      alert('Failed to update favorites.');
    }
  };

  // Subscribe / Buy Plan
  const handleSubscribe = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    try {
      setSubscribingPlanId(plan.id || plan._id);
      setSubSuccessMsg('');
      const res = await axios.post(
        `${API_BASE_URL}/subscriptions/subscribe`,
        {
          planId: plan.id || plan._id,
          paymentMethod: 'Online UPI / Card (Mock Gateway)',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setSubSuccessMsg(res.data.message || `Subscribed to ${plan.name} successfully!`);
        // Refresh listings and update user in window/local
        fetchMyListings();
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment / Subscription failed.');
    } finally {
      setSubscribingPlanId(null);
    }
  };

  // Submit Agent Upgrade Request
  const handleAgentRequestSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setSubmittingAgentReq(true);
      setAgentReqSuccess('');
      const res = await axios.post(`${API_BASE_URL}/users/request-agent`, agentForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setAgentReqSuccess(res.data.message || 'Request submitted successfully!');
        setAgentReqStatus('pending');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit agent upgrade request');
    } finally {
      setSubmittingAgentReq(false);
    }
  };

  // Delete listing
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

  const userType = user?.userType || 'Owner';
  const isAgent = userType === 'Dealer / Agent';

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* User Profile Bar */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center sm:text-left flex-wrap sm:flex-nowrap justify-center sm:justify-start">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#eff6ff] border-2 border-[#2563eb]/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-[#2563eb]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className="text-xl font-bold text-[#0f172a]">
                  {user?.name || 'Property Adda User'}
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold border ${getRoleBadgeStyle(
                    userType
                  )}`}
                >
                  {userType}
                </span>

                {user?.isVerifiedAgent && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-[#2563eb] text-white flex items-center gap-1 shadow-xs">
                    ✓ Verified Agent
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                {user?.email} {user?.phone ? `• +91 ${user.phone}` : ''}
              </p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap justify-center sm:justify-start text-xs font-semibold">
                <span className="text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded-md">
                  Plan: {user?.activePlan || 'Free Starter'}
                </span>
                <span className="text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-md">
                  Limit: {counts.all} / {user?.listingLimit !== undefined ? user.listingLimit : 2} listings
                </span>
              </div>
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
              className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>+ Post Property</span>
              <span className="bg-[#ef4444] text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                FREE
              </span>
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setNavTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              navTab === 'listings'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            <span>📑 My Listings</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{counts.all}</span>
          </button>

          <button
            onClick={() => setNavTab('enquiries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              navTab === 'enquiries'
                ? 'bg-[#D62839] text-white shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            <span>💬 Leads & Inquiries</span>
            {enquiries.length > 0 && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                {enquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setNavTab('subscription')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              navTab === 'subscription'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white'
            }`}
          >
            <span>💎 Subscription Plans</span>
          </button>

          {!isAgent && (
            <button
              onClick={() => setNavTab('agent-upgrade')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                navTab === 'agent-upgrade'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white'
              }`}
            >
              <span>🤝 Register as Agent / Project Owner</span>
              {agentReqStatus === 'pending' && (
                <span className="text-[9.5px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-black">
                  PENDING
                </span>
              )}
            </button>
          )}
        </div>

        {/* ── TAB 1: MY LISTINGS ── */}
        {navTab === 'listings' && (
          <div className="space-y-6">
            {/* Status Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white border-[#2563eb] ring-2 ring-[#2563eb]/10 shadow-sm'
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
                    {activeTab === 'pending' && 'Under Review (Verification in Progress)'}
                    {activeTab === 'rejected' && 'Rejected Listings'}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {activeTab === 'pending'
                      ? 'These properties are undergoing verification before appearing live.'
                      : 'Manage, review status, and view inquiries for all properties listed under your account.'}
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl text-xs font-semibold flex-wrap">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'all' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'
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

              {/* Listings Grid */}
              {loading ? (
                <div className="py-16 text-center text-slate-400">Loading your properties...</div>
              ) : filteredListings.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="text-4xl">🏡</span>
                  <p className="text-base font-bold text-slate-800 mt-3">No properties found in this view</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeTab === 'all' ? 'You have not listed any property yet.' : `No ${activeTab} listings.`}
                  </p>
                  <Link
                    to="/post-property"
                    className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-md"
                  >
                    + Post Property for Free
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {filteredListings.map((prop) => {
                    const imgUrl = Array.isArray(prop.images) && prop.images[0]
                      ? prop.images[0]
                      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';

                    return (
                      <div
                        key={prop.id || prop._id}
                        className="rounded-2xl border border-[#e2e8f0] overflow-hidden bg-white shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                            <img src={imgUrl} alt={prop.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              {prop.status === 'approved' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white">
                                  LIVE
                                </span>
                              )}
                              {prop.status === 'pending' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-white">
                                  UNDER REVIEW
                                </span>
                              )}
                              {prop.status === 'rejected' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white">
                                  REJECTED
                                </span>
                              )}
                            </div>
                            <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                              {prop.uniqueCode || 'HW-PROP'}
                            </span>
                          </div>

                          <div className="p-4 space-y-2">
                            <h4 className="font-bold text-sm text-[#0f172a] line-clamp-1">
                              {prop.title || `${prop.propertyType} in ${prop.city}`}
                            </h4>
                            <p className="text-xs text-[#64748b]">
                              📍 {prop.locality ? `${prop.locality}, ` : ''}{prop.city}
                            </p>
                            <p className="text-base font-extrabold text-[#2563eb]">
                              {formatIndianPrice(prop.price, prop.listingType || prop.purpose)}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                          <span className="text-[11px] text-slate-500 font-medium">
                            👁️ {prop.viewsCount || 0} Views
                          </span>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/post-property?edit=${prop.id || prop._id}`}
                              className="px-3 py-1.5 rounded-lg border border-blue-200 text-[#2563eb] hover:bg-blue-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                              title="Edit Property"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteListing(prop)}
                              disabled={deletingId === (prop.id || prop._id)}
                              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            >
                              <span>🗑️</span>
                              <span>{deletingId === (prop.id || prop._id) ? 'Deleting...' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: SUBSCRIPTION PLANS ── */}
        {navTab === 'subscription' && (
          <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Subscription Plans & Listing Limits
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Broker & Owner subscription flow: Select plan → Online payment → Instant activation → Listing limit update.
                </p>
              </div>

              <div className="p-3 bg-[#eff6ff] rounded-2xl border border-[#bfdbfe] text-xs">
                <span className="text-[#64748b]">Current Active Plan: </span>
                <strong className="text-[#2563eb] font-extrabold">{user?.activePlan || 'Free Starter'}</strong>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-[#64748b]">Quota: </span>
                <strong className="text-emerald-700 font-extrabold">{user?.listingLimit !== undefined ? user.listingLimit : 2} listings</strong>
              </div>
            </div>

            {subSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <span>🎉</span>
                <span>{subSuccessMsg}</span>
              </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Plan 1 */}
              <div className="p-6 rounded-3xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-200 px-2 py-0.5 rounded">
                    STARTER
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-3">फ्री में दो लिस्टिंग for 1 month</h4>
                  <p className="text-xs text-slate-600 mt-1.5">
                    Post 2 properties completely free with 30 days validity.
                  </p>
                  <p className="text-3xl font-black text-slate-900 mt-4">₹0</p>
                </div>
                <button
                  type="button"
                  disabled={subscribingPlanId !== null}
                  onClick={() => handleSubscribe({ _id: plans[0]?._id || 'free', name: 'Free Starter' })}
                  className="mt-6 w-full py-3 rounded-2xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-white cursor-pointer"
                >
                  Activate Free
                </button>
              </div>

              {/* Plan 2 */}
              <div className="p-6 rounded-3xl border-2 border-amber-300 bg-amber-50/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-amber-800 uppercase bg-amber-200 px-2 py-0.5 rounded">
                    FEATURED BOOST
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-3">₹99 में 1 featured लिस्टिंग</h4>
                  <p className="text-xs text-slate-600 mt-1.5">
                    1 premium featured listing tag with up to 5x higher enquiries for 30 days.
                  </p>
                  <p className="text-3xl font-black text-amber-700 mt-4">₹99</p>
                </div>
                <button
                  type="button"
                  disabled={subscribingPlanId !== null}
                  onClick={() => handleSubscribe(plans.find((p) => p.price === 99) || { price: 99, name: 'Featured Boost' })}
                  className="mt-6 w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  {subscribingPlanId ? 'Processing...' : 'Pay ₹99 Online →'}
                </button>
              </div>

              {/* Plan 3 */}
              <div className="p-6 rounded-3xl border-2 border-blue-500 bg-blue-50/40 flex flex-col justify-between relative shadow-sm">
                <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  MOST POPULAR
                </span>
                <div>
                  <span className="text-[10px] font-black text-blue-800 uppercase bg-blue-200 px-2 py-0.5 rounded">
                    QUARTERLY
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-3">₹499 में 10 लिस्टिंग for 3 months</h4>
                  <p className="text-xs text-slate-600 mt-1.5">
                    10 active listings for 90 days validity + 2 featured boosts included.
                  </p>
                  <p className="text-3xl font-black text-blue-700 mt-4">₹499</p>
                </div>
                <button
                  type="button"
                  disabled={subscribingPlanId !== null}
                  onClick={() => handleSubscribe(plans.find((p) => p.price === 499) || { price: 499, name: 'Standard Quarterly' })}
                  className="mt-6 w-full py-3 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  {subscribingPlanId ? 'Processing...' : 'Pay ₹499 Online →'}
                </button>
              </div>

              {/* Plan 4 */}
              <div className="p-6 rounded-3xl border-2 border-emerald-500 bg-emerald-50/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase bg-emerald-200 px-2 py-0.5 rounded">
                    BEST VALUE (9 MONTHS)
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-3">₹999 में 30 लिस्टिंग for 9 months</h4>
                  <p className="text-xs text-slate-600 mt-1.5">
                    30 active listings for 270 days (9 months) + 5 featured boosts included.
                  </p>
                  <p className="text-3xl font-black text-emerald-700 mt-4">₹999</p>
                </div>
                <button
                  type="button"
                  disabled={subscribingPlanId !== null}
                  onClick={() => handleSubscribe(plans.find((p) => p.price === 999) || { price: 999, name: 'Agency Pro (9 Months)' })}
                  className="mt-6 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  {subscribingPlanId ? 'Processing...' : 'Pay ₹999 Online →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: REGISTER AS AGENT / PROJECT OWNER (FOR OWNERS) ── */}
        {navTab === 'agent-upgrade' && !isAgent && (
          <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Register as Real Estate Agent / Project Owner
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upgrade your Owner account to an authorized Agent or Project Owner profile with a verified badge.
              </p>
            </div>

            {agentReqSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <span>🎉</span>
                <span>{agentReqSuccess}</span>
              </div>
            )}

            {agentReqStatus === 'pending' ? (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                <span className="text-3xl">⏳</span>
                <h4 className="text-base font-bold text-amber-900">Agent Upgrade Request Under Review</h4>
                <p className="text-xs text-amber-700 max-w-md mx-auto">
                  Your registration request as Real Estate Agent / Project Owner is submitted and currently being reviewed by Property Adda team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAgentRequestSubmit} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Agency / Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={agentForm.companyName}
                    onChange={(e) => setAgentForm({ ...agentForm, companyName: e.target.value })}
                    placeholder="e.g. Apex Realty Partners"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      RERA Registration Number
                    </label>
                    <input
                      type="text"
                      value={agentForm.reraNumber}
                      onChange={(e) => setAgentForm({ ...agentForm, reraNumber: e.target.value })}
                      placeholder="e.g. UPRERAAGT123456"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Operating City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={agentForm.city}
                      onChange={(e) => setAgentForm({ ...agentForm, city: e.target.value })}
                      placeholder="e.g. Noida, Delhi NCR, Mumbai, Jaipur"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={agentForm.experience}
                      onChange={(e) => setAgentForm({ ...agentForm, experience: e.target.value })}
                      placeholder="e.g. 5+ Years"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Operating Localities / Sectors
                    </label>
                    <input
                      type="text"
                      value={agentForm.operatingLocalities}
                      onChange={(e) => setAgentForm({ ...agentForm, operatingLocalities: e.target.value })}
                      placeholder="e.g. Sector 62, Indirapuram, Expressway"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingAgentReq}
                  className="py-3 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs shadow-md cursor-pointer disabled:opacity-60"
                >
                  {submittingAgentReq ? 'Submitting Request...' : 'Submit Agent Registration Request →'}
                </button>
              </form>
            )}
          </div>
        )}
        {/* ── TAB 5: LEADS & ENQUIRIES (USER REQUIREMENT) ── */}
        {navTab === 'enquiries' && (
          <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">
                    Buyer Leads & Property Enquiries
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#fff1f2] text-[#D62839]">
                    {enquiries.length} {enquiries.length === 1 ? 'Lead' : 'Leads'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Prospective buyers & tenants who submitted inquiry forms on your listed properties.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchMyEnquiries}
                disabled={loadingEnquiries}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>🔄</span>
                <span>{loadingEnquiries ? 'Refreshing...' : 'Refresh Leads'}</span>
              </button>
            </div>

            {enquiryError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-[#D62839]">
                {enquiryError}
              </div>
            )}

            {loadingEnquiries && (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )}

            {!loadingEnquiries && enquiries.length === 0 && (
              <div className="py-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                  💬
                </div>
                <h4 className="text-base font-bold text-slate-800">No Inquiries Received Yet</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  When prospective buyers or tenants visit your property details page and submit an inquiry form, their contact details and message will appear here in real time.
                </p>
                <Link
                  to="/post-property"
                  className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Post More Properties →
                </Link>
              </div>
            )}

            {!loadingEnquiries && enquiries.length > 0 && (
              <div className="space-y-4">
                {enquiries.map((enq) => {
                  const prop = enq.property || {};
                  const propId = prop._id || prop.id || enq.propertyId;
                  const cleanPhone = enq.userPhone ? enq.userPhone.replace(/\D/g, '') : '';

                  return (
                    <div
                      key={enq._id || enq.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#D62839]/40 hover:shadow-md transition-all space-y-3.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {enq.status || 'New Lead'}
                          </span>
                          <span className="text-xs font-bold text-[#142D4E]">
                            Property:
                          </span>
                          {propId ? (
                            <Link
                              to={`/property/${propId}`}
                              className="text-xs font-bold text-[#D62839] hover:underline truncate max-w-sm"
                            >
                              {enq.propertyTitle || prop.title || 'View Property'} →
                            </Link>
                          ) : (
                            <span className="text-xs font-bold text-slate-700">
                              {enq.propertyTitle || 'Property Listing'}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'Recent'}
                        </span>
                      </div>

                      {/* Prospective Buyer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                            Prospective Buyer
                          </span>
                          <strong className="text-[#142D4E] text-sm mt-0.5 block">
                            {enq.userName}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                            Phone Number
                          </span>
                          <strong className="text-slate-800 text-xs mt-0.5 block font-mono">
                            {enq.userPhone || 'Not provided'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                            Email
                          </span>
                          <span className="text-slate-600 text-xs mt-0.5 block truncate">
                            {enq.userEmail || 'Not provided'}
                          </span>
                        </div>
                      </div>

                      {/* Buyer Note / Message */}
                      {enq.message && (
                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700">
                          <strong className="text-amber-900 block mb-0.5">💬 Buyer's Message:</strong>
                          <p className="italic">"{enq.message}"</p>
                        </div>
                      )}

                      {/* Instant Buyer Contact Actions */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {enq.userPhone && (
                          <>
                            <a
                              href={`tel:${enq.userPhone}`}
                              className="py-2 px-3.5 rounded-xl bg-[#142D4E] hover:bg-[#0f233d] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              <span>Call Buyer ({enq.userPhone})</span>
                            </a>

                            <a
                              href={`https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(enq.userName)},%20I%20am%20contacting%20you%20regarding%20your%20inquiry%20on%20our%20property:%20${encodeURIComponent(enq.propertyTitle || 'Property Adda Listing')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <span>WhatsApp</span>
                            </a>
                          </>
                        )}

                        {propId && (
                          <Link
                            to={`/property/${propId}`}
                            className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:text-[#D62839] text-xs font-bold transition-colors ml-auto"
                          >
                            View Property →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
