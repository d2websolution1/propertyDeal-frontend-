// pages/admin/ReportListings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const formatIndianPrice = (price, listingType) => {
  const num = Number(price);
  if (!num || isNaN(num)) return "₹ Call for Price";
  if (listingType === "rent") return `₹ ${num.toLocaleString("en-IN")}/mo`;
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  return `₹ ${num.toLocaleString("en-IN")}`;
};

const ReportListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    fetchListings();
  }, [dateRange]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/listings?range=${dateRange}`);
      setListings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>📑</span> New Listing Audit Report
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live DB ({listings.length})
            </span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Audit properties posted during specified timeframes with poster details
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
          <p className="mt-2 text-sm">Generating listing report...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-2">📋</div>
          <h4 className="font-bold text-gray-800">No properties in this period</h4>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-5 py-3.5">Poster / Role</th>
                  <th className="px-5 py-3.5">Type & Location</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((listing) => {
                  const propId = listing.id || listing._id;
                  const posterRole = listing.postedByType || listing.owner?.userType || "Owner";

                  return (
                    <tr key={propId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-gray-900 block truncate max-w-xs">
                          {listing.title}
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">
                          {listing.uniqueCode || "HW-NEW"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-gray-800 block">
                          {listing.contactName || listing.owner?.name || "Owner"}
                        </span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                          {posterRole}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        <span className="block font-semibold">{listing.propertyType || "Property"}</span>
                        <span className="text-[11px] text-gray-400">
                          {listing.locality ? `${listing.locality}, ` : ""}{listing.city}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-black text-[#005744]">
                        {formatIndianPrice(listing.price, listing.listingType)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md capitalize ${
                            listing.status === "approved"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : listing.status === "pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {listing.status || "approved"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {listing.createdAt
                          ? new Date(listing.createdAt).toLocaleDateString("en-IN", {
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

export default ReportListings;