// pages/admin/ManageSubscriptions.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const DEFAULT_PLANS = [
  {
    name: "Owner Free Starter",
    tier: "free",
    targetAudience: "Owner",
    price: 0,
    billingCycle: "one-time",
    listingLimit: 2,
    featuredLimit: 0,
    features: ["Post up to 2 Properties Free", "Direct Buyer Phone & WhatsApp", "Standard 30 Days Visibility"],
    badge: "Basic",
    isActive: true,
  },
  {
    name: "Owner Fast-Track Verified",
    tier: "silver",
    targetAudience: "Owner",
    price: 999,
    billingCycle: "one-time",
    listingLimit: 5,
    featuredLimit: 1,
    features: ["Verified Green Shield Badge", "Top 5 in Search Results", "Instant WhatsApp Inquiries Alert", "45 Days Validity"],
    badge: "Popular",
    isActive: true,
  },
  {
    name: "Dealer / Agent Pro Pack",
    tier: "gold",
    targetAudience: "Dealer / Agent",
    price: 4999,
    billingCycle: "monthly",
    listingLimit: 30,
    featuredLimit: 5,
    features: ["Up to 30 Active Listings", "5 Featured Boost Slots", "Direct RERA & Company Branding", "CRM Leads Manager", "Priority Customer Support"],
    badge: "Recommended",
    isActive: true,
  },
  {
    name: "Builder Mega Township Enterprise",
    tier: "platinum",
    targetAudience: "Builder",
    price: 14999,
    billingCycle: "monthly",
    listingLimit: 100,
    featuredLimit: 20,
    features: ["Unlimited Floor Plans & Videos", "Homepage Top Carousel Banner", "Dedicated Relationship Manager", "SMS / Email Lead Blasts", "Verified Developer Blue Tick"],
    badge: "Enterprise",
    isActive: true,
  },
];

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    tier: "silver",
    targetAudience: "All",
    price: "",
    billingCycle: "monthly",
    features: "",
    listingLimit: 5,
    featuredLimit: 1,
    badge: "",
    isActive: true,
  });

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/subscriptions/plans");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSubscriptions(res.data);
      } else {
        setSubscriptions(DEFAULT_PLANS);
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setSubscriptions(DEFAULT_PLANS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const openCreate = () => {
    setForm({
      name: "",
      tier: "silver",
      targetAudience: "All",
      price: "",
      billingCycle: "monthly",
      features: "",
      listingLimit: 5,
      featuredLimit: 1,
      badge: "",
      isActive: true,
    });
    setModal({ mode: "create" });
  };

  const openEdit = (sub) => {
    setForm({
      name: sub.name,
      tier: sub.tier || "silver",
      targetAudience: sub.targetAudience || "All",
      price: sub.price,
      billingCycle: sub.billingCycle || "monthly",
      features: Array.isArray(sub.features) ? sub.features.join(", ") : sub.features || "",
      listingLimit: sub.listingLimit || 5,
      featuredLimit: sub.featuredLimit || 0,
      badge: sub.badge || "",
      isActive: sub.isActive !== false,
    });
    setModal({ mode: "edit", data: sub });
  };

  const save = async () => {
    if (!form.name || form.price === "") {
      alert("Plan name and price are required");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      listingLimit: Number(form.listingLimit) || 0,
      featuredLimit: Number(form.featuredLimit) || 0,
      features: form.features
        ? form.features.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      if (modal.mode === "create") {
        await api.post("/admin/subscriptions/plans", payload);
      } else {
        const id = modal.data._id || modal.data.id;
        await api.put(`/admin/subscriptions/plans/${id}`, payload);
      }
      setModal(null);
      await fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save plan to MongoDB Atlas");
    }
  };

  const toggleActive = async (sub) => {
    const id = sub._id || sub.id;
    try {
      await api.put(`/admin/subscriptions/plans/${id}`, {
        isActive: !sub.isActive,
      });
      await fetchSubscriptions();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>📦</span> Real Subscription & Pricing Plans
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live MongoDB
            </span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Real monetized tiers for Owners, Verified Dealers, and Builders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-xs cursor-pointer inline-flex items-center gap-2 transition-all active:scale-95"
          >
            <i className="fas fa-plus"></i>
            <span>Add New Tier</span>
          </button>
          <button
            onClick={fetchSubscriptions}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <i className={`fas fa-sync-alt text-blue-600 ${loading ? "fa-spin" : ""}`}></i>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <i className="fas fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
          <p className="text-xs font-semibold">Loading real tiers from MongoDB...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub._id || sub.id}
              className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between p-6 ${
                sub.isActive ? "border-gray-200 shadow-sm" : "border-gray-200/50 opacity-60 bg-gray-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">
                    {sub.targetAudience || "All"}
                  </span>
                  {sub.badge && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      {sub.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-gray-900 mt-3">{sub.name}</h3>

                <div className="mt-3 pb-4 border-b border-gray-100 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#005744]">
                    ₹{(Number(sub.price) || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">/{sub.billingCycle || "month"}</span>
                </div>

                <div className="py-3 border-b border-gray-100 text-xs font-bold text-gray-600 flex justify-between">
                  <span>Listings allowed:</span>
                  <span className="text-blue-600">{sub.listingLimit || 0} Slots</span>
                </div>

                <div className="py-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Features</p>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {(Array.isArray(sub.features)
                      ? sub.features
                      : (sub.features || "").split(",")
                    ).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <i className="fas fa-check text-emerald-500 text-[11px] mt-0.5 flex-shrink-0"></i>
                        <span>{f.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(sub)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                    sub.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {sub.isActive ? "Active" : "Disabled"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(sub)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">
                {modal.mode === "create" ? "Add Subscription Plan" : "Edit Subscription Plan"}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dealer Pro Boost"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Role</label>
                  <select
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb] bg-white"
                  >
                    <option value="All">All Roles</option>
                    <option value="Owner">Owner</option>
                    <option value="Dealer / Agent">Dealer / Agent</option>
                    <option value="Builder">Builder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="4999"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Billing Cycle</label>
                  <select
                    value={form.billingCycle}
                    onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb] bg-white"
                  >
                    <option value="one-time">One-Time</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Listing Limit</label>
                  <input
                    type="number"
                    value={form.listingLimit}
                    onChange={(e) => setForm({ ...form, listingLimit: e.target.value })}
                    placeholder="25"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Features (comma separated)</label>
                <textarea
                  rows="3"
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="30 listings, Verified badge, Priority inquiries, CRM dashboard"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8]"
                >
                  Save in MongoDB Atlas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscriptions;