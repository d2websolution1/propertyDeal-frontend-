// pages/admin/ManageSessions.jsx
import React, { useState } from "react";

const ManageSessions = () => {
  const [sessions] = useState([
    { id: 1, device: "Chrome - Windows", ip: "192.168.1.1", location: "Mumbai, India", lastActive: "2 mins ago", current: true },
    { id: 2, device: "Safari - iPhone", ip: "192.168.1.2", location: "Delhi, India", lastActive: "1 hour ago", current: false },
    { id: 3, device: "Firefox - Mac", ip: "192.168.1.3", location: "Bangalore, India", lastActive: "2 days ago", current: false }
  ]);

  const [showConfirm, setShowConfirm] = useState(false);

  const logoutAll = () => {
    if (window.confirm("Are you sure you want to log out all devices? This will log out all active sessions.")) {
      alert("All devices logged out successfully!");
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sessions</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage active sessions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">Active Sessions ({sessions.length})</span>
          <button
            onClick={logoutAll}
            className="bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <i className="fas fa-sign-out-alt mr-1.5"></i>
            Log Out All Devices
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{session.device}</span>
                  {session.current && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {session.ip} • {session.location}
                </div>
                <div className="text-xs text-gray-400">Last active: {session.lastActive}</div>
              </div>
              {!session.current && (
                <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                  Log Out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSessions;