// pages/admin/ManageFeaturedListings.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageFeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/properties/featured");
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load featured properties:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleFeatured = async (property) => {
    try {
      await api.put(`/admin/properties/${property.id}/featured`, {
        isFeatured: !property.isFeatured
      });
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const removeFeatured = async (property) => {
    if (!window.confirm(`Remove "${property.title}" from featured listings?`)) return;
    try {
      await api.delete(`/admin/properties/${property.id}/featured`);
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Featured Listings</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Manage properties that appear in featured listings section
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No featured properties found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-t border-gray-100">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {property.image && (
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium text-gray-800">{property.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{property.location}</td>
                  <td className="px-5 py-3 font-semibold text-[#6C3EE6]">{property.price}</td>
                  <td className="px-5 py-3">
                    <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => removeFeatured(property)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      <i className="fas fa-star mr-1"></i> Remove
                    </button>
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

export default ManageFeaturedListings; 