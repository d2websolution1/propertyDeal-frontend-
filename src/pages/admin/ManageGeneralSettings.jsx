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
  const [settings, setSettings] = useState({
    siteName: "Housing.com",
    siteEmail: "admin@housing.com",
    sitePhone: "+91 9876543210",
    address: "Mumbai, India",
    currency: "INR",
    timezone: "Asia/Kolkata",
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await api.put("/admin/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">General Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure site-wide settings</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
          Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Site Name</label>
            <input
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Site Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              value={settings.sitePhone}
              onChange={(e) => setSettings({...settings, sitePhone: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              className="w-4 h-4 accent-[#6C3EE6]"
            />
            <label className="text-sm text-gray-700">Enable Maintenance Mode</label>
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={loading}
          className="mt-6 bg-[#6C3EE6] hover:bg-[#5b34c9] text-white font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default ManageGeneralSettings;