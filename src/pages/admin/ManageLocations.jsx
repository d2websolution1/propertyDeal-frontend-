// frontend/src/pages/admin/ManageLocations.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add / Edit City Modal
  const [showModal, setShowModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    state: "Rajasthan",
    areas: "",
    isPopular: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Quick Add Area to City
  const [newAreaInput, setNewAreaInput] = useState({});

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/locations");
      setLocations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setFormData({
      city: "",
      state: "Rajasthan",
      areas: "",
      isPopular: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (loc) => {
    setEditingLoc(loc);
    setFormData({
      city: loc.city,
      state: loc.state || "Rajasthan",
      areas: Array.isArray(loc.areas) ? loc.areas.join(", ") : "",
      isPopular: !!loc.isPopular,
    });
    setShowModal(true);
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!formData.city.trim()) {
      alert("City name is required");
      return;
    }

    setSubmitting(true);
    try {
      const areaList = formData.areas
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        city: formData.city.trim(),
        state: formData.state.trim(),
        areas: areaList,
        isPopular: formData.isPopular,
      };

      if (editingLoc) {
        const id = editingLoc.id || editingLoc._id;
        const res = await api.put(`/admin/locations/${id}`, payload);
        setLocations((prev) =>
          prev.map((l) => ((l.id || l._id) === id ? res.data : l))
        );
      } else {
        const res = await api.post("/admin/locations", payload);
        setLocations((prev) => [res.data, ...prev]);
      }

      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save location");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLocation = async (loc) => {
    const id = loc.id || loc._id;
    if (!window.confirm(`Delete "${loc.city}" and all its areas?`)) return;

    try {
      await api.delete(`/admin/locations/${id}`);
      setLocations((prev) => prev.filter((l) => (l.id || l._id) !== id));
    } catch (err) {
      alert("Failed to delete location");
    }
  };

  const handleQuickAddArea = async (loc) => {
    const id = loc.id || loc._id;
    const areaName = (newAreaInput[id] || "").trim();
    if (!areaName) return;

    try {
      const res = await api.post(`/admin/locations/${id}/areas`, { area: areaName });
      setLocations((prev) =>
        prev.map((l) => ((l.id || l._id) === id ? res.data : l))
      );
      setNewAreaInput({ ...newAreaInput, [id]: "" });
    } catch (err) {
      alert("Failed to add area");
    }
  };

  const handleRemoveArea = async (loc, areaToRemove) => {
    const id = loc.id || loc._id;
    const updatedAreas = loc.areas.filter((a) => a !== areaToRemove);

    try {
      const res = await api.put(`/admin/locations/${id}`, { areas: updatedAreas });
      setLocations((prev) =>
        prev.map((l) => ((l.id || l._id) === id ? res.data : l))
      );
    } catch (err) {
      alert("Failed to remove area");
    }
  };

  const filteredLocations = locations.filter((loc) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const cityMatch = loc.city?.toLowerCase().includes(q);
    const stateMatch = loc.state?.toLowerCase().includes(q);
    const areaMatch = loc.areas?.some((a) => a.toLowerCase().includes(q));
    return cityMatch || stateMatch || areaMatch;
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>📍</span> Manage Platform Locations
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Add and manage Cities, States & Area/Locality suggestions used across listings and search
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <span>＋ Add New City / Location</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md">
          <i className="fas fa-search text-gray-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search by city, state, or area/locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-xs sm:text-sm flex-1 text-gray-700 placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
          <span>Active Cities: <strong className="text-gray-900">{locations.length}</strong></span>
          <span>•</span>
          <span>Total Areas: <strong className="text-[#005744]">{locations.reduce((acc, l) => acc + (l.areas?.length || 0), 0)}</strong></span>
        </div>
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <i className="fas fa-spinner fa-spin text-2xl text-[#005744] mb-2 block"></i>
          Loading locations and area suggestions...
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-gray-400">
          <div className="text-3xl mb-2">📍</div>
          <p className="text-sm font-bold text-gray-700">No locations found</p>
          <p className="text-xs text-gray-400 mt-1">Add a city using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLocations.map((loc) => {
            const locId = loc.id || loc._id;
            const areas = loc.areas || [];

            return (
              <div
                key={locId}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* City Title and Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-gray-900">{loc.city}</h3>
                        {loc.isPopular && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                            ★ Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{loc.state || "India"}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(loc)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        title="Edit City"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(loc)}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        title="Delete City"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>

                  {/* Areas Count */}
                  <div className="text-xs font-bold text-gray-600 mb-2.5 flex items-center justify-between">
                    <span>Suggested Areas & Localities ({areas.length}):</span>
                  </div>

                  {/* Areas Tags List */}
                  <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto custom-scrollbar p-1 bg-gray-50/60 rounded-xl border border-gray-100 mb-3">
                    {areas.length === 0 ? (
                      <span className="text-[11px] text-gray-400 italic p-1">No areas added yet.</span>
                    ) : (
                      areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-gray-800 border border-gray-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs group"
                        >
                          <span>{area}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveArea(loc, area)}
                            className="text-gray-400 hover:text-red-500 font-bold transition-colors text-xs leading-none"
                            title="Remove area"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Add Area Form */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Add area to ${loc.city}...`}
                      value={newAreaInput[locId] || ""}
                      onChange={(e) =>
                        setNewAreaInput({ ...newAreaInput, [locId]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleQuickAddArea(loc);
                        }
                      }}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#005744] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuickAddArea(loc)}
                      className="px-3 py-1.5 rounded-xl bg-[#005744] text-white text-xs font-bold hover:bg-[#004737] cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT CITY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="text-lg font-black text-gray-900">
                {editingLoc ? `Edit City: ${editingLoc.city}` : "Add New City / Location"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Kota, Udaipur, Jodhpur"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm outline-none focus:border-[#005744]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajasthan, Delhi, Uttar Pradesh"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm outline-none focus:border-[#005744]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Areas / Localities (comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Mansarovar, Vaishali Nagar, Jagatpura, Malviya Nagar, Tonk Road"
                  value={formData.areas}
                  onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm outline-none focus:border-[#005744] resize-none"
                ></textarea>
                <p className="text-[11px] text-gray-400 mt-1">
                  Separate multiple areas with commas. These will automatically appear as suggestions!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded text-[#005744] focus:ring-[#005744] w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as Popular City (Shown in top navigation & quick filters)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-extrabold shadow-md cursor-pointer disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editingLoc ? "Update City" : "Add City & Areas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLocations;

