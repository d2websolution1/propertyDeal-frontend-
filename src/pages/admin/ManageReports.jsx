// pages/admin/ManageReports.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
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
    pendingListings: 0,
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
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>📈</span> Platform Analytics & Revenue Reports
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Key metrics and aggregated health indicators across PropertyDeal
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <i className="fas fa-sync-alt text-blue-600"></i>
          <span>Refresh Analytics</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-semibold">
          <i className="fas fa-spinner fa-spin text-2xl mr-2 text-indigo-600"></i>
          <p className="mt-2 text-sm">Aggregating platform metrics...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Total Users
              </span>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.totalUsers}</p>
              <span className="inline-block mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                +{stats.newUsers} this month
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Total Properties
              </span>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.totalProperties}</p>
              <span className="inline-block mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                +{stats.newProperties} this month
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Active & Live
              </span>
              <p className="text-3xl font-black text-blue-600 mt-1">{stats.totalListings}</p>
              <span className="inline-block mt-2 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {stats.pendingListings} pending approval
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Total Real Revenue
              </span>
              <p className="text-3xl font-black text-[#005744] mt-1">
                ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}
              </p>
              <span className="inline-block mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live MongoDB
              </span>
            </div>
          </div>

          {/* Quick Deep-Dive Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-black text-gray-900 text-base">New Listing Audits</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspect detailed listings submitted by verified Owners, Dealers / Agents, and Builders across metropolitan regions.
              </p>
              <Link
                to="/admin/reports/listings"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>View Full Listing Report</span>
                <span>→</span>
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-black text-gray-900 text-base">User Registration Audits</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspect accounts created via Instant Gmail and Google OAuth with contact details and company associations.
              </p>
              <Link
                to="/admin/reports/users"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>View Full User Report</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageReports;