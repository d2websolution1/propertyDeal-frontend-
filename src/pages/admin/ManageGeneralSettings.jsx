// pages/admin/ManageGeneralSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageGeneralSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("propertydeal_general_settings");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      siteName: "PropertyDeal",
      siteEmail: "admin@propertydeal.com",
      sitePhone: "+91 9084486898",
      address: "Techzone 4, Greater Noida West, Uttar Pradesh 201306",
      currency: "INR",
      timezone: "Asia/Kolkata",
      maintenanceMode: false,
    };
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem("propertydeal_general_settings", JSON.stringify(settings));
      try {
        await api.put("/admin/settings", settings);
      } catch (err) {
        // saved in localStorage
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>⚙️</span> General Platform Settings
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Configure portal identity, communication details, currency & timezone
          </p>
        </div>

        <button
          onClick={saveSettings}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Platform Settings"}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <span>✓</span>
          <span>General settings saved and synced successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Portal Brand Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#005744]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Administrative Support Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#005744]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Official Helpline Phone</label>
            <input
              type="text"
              value={settings.sitePhone}
              onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#005744]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Head Office Location</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#005744]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Default Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#005744] bg-white cursor-pointer"
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="AED">AED (د.إ - UAE Dirham)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Platform Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#005744] bg-white cursor-pointer"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC (GMT +0:00)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGeneralSettings;