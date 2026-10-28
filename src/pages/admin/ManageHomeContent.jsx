// ManageHomeContent.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Safely returns an array of items
const getItems = (section) => {
  if (!section) return [];
  if (Array.isArray(section.items)) return section.items;
  if (typeof section.items === "string") {
    try {
      const parsed = JSON.parse(section.items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const EMPTY_ITEM_FORM = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  price: "",
  location: "",
  link: "",
  badge: "",
  ctaText: "",
  category: "",
};

const PAGE_TABS = [
  { key: "homepage", label: "🏠 Homepage" },
  { key: "rent", label: "🔑 Rent Page" },
  { key: "commercial", label: "🏢 Commercial" },
  { key: "plots", label: "🧭 Plots" },
  { key: "pg", label: "🏠 PG / Co-Living" },
  { key: "all", label: "🌐 All Sections" },
];

const ManageHomeContent = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activePageTab, setActivePageTab] = useState("homepage");
  const [expandedSections, setExpandedSections] = useState(new Set());

  // Section create/edit modal
  const [sectionModal, setSectionModal] = useState(null); // { mode: 'create' | 'edit', data }
  const [sectionForm, setSectionForm] = useState({
    sectionKey: "",
    title: "",
    subtitle: "",
    displayOrder: 0,
    page: "homepage",
  });

  // Item create/edit modal
  const [itemModal, setItemModal] = useState(null); // { sectionId, mode, itemId, sectionTitle }
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/home-sections");
      const list = res.data || [];
      setSections(list);
      // Automatically expand all sections so cards are visible immediately
      setExpandedSections(new Set(list.map((s) => s.id)));
    } catch (err) {
      console.error("Failed to load sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const toggleExpand = (id) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Sync / Restore default sections
  const handleRestoreDefaults = async () => {
    if (!window.confirm("Verify and restore all standard sections (Homepage, Rent, Commercial, Plots, PG)? Missing sections will be created automatically.")) {
      return;
    }
    setSyncing(true);
    try {
      const res = await api.post("/admin/home-sections/seed-defaults");
      alert(res.data.message || "All standard sections restored successfully!");
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  // Filter sections by page
  const visibleSections = sections.filter((s) =>
    activePageTab === "all" ? true : (s.page || "homepage") === activePageTab
  );

  // ── Section Actions ──
  const openCreateSection = () => {
    setSectionForm({
      sectionKey: "",
      title: "",
      subtitle: "",
      displayOrder: sections.length + 1,
      page: activePageTab === "all" ? "homepage" : activePageTab,
    });
    setSectionModal({ mode: "create" });
  };

  const openEditSection = (section) => {
    setSectionForm({
      sectionKey: section.sectionKey,
      title: section.title,
      subtitle: section.subtitle || "",
      displayOrder: section.displayOrder || 0,
      page: section.page || "homepage",
    });
    setSectionModal({ mode: "edit", data: section });
  };

  const saveSection = async () => {
    try {
      const formData = { ...sectionForm };
      if (!formData.page) formData.page = activePageTab === "all" ? "homepage" : activePageTab;

      if (sectionModal.mode === "create") {
        await api.post("/admin/home-sections", formData);
      } else {
        await api.put(`/admin/home-sections/${sectionModal.data.id}`, formData);
      }
      setSectionModal(null);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const toggleActive = async (section) => {
    try {
      await api.put(`/admin/home-sections/${section.id}`, { isActive: !section.isActive });
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const deleteSection = async (section) => {
    if (!window.confirm(`Delete the entire "${section.title}" section? This removes all cards inside it.`)) return;
    try {
      await api.delete(`/admin/home-sections/${section.id}`);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ── Card (Item) Actions ──
  const openAddItem = (section) => {
    setItemForm({ ...EMPTY_ITEM_FORM });
    setItemModal({ sectionId: section.id, sectionTitle: section.title, mode: "create" });
  };

  const openEditItem = (section, item) => {
    setItemForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || item.desc || "",
      image: item.image || item.img || "",
      price: item.price || "",
      location: item.location || "",
      link: item.link || "",
      badge: item.badge || item.tag || "",
      ctaText: item.ctaText || "",
      category: item.category || "",
    });
    setItemModal({
      sectionId: section.id,
      sectionTitle: section.title,
      mode: "edit",
      itemId: item.id,
    });
  };

  const saveItem = async () => {
    if (!itemForm.title.trim()) {
      alert("Card Title is required");
      return;
    }

    try {
      if (itemModal.mode === "create") {
        await api.post(`/admin/home-sections/${itemModal.sectionId}/items`, itemForm);
      } else {
        await api.put(
          `/admin/home-sections/${itemModal.sectionId}/items/${itemModal.itemId}`,
          itemForm
        );
      }
      setItemModal(null);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const deleteItem = async (sectionId, itemId) => {
    if (!window.confirm("Delete this card from this section?")) return;
    try {
      await api.delete(`/admin/home-sections/${sectionId}/items/${itemId}`);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] flex items-center gap-2">
            <span>🗂️</span> Website Content & Cards Manager
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage section titles, subtitles, and add / edit / delete cards across all website pages
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRestoreDefaults}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Ensure all standard sections are present in database"
          >
            <span>{syncing ? "🔄 Restoring..." : "⚡ Sync All Sections"}</span>
          </button>

          <button
            onClick={openCreateSection}
            className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>➕ New Section</span>
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="mb-6 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {PAGE_TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? sections.length
                : sections.filter((s) => (s.page || "homepage") === tab.key).length;

            const isActive = activePageTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActivePageTab(tab.key)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label} <span className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-2 text-xs text-gray-500">
          <button onClick={expandAll} className="hover:text-[#2563eb] font-semibold cursor-pointer">
            Expand All
          </button>
          <span>•</span>
          <button onClick={collapseAll} className="hover:text-[#2563eb] font-semibold cursor-pointer">
            Collapse All
          </button>
        </div>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-bold text-gray-500">Loading website sections & cards from MongoDB...</p>
        </div>
      ) : visibleSections.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
          <p className="text-lg font-bold text-gray-700 mb-1">No sections found for this tab</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
            Click "Sync All Sections" to automatically load all default sections with their pre-configured cards into your MongoDB Atlas database.
          </p>
          <button
            onClick={handleRestoreDefaults}
            className="px-4 py-2 bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#1d4ed8]"
          >
            ⚡ Restore Standard Sections
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {visibleSections.map((section) => {
            const items = getItems(section);
            const isExpanded = expandedSections.has(section.id);

            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-blue-200"
              >
                {/* Section Header Row */}
                <div className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40 border-b border-gray-100">
                  <div
                    onClick={() => toggleExpand(section.id)}
                    className="flex items-center gap-3 flex-1 min-w-[260px] cursor-pointer select-none"
                  >
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      {isExpanded ? "▼" : "▶"}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-[#0f172a] text-base leading-snug">
                          {section.title}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200">
                          {items.length} {items.length === 1 ? "Card" : "Cards"}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {section.page || "homepage"}
                        </span>
                      </div>
                      {section.subtitle && (
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Add Card Button (Directly visible!) */}
                    <button
                      type="button"
                      onClick={() => openAddItem(section)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>➕ Add Card</span>
                    </button>

                    {/* Active/Hidden Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleActive(section)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        section.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {section.isActive ? "Active" : "Hidden"}
                    </button>

                    {/* Edit Section Details */}
                    <button
                      type="button"
                      onClick={() => openEditSection(section)}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Edit Section Name & Page"
                    >
                      <span>✏️ Edit</span>
                    </button>

                    {/* Delete Section */}
                    <button
                      type="button"
                      onClick={() => deleteSection(section)}
                      className="w-8 h-8 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center text-xs cursor-pointer"
                      title="Delete Entire Section"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Expanded: Cards Grid */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-[#fafbfd]">
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-500 font-bold uppercase tracking-wider">
                      <span>Cards in this section:</span>
                      <button
                        type="button"
                        onClick={() => openAddItem(section)}
                        className="text-[#2563eb] hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <span>➕ Add New Card Here</span>
                      </button>
                    </div>

                    {items.length === 0 ? (
                      <div className="text-center py-8 px-4 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 mb-2">No cards exist in this section yet.</p>
                        <button
                          type="button"
                          onClick={() => openAddItem(section)}
                          className="px-3 py-1.5 bg-[#2563eb] text-white text-xs font-bold rounded-lg hover:bg-[#1d4ed8]"
                        >
                          ➕ Add First Card
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {items.map((item, idx) => {
                          const itemImg = item.image || item.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";
                          const itemBadge = item.badge || item.tag || "";
                          const itemDesc = item.description || item.desc || "";
                          const itemSubtitle = item.subtitle || item.builder || "";

                          return (
                            <div
                              key={item.id || idx}
                              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                              <div>
                                {/* Image preview */}
                                <div className="h-32 w-full bg-gray-100 relative overflow-hidden">
                                  <img
                                    src={itemImg}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  {itemBadge && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0f172a]/80 text-[#fde047] text-[10px] font-black tracking-wide uppercase backdrop-blur-xs">
                                      {itemBadge}
                                    </span>
                                  )}
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                  <h4 className="font-extrabold text-[#0f172a] text-sm leading-snug line-clamp-1" title={item.title}>
                                    {item.title}
                                  </h4>

                                  {itemSubtitle && (
                                    <p className="text-gray-500 text-xs font-medium mt-0.5 line-clamp-1">
                                      {itemSubtitle}
                                    </p>
                                  )}

                                  {item.price && (
                                    <p className="text-[#2563eb] font-black text-xs mt-1">
                                      {item.price}
                                    </p>
                                  )}

                                  {item.location && (
                                    <p className="text-gray-500 text-[11px] mt-0.5 truncate">
                                      📍 {item.location}
                                    </p>
                                  )}

                                  {itemDesc && (
                                    <p className="text-gray-500 text-[11px] mt-1 line-clamp-2">
                                      {itemDesc}
                                    </p>
                                  )}

                                  {item.link && (
                                    <p className="text-blue-500 text-[10.5px] mt-1 truncate font-mono">
                                      🔗 {item.link}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Card Actions */}
                              <div className="p-2.5 pt-0 flex items-center gap-1.5 border-t border-gray-50 bg-gray-50/50">
                                <button
                                  type="button"
                                  onClick={() => openEditItem(section, item)}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <span>✏️</span> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteItem(section.id, item.id)}
                                  className="py-1.5 px-2.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                                  title="Delete Card"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Section Create / Edit Modal */}
      {sectionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] p-6 border border-gray-100">
            <h3 className="font-extrabold text-[#0f172a] text-lg mb-4 flex items-center gap-2">
              <span>{sectionModal.mode === "create" ? "➕ Create New Section" : "✏️ Edit Section Details"}</span>
            </h3>

            <div className="space-y-3">
              {sectionModal.mode === "create" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Section Key <span className="text-rose-500">* (unique identifier, e.g. trending_villas)</span>
                  </label>
                  <input
                    value={sectionForm.sectionKey}
                    onChange={(e) =>
                      setSectionForm((f) => ({ ...f, sectionKey: e.target.value.toLowerCase().replace(/\s+/g, '_') }))
                    }
                    placeholder="e.g. trending_villas"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Section Title <span className="text-rose-500">*</span>
                </label>
                <input
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Properties to Buy in Mumbai"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Section Subtitle / Slogan
                </label>
                <input
                  value={sectionForm.subtitle}
                  onChange={(e) => setSectionForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="e.g. 7,000+ verified listings added daily directly from owners"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Page</label>
                  <select
                    value={sectionForm.page || "homepage"}
                    onChange={(e) => setSectionForm((f) => ({ ...f, page: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                  >
                    <option value="homepage">Homepage</option>
                    <option value="rent">Rent Page</option>
                    <option value="commercial">Commercial</option>
                    <option value="plots">Plots</option>
                    <option value="pg">PG / Co-Living</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={sectionForm.displayOrder}
                    onChange={(e) => setSectionForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setSectionModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-xs sm:text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSection}
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                Save Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card (Item) Add / Edit Modal */}
      {itemModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] p-6 max-h-[92vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-extrabold text-[#0f172a] text-base sm:text-lg">
                  {itemModal.mode === "create" ? "➕ Add New Card" : "✏️ Edit Card"}
                </h3>
                <p className="text-gray-400 text-xs">Section: {itemModal.sectionTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setItemModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Card Title <span className="text-rose-500">*</span>
                </label>
                <input
                  value={itemForm.title}
                  onChange={(e) => setItemForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Owner Properties or Jains Central Park"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Badge / Tag (optional)
                  </label>
                  <input
                    value={itemForm.badge}
                    onChange={(e) => setItemForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="e.g. 0% Brokerage, New Launch"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subtitle / Builder (optional)
                  </label>
                  <input
                    value={itemForm.subtitle}
                    onChange={(e) => setItemForm((f) => ({ ...f, subtitle: e.target.value }))}
                    placeholder="e.g. by Jain Constructions"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (optional)</label>
                  <input
                    value={itemForm.price}
                    onChange={(e) => setItemForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. ₹1.22 Cr - 1.42 Cr or Under ₹50 L"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location (optional)</label>
                  <input
                    value={itemForm.location}
                    onChange={(e) => setItemForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Narapally, Hyderabad"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description / Text (optional)
                </label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Direct owner deals →"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  value={itemForm.image}
                  onChange={(e) => setItemForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                />
                {itemForm.image && (
                  <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={itemForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Link URL (e.g. /commercial or /?filter=owner)
                </label>
                <input
                  value={itemForm.link}
                  onChange={(e) => setItemForm((f) => ({ ...f, link: e.target.value }))}
                  placeholder="e.g. /commercial or /?filter=owner"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setItemModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-xs sm:text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveItem}
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                {itemModal.mode === "create" ? "Add Card" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomeContent;