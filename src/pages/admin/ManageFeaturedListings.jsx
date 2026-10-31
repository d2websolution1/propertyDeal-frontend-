// pages/admin/ManageFeaturedListings.jsx
import React, { useEffect, useState, useCallback } from "react";
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

const ManageFeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      // Try both routes safely
      const res = await api.get("/admin/properties/featured");
      setProperties(Array.isArray(res.data) ? res.data : res.data.properties || []);
    } catch (err) {
      try {
        const fallbackRes = await api.get("/admin/listings/featured");
        setProperties(Array.isArray(fallbackRes.data) ? fallbackRes.data : fallbackRes.data.properties || []);
      } catch (e) {
        console.error("Failed to load featured properties:", e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const removeFeatured = async (property) => {
    const propId = property.id || property._id;
    if (!window.confirm(`Remove "${property.title}" from featured listings?`)) return;
    setActionId(propId);
    try {
      await api.delete(`/admin/properties/${propId}/featured`);
      setProperties((prev) => prev.filter((p) => (p.id || p._id) !== propId));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionId(null);
    }
  };

  const filtered = properties.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.locality?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>⭐</span> Featured Property Listings
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Properties promoted on the homepage showcase with high visibility
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs max-w-xs">
          <i className="fas fa-search text-gray-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search featured properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs outline-none bg-transparent flex-1 text-gray-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-semibold">
          <i className="fas fa-spinner fa-spin text-2xl mr-2 text-amber-500"></i>
          <p className="mt-2 text-sm">Loading featured listings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-2">⭐</div>
          <h4 className="font-bold text-gray-800">No Featured Properties Found</h4>
          <p className="text-xs text-gray-400 mt-1">
            Go to <a href="/admin/properties" className="text-blue-600 font-bold underline">Manage Properties</a> to toggle properties as Featured.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Poster / Owner</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((property) => {
                  const propId = property.id || property._id;
                  const imgUrl =
                    property.images?.[0] ||
                    property.image ||
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80";

                  return (
                    <tr key={propId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={imgUrl}
                            alt={property.title}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-gray-900 line-clamp-1">
                              {property.title}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                              {property.uniqueCode || "HW-PROP"} • {property.propertyType}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {property.locality ? `${property.locality}, ` : ""}
                        {property.city}
                      </td>
                      <td className="px-5 py-3.5 font-black text-[#005744]">
                        {formatIndianPrice(property.price, property.listingType)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        <span className="font-bold text-gray-800">
                          {property.owner?.name || property.contactName || "Owner"}
                        </span>
                        {property.owner?.email && (
                          <span className="block text-[11px] text-gray-400 truncate max-w-[150px]">
                            {property.owner.email}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-black px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          ★ Featured
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => removeFeatured(property)}
                          disabled={actionId === propId}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {actionId === propId ? "Removing..." : "Remove"}
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

export default ManageFeaturedListings;