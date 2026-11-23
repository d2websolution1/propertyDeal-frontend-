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

const PLAN_PRESETS = [
  {
    id: "owner-starter",
    name: "Free Starter (30 Days)",
    price: 0,
    priceLabel: "₹0",
    limit: 2,
    days: 30,
    featured: 0,
    tag: "FREE",
    desc: "2 Listings Quota • 30 Days Validity",
  },
  {
    id: "owner-gold",
    name: "Gold Owner Plan (60 Days)",
    price: 499,
    priceLabel: "₹499",
    limit: 5,
    days: 60,
    featured: 1,
    tag: "POPULAR",
    desc: "5 Listings Quota • 60 Days Validity • Direct inquiries",
  },
  {
    id: "owner-annual",
    name: "Annual Owner Plan (365 Days)",
    price: 1499,
    priceLabel: "₹1499",
    limit: 20,
    days: 365,
    featured: 5,
    tag: "BEST VALUE",
    desc: "20 Listings Quota • 365 Days Validity • Direct inquiries",
  },
  {
    id: "agent-std",
    name: "Standard Agent Plan (45 Days)",
    price: 999,
    priceLabel: "₹999",
    limit: 20,
    days: 45,
    featured: 2,
    tag: "AGENT PACK",
    desc: "20 Listings Quota • 45 Days Validity • 2 Featured Boosts",
  },
  {
    id: "agent-pro",
    name: "Pro Agent Plan (90 Days)",
    price: 1999,
    priceLabel: "₹1999",
    limit: 50,
    days: 90,
    featured: 5,
    tag: "MOST POPULAR",
    desc: "50 Listings Quota • 90 Days Validity • 5 Featured Boosts",
  },
  {
    id: "agent-annual",
    name: "Annual Agent Plan (365 Days)",
    price: 4999,
    priceLabel: "₹4999",
    limit: 200,
    days: 365,
    featured: 20,
    tag: "UNLIMITED",
    desc: "200 Listings Quota • 365 Days Validity • 20 Featured Slots",
  },
];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Edit Profile Modal State
  const [editModalUser, setEditModalUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    userType: "Owner",
    city: "",
    companyName: "",
    reraNumber: "",
    operatingSince: "",
    teamSize: "",
    localities: "",
    about: "",
    isBlocked: false,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Activate Plan Modal State
  const [planModalUser, setPlanModalUser] = useState(null);
  const [selectedPlanPreset, setSelectedPlanPreset] = useState("owner-gold");
  const [customPlanForm, setCustomPlanForm] = useState({
    planName: "Gold Owner Plan (60 Days)",
    listingLimit: 5,
    validityDays: 60,
    featuredLimit: 1,
    price: 499,
  });
  const [activatingPlan, setActivatingPlan] = useState(false);
  const [planSuccessMsg, setPlanSuccessMsg] = useState("");

  const openPlanModal = (user) => {
    setPlanModalUser(user);
    const isAg = user.userType === "Dealer / Agent" || user.role === "vendor";
    const defaultPreset = isAg ? PLAN_PRESETS[3] : PLAN_PRESETS[1];
    setSelectedPlanPreset(defaultPreset.id);
    setCustomPlanForm({
      planName: defaultPreset.name,
      listingLimit: defaultPreset.limit,
      validityDays: defaultPreset.days,
      featuredLimit: defaultPreset.featured,
      price: defaultPreset.price,
    });
    setPlanSuccessMsg("");
  };

  const handleSelectPreset = (preset) => {
    setSelectedPlanPreset(preset.id);
    setCustomPlanForm({
      planName: preset.name,
      listingLimit: preset.limit,
      validityDays: preset.days,
      featuredLimit: preset.featured,
      price: preset.price,
    });
  };

  const handleActivatePlanSubmit = async (e, overridePlanForm) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!planModalUser) return;
    const uid = planModalUser.id || planModalUser._id || planModalUser.email;
    const formToSend = overridePlanForm || customPlanForm;
    setActivatingPlan(true);
    try {
      const res = await api.put(`/admin/users/${uid}/activate-plan`, formToSend);
      const updatedUser = res.data.user || {};

      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u._id) === uid || (updatedUser.email && u.email === updatedUser.email)
            ? { ...u, ...updatedUser }
            : u
        )
      );
      setPlanSuccessMsg(
        `Plan "${formToSend.planName}" activated successfully! Quota updated to ${formToSend.listingLimit} listings.`
      );
      setTimeout(() => {
        setPlanSuccessMsg("");
        setPlanModalUser(null);
      }, 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || "Failed to activate plan";
      alert(msg);
    } finally {
      setActivatingPlan(false);
    }
  };

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

  const handleQuickVerifyAgent = async (user) => {
    const uid = user.id || user._id;
    setActionLoadingId(uid);
    try {
      const nextVerified = !user.isVerifiedAgent;
      await api.put(`/users/admin/${uid}/agent-status`, {
        isVerifiedAgent: nextVerified,
        userType: nextVerified ? 'Dealer / Agent' : user.userType,
      });
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u._id) === uid
            ? { ...u, isVerifiedAgent: nextVerified, userType: nextVerified ? 'Dealer / Agent' : u.userType }
            : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update agent verification");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApproveAgentRequest = async (user) => {
    const uid = user.id || user._id;
    setActionLoadingId(uid);
    try {
      await api.put(`/users/admin/${uid}/agent-status`, {
        agentRequestStatus: 'approved',
        userType: 'Dealer / Agent',
        isVerifiedAgent: true,
      });
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u._id) === uid
            ? { ...u, agentRequestStatus: 'approved', userType: 'Dealer / Agent', isVerifiedAgent: true }
            : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve agent request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openEditModal = (user) => {
    setEditModalUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      userType: user.userType || "Owner",
      city: user.city || "",
      companyName: user.companyName || "",
      reraNumber: user.reraNumber || "",
      operatingSince: user.operatingSince || "",
      teamSize: user.teamSize || "",
      localities: user.localities || "",
      about: user.about || "",
      isBlocked: !!user.isBlocked,
      isVerifiedAgent: !!user.isVerifiedAgent,
      agentRequestStatus: user.agentRequestStatus || "none",
      listingLimit: user.listingLimit !== undefined ? user.listingLimit : 2,
      activePlan: user.activePlan || "Free Starter",
    });
    setSaveSuccess(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editModalUser) return;
    const uid = editModalUser.id || editModalUser._id;

    setSavingProfile(true);
    try {
      const res = await api.put(`/admin/users/${uid}`, editForm);
      const updated = res.data.user;

      setUsers((prev) =>
        prev.map((u) => ((u.id || u._id) === uid ? { ...u, ...updated } : u))
      );
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditModalUser(null);
      }, 900);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user profile");
    } finally {
      setSavingProfile(false);
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
            Registered accounts across India: Owners, Dealers / Agents, Builders & Profile Editing
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
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-extrabold uppercase tracking-wider">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Company & City</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-gray-400">
                    <i className="fas fa-spinner fa-spin text-xl text-blue-600 mb-2 block"></i>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-gray-400">
                    No users matching criteria
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
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          {getRoleBadge(u.userType)}
                          
                          {/* User Plan & Days Duration */}
                          <div className="pt-0.5">
                            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md block w-max">
                              📦 {u.activePlan || "Free Starter (30 Days)"}
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">
                              {u.planExpiresAt
                                ? `⏱️ ${Math.max(0, Math.ceil((new Date(u.planExpiresAt) - new Date()) / (1000 * 60 * 60 * 24)))} days validity left`
                                : "⏱️ 30 days validity"}
                            </span>
                          </div>

                          {u.isVerifiedAgent && (
                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 w-max shadow-xs">
                              ✓ Verified Agent
                            </span>
                          )}
                          {u.agentRequestStatus === "pending" && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                ⏳ Upgrade Pending
                              </span>
                              <button
                                type="button"
                                onClick={() => handleApproveAgentRequest(u)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded cursor-pointer shadow-xs"
                                title="Approve as Verified Agent"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-gray-700 block truncate max-w-[180px]">{u.email}</span>
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${u.phone}`}
                              className="text-[11px] text-blue-600 font-semibold hover:underline"
                            >
                              📞 {u.phone}
                            </a>
                            <a
                              href={`https://wa.me/${u.phone.replace(/\D/g, "")}`}
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
                          <span className="text-gray-700 text-xs block">{u.city || "—"}</span>
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
                          {/* Quick Verify Agent Button */}
                          {!isAdmin && (
                            <button
                              onClick={() => handleQuickVerifyAgent(u)}
                              disabled={actionLoadingId === uid}
                              className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                u.isVerifiedAgent
                                  ? "border-blue-400 bg-blue-600 text-white hover:bg-blue-700"
                                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                              title={u.isVerifiedAgent ? "Revoke Agent Verification" : "Mark as Verified Agent"}
                            >
                              <span>{u.isVerifiedAgent ? "✓ Verified" : "Verify Agent"}</span>
                            </button>
                          )}

                          {/* Activate Plan Button */}
                          {!isAdmin && (
                            <button
                              onClick={() => openPlanModal(u)}
                              className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Activate / Upgrade User Plan"
                            >
                              <span>⚡</span>
                              <span>Activate Plan</span>
                            </button>
                          )}

                          {/* Manage Profile Button */}
                          <button
                            onClick={() => openEditModal(u)}
                            className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Edit User Profile"
                          >
                            <i className="fas fa-user-edit text-[11px]"></i>
                            <span>Edit Profile</span>
                          </button>

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
                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
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
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EDIT USER PROFILE MODAL */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                  {editForm.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Edit User Profile: {editModalUser.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Admin full control over user identity, role, category and company details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalUser(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <span>✓</span> Profile updated successfully in database!
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile / Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">User Category</label>
                  <select
                    value={editForm.userType}
                    onChange={(e) => setEditForm({ ...editForm, userType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Dealer / Agent">Dealer / Agent</option>
                    <option value="Builder">Builder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">System Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="user">Regular User</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Agency Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Associates"
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">RERA Number</label>
                  <input
                    type="text"
                    placeholder="e.g. RAJ/RERA/P/2024/001"
                    value={editForm.reraNumber}
                    onChange={(e) => setEditForm({ ...editForm, reraNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Operating Since</label>
                  <input
                    type="text"
                    placeholder="e.g. 2018"
                    value={editForm.operatingSince}
                    onChange={(e) => setEditForm({ ...editForm, operatingSince: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Team Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-10 Agents"
                    value={editForm.teamSize}
                    onChange={(e) => setEditForm({ ...editForm, teamSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Localities / Areas Covered</label>
                <input
                  type="text"
                  placeholder="e.g. Mansarovar, Vaishali Nagar, Jagatpura"
                  value={editForm.localities}
                  onChange={(e) => setEditForm({ ...editForm, localities: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">About / Bio</label>
                <textarea
                  rows={2}
                  placeholder="Short description or background..."
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Active Subscription Plan</label>
                  <select
                    value={editForm.activePlan}
                    onChange={(e) => {
                      const sel = e.target.value;
                      const matched = PLAN_PRESETS.find((p) => p.name === sel);
                      setEditForm({
                        ...editForm,
                        activePlan: sel,
                        listingLimit: matched ? matched.limit : editForm.listingLimit,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="Free Starter (30 Days)">Free Starter (30 Days) - 2 Listings</option>
                    <option value="Gold Owner Plan (60 Days)">Gold Owner Plan (60 Days) - 5 Listings (₹499)</option>
                    <option value="Annual Owner Plan (365 Days)">Annual Owner Plan (365 Days) - 20 Listings (₹1499)</option>
                    <option value="Standard Agent Plan (45 Days)">Standard Agent Plan (45 Days) - 20 Listings (₹999)</option>
                    <option value="Pro Agent Plan (90 Days)">Pro Agent Plan (90 Days) - 50 Listings (₹1999)</option>
                    <option value="Annual Agent Plan (365 Days)">Annual Agent Plan (365 Days) - 200 Listings (₹4999)</option>
                    {!PLAN_PRESETS.some((p) => p.name === editForm.activePlan) && (
                      <option value={editForm.activePlan}>{editForm.activePlan}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Listing Limit Quota</label>
                  <input
                    type="number"
                    value={editForm.listingLimit}
                    onChange={(e) => setEditForm({ ...editForm, listingLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-700">
                  <input
                    type="checkbox"
                    checked={editForm.isVerifiedAgent}
                    onChange={(e) => setEditForm({ ...editForm, isVerifiedAgent: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span>✓ Mark as Verified Real Estate Agent</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.isBlocked}
                    onChange={(e) => setEditForm({ ...editForm, isBlocked: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Block Account from Logging in</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {savingProfile ? "Saving..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── ACTIVATE / UPGRADE USER PLAN MODAL ── */}
      {planModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Activate / Upgrade User Plan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Assign a paid listing package for <strong>{planModalUser.name || planModalUser.email}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPlanModalUser(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {planSuccessMsg && (
              <div className="my-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <span>🎉</span>
                <span>{planSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleActivatePlanSubmit} className="space-y-4 pt-3">
              {/* User Current Info Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-gray-500 block">User Account:</span>
                  <span className="font-extrabold text-gray-900">{planModalUser.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Current Active Plan:</span>
                  <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {planModalUser.activePlan || "Free Starter (30 Days)"}
                  </span>
                </div>
              </div>

              {/* Select Preset Plan */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Subscription Package:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PLAN_PRESETS.map((preset) => {
                    const isSelected = selectedPlanPreset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            {preset.tag}
                          </span>
                          <span className="text-sm font-black text-[#D62839]">
                            {preset.priceLabel}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-gray-900 mt-1">{preset.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{preset.desc}</p>
                        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-medium">Click to select</span>
                          <button
                            type="button"
                            disabled={activatingPlan}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              handleSelectPreset(preset);
                              handleActivatePlanSubmit(null, {
                                planName: preset.name,
                                listingLimit: preset.limit,
                                validityDays: preset.days,
                                featuredLimit: preset.featured,
                                price: preset.price,
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold shadow-xs cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
                          >
                            <span>⚡ Activate</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editable Plan Name, Quota, Days, & Price */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Plan Name to Activate
                  </label>
                  <input
                    type="text"
                    required
                    value={customPlanForm.planName}
                    onChange={(e) =>
                      setCustomPlanForm({
                        ...customPlanForm,
                        planName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Listing Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={customPlanForm.listingLimit}
                      onChange={(e) =>
                        setCustomPlanForm({
                          ...customPlanForm,
                          listingLimit: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Validity (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={customPlanForm.validityDays}
                      onChange={(e) =>
                        setCustomPlanForm({
                          ...customPlanForm,
                          validityDays: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={customPlanForm.price}
                      onChange={(e) =>
                        setCustomPlanForm({
                          ...customPlanForm,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPlanModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={activatingPlan}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-60 flex items-center gap-1.5 transition-all"
                >
                  {activatingPlan ? "Activating..." : "Confirm & Activate Plan →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
