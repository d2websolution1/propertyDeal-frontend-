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
        console.error("Failed to load enquiries from MongoDB:", e);
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
    if (!window.confirm("Are you sure you want to permanently delete this customer enquiry from MongoDB Atlas?")) return;
    setActionId(id);
    try {
      try {
        await api.delete(`/admin/enquiries/${id}`);
      } catch (delErr) {
        if (delErr.response?.status === 404 || delErr.response?.status === 405 || !delErr.response) {
          await api.post(`/admin/enquiries/${id}/delete`);
        } else {
          throw delErr;
        }
      }
      setEnquiries((prev) => prev.filter((item) => (item.id || item._id) !== id));
    } catch (err) {
      try {
        await api.delete(`/admin/listings/enquiries/${id}`);
        setEnquiries((prev) => prev.filter((item) => (item.id || item._id) !== id));
      } catch (e) {
        alert("Failed to delete enquiry from DB");
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
      const phone = (e.userPhone || e.user?.phone || "").toLowerCase();
      return name.includes(q) || email.includes(q) || prop.includes(q) || phone.includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>💬</span> Property Enquiries & Leads
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live MongoDB
            </span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Real customer enquiries submitted from frontend property cards and helpdesk forms
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchEnquiries}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-all active:scale-95"
            title="Reload real enquiries from MongoDB"
          >
            <i className={`fas fa-sync-alt text-blue-600 ${loading ? "fa-spin" : ""}`}></i>
            <span>Refresh</span>
          </button>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {["all", "new", "contacted", "in_progress", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  statusFilter === st ? "bg-white text-gray-900 shadow-xs font-extrabold" : "text-gray-600 hover:text-gray-900"
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
              placeholder="Search by name, phone, property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs outline-none bg-transparent text-gray-700 w-40 sm:w-52"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-semibold">
          <i className="fas fa-circle-notch fa-spin text-2xl mr-2 text-[#2563eb]"></i>
          <p className="mt-2 text-xs">Loading real customer enquiries from MongoDB Atlas...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200 p-8 space-y-2">
          <div className="text-4xl mb-2">📬</div>
          <h4 className="font-bold text-gray-800 text-sm">No Enquiries Found</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {search
              ? `No inquiries match "${search}".`
              : "When prospective buyers or tenants submit inquiry forms on properties, their details will appear here live in real-time."}
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
                  const enqId = enquiry._id || enquiry.id;
                  const userName = enquiry.userName || enquiry.user?.name || "Website Visitor";
                  const userEmail = enquiry.userEmail || enquiry.user?.email || "";
                  const userPhone = enquiry.userPhone || enquiry.user?.phone || "";
                  const propTitle = enquiry.propertyTitle || enquiry.property?.title || "Direct Website Enquiry";

                  return (
                    <tr key={enqId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 max-w-[280px]">
                        <p className="font-bold text-gray-900 truncate">{propTitle}</p>
                        {enquiry.propertyLocation && (
                          <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <span>📍</span> {enquiry.propertyLocation}
                          </p>
                        )}
                        {enquiry.property?.price && (
                          <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                            ₹{Number(enquiry.property.price).toLocaleString("en-IN")}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="font-bold text-gray-900">{userName}</p>
                        {userPhone && (
                          <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                            <a
                              href={`tel:${userPhone}`}
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <i className="fas fa-phone-alt text-[9px]"></i> {userPhone}
                            </a>
                            <a
                              href={`https://wa.me/${userPhone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 font-bold hover:underline"
                            >
                              <i className="fab fa-whatsapp"></i> Chat
                            </a>
                          </div>
                        )}
                        {userEmail && (
                          <a
                            href={`mailto:${userEmail}`}
                            className="text-[11px] text-gray-400 hover:text-gray-600 block mt-0.5"
                          >
                            {userEmail}
                          </a>
                        )}
                      </td>

                      <td className="px-5 py-3.5 max-w-[320px]">
                        <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-xs text-gray-700 italic">
                          "{enquiry.message}"
                        </div>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <select
                          disabled={actionId === enqId}
                          value={enquiry.status || "new"}
                          onChange={(e) => updateStatus(enqId, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer capitalize transition-all ${getStatusBadge(
                            enquiry.status
                          )}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500">
                        {enquiry.createdAt
                          ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recent"}
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          disabled={actionId === enqId}
                          onClick={() => deleteEnquiry(enqId)}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Enquiry from MongoDB"
                        >
                          <i className={`fas ${actionId === enqId ? "fa-circle-notch fa-spin" : "fa-trash-alt"} text-xs`}></i>
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
