// pages/admin/ReportUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ReportUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [dateRange]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/users?range=${dateRange}`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>👤</span> New User Registrations Report
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live DB ({users.length})
            </span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Audit new accounts created across India with poster category and contact
          </p>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setDateRange("all")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              dateRange === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setDateRange("week")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              dateRange === "week" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange("month")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              dateRange === "month" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange("year")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              dateRange === "year" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600"
            }`}
          >
            Past Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-semibold">
          <i className="fas fa-spinner fa-spin text-2xl mr-2 text-blue-600"></i>
          <p className="mt-2 text-sm">Generating user report...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-2">👥</div>
          <h4 className="font-bold text-gray-800">No new user registrations in this timeframe</h4>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Company / City</th>
                  <th className="px-5 py-3.5">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const uid = u.id || u._id;
                  return (
                    <tr key={uid} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-gray-900">{u.name || "User"}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {u.userType || "Owner"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">
                        <span className="block truncate max-w-xs">{u.email}</span>
                        {u.phone && <span className="text-xs text-blue-600 font-semibold">📞 +91 {u.phone}</span>}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {u.companyName ? (
                          <span className="font-bold text-gray-800 block">🏢 {u.companyName}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                        {u.city && <span className="text-[11px] text-gray-400 block">{u.city}</span>}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recent"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportUsers;