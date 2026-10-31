// frontend/src/pages/admin/ManageProperties.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending Permission" },
  { key: "approved", label: "Approved (Live)" },
  { key: "rejected", label: "Rejected" },
];

const USER_ROLES = [
  { key: "", label: "All Posters" },
  { key: "Owner", label: "Owners" },
  { key: "Dealer / Agent", label: "Dealers / Agents" },
  { key: "Builder", label: "Builders" },
];

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800 border border-amber-300",
  approved: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  rejected: "bg-red-100 text-red-800 border border-red-300",
};

const formatIndianPrice = (price, listingType) => {
  const num = Number(price);
  if (!num || isNaN(num)) return "₹ Call for Price";
  if (listingType === "rent") {
    return `₹ ${num.toLocaleString("en-IN")}/mo`;
  }
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  }
  return `₹ ${num.toLocaleString("en-IN")}`;
};

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState("pending");
  const [userType, setUserType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailModal, setDetailModal] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/properties", {
        params: { status, userType, search, page, limit: 12 },
      });
      setProperties(res.data.properties || []);
      setTotalPages(res.data.totalPages || 1);
      if (res.data.counts) {
        setCounts(res.data.counts);
      }
    } catch (err) {
      console.error("Failed to load properties:", err);
    } finally {
      setLoading(false);
    }
  }, [status, userType, search, page]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchProperties(), 350);
    return () => clearTimeout(debounce);
  }, [fetchProperties]);

  const handleApprove = async (property) => {
    const propId = property.id || property._id;
    setActionLoadingId(propId);
    try {
      const res = await api.patch(`/admin/properties/${propId}/approve`);
      // Update in local state
      setProperties((prev) =>
        prev.map((p) => {
          if ((p.id || p._id) === propId) {
            return { ...p, status: "approved", rejectionReason: null };
          }
          return p;
        })
      );
      setCounts((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        approved: prev.approved + 1,
      }));
      if (status === "pending") {
        setProperties((prev) => prev.filter((p) => (p.id || p._id) !== propId));
      }
      alert(`Property "${property.title}" approved and live on website!`);
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (property) => {
    setRejectModal(property);
    setRejectReason("Listing does not comply with verification criteria. Please provide clear details and photos.");
  };

  const confirmReject = async () => {
    if (!rejectModal) return;
    const propId = rejectModal.id || rejectModal._id;
    setActionLoadingId(propId);
    try {
      await api.patch(`/admin/properties/${propId}/reject`, {
        reason: rejectReason,
      });
      setProperties((prev) =>
        prev.map((p) => {
          if ((p.id || p._id) === propId) {
            return { ...p, status: "rejected", rejectionReason: rejectReason };
          }
          return p;
        })
      );
      setCounts((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        rejected: prev.rejected + 1,
      }));
      if (status === "pending") {
        setProperties((prev) => prev.filter((p) => (p.id || p._id) !== propId));
      }
      setRejectModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (property) => {
    const propId = property.id || property._id;
    setActionLoadingId(propId);
    try {
      const res = await api.patch(`/admin/properties/${propId}/feature`);
      setProperties((prev) =>
        prev.map((p) => ((p.id || p._id) === propId ? { ...p, isFeatured: !p.isFeatured } : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (property) => {
    const propId = property.id || property._id;
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    setActionLoadingId(propId);
    try {
      await api.delete(`/admin/properties/${propId}`);
      setProperties((prev) => prev.filter((p) => (p.id || p._id) !== propId));
      setCounts((prev) => ({
        ...prev,
        all: Math.max(0, prev.all - 1),
        pending: property.status === "pending" ? Math.max(0, prev.pending - 1) : prev.pending,
        approved: property.status === "approved" ? Math.max(0, prev.approved - 1) : prev.approved,
        rejected: property.status === "rejected" ? Math.max(0, prev.rejected - 1) : prev.rejected,
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getRoleBadge = (type) => {
    const normalized = type || "Owner";
    if (normalized === "Dealer / Agent") {
      return (
        <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200 inline-flex items-center gap-1">
          <span>💼</span> Dealer / Agent
        </span>
      );
    }
    if (normalized === "Builder") {
      return (
        <span className="bg-purple-100 text-purple-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200 inline-flex items-center gap-1">
          <span>🏗️</span> Builder
        </span>
      );
    }
    return (
      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
        <span>👤</span> Owner
      </span>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Manage Property Listings & Approvals
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Systematic verification queue for Owners, Dealers/Agents & Builders. Approve to publish live on the website.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-xs text-xs font-bold text-gray-700">
            Total: <span className="text-black font-black">{counts.all}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shadow-xs text-xs font-bold text-amber-800">
            Pending: <span className="font-black">{counts.pending}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs text-xs font-bold text-emerald-800">
            Approved: <span className="font-black">{counts.approved}</span>
          </div>
          <div className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl shadow-xs text-xs font-bold text-red-800">
            Rejected: <span className="font-black">{counts.rejected}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-4">
        {/* Status tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold flex-wrap">
            {STATUS_TABS.map((tab) => {
              const countNum =
                tab.key === ""
                  ? counts.all
                  : tab.key === "pending"
                  ? counts.pending
                  : tab.key === "approved"
                  ? counts.approved
                  : counts.rejected;

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setPage(1);
                    setStatus(tab.key);
                  }}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    status === tab.key
                      ? "bg-white text-[#6C3EE6] shadow-xs font-black"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label} ({countNum || 0})
                </button>
              );
            })}
          </div>

          {/* User role filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Poster Role:</span>
            <select
              value={userType}
              onChange={(e) => {
                setPage(1);
                setUserType(e.target.value);
              }}
              className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none text-gray-700 cursor-pointer focus:border-[#6C3EE6]"
            >
              {USER_ROLES.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 max-w-md">
          <i className="fas fa-search text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search by title, city, user name, email, phone or code..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="bg-transparent outline-none text-xs sm:text-sm flex-1 text-gray-800 placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Properties Cards Grid */}
      {loading ? (
        <div className="text-center py-24 text-gray-400">
          <i className="fas fa-spinner fa-spin text-2xl mr-2 text-[#6C3EE6]"></i>
          <p className="mt-2 text-sm font-semibold">Loading listings & poster details...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
          <div className="text-4xl mb-3">🏡</div>
          <h3 className="text-base font-bold text-gray-700">No properties found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {status === "pending"
              ? "All submitted properties have been reviewed. There are currently no pending approvals!"
              : "No property listings match your selected status or filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const propId = property.id || property._id;
            const owner = property.owner || {};
            const posterRole = property.postedByType || owner.userType || "Owner";
            const posterName = property.contactName || property.ownerName || owner.name || "Owner";
            const posterEmail = property.contactEmail || property.ownerEmail || owner.email || "";
            const posterPhone = property.contactPhone || property.ownerPhone || owner.phone || "";
            const companyName = owner.companyName || "";
            const reraNumber = property.reraNumber || owner.reraNumber || "";

            return (
              <div
                key={propId}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Property Image & Status Badges */}
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img
                      src={
                        property.images?.[0] ||
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Status Badge */}
                    <span
                      className={`absolute top-3 left-3 text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-xs capitalize ${
                        STATUS_STYLES[property.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {property.status === "pending"
                        ? "⏳ Pending Review"
                        : property.status === "approved"
                        ? "● Live on Site"
                        : "✕ Rejected"}
                    </span>

                    {/* Listing Code & Type */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {property.isFeatured && (
                        <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                          ★ Featured
                        </span>
                      )}
                      <span className="bg-black/70 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {property.uniqueCode || "HW-PROP"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs uppercase">
                      {property.listingType || "Sale"} • {property.propertyType || "Property"}
                    </div>

                    {property.images?.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/65 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        📷 {property.images.length}
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                          {property.title}
                        </h3>
                        <span className="text-[#6C3EE6] font-black text-base flex-shrink-0">
                          {formatIndianPrice(property.price, property.listingType)}
                        </span>
                      </div>

                      <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <span>📍</span>
                        <span className="truncate">
                          {property.locality ? `${property.locality}, ` : ""}
                          {property.city}
                          {property.state ? `, ${property.state}` : ""}
                        </span>
                      </p>
                    </div>

                    {/* Property Specs Pill */}
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100 flex-wrap">
                      {property.bhk && <span>{property.bhk}</span>}
                      {property.areaSqft && <span>• {property.areaSqft} sq.ft</span>}
                      {property.furnishing && <span>• {property.furnishing}</span>}
                      {property.projectName && <span>• {property.projectName}</span>}
                    </div>

                    {/* Poster / User Box (Requested: User Details in Admin Panel) */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                          Poster / User Details
                        </span>
                        {getRoleBadge(posterRole)}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#6C3EE6]/10 text-[#6C3EE6] font-black text-xs flex items-center justify-center flex-shrink-0">
                          {posterName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{posterName}</p>
                          {companyName && (
                            <p className="text-[11px] font-semibold text-[#005744] truncate">
                              🏢 {companyName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-600 pt-1 border-t border-slate-200">
                        {posterPhone ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">📞</span>
                            <a
                              href={`tel:${posterPhone}`}
                              className="font-semibold text-blue-600 hover:underline truncate"
                            >
                              +91 {posterPhone}
                            </a>
                            <a
                              href={`https://wa.me/91${posterPhone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="text-emerald-600 hover:text-emerald-700 ml-1"
                            >
                              <i className="fab fa-whatsapp"></i>
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No phone provided</span>
                        )}

                        {posterEmail && (
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-slate-400">✉️</span>
                            <a
                              href={`mailto:${posterEmail}`}
                              className="text-gray-600 hover:text-gray-900 truncate"
                              title={posterEmail}
                            >
                              {posterEmail}
                            </a>
                          </div>
                        )}
                      </div>

                      {reraNumber && (
                        <p className="text-[10px] font-mono font-semibold text-gray-500">
                          RERA: <span className="text-gray-800">{reraNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* Rejection notice if rejected */}
                    {property.status === "rejected" && property.rejectionReason && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                        <span className="font-bold">Rejection Reason:</span> {property.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2 flex-wrap">
                  {property.status === "pending" ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => handleApprove(property)}
                        disabled={actionLoadingId === propId}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <i className="fas fa-check"></i>
                        <span>{actionLoadingId === propId ? "Approving..." : "Approve & Publish"}</span>
                      </button>

                      <button
                        onClick={() => openRejectModal(property)}
                        disabled={actionLoadingId === propId}
                        className="px-3.5 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <i className="fas fa-times mr-1"></i>Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {property.status === "approved" && (
                        <>
                          <a
                            href="/#properties-showcase"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1"
                          >
                            <span>🌐 Live</span>
                          </a>

                          <button
                            onClick={() => handleToggleFeatured(property)}
                            disabled={actionLoadingId === propId}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              property.isFeatured
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <i className="fas fa-star mr-1"></i>
                            {property.isFeatured ? "Featured" : "Feature"}
                          </button>
                        </>
                      )}

                      {property.status === "rejected" && (
                        <button
                          onClick={() => handleApprove(property)}
                          disabled={actionLoadingId === propId}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                        >
                          Re-approve
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDetailModal(property)}
                      className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                      title="View Full Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>

                    <button
                      onClick={() => handleDelete(property)}
                      disabled={actionLoadingId === propId}
                      className="px-2.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                      title="Delete Property"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && properties.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
          >
            ← Previous
          </button>
          <span className="text-xs font-bold text-gray-600 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span>❌</span> Reject Property Listing
              </h3>
              <button
                onClick={() => setRejectModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-500">Property:</p>
              <p className="text-sm font-bold text-gray-800">{rejectModal.title}</p>
              <p className="text-xs text-[#005744] font-semibold mt-0.5">
                Poster: {rejectModal.contactName || rejectModal.owner?.name || "Owner"} (
                {rejectModal.postedByType || rejectModal.owner?.userType || "Owner"})
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reason for Rejection (Visible to Poster in My Listings):
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Specify why this listing was rejected so the user can fix and re-submit..."
                className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-red-500 text-gray-800"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={actionLoadingId === (rejectModal.id || rejectModal._id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {actionLoadingId === (rejectModal.id || rejectModal._id)
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Inspection Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {detailModal.uniqueCode || "HW-PROP"}
                </span>
                <h3 className="font-bold text-gray-900 text-lg mt-1">{detailModal.title}</h3>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Photos */}
            {detailModal.images?.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {detailModal.images.slice(0, 6).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Property ${i}`}
                    className="w-full h-28 object-cover rounded-xl border border-gray-200"
                  />
                ))}
              </div>
            )}

            {/* Details Table */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <span className="text-gray-400">Price:</span>
                <p className="font-black text-[#005744] text-sm">
                  {formatIndianPrice(detailModal.price, detailModal.listingType)}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Listing For:</span>
                <p className="font-bold text-gray-800 uppercase">{detailModal.listingType || "Sale"}</p>
              </div>
              <div>
                <span className="text-gray-400">Property Type:</span>
                <p className="font-bold text-gray-800">{detailModal.propertyType}</p>
              </div>
              <div>
                <span className="text-gray-400">BHK / Config:</span>
                <p className="font-bold text-gray-800">{detailModal.bhk || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-400">Super Area:</span>
                <p className="font-bold text-gray-800">
                  {detailModal.areaSqft ? `${detailModal.areaSqft} sq.ft` : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Furnishing:</span>
                <p className="font-bold text-gray-800">{detailModal.furnishing || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Location:</span>
                <p className="font-bold text-gray-800">
                  {detailModal.address ? `${detailModal.address}, ` : ""}
                  {detailModal.locality ? `${detailModal.locality}, ` : ""}
                  {detailModal.city}, {detailModal.state} {detailModal.pincode}
                </p>
              </div>
            </div>

            {/* Poster Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <p className="font-black text-gray-900 text-sm">User & Poster Profile:</p>
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                <span className="font-bold text-gray-800">
                  {detailModal.contactName || detailModal.owner?.name || "N/A"}
                </span>{" "}
                ({detailModal.postedByType || detailModal.owner?.userType || "Owner"})
              </p>
              <p>
                <span className="text-gray-500">Email:</span>{" "}
                <span className="font-bold text-gray-800">
                  {detailModal.contactEmail || detailModal.owner?.email || "N/A"}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Phone:</span>{" "}
                <span className="font-bold text-gray-800">
                  {detailModal.contactPhone || detailModal.owner?.phone || "N/A"}
                </span>
              </p>
              {detailModal.owner?.companyName && (
                <p>
                  <span className="text-gray-500">Company:</span>{" "}
                  <span className="font-bold text-gray-800">{detailModal.owner.companyName}</span>
                </p>
              )}
            </div>

            {/* Description */}
            {detailModal.description && (
              <div>
                <span className="text-xs font-bold text-gray-600">Description:</span>
                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl mt-1 leading-relaxed">
                  {detailModal.description}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t">
              <button
                onClick={() => setDetailModal(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              {detailModal.status === "pending" && (
                <button
                  onClick={() => {
                    handleApprove(detailModal);
                    setDetailModal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Approve Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;