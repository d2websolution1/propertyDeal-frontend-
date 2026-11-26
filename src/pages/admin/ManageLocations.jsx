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
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("locations"); // "locations" or "authorities"

  // Add / Edit City Modal
  const [showModal, setShowModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    state: "Rajasthan",
    areas: "",
    townships: "",
    subAreas: "",
    isPopular: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Quick inputs per city
  const [newAreaInput, setNewAreaInput] = useState({});
  const [newTownshipInput, setNewTownshipInput] = useState({});
  const [newSubAreaInput, setNewSubAreaInput] = useState({});

  // Quick authority input
  const [newAuthInput, setNewAuthInput] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);

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

  const fetchAuthorities = useCallback(async () => {
    setLoadingAuth(true);
    try {
      const res = await api.get("/authorities");
      setAuthorities(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch authorities:", err);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
    fetchAuthorities();
  }, [fetchLocations, fetchAuthorities]);

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setFormData({
      city: "",
      state: "Rajasthan",
      areas: "",
      townships: "",
      subAreas: "",
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
      townships: Array.isArray(loc.townships) ? loc.townships.join(", ") : "",
      subAreas: Array.isArray(loc.subAreas) ? loc.subAreas.join(", ") : "",
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

      const townshipList = formData.townships
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const subAreaList = formData.subAreas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        city: formData.city.trim(),
        state: formData.state.trim(),
        areas: areaList,
        townships: townshipList,
        subAreas: subAreaList,
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
    if (!window.confirm(`Delete "${loc.city}" and all its areas/townships?`)) return;

    try {
      await api.delete(`/admin/locations/${id}`);
      setLocations((prev) => prev.filter((l) => (l.id || l._id) !== id));
    } catch (err) {
      alert("Failed to delete location");
    }
  };

  // Quick Area Handlers
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
    const updatedAreas = (loc.areas || []).filter((a) => a !== areaToRemove);

    try {
      const res = await api.put(`/admin/locations/${id}`, { areas: updatedAreas });
      setLocations((prev) =>
        prev.map((l) => ((l.id || l._id) === id ? res.data : l))
      );
    } catch (err) {
      alert("Failed to remove area");
    }
  };

  // Quick Township Handlers
  const handleQuickAddTownship = async (loc) => {
    const id = loc.id || loc._id;
    const townshipName = (newTownshipInput[id] || "").trim();
    if (!townshipName) return;

    try {
      const res = await api.post(`/admin/locations/${id}/townships`, { township: townshipName });
      setLocations((prev) =>
        prev.map((l) => ((l.id || l._id) === id ? res.data : l))
      );
      setNewTownshipInput({ ...newTownshipInput, [id]: "" });
    } catch (err) {
      alert("Failed to add township");
    }
  };

  const handleRemoveTownship = async (loc, townshipToRemove) => {
    const id = loc.id || loc._id;
    const updatedTownships = (loc.townships || []).filter((t) => t !== townshipToRemove);

    try {
      const res = await api.put(`/admin/locations/${id}`, { townships: updatedTownships });
      setLocations((prev) =>
        prev.map((l) => ((l.id || l._id) === id ? res.data : l))
      );
    } catch (err) {
      alert("Failed to remove township");
    }
  };

  // Quick SubArea Handlers
  const handleQuickAddSubArea = async (loc) => {
    const id = loc.id || loc._id;
    const subAreaName = (newSubAreaInput[id] || "").trim();
    if (!subAreaName) return;

    try {
      const res = await api.post(`/admin/locations/${id}/subareas`, { subArea: subAreaName });
      setLocations((prev) =>
        prev.map((l) => ((l.id || l._id) === id ? res.data : l))
      );
      setNewSubAreaInput({ ...newSubAreaInput, [id]: "" });
    } catch (err) {
      alert("Failed to add sub-area");
    }
  };

  const handleRemoveSubArea = async (loc, subAreaToRemove) => {
    const id = loc.id || loc._id;
    const updatedSubAreas = (loc.subAreas || []).filter((s) => s !== subAreaToRemove);

    try {
      const res = await api.put(`/admin/locations/${id}`, { subAreas: updatedSubAreas });
      setLocations((prev) =>
        prev.map((l) => ((l.id || l._id) === id ? res.data : l))
      );
    } catch (err) {
      alert("Failed to remove sub-area");
    }
  };

  // Authority Handlers
  const handleAddAuthority = async (e) => {
    if (e) e.preventDefault();
    if (!newAuthInput.trim()) return;

    setSubmittingAuth(true);
    try {
      const res = await api.post("/authorities", { name: newAuthInput.trim() });
      if (res.data?.authority) {
        setAuthorities((prev) => [...prev, res.data.authority]);
        setNewAuthInput("");
      } else {
        fetchAuthorities();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add authority");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleDeleteAuthority = async (authId) => {
    if (!window.confirm("Remove this recognized authority?")) return;
    try {
      await api.delete(`/authorities/${authId}`);
      setAuthorities((prev) => prev.filter((a) => (a.id || a._id) !== authId));
    } catch (err) {
      alert("Failed to delete authority");
    }
  };

  const filteredLocations = locations.filter((loc) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const cityMatch = loc.city?.toLowerCase().includes(q);
    const stateMatch = loc.state?.toLowerCase().includes(q);
    const areaMatch = loc.areas?.some((a) => a.toLowerCase().includes(q));
    const townshipMatch = loc.townships?.some((t) => t.toLowerCase().includes(q));
    const subAreaMatch = loc.subAreas?.some((s) => s.toLowerCase().includes(q));
    return cityMatch || stateMatch || areaMatch || townshipMatch || subAreaMatch;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>📍</span> Manage Platform Locations & Recognition
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Manage Cities, Localities, Townships / Projects, Sub Areas / Blocks, and Recognized Authorities in real time
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("authorities")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "authorities"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            🏛️ Authorities ({authorities.length})
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "locations"
                ? "bg-[#005744] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            📍 Cities & Townships ({locations.length})
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>＋ Add New City</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: AUTHORITIES MANAGEMENT ── */}
      {activeTab === "authorities" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <span>🏛️</span> Property Approved / Recognised Authorities (Optional)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                These authorities appear dynamically in the Post Property & Edit Property form dropdown in real time.
              </p>
            </div>

            {/* Quick Add Authority */}
            <form onSubmit={handleAddAuthority} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. JDA, DDA, Collector Approved..."
                value={newAuthInput}
                onChange={(e) => setNewAuthInput(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-emerald-600 focus:bg-white w-64"
              />
              <button
                type="submit"
                disabled={submittingAuth || !newAuthInput.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingAuth ? "Adding..." : "+ Add Authority"}
              </button>
            </form>
          </div>

          {loadingAuth ? (
            <div className="py-12 text-center text-gray-400 text-xs">Loading recognized authorities...</div>
          ) : authorities.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">No authorities registered yet. Add one above.</div>
          ) : (
            <div className="flex flex-wrap gap-2.5 pt-2">
              {authorities.map((auth) => {
                const aId = auth.id || auth._id;
                return (
                  <span
                    key={aId}
                    className="bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-2xs"
                  >
                    <span>🏛️ {auth.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAuthority(aId)}
                      className="text-emerald-500 hover:text-red-600 font-bold transition-colors text-sm leading-none cursor-pointer"
                      title="Delete Authority"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: LOCATIONS, TOWNSHIPS & SUBAREAS ── */}
      {activeTab === "locations" && (
        <>
          {/* Search & Stats Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md">
              <i className="fas fa-search text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search city, area, township/project or block..."
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

            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 flex-wrap">
              <span>Cities: <strong className="text-gray-900">{locations.length}</strong></span>
              <span>•</span>
              <span>Areas: <strong className="text-[#005744]">{locations.reduce((acc, l) => acc + (l.areas?.length || 0), 0)}</strong></span>
              <span>•</span>
              <span>Townships: <strong className="text-blue-600">{locations.reduce((acc, l) => acc + (l.townships?.length || 0), 0)}</strong></span>
              <span>•</span>
              <span>Sub Areas: <strong className="text-amber-600">{locations.reduce((acc, l) => acc + (l.subAreas?.length || 0), 0)}</strong></span>
            </div>
          </div>

          {/* Locations Grid */}
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <i className="fas fa-spinner fa-spin text-2xl text-[#005744] mb-2 block"></i>
              Loading locations, townships and sub-areas...
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
                const townships = loc.townships || [];
                const subAreas = loc.subAreas || [];

                return (
                  <div
                    key={locId}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
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
                            title="Edit City & All Data"
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

                      {/* 1. SECTION: AREAS & LOCALITIES */}
                      <div className="mb-3">
                        <div className="text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                          <span>📍 Areas / Localities ({areas.length}):</span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar p-1.5 bg-gray-50 rounded-xl border border-gray-100">
                          {areas.length === 0 ? (
                            <span className="text-[10px] text-gray-400 italic">No areas added.</span>
                          ) : (
                            areas.map((area, idx) => (
                              <span
                                key={idx}
                                className="bg-white text-gray-800 border border-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                              >
                                <span>{area}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveArea(loc, area)}
                                  className="text-gray-400 hover:text-red-500 font-bold text-[10px]"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <input
                            type="text"
                            placeholder="Add area..."
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
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#005744] focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickAddArea(loc)}
                            className="px-2.5 py-1 rounded-lg bg-[#005744] text-white text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* 2. SECTION: TOWNSHIPS / APARTMENTS / PROJECTS */}
                      <div className="mb-3">
                        <div className="text-xs font-bold text-blue-800 mb-1.5 flex items-center justify-between">
                          <span>🏢 Townships / Projects ({townships.length}):</span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar p-1.5 bg-blue-50/40 rounded-xl border border-blue-100">
                          {townships.length === 0 ? (
                            <span className="text-[10px] text-blue-400 italic">No townships added.</span>
                          ) : (
                            townships.map((tName, idx) => (
                              <span
                                key={idx}
                                className="bg-white text-blue-900 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                              >
                                <span>{tName}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTownship(loc, tName)}
                                  className="text-blue-400 hover:text-red-500 font-bold text-[10px]"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <input
                            type="text"
                            placeholder="Add township/project..."
                            value={newTownshipInput[locId] || ""}
                            onChange={(e) =>
                              setNewTownshipInput({ ...newTownshipInput, [locId]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleQuickAddTownship(loc);
                              }
                            }}
                            className="flex-1 bg-blue-50/30 border border-blue-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-blue-600 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickAddTownship(loc)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* 3. SECTION: SUB AREAS / BLOCKS / SECTORS */}
                      <div>
                        <div className="text-xs font-bold text-amber-800 mb-1.5 flex items-center justify-between">
                          <span>🧱 Sub Areas / Blocks / Sectors ({subAreas.length}):</span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar p-1.5 bg-amber-50/40 rounded-xl border border-amber-100">
                          {subAreas.length === 0 ? (
                            <span className="text-[10px] text-amber-500 italic">No sub-areas added.</span>
                          ) : (
                            subAreas.map((sName, idx) => (
                              <span
                                key={idx}
                                className="bg-white text-amber-900 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                              >
                                <span>{sName}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSubArea(loc, sName)}
                                  className="text-amber-500 hover:text-red-500 font-bold text-[10px]"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <input
                            type="text"
                            placeholder="Add sub-area/block..."
                            value={newSubAreaInput[locId] || ""}
                            onChange={(e) =>
                              setNewSubAreaInput({ ...newSubAreaInput, [locId]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleQuickAddSubArea(loc);
                              }
                            }}
                            className="flex-1 bg-amber-50/30 border border-amber-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-amber-600 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickAddSubArea(loc)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CREATE / EDIT CITY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 p-4 sm:p-6 max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 duration-150">
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
                  placeholder="e.g. Jaipur, Ghaziabad, Noida, Delhi NCR"
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
                  placeholder="e.g. Rajasthan, Uttar Pradesh, Delhi"
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
                  rows={2}
                  placeholder="e.g. Mansarovar, Vaishali Nagar, Jagatpura, Malviya Nagar"
                  value={formData.areas}
                  onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm outline-none focus:border-[#005744] resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-800 mb-1">
                  Townships / Apartments / Projects (comma separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mahima Panorama, Vatika Infotech, Ashiana Town, Omaxe City"
                  value={formData.townships}
                  onChange={(e) => setFormData({ ...formData, townships: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 text-xs sm:text-sm outline-none focus:border-blue-600 resize-none bg-blue-50/20"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-800 mb-1">
                  Sub Areas / Blocks / Sectors (comma separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Block A, Block B, Phase 1, Sector 62, Extension"
                  value={formData.subAreas}
                  onChange={(e) => setFormData({ ...formData, subAreas: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 text-xs sm:text-sm outline-none focus:border-amber-600 resize-none bg-amber-50/20"
                ></textarea>
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
                  {submitting ? "Saving..." : editingLoc ? "Update City & Data" : "Add City & Data"}
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
