// pages/admin/ManageReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageReports = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalListings: 0,
    totalRevenue: 0,
    newUsers: 0,
    newProperties: 0,
    pendingListings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/reports/analytics");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of platform statistics</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-gray-400 text-xs uppercase">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
              <p className="text-green-600 text-xs mt-1">+{stats.newUsers} this month</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-gray-400 text-xs uppercase">Properties</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProperties}</p>
              <p className="text-green-600 text-xs mt-1">+{stats.newProperties} this month</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-gray-400 text-xs uppercase">Active Listings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalListings}</p>
              <p className="text-yellow-600 text-xs mt-1">{stats.pendingListings} pending</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-gray-400 text-xs uppercase">Total Revenue</p>
              <p className="text-2xl font-bold text-[#6C3EE6]">₹{stats.totalRevenue}</p>
              <p className="text-gray-400 text-xs mt-1">Lifetime earnings</p>
            </div>
          </div>

          {/* Charts placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                Chart placeholder - Coming soon
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Property Categories</h3>
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                Chart placeholder - Coming soon
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageReports;