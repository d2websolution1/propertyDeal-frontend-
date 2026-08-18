// pages/admin/ReportUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ReportUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/users?role=${role}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-purple-50 text-purple-600",
      vendor: "bg-blue-50 text-blue-600",
      user: "bg-green-50 text-green-600"
    };
    return colors[role] || colors.user;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New User & Vendor Report</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track new user registrations</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setRole("all")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            role === "all" ? "bg-[#6C3EE6] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          All ({users.length})
        </button>
        <button
          onClick={() => setRole("user")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Users ({users.filter(u => u.role === 'user').length})
        </button>
        <button
          onClick={() => setRole("vendor")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            role === "vendor" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Vendors ({users.filter(u => u.role === 'vendor').length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No users found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Properties</th>
                <th className="text-left px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-5 py-3 text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{user.properties?.length || 0}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportUsers;