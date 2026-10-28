// ManageProperties.jsx
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
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-600",
};

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // holds property being rejected
  const [rejectReason, setRejectReason] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/properties", {
        params: { status, search, page, limit: 10 },
      });
      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load properties:", err);
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchProperties(), 350);
    return () => clearTimeout(debounce);
  }, [fetchProperties]);

  const handleApprove = async (property) => {
    setActionLoadingId(property.id);
    try {
      await api.patch(`/admin/properties/${property.id}/approve`);
      setProperties((prev) => prev.filter((p) => p.id !== property.id));
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (property) => {
    setRejectModal(property);
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectModal) return;
    setActionLoadingId(rejectModal.id);
    try {
      await api.patch(`/admin/properties/${rejectModal.id}/reject`, {
        reason: rejectReason,
      });
      setProperties((prev) => prev.filter((p) => p.id !== rejectModal.id));
      setRejectModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (property) => {
    setActionLoadingId(property.id);
    try {
      const res = await api.patch(`/admin/properties/${property.id}/feature`);
      setProperties((prev) =>
        prev.map((p) => (p.id === property.id ? res.data.property : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`Delete "${property.title}"? This can't be undone.`)) return;
    setActionLoadingId(property.id);
    try {
      await api.delete(`/admin/properties/${property.id}`);
      setProperties((prev) => prev.filter((p) => p.id !== property.id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Properties</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Review, approve, or reject property listings
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setPage(1);
              setStatus(tab.key);
            }}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              status === tab.key
                ? "border-[#6C3EE6] text-[#6C3EE6]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 max-w-[360px] mb-4">
        <i className="fas fa-search text-gray-400 text-sm"></i>
        <input
          type="text"
          placeholder="Search by title, city, or code..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No properties found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Image */}
              <div className="h-[160px] bg-gray-100 relative">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <i className="fas fa-image text-3xl"></i>
                  </div>
                )}
                <span
                  className={`absolute top-2 left-2 text-[11px] font-bold px-2 py-1 rounded capitalize ${STATUS_STYLES[property.status]}`}
                >
                  {property.status}
                </span>
                {property.isFeatured && (
                  <span className="absolute top-2 right-2 text-[11px] font-bold px-2 py-1 rounded bg-yellow-50 text-yellow-600">
                    <i className="fas fa-star mr-1"></i>Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm truncate">
                  {property.title}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {property.locality ? `${property.locality}, ` : ""}
                  {property.city}
                </p>
                <p className="text-[#6C3EE6] font-bold text-sm mt-2">
                  ₹{Number(property.price).toLocaleString("en-IN")}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  by {property.owner?.name || "Unknown"} · {property.propertyType}
                  {property.bhk ? ` · ${property.bhk}` : ""}
                </p>
                {property.uniqueCode && (
                  <p className="text-gray-400 text-[11px] mt-1 font-mono">
                    {property.uniqueCode}
                  </p>
                )}
                {property.status === "rejected" && property.rejectionReason && (
                  <p className="text-red-500 text-xs mt-2 bg-red-50 rounded px-2 py-1">
                    {property.rejectionReason}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {property.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(property)}
                        disabled={actionLoadingId === property.id}
                        className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold px-3 py-2 rounded-md transition-colors disabled:opacity-40"
                      >
                        <i className="fas fa-check mr-1"></i>Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(property)}
                        disabled={actionLoadingId === property.id}
                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold px-3 py-2 rounded-md transition-colors disabled:opacity-40"
                      >
                        <i className="fas fa-times mr-1"></i>Reject
                      </button>
                    </>
                  )}
                  {property.status === "approved" && (
                    <button
                      onClick={() => handleToggleFeatured(property)}
                      disabled={actionLoadingId === property.id}
                      className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs font-semibold px-3 py-2 rounded-md transition-colors disabled:opacity-40"
                    >
                      <i className="fas fa-star mr-1"></i>
                      {property.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(property)}
                    disabled={actionLoadingId === property.id}
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40"
                    aria-label="Delete property"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && properties.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 hover:bg-gray-50"
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 hover:bg-gray-50"
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-6">
            <h3 className="font-bold text-gray-800 mb-1">Reject Listing</h3>
            <p className="text-gray-500 text-sm mb-4">
              "{rejectModal.title}" — let the owner know why.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Photos are unclear, pricing seems incorrect..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6] resize-none"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={actionLoadingId === rejectModal.id}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50"
              >
                {actionLoadingId === rejectModal.id ? "Rejecting..." : "Reject Listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;