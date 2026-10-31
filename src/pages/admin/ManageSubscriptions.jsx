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
    id: "sub-1",
    name: "Free Owner Basic",
    price: "0",
    duration: "Unlimited",
    features: "1 Free Property Listing, Standard Search Appearance, Direct WhatsApp Leads",
    isActive: true,
  },
  {
    id: "sub-2",
    name: "Dealer / Agent Pro Boost",
    price: "4,999",
    duration: "Monthly",
    features: "Up to 25 Live Listings, Verified Badge Tag, Top 3 Search Placement, 10x Lead Inquiries",
    isActive: true,
  },
  {
    id: "sub-3",
    name: "Builder Platinum Developer",
    price: "19,999",
    duration: "Quarterly",
    features: "Unlimited Project Listings, Homepage Hero Banner Boost, Dedicated Relationship Manager, Verified RERA Stamp",
    isActive: true,
  },
];

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem("propertydeal_subscription_plans");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PLANS;
  });

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "Monthly",
    features: "",
    isActive: true,
  });

  const saveToStorage = (plans) => {
    setSubscriptions(plans);
    localStorage.setItem("propertydeal_subscription_plans", JSON.stringify(plans));
  };

  const openCreate = () => {
    setForm({ name: "", price: "", duration: "Monthly", features: "", isActive: true });
    setModal({ mode: "create" });
  };

  const openEdit = (sub) => {
    setForm({
      name: sub.name,
      price: sub.price,
      duration: sub.duration,
      features: sub.features,
      isActive: sub.isActive,
    });
    setModal({ mode: "edit", data: sub });
  };

  const save = async () => {
    if (!form.name || !form.price) {
      alert("Name and price are required");
      return;
    }

    if (modal.mode === "create") {
      const newPlan = { id: `sub-${Date.now()}`, ...form };
      saveToStorage([newPlan, ...subscriptions]);
    } else {
      const updated = subscriptions.map((s) => (s.id === modal.data.id ? { ...s, ...form } : s));
      saveToStorage(updated);
    }
    setModal(null);
  };

  const toggleActive = (sub) => {
    const updated = subscriptions.map((s) => (s.id === sub.id ? { ...s, isActive: !s.isActive } : s));
    saveToStorage(updated);
  };

  const remove = (sub) => {
    if (!window.confirm(`Delete "${sub.name}" plan?`)) return;
    const updated = subscriptions.filter((s) => s.id !== sub.id);
    saveToStorage(updated);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>📦</span> Subscription & Listing Pricing Plans
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Configure monetized tiers for Owners, Verified Dealers, and Builders
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+ Create New Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className={`rounded-3xl border p-6 flex flex-col justify-between transition-all bg-white shadow-xs hover:shadow-md ${
              sub.isActive ? "border-gray-200" : "border-gray-200 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    sub.isActive
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {sub.isActive ? "Active Plan" : "Paused"}
                </span>
                <span className="text-xs font-bold text-gray-400">{sub.duration}</span>
              </div>

              <h3 className="text-lg font-black text-gray-900 mt-3">{sub.name}</h3>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#005744]">
                  {sub.price === "0" ? "FREE" : `₹ ${sub.price}`}
                </span>
                {sub.price !== "0" && <span className="text-xs text-gray-400">/{sub.duration}</span>}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Features Included:
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{sub.features}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => toggleActive(sub)}
                className="text-xs font-bold text-gray-600 hover:text-gray-900"
              >
                {sub.isActive ? "Pause" : "Activate"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(sub)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(sub)}
                  className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">
              {modal.mode === "create" ? "Create Pricing Plan" : "Edit Plan"}
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Agent Super Boost"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#005744]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 2999"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#005744]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                <select
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none bg-white cursor-pointer"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Unlimited">Unlimited</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Features Summary</label>
              <textarea
                rows={3}
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="List key perks separated by comma..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-[#005744]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-5 py-2 rounded-xl bg-[#005744] text-white text-xs font-bold shadow-md"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscriptions;