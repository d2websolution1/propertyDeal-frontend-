// pages/admin/ManageEnquiries.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [actionId, setActionId] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/enquiries");
      setEnquiries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      try {
        const fallbackRes = await api.get("/admin/listings/enquiries");
        setEnquiries(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
      } catch (e) {
        console.error("Failed to load enquiries:", e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateStatus = async (id, status) => {
    setActionId(id);
    try {
      await api.put(`/admin/enquiries/${id}`, { status });
      setEnquiries((prev) =>
        prev.map((item) => ((item.id || item._id) === id ? { ...item, status } : item))
      );
    } catch (err) {
      try {
        await api.put(`/admin/listings/enquiries/${id}`, { status });
        setEnquiries((prev) =>
          prev.map((item) => ((item.id || item._id) === id ? { ...item, status } : item))
        );
      } catch (e) {
        alert("Failed to update status");
      }
    } finally {
      setActionId(null);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this customer enquiry?")) return;
    setActionId(id);
    try {
      await api.delete(`/admin/enquiries/${id}`);
      setEnquiries((prev) => prev.filter((item) => (item.id || item._id) !== id));
    } catch (err) {
      try {
        await api.delete(`/admin/listings/enquiries/${id}`);
        setEnquiries((prev) => prev.filter((item) => (item.id || item._id) !== id));
      } catch (e) {
        alert("Failed to delete enquiry");
      }
    } finally {
      setActionId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "contacted":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "in_progress":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
  };

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (e.userName || e.user?.name || "").toLowerCase();
      const email = (e.userEmail || e.user?.email || "").toLowerCase();
      const prop = (e.propertyTitle || e.property?.title || "").toLowerCase();
      return name.includes(q) || email.includes(q) || prop.includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>💬</span> Property Enquiries & Leads
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Real-time prospective buyer & tenant enquiries from public property listings
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {["all", "new", "contacted", "in_progress", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  statusFilter === st ? "bg-white text-gray-900 shadow-xs" : "text-gray-600"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-xs">
            <i className="fas fa-search text-gray-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs outline-none bg-transparent text-gray-700"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-semibold">
          <i className="fas fa-spinner fa-spin text-2xl mr-2 text-[#6C3EE6]"></i>
          <p className="mt-2 text-sm">Loading property enquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-2">📬</div>
          <h4 className="font-bold text-gray-800">No Enquiries Found</h4>
          <p className="text-xs text-gray-400 mt-1">
            When users submit inquiry forms on properties, they will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-5 py-3.5">Prospective Buyer</th>
                  <th className="px-5 py-3.5">Message / Note</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((enquiry) => {
                  const enqId = enquiry.id || enquiry._id;
                  const userName = enquiry.userName || enquiry.user?.name || "Client";
                  const userEmail = enquiry.userEmail || enquiry.user?.email || "";
                  const userPhone = enquiry.userPhone || enquiry.user?.phone || "";
                  const propTitle = enquiry.propertyTitle || enquiry.property?.title || "Property";

                  return (
                    <tr key={enqId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-gray-900 block max-w-xs truncate">
                          {propTitle}
                        </span>
                        {enquiry.propertyLocation && (
                          <span className="text-[11px] text-gray-400 block truncate">
                            📍 {enquiry.propertyLocation}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-gray-900 block">{userName}</span>
                        {userPhone && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${userPhone}`}
                              className="text-[11px] text-blue-600 font-semibold hover:underline"
                            >
                              📞 +91 {userPhone}
                            </a>
                            <a
                              href={`https://wa.me/91${userPhone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 text-xs"
                              title="WhatsApp"
                            >
                              <i className="fab fa-whatsapp"></i>
                            </a>
                          </div>
                        )}
                        {userEmail && (
                          <span className="text-[11px] text-gray-400 block truncate max-w-[160px]">
                            {userEmail}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700 max-w-xs">
                        <p className="line-clamp-2 text-xs italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                          "{enquiry.message}"
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={enquiry.status || "new"}
                          onChange={(e) => updateStatus(enqId, e.target.value)}
                          disabled={actionId === enqId}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer capitalize ${getStatusBadge(
                            enquiry.status
                          )}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {enquiry.createdAt
                          ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Today"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => deleteEnquiry(enqId)}
                          disabled={actionId === enqId}
                          className="px-2.5 py-1.5 rounded-lg text-red-500 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
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

export default ManageEnquiries;