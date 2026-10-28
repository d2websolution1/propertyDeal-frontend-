// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
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
      color: "#6C3EE6",
      badge: "Real DB Users",
    },
    {
      id: "properties",
      label: "Total Properties",
      value: counts.totalProperties,
      sublabel: `${counts.saleProperties} Sale • ${counts.rentProperties} Rent`,
      icon: "fa-building",
      color: "#2fb47c",
      badge: "In Database",
    },
    {
      id: "approvals",
      label: "Pending Approvals",
      value: counts.pendingApprovals,
      sublabel: counts.pendingApprovals > 0 ? "Requires review" : "All reviewed",
      icon: "fa-hourglass-half",
      color: counts.pendingApprovals > 0 ? "#e0569a" : "#10b981",
      badge: counts.pendingApprovals > 0 ? "Action Needed" : "Clear",
    },
    {
      id: "approved",
      label: "Approved & Live Listings",
      value: counts.approvedProperties,
      sublabel: `${counts.verifiedProperties} Verified Listings`,
      icon: "fa-check-circle",
      color: "#2563eb",
      badge: "Live on Site",
    },
    {
      id: "featured",
      label: "Featured Properties",
      value: counts.featuredProperties,
      sublabel: "Promoted on Homepage",
      icon: "fa-star",
      color: "#d9975a",
      badge: "Homepage Boost",
    },
    {
      id: "today",
      label: "New Listings Today",
      value: counts.newListingsToday,
      sublabel: "Added in last 24 hrs",
      icon: "fa-bolt",
      color: "#0f766e",
      badge: "Real-time",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Real-Time Dashboard</h1>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              ● Live MongoDB Atlas
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Real-time platform activity, user accounts & property listings from your database
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl border border-gray-200 shadow-xs transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-60"
        >
          <i className={`fas fa-sync-alt text-xs text-[#2563eb] ${refreshing ? "fa-spin" : ""}`}></i>
          <span>{refreshing ? "Syncing..." : "Refresh Live Data"}</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchStats()}
            className="text-xs font-bold underline hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <i className={`fas ${stat.icon} text-sm`} style={{ color: stat.color }}></i>
              </div>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
                {stat.badge}
              </span>
            </div>

            <p className="text-gray-500 text-xs font-medium truncate">{stat.label}</p>
            <p className="text-2xl font-black text-gray-800 mt-1">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-100 animate-pulse rounded"></span>
              ) : (
                stat.value
              )}
            </p>
            <p className="text-[11px] text-gray-400 mt-1 truncate">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Listings trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">
                Property Listings Added (Last 6 Months)
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Calculated from actual database timestamp</p>
            </div>
            <span className="text-xs font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md">
              Total: {counts.totalProperties}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={listingsTrend.length > 0 ? listingsTrend : [{ month: "Current", listings: counts.totalProperties }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="listings"
                name="Listings"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563eb" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User signups */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">
                User Signups (Last 6 Months)
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Real users & vendors registered in MongoDB Atlas</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Total: {counts.totalUsers}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={userSignups.length > 0 ? userSignups : [{ month: "Current", buyers: counts.totalClients, vendors: counts.totalVendors }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Bar dataKey="buyers" name="Clients" fill="#6C3EE6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vendors" name="Vendors" fill="#2fb47c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Live Recent Activity</h3>
            <p className="text-[11px] text-gray-400">Directly from latest database transactions</p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
            {recentActivity.length} Events Logged
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            <i className="fas fa-spinner fa-spin mr-2"></i>Loading live database activity...
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No activity logged yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {activity.type.includes("User") || activity.type.includes("Client") ? (
                      <i className="fas fa-user"></i>
                    ) : (
                      <i className="fas fa-building"></i>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                      {activity.type}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate max-w-md">{activity.detail}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-semibold text-gray-700 block">
                    {activity.user}
                  </span>
                  <span className="text-[10px] text-gray-400">{activity.time}</span>
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