// pages/admin/ManageNavMenus.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageNavMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("buyers"); // "buyers" | "tenants"
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New item input states
  const [newArea, setNewArea] = useState("");
  const [newBhk, setNewBhk] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [newPropType, setNewPropType] = useState({ label: "", path: "", icon: "🏢" });
  const [showAddPropModal, setShowAddPropModal] = useState(false);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/nav-menus");
      const list = res.data?.menus || [];
      setMenus(list);
    } catch (err) {
      console.error("Failed to load nav menus:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const currentMenu = menus.find((m) => m.menuKey === activeTab) || {
    menuKey: activeTab,
    title: activeTab === "buyers" ? "For Buyers" : "For Tenants",
    propertyTypes: [],
    popularAreas: [],
    searchByBHK: [],
    popularSearches: [],
  };

  const updateCurrentMenu = (updatedFields) => {
    setMenus((prev) =>
      prev.map((m) => (m.menuKey === activeTab ? { ...m, ...updatedFields } : m))
    );
  };

  const handleSaveMenu = async () => {
    if (!currentMenu) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.put(`/admin/nav-menus/${activeTab}`, currentMenu);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await fetchMenus();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save menu in DB");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Are you sure you want to reset all navigation dropdown menus to system defaults?")) return;
    setLoading(true);
    try {
      await api.post("/admin/nav-menus/reset");
      await fetchMenus();
      alert("Navigation menus restored to defaults!");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Area Handlers ──
  const handleAddArea = () => {
    const val = newArea.trim();
    if (!val) return;
    if (currentMenu.popularAreas?.includes(val)) {
      alert("Area already exists!");
      return;
    }
    updateCurrentMenu({ popularAreas: [...(currentMenu.popularAreas || []), val] });
    setNewArea("");
  };

  const handleRemoveArea = (areaToRemove) => {
    updateCurrentMenu({
      popularAreas: (currentMenu.popularAreas || []).filter((a) => a !== areaToRemove),
    });
  };

  // ── BHK Handlers ──
  const handleAddBhk = () => {
    const val = newBhk.trim();
    if (!val) return;
    if (currentMenu.searchByBHK?.includes(val)) {
      alert("BHK search query already exists!");
      return;
    }
    updateCurrentMenu({ searchByBHK: [...(currentMenu.searchByBHK || []), val] });
    setNewBhk("");
  };

  const handleRemoveBhk = (bhkToRemove) => {
    updateCurrentMenu({
      searchByBHK: (currentMenu.searchByBHK || []).filter((b) => b !== bhkToRemove),
    });
  };

  // ── Popular Searches Handlers ──
  const handleAddSearch = () => {
    const val = newSearch.trim();
    if (!val) return;
    if (currentMenu.popularSearches?.includes(val)) {
      alert("Search query already exists!");
      return;
    }
    updateCurrentMenu({ popularSearches: [...(currentMenu.popularSearches || []), val] });
    setNewSearch("");
  };

  const handleRemoveSearch = (searchToRemove) => {
    updateCurrentMenu({
      popularSearches: (currentMenu.popularSearches || []).filter((s) => s !== searchToRemove),
    });
  };

  // ── Property Types Handlers ──
  const handleAddPropType = (e) => {
    e.preventDefault();
    if (!newPropType.label || !newPropType.path) {
      alert("Label and Path are required!");
      return;
    }
    updateCurrentMenu({
      propertyTypes: [...(currentMenu.propertyTypes || []), { ...newPropType }],
    });
    setNewPropType({ label: "", path: "", icon: "🏢" });
    setShowAddPropModal(false);
  };

  const handleRemovePropType = (index) => {
    const list = [...(currentMenu.propertyTypes || [])];
    list.splice(index, 1);
    updateCurrentMenu({ propertyTypes: list });
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>🧭</span> Navbar Navigation Dropdowns
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Database
            </span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Manage Property Types, Popular Areas, BHK Filters, and Popular Searches shown in frontend header mega-menus
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <i className="fas fa-undo"></i>
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSaveMenu}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60"
          >
            <i className={`fas ${saving ? "fa-circle-notch fa-spin" : saveSuccess ? "fa-check" : "fa-save"}`}></i>
            <span>{saving ? "Saving to DB..." : saveSuccess ? "Saved Successfully!" : "Save Changes to MongoDB"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("buyers")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "buyers"
              ? "bg-[#2563eb] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <i className="fas fa-home"></i>
          <span>For Buyers Dropdown</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Mega Menu 1</span>
        </button>

        <button
          onClick={() => setActiveTab("tenants")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "tenants"
              ? "bg-[#2563eb] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <i className="fas fa-key"></i>
          <span>For Tenants Dropdown</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Mega Menu 2</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-gray-400">
          <i className="fas fa-circle-notch fa-spin text-3xl text-blue-600 mb-2"></i>
          <p className="text-xs font-semibold">Loading dropdown configurations from MongoDB...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Property Types */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>🏢</span> Property Types ({currentMenu.propertyTypes?.length || 0})
                </h3>
                <p className="text-[11px] text-gray-400">Icon, Title and navigation route link</p>
              </div>
              <button
                onClick={() => setShowAddPropModal(true)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <i className="fas fa-plus text-[10px]"></i> Add Type
              </button>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {(currentMenu.propertyTypes || []).map((pt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-2xs">
                      {pt.icon || "🏢"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{pt.label}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{pt.path}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePropType(idx)}
                    className="w-7 h-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Popular Areas */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>📍</span> Popular Areas ({currentMenu.popularAreas?.length || 0})
              </h3>
              <p className="text-[11px] text-gray-400">Top locality tags clicked by users</p>
            </div>

            {/* Add Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type area name (e.g. Andheri West, Whitefield)..."
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddArea()}
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
              >
                + Add
              </button>
            </div>

            {/* Chip List */}
            <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto">
              {(currentMenu.popularAreas || []).map((area, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-800 border border-slate-200 transition-colors"
                >
                  <span>{area}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    className="w-4 h-4 rounded-full text-slate-400 hover:text-red-600 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Column 3: Search by BHK */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>🛏️</span> Search by BHK ({currentMenu.searchByBHK?.length || 0})
              </h3>
              <p className="text-[11px] text-gray-400">Configurations for rapid one-click search</p>
            </div>

            {/* Add Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 2 BHK for Sale in Mumbai, 3 BHK Houses..."
                value={newBhk}
                onChange={(e) => setNewBhk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddBhk()}
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddBhk}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
              >
                + Add
              </button>
            </div>

            {/* Chip List */}
            <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto">
              {(currentMenu.searchByBHK || []).map((bhk, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-xs font-semibold text-blue-900 border border-blue-200 transition-colors"
                >
                  <span>{bhk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBhk(bhk)}
                    className="w-4 h-4 rounded-full text-blue-400 hover:text-red-600 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Column 4: Popular Searches */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>🔥</span> Popular Searches ({currentMenu.popularSearches?.length || 0})
              </h3>
              <p className="text-[11px] text-gray-400">Trending filters & buyer queries</p>
            </div>

            {/* Add Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Flats without brokerage, Under construction flats..."
                value={newSearch}
                onChange={(e) => setNewSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSearch()}
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddSearch}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
              >
                + Add
              </button>
            </div>

            {/* Chip List */}
            <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto">
              {(currentMenu.popularSearches || []).map((search, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-xs font-semibold text-emerald-900 border border-emerald-200 transition-colors"
                >
                  <span>{search}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSearch(search)}
                    className="w-4 h-4 rounded-full text-emerald-400 hover:text-red-600 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Property Type */}
      {showAddPropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add Property Type</h3>
              <button
                type="button"
                onClick={() => setShowAddPropModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPropType} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Emoji Icon</label>
                <input
                  type="text"
                  placeholder="🏢"
                  value={newPropType.icon}
                  onChange={(e) => setNewPropType({ ...newPropType, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Label Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio Apartments"
                  value={newPropType.label}
                  onChange={(e) => setNewPropType({ ...newPropType, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Link Path *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /?type=studio or /plots"
                  value={newPropType.path}
                  onChange={(e) => setNewPropType({ ...newPropType, path: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddPropModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  Add Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNavMenus;
