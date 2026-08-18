// pages/admin/ManageSecuritySettings.jsx
import React, { useState } from "react";

const ManageSecuritySettings = () => {
  const [settings, setSettings] = useState({
    sslEnabled: true,
    twoFactorAuth: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordPolicy: "strong"
  });

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Security & SSL Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure security settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-800">SSL Certificate</p>
            <p className="text-sm text-gray-500">Enable HTTPS for secure connection</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            settings.sslEnabled ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
            {settings.sslEnabled ? "Enabled ✅" : "Disabled ❌"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
            <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
          </div>
          <button
            onClick={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})}
            className={`px-4 py-2 text-sm font-semibold rounded-lg ${
              settings.twoFactorAuth ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"
            }`}
          >
            {settings.twoFactorAuth ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="py-2 border-b border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
            className="w-32 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
          />
        </div>

        <div className="py-2 border-b border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Max Login Attempts</label>
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
            className="w-32 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
          />
        </div>

        <div className="py-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password Policy</label>
          <select
            value={settings.passwordPolicy}
            onChange={(e) => setSettings({...settings, passwordPolicy: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#6C3EE6]"
          >
            <option value="weak">Weak - Only letters</option>
            <option value="medium">Medium - Letters & numbers</option>
            <option value="strong">Strong - Letters, numbers & special chars</option>
          </select>
        </div>

        <button className="mt-4 bg-[#6C3EE6] hover:bg-[#5b34c9] text-white font-semibold px-6 py-2.5 rounded-lg">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default ManageSecuritySettings;