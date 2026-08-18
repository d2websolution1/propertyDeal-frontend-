// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
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

// TODO: replace with real API calls, e.g. GET /api/admin/dashboard-stats
const MOCK_STATS = [
  { id: 1, label: "Total Users", value: "12,480", change: "+8.2%", up: true, icon: "fa-users", color: "#6C3EE6" },
  { id: 2, label: "Total Properties", value: "3,214", change: "+4.1%", up: true, icon: "fa-building", color: "#2fb47c" },
  { id: 3, label: "Pending Approvals", value: "37", change: "-2 today", up: false, icon: "fa-hourglass-half", color: "#e0569a" },
  { id: 4, label: "Active Subscriptions", value: "842", change: "+12", up: true, icon: "fa-layer-group", color: "#4f6bd8" },
  { id: 5, label: "New Listings Today", value: "56", change: "+15%", up: true, icon: "fa-file-invoice", color: "#d9975a" },
  { id: 6, label: "Revenue (This Month)", value: "₹8.4L", change: "+6.4%", up: true, icon: "fa-indian-rupee-sign", color: "#0f766e" },
];

const MOCK_LISTINGS_TREND = [
  { month: "Feb", listings: 210 },
  { month: "Mar", listings: 280 },
  { month: "Apr", listings: 240 },
  { month: "May", listings: 310 },
  { month: "Jun", listings: 350 },
  { month: "Jul", listings: 420 },
];

const MOCK_USER_SIGNUPS = [
  { month: "Feb", buyers: 120, vendors: 40 },
  { month: "Mar", buyers: 150, vendors: 55 },
  { month: "Apr", buyers: 130, vendors: 48 },
  { month: "May", buyers: 180, vendors: 62 },
  { month: "Jun", buyers: 210, vendors: 70 },
  { month: "Jul", buyers: 260, vendors: 85 },
];

const MOCK_RECENT_ACTIVITY = [
  { id: 1, type: "New Listing", detail: "3 BHK Apartment — Andheri West, Mumbai", user: "Rohit Sharma", time: "5 min ago" },
  { id: 2, type: "New Vendor", detail: "Registered as a Broker", user: "Priya Constructions", time: "22 min ago" },
  { id: 3, type: "Listing Approved", detail: "2 BHK Flat — Kandivali East", user: "Admin", time: "1 hr ago" },
  { id: 4, type: "Enquiry", detail: "Interested in Lodha Upper Thane", user: "Aakash Verma", time: "2 hr ago" },
  { id: 5, type: "Payment", detail: "Subscription renewed — Premium Plan", user: "Mehta Properties", time: "3 hr ago" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: fetch real stats
    // setLoading(true);
    // api.get('/admin/dashboard-stats').then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Overview of platform activity and performance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${stat.color}1a` }}
            >
              <i className={`fas ${stat.icon} text-sm`} style={{ color: stat.color }}></i>
            </div>
            <p className="text-gray-500 text-xs">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                stat.up ? "text-green-600" : "text-gray-400"
              }`}
            >
              {stat.up && <i className="fas fa-arrow-up text-[9px]"></i>}
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Listings trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4">
            New Listings — Last 6 Months
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MOCK_LISTINGS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="listings"
                stroke="#6C3EE6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User signups */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4">
            New User &amp; Vendor Signups
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MOCK_USER_SIGNUPS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="buyers" fill="#6C3EE6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vendors" fill="#2fb47c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">Recent Activity</h3>
          <button className="text-[#6C3EE6] text-xs font-semibold hover:underline">
            View all
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {MOCK_RECENT_ACTIVITY.map((activity) => (
            <div
              key={activity.id}
              className="px-5 py-3 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {activity.type}
                </p>
                <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-600">{activity.user}</p>
                <p className="text-[11px] text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;