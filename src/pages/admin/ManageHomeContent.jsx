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

// Safely returns an array of items, whether the backend sent a real array
// or a JSON-stringified array (happens if the column value got double-encoded).
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
];

const ManageHomeContent = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activePageTab, setActivePageTab] = useState("homepage"); // 'homepage' or 'rent'

  // Section create/edit modal
  const [sectionModal, setSectionModal] = useState(null); // { mode: 'create' | 'edit', data }
  const [sectionForm, setSectionForm] = useState({ 
    sectionKey: "", 
    title: "", 
    subtitle: "", 
    displayOrder: 0,
    page: "homepage" 
  });

  // Item create/edit modal
  const [itemModal, setItemModal] = useState(null); // { sectionId, mode, itemId }
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/home-sections");
      setSections(res.data);
    } catch (err) {
      console.error("Failed to load sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Filter sections by page
  const visibleSections = sections.filter((s) => (s.page || "homepage") === activePageTab);

  // ── Section actions ──
  const openCreateSection = () => {
    setSectionForm({ 
      sectionKey: "", 
      title: "", 
      subtitle: "", 
      displayOrder: sections.length,
      page: activePageTab 
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
      // Ensure page is set
      const formData = { ...sectionForm };
      if (!formData.page) formData.page = activePageTab;
      
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
    if (!window.confirm(`Delete the entire "${section.title}" section? This removes all its items too.`)) return;
    try {
      await api.delete(`/admin/home-sections/${section.id}`);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ── Item actions ──
  const openAddItem = (section) => {
    setItemForm(EMPTY_ITEM_FORM);
    setItemModal({ sectionId: section.id, mode: "create" });
  };

  const openEditItem = (section, item) => {
    setItemForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image || "",
      price: item.price || "",
      location: item.location || "",
      link: item.link || "",
      badge: item.badge || "",
      ctaText: item.ctaText || "",
      category: item.category || "",
    });
    setItemModal({ sectionId: section.id, mode: "edit", itemId: item.id });
  };

  const saveItem = async () => {
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
    if (!window.confirm("Delete this card?")) return;
    try {
      await api.delete(`/admin/home-sections/${sectionId}/items/${itemId}`);
      fetchSections();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Website Content Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage sections for the homepage, rent, commercial, plots, and PG pages from one place
          </p>
        </div>
        <button
          onClick={openCreateSection}
          className="bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex-shrink-0"
        >
          <i className="fas fa-plus mr-1.5"></i>
          New Section
        </button>
      </div>

      {/* Page Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex flex-wrap gap-1 overflow-x-auto pb-2">
          {PAGE_TABS.map((tab) => {
            const count = sections.filter((s) => (s.page || "homepage") === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActivePageTab(tab.key)}
                className={`px-4 sm:px-6 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activePageTab === tab.key
                    ? "border-[#6C3EE6] text-[#6C3EE6]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading sections...
        </div>
      ) : visibleSections.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No sections yet for this page — create your first one.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleSections.map((section) => {
            const items = getItems(section);
            return (
              <div
                key={section.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Section header row */}
                <div className="flex items-center justify-between px-5 py-4">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === section.id ? null : section.id)
                    }
                    className="flex items-center gap-3 flex-1 text-left min-w-0"
                  >
                    <i
                      className={`fas fa-chevron-right text-xs text-gray-400 transition-transform ${
                        expandedId === section.id ? "rotate-90" : ""
                      }`}
                    ></i>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">
                        {section.title}{" "}
                        <span className="text-gray-400 font-normal">
                          ({items.length} items)
                        </span>
                      </p>
                      <p className="text-gray-400 text-xs font-mono truncate">
                        {section.sectionKey}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {section.page || "homepage"}
                    </span>
                    <button
                      onClick={() => toggleActive(section)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                        section.isActive
                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {section.isActive ? "Active" : "Hidden"}
                    </button>
                    <button
                      onClick={() => openEditSection(section)}
                      className="w-8 h-8 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center"
                      aria-label="Edit section"
                    >
                      <i className="fas fa-pen text-xs"></i>
                    </button>
                    <button
                      onClick={() => deleteSection(section)}
                      className="w-8 h-8 rounded-md bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center"
                      aria-label="Delete section"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Expanded: items grid */}
                {expandedId === section.id && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Cards in this section
                      </p>
                      <button
                        onClick={() => openAddItem(section)}
                        className="text-[#6C3EE6] text-xs font-semibold hover:underline"
                      >
                        <i className="fas fa-plus mr-1"></i>
                        Add Card
                      </button>
                    </div>

                    {items.length === 0 ? (
                      <p className="text-gray-400 text-sm py-4 text-center">
                        No cards yet in this section.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="border border-gray-100 rounded-lg overflow-hidden"
                          >
                            {item.image && (
                              <div className="h-[100px] bg-gray-100">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="font-semibold text-gray-800 text-sm truncate">
                                {item.title}
                              </p>
                              {item.subtitle && (
                                <p className="text-gray-500 text-xs truncate">
                                  {item.subtitle}
                                </p>
                              )}
                              {item.price && (
                                <p className="text-[#6C3EE6] font-bold text-xs mt-1">
                                  {item.price}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              {item.category && (
                                <p className="text-[#6C3EE6] text-[11px] font-semibold mt-1 uppercase tracking-wide">
                                  {item.category}
                                </p>
                              )}
                              {item.ctaText && (
                                <p className="text-gray-500 text-[11px] mt-1">
                                  CTA: {item.ctaText}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => openEditItem(section, item)}
                                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold py-1.5 rounded"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteItem(section.id, item.id)}
                                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-1.5 rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Section modal */}
      {sectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] p-6">
            <h3 className="font-bold text-gray-800 mb-4">
              {sectionModal.mode === "create" ? "New Section" : "Edit Section"}
            </h3>

            <div className="flex flex-col gap-3">
              {sectionModal.mode === "create" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Section Key (unique, no spaces)
                  </label>
                  <input
                    value={sectionForm.sectionKey}
                    onChange={(e) =>
                      setSectionForm((f) => ({ ...f, sectionKey: e.target.value }))
                    }
                    placeholder="e.g. featured_developers"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Title
                </label>
                <input
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Featured Developers"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Subtitle
                </label>
                <input
                  value={sectionForm.subtitle}
                  onChange={(e) =>
                    setSectionForm((f) => ({ ...f, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Prominent real-estate builders"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={sectionForm.displayOrder}
                  onChange={(e) =>
                    setSectionForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Page
                </label>
                <select
                  value={sectionForm.page || "homepage"}
                  onChange={(e) =>
                    setSectionForm((f) => ({ ...f, page: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                >
                  <option value="homepage">Homepage</option>
                  <option value="rent">Rent Page</option>
                  <option value="buy">Buy Page</option>
                  <option value="commercial">Commercial Page</option>
                  <option value="pg">PG/Co-Living Page</option>
                  <option value="plots">Plots Page</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setSectionModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSection}
                className="flex-1 bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold py-2.5 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item modal */}
      {itemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">
              {itemModal.mode === "create" ? "Add Card" : "Edit Card"}
            </h3>

            <div className="flex flex-col gap-3">
              {[
                { key: "title", label: "Title" },
                { key: "subtitle", label: "Subtitle" },
                { key: "description", label: "Description" },
                { key: "image", label: "Image URL" },
                { key: "price", label: "Price (optional)" },
                { key: "location", label: "Location (optional)" },
                { key: "category", label: "Category (optional)" },
                { key: "badge", label: "Badge text (optional)" },
                { key: "ctaText", label: "Button text (optional)" },
                { key: "link", label: "Link URL (optional)" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    value={itemForm[field.key]}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setItemModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                className="flex-1 bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold py-2.5 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomeContent;