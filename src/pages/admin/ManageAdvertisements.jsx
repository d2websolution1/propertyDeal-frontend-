import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const EMPTY_FORM = { title: "", image: "", link: "", position: "header", startDate: "", endDate: "" };

const ManageAdvertisements = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/ads");
      setAds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load ads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "create" });
  };

  const openEdit = (ad) => {
    setForm({
      title: ad.title || "",
      image: ad.image || "",
      link: ad.link || "",
      position: ad.position || "header",
      startDate: ad.startDate ? ad.startDate.slice(0, 10) : "",
      endDate: ad.endDate ? ad.endDate.slice(0, 10) : "",
    });
    setModal({ mode: "edit", data: ad });
  };

  // Handle local file upload (converts to base64 data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Kripya ek valid image file chunein (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Image size 8MB se kam hona chahiye");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (saving) return; // Prevent double click
    if (!form.title.trim()) {
      alert("Ad ka title zaroori hai");
      return;
    }
    if (!form.image.trim()) {
      alert("Ad ki image upload karein ya image URL daalein");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        image: form.image.trim(),
        link: form.link.trim(),
        position: form.position || "header",
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      if (modal.mode === "create") {
        await api.post("/admin/ads", payload);
      } else {
        const adId = modal.data._id || modal.data.id;
        await api.put(`/admin/ads/${adId}`, payload);
      }
      setModal(null);
      await fetchAds();
    } catch (err) {
      alert(err.response?.data?.message || "Ad save karne me error aaya");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (ad) => {
    try {
      const adId = ad._id || ad.id;
      await api.put(`/admin/ads/${adId}`, { isActive: !ad.isActive });
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const remove = async (ad) => {
    if (!window.confirm(`Kya aap "${ad.title}" ad ko delete karna chahte hain?`)) return;
    try {
      const adId = ad._id || ad.id;
      await api.delete(`/admin/ads/${adId}`);
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // One-click duplicate cleanup
  const cleanDuplicates = async () => {
    if (!window.confirm("Duplicate ads delete karein (har duplicate ad ki sirf 1 original copy bachegi)?")) return;
    try {
      const seen = new Set();
      const duplicatesToDelete = [];
      for (const ad of ads) {
        const key = `${(ad.title || "").trim().toLowerCase()}::${ad.position}`;
        if (seen.has(key)) {
          duplicatesToDelete.push(ad._id || ad.id);
        } else {
          seen.add(key);
        }
      }

      if (duplicatesToDelete.length === 0) {
        alert("Koi duplicate ad nahi mila!");
        return;
      }

      for (const id of duplicatesToDelete) {
        await api.delete(`/admin/ads/${id}`).catch(() => {});
      }
      alert(`${duplicatesToDelete.length} duplicate ads successfully delete ho gaye!`);
      fetchAds();
    } catch (err) {
      alert("Duplicates delete karne me error aaya");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header Bar */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📢</span>
            <span>Advertisements & Sponsored Banners</span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Website ke header, between-listings aur sidebar positions par ads live manage karein
          </p>
        </div>
        <div className="flex items-center gap-2">
          {ads.length > 1 && (
            <button
              onClick={cleanDuplicates}
              className="bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-700 text-xs font-bold px-3 py-2.5 rounded-lg border border-amber-300 transition-colors cursor-pointer"
              title="Remove accidental duplicate entries"
            >
              <i className="fas fa-trash-alt mr-1"></i>Clean Duplicates
            </button>
          )}
          <button
            onClick={openCreate}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <i className="fas fa-plus"></i>
            <span>New Ad</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading advertisements...</div>
      ) : ads.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
          <p className="text-lg font-bold text-gray-700 mb-1">Abhi tak koi advertisement live nahi hai</p>
          <p className="text-xs text-gray-400 mb-4">Pehla sponsored ad banakar website par live karein.</p>
          <button
            onClick={openCreate}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-4 py-2 rounded-lg"
          >
            + Create First Ad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ads.map((ad) => {
            const adId = ad._id || ad.id;
            return (
              <div
                key={adId}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image Banner */}
                <div className="h-[140px] bg-slate-100 relative overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {ad.position || "header"}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-bold text-gray-900 text-sm truncate" title={ad.title}>
                        {ad.title}
                      </p>
                      <button
                        onClick={() => toggleActive(ad)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ml-2 transition-colors cursor-pointer ${
                          ad.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {ad.isActive ? "Active (Live)" : "Hidden"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Position: <strong className="text-gray-700 capitalize">{ad.position}</strong></span>
                      <span>📊 <strong>{ad.clicks || 0}</strong> clicks</span>
                    </div>

                    {ad.link && (
                      <p className="text-[11px] text-blue-600 truncate mb-3 bg-blue-50/50 p-1.5 rounded-lg border border-blue-100">
                        🔗 {ad.link}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openEdit(ad)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer border border-gray-200"
                    >
                      <i className="fas fa-edit mr-1 text-gray-500"></i>Edit
                    </button>
                    <button
                      onClick={() => remove(ad)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer border border-red-200"
                    >
                      <i className="fas fa-trash-alt mr-1 text-red-500"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog for Create & Edit */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-gray-900 text-base">
                {modal.mode === "create" ? "📢 Add New Advertisement" : "✏️ Edit Advertisement"}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ad Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream City Luxury Residences"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Image Input: File Upload OR URL */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Banner Image * (Upload File or Enter URL)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition-colors cursor-pointer text-center"
                  >
                    <i className="fas fa-upload mr-1.5"></i>Upload from Computer
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Or paste Direct Image URL (https://...)"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />

                {/* Live Image Preview */}
                {form.image && (
                  <div className="mt-2.5 p-2 border border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Preview:</p>
                    <div className="h-32 rounded-lg overflow-hidden bg-white border border-gray-200">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Link URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com or /post-property"
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Position on Website</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-600 bg-white"
                >
                  <option value="header">Header (Top under search / banner)</option>
                  <option value="between-listings">Between Listings (High visibility)</option>
                  <option value="sidebar">Sidebar / Middle Banner</option>
                  <option value="footer">Footer Banner</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Date (Optional)</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModal(null)}
                disabled={saving}
                className="flex-1 border border-gray-300 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className={`flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
                  saving ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Saving Ad...</span>
                  </>
                ) : (
                  <span>{modal.mode === "create" ? "Save & Publish" : "Update Ad"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdvertisements;
