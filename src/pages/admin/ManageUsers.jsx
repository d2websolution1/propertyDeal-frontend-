// ManageUsers.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: { search, role: roleFilter, page, limit: 12 },
      });
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(), 350);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  const handleBlockToggle = async (user) => {
    const uid = user.id || user._id;
    setActionLoadingId(uid);
    try {
      const endpoint = user.isBlocked
        ? `/admin/users/${uid}/unblock`
        : `/admin/users/${uid}/block`;
      await api.patch(endpoint);
      setUsers((prev) =>
        prev.map((u) => ((u.id || u._id) === uid ? { ...u, isBlocked: !u.isBlocked } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (user) => {
    const uid = user.id || user._id;
    if (!window.confirm(`Delete account for ${user.name}? This cannot be undone.`)) return;
    setActionLoadingId(uid);
    try {
      await api.delete(`/admin/users/${uid}`);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== uid));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getRoleBadge = (uType) => {
    const normalized = uType || "Owner";
    if (normalized === "Dealer / Agent") {
      return (
        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
          💼 Dealer / Agent
        </span>
      );
    }
    if (normalized === "Builder") {
      return (
        <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
          🏗️ Builder
        </span>
      );
    }
    return (
      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
        👤 Owner
      </span>
    );
  };

  const filteredUsers = users.filter((u) => {
    if (userTypeFilter && (u.userType || "Owner") !== userTypeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>👥</span> Manage Platform Users
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Registered accounts across India: Owners, Dealers / Agents, Builders & Vendors
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-xs">
          <span>Total Database Users:</span>
          <span className="text-black font-black text-sm">{users.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md">
          <i className="fas fa-search text-gray-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="bg-transparent outline-none text-xs sm:text-sm flex-1 text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3 py-2 text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Owner">Owners</option>
            <option value="Dealer / Agent">Dealers / Agents</option>
            <option value="Builder">Builders</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value);
            }}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3 py-2 text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Account Roles</option>
            <option value="user">Regular Users</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Company / RERA</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400 font-semibold">
                    <i className="fas fa-spinner fa-spin mr-2 text-blue-600"></i>
                    Loading registered users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const uid = u.id || u._id;
                  const isBlocked = !!u.isBlocked;
                  const isAdmin = u.role === "admin";

                  return (
                    <tr key={uid} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 flex-shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              u.name?.charAt(0)?.toUpperCase() || "U"
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block truncate max-w-[150px]">
                              {u.name || "User"}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono block">
                              ID: {String(uid).slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{getRoleBadge(u.userType)}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-gray-700 block truncate max-w-[180px]">{u.email}</span>
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${u.phone}`}
                              className="text-[11px] text-blue-600 font-semibold hover:underline"
                            >
                              📞 +91 {u.phone}
                            </a>
                            <a
                              href={`https://wa.me/91${u.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 text-xs"
                              title="WhatsApp"
                            >
                              <i className="fab fa-whatsapp"></i>
                            </a>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">No phone</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {u.companyName ? (
                          <span className="font-semibold text-gray-800 block truncate max-w-[140px]">
                            🏢 {u.companyName}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">—</span>
                        )}
                        {u.reraNumber && (
                          <span className="text-[10px] font-mono text-gray-500 block">
                            RERA: {u.reraNumber}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[11px] font-black px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                            isBlocked
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-red-500" : "bg-emerald-500"}`}
                          ></span>
                          {isBlocked ? "Blocked" : "Active"}
                        </span>
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
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isAdmin && (
                            <>
                              <button
                                onClick={() => handleBlockToggle(u)}
                                disabled={actionLoadingId === uid}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                                  isBlocked
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                }`}
                              >
                                {actionLoadingId === uid ? "..." : isBlocked ? "Unblock" : "Block"}
                              </button>
                              <button
                                onClick={() => handleDelete(u)}
                                disabled={actionLoadingId === uid}
                                className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {isAdmin && (
                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <span className="text-xs font-bold text-gray-600 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;