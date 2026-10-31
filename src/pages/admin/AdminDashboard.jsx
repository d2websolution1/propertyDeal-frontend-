// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [statsData, setStatsData] = useState({
    counts: {
      totalUsers: 0,
      totalClients: 0,
      totalVendors: 0,
      totalProperties: 0,
      pendingApprovals: 0,
      approvedProperties: 0,
      featuredProperties: 0,
      verifiedProperties: 0,
      saleProperties: 0,
      rentProperties: 0,
      newListingsToday: 0,
    },
    listingsTrend: [],
    userSignups: [],
    recentActivity: [],
  });

  const fetchStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    setError("");

    try {
      const res = await api.get("/admin/dashboard/stats");
      if (res.data && res.data.counts) {
        setStatsData(res.data);
      }
    } catch (err) {
      console.error("Failed to load real dashboard stats:", err);
      setError("Unable to load real-time stats from database. Check server connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const { counts, listingsTrend, userSignups, recentActivity } = statsData;

  const statCards = [
    {
      id: "users",
      label: "Total Registered Users",
      value: counts.totalUsers,
      sublabel: `${counts.totalClients} Clients • ${counts.totalVendors} Vendors`,
      icon: "fa-users",
      emoji: "👥",
      color: "#6366f1",
      badge: "Real DB Users",
      link: "/admin/users",
    },
    {
      id: "properties",
      label: "Total Properties",
      value: counts.totalProperties,
      sublabel: `${counts.saleProperties} Sale • ${counts.rentProperties} Rent`,
      icon: "fa-building",
      emoji: "🏢",
      color: "#10b981",
      badge: "In Database",
      link: "/admin/properties",
    },
    {
      id: "approvals",
      label: "Pending Approvals",
      value: counts.pendingApprovals,
      sublabel: counts.pendingApprovals > 0 ? "Requires review" : "All reviewed",
      icon: "fa-hourglass-half",
      emoji: "⏳",
      color: counts.pendingApprovals > 0 ? "#f59e0b" : "#10b981",
      badge: counts.pendingApprovals > 0 ? "Action Needed" : "Clear",
      link: "/admin/properties",
    },
    {
      id: "approved",
      label: "Approved & Live Listings",
      value: counts.approvedProperties,
      sublabel: `${counts.verifiedProperties} Verified Listings`,
      icon: "fa-check-circle",
      emoji: "✅",
      color: "#3b82f6",
      badge: "Live on Site",
      link: "/admin/properties",
    },
    {
      id: "featured",
      label: "Featured Properties",
      value: counts.featuredProperties,
      sublabel: "Promoted on Homepage",
      icon: "fa-star",
      emoji: "⭐",
      color: "#f59e0b",
      badge: "Homepage Boost",
      link: "/admin/listings/featured",
    },
    {
      id: "today",
      label: "New Listings Today",
      value: counts.newListingsToday,
      sublabel: "Added in last 24 hrs",
      icon: "fa-bolt",
      emoji: "⚡",
      color: "#06b6d4",
      badge: "Real-time",
      link: "/admin/properties",
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Real-Time Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live MongoDB Atlas Sync
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Real-time platform activity, user accounts & property listings from your database
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl border border-gray-200 shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            <i className={`fas fa-sync-alt text-xs text-blue-600 ${refreshing ? "fa-spin" : ""}`}></i>
            <span>{refreshing ? "Refreshing..." : "Refresh Live Data"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchStats()}
            className="text-xs font-bold underline hover:text-rose-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Quick Action Launchpad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link
          to="/admin/properties"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg">
            🏢
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white/80">Manage</p>
            <p className="text-sm font-black truncate">Properties Queue</p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg">
            👥
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white/80">User Directory</p>
            <p className="text-sm font-black truncate">Owners & Agents</p>
          </div>
        </Link>

        <Link
          to="/admin/enquiries"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg">
            💬
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white/80">Customer Leads</p>
            <p className="text-sm font-black truncate">Enquiries</p>
          </div>
        </Link>

        <Link
          to="/admin/bulk-messaging"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg">
            📣
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white/80">Broadcast</p>
            <p className="text-sm font-black truncate">WhatsApp / Email</p>
          </div>
        </Link>
      </div>

      {/* Real Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.id}
            to={stat.link}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-inner"
                style={{ backgroundColor: `${stat.color}18`, color: stat.color }}
              >
                <span>{stat.emoji}</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-200">
                {stat.badge}
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-xs font-semibold truncate">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 tracking-tight">
                {loading ? (
                  <span className="inline-block w-10 h-7 bg-gray-100 animate-pulse rounded"></span>
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-[11px] font-medium text-gray-400 mt-1 truncate">{stat.sublabel}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings Trend Chart */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900 text-base">
                Property Listings Added (Last 6 Months)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Calculated from actual database timestamp</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
              Total: {counts.totalProperties}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  listingsTrend.length > 0
                    ? listingsTrend
                    : [{ month: "Current", listings: counts.totalProperties }]
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="listings"
                  name="Listings"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#2563eb" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Signups Chart */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900 text-base">User Signups (Last 6 Months)</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Real users & vendors registered in MongoDB Atlas
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              Total: {counts.totalUsers}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  userSignups.length > 0
                    ? userSignups
                    : [{ month: "Current", buyers: counts.totalClients, vendors: counts.totalVendors }]
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="buyers" name="Clients" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="vendors" name="Vendors" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Recent Activity Stream */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-black text-gray-900 text-base">Live Activity Feed</h3>
            <p className="text-xs text-gray-400">Directly from latest database transactions</p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-xl">
            {recentActivity.length} Events Logged
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-xs font-semibold">
            <i className="fas fa-spinner fa-spin mr-2 text-blue-600"></i>
            Loading live database activity...
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-xs">No activity logged yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-base font-bold shadow-inner">
                    {activity.type.includes("User") || activity.type.includes("Client") ? "👤" : "🏡"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {activity.type}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-lg mt-0.5">{activity.detail}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-gray-800 block">{activity.user}</span>
                  <span className="text-[11px] text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;