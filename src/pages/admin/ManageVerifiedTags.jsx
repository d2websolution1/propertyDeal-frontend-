// pages/admin/ManageVerifiedTags.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageVerifiedTags = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/properties/verified");
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load properties:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleVerified = async (property) => {
    try {
      await api.put(`/admin/properties/${property.id}/verify`, {
        isVerified: !property.isVerified
      });
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const filteredProperties = filter === "all" 
    ? properties 
    : properties.filter(p => filter === "verified" ? p.isVerified : !p.isVerified);

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Verified Property Tags</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Manage verification status of property listings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            filter === "all" ? "bg-[#6C3EE6] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          All ({properties.length})
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            filter === "verified" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Verified ({properties.filter(p => p.isVerified).length})
        </button>
        <button
          onClick={() => setFilter("unverified")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            filter === "unverified" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Unverified ({properties.filter(p => !p.isVerified).length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No properties found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-3">Owner</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
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
                      <div>
                        <span className="font-medium text-gray-800">{property.title}</span>
                        <p className="text-gray-400 text-xs">{property.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{property.owner?.name || 'N/A'}</td>
                  <td className="px-5 py-3">
                    {property.isVerified ? (
                      <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">
                        <i className="fas fa-check-circle mr-1"></i> Verified
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 text-xs font-bold px-2.5 py-1 rounded-full">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => toggleVerified(property)}
                      className={`text-sm font-medium px-3 py-1 rounded ${
                        property.isVerified 
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {property.isVerified ? "Remove Tag" : "Add Tag"}
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

export default ManageVerifiedTags;