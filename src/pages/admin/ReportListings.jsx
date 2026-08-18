// pages/admin/ReportListings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ReportListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("week");

  useEffect(() => {
    fetchListings();
  }, [dateRange]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/listings?range=${dateRange}`);
      setListings(res.data);
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Listing Report</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track new property listings</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setDateRange("week")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            dateRange === "week" ? "bg-[#6C3EE6] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setDateRange("month")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            dateRange === "month" ? "bg-[#6C3EE6] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setDateRange("year")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            dateRange === "year" ? "bg-[#6C3EE6] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          This Year
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No new listings in this period.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-3">Owner</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-gray-800">{listing.title}</td>
                  <td className="px-5 py-3 text-gray-500">{listing.owner?.name || 'N/A'}</td>
                  <td className="px-5 py-3 text-gray-500">{listing.type}</td>
                  <td className="px-5 py-3 font-semibold text-[#6C3EE6]">₹{listing.price}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(listing.createdAt).toLocaleDateString()}
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

export default ReportListings;