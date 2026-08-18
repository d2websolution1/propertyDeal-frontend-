// pages/admin/ManageEnquiries.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/enquiries");
      setEnquiries(res.data);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/enquiries/${id}`, { status });
      fetchEnquiries();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await api.delete(`/admin/enquiries/${id}`);
      fetchEnquiries();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      new: "bg-blue-50 text-blue-600",
      contacted: "bg-yellow-50 text-yellow-600",
      in_progress: "bg-purple-50 text-purple-600",
      closed: "bg-gray-50 text-gray-500"
    };
    return colors[status] || colors.new;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enquiries</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Manage all property enquiries from users
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No enquiries yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Message</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-t border-gray-100">
                  <td className="px-5 py-3">
                    <div>
                      <span className="font-medium text-gray-800">{enquiry.propertyTitle}</span>
                      <p className="text-gray-400 text-xs">{enquiry.propertyLocation}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <span className="font-medium text-gray-800">{enquiry.userName}</span>
                      <p className="text-gray-400 text-xs">{enquiry.userEmail}</p>
                      <p className="text-gray-400 text-xs">{enquiry.userPhone}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="text-[#6C3EE6] hover:underline text-sm"
                    >
                      View Message
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={enquiry.status}
                      onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 ${getStatusBadge(enquiry.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteEnquiry(enquiry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Enquiry Details</h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500">Property</label>
                <p className="text-gray-800">{selectedEnquiry.propertyTitle}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500">From</label>
                <p className="text-gray-800">{selectedEnquiry.userName}</p>
                <p className="text-gray-500 text-sm">{selectedEnquiry.userEmail}</p>
                <p className="text-gray-500 text-sm">{selectedEnquiry.userPhone}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500">Message</label>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500">Date</label>
                <p className="text-gray-500 text-sm">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  updateStatus(selectedEnquiry.id, "contacted");
                  setSelectedEnquiry(null);
                }}
                className="flex-1 bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold py-2.5 rounded-lg"
              >
                Mark as Contacted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;