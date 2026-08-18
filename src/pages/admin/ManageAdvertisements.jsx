import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const EMPTY_FORM = { title: "", image: "", link: "", position: "sidebar", startDate: "", endDate: "" };

const ManageAdvertisements = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/ads");
      setAds(res.data);
    } catch (err) {
      console.error("Failed to load ads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ mode: "create" }); };
  const openEdit = (ad) => {
    setForm({
      title: ad.title, image: ad.image, link: ad.link || "",
      position: ad.position, startDate: ad.startDate || "", endDate: ad.endDate || "",
    });
    setModal({ mode: "edit", data: ad });
  };

  const save = async () => {
    if (!form.title.trim() || !form.image.trim()) {
      alert("Title aur image URL dono zaroori hain");
      return;
    }
    try {
      if (modal.mode === "create") await api.post("/admin/ads", form);
      else await api.put(`/admin/ads/${modal.data.id}`, form);
      setModal(null);
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const toggleActive = async (ad) => {
    try {
      await api.put(`/admin/ads/${ad.id}`, { isActive: !ad.isActive });
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const remove = async (ad) => {
    if (!window.confirm(`Delete "${ad.title}"?`)) return;
    try {
      await api.delete(`/admin/ads/${ad.id}`);
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Advertisements</h1>
          <p className="text-gray-500 text-sm mt-0.5">Website ke different positions par ads manage karein</p>
        </div>
        <button onClick={openCreate} className="bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          <i className="fas fa-plus mr-1.5"></i>New Ad
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : ads.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          Abhi tak koi ad nahi hai — pehla ad banayein.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="h-[120px] bg-gray-100">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-gray-800 text-sm truncate">{ad.title}</p>
                  <button
                    onClick={() => toggleActive(ad)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      ad.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {ad.isActive ? "Active" : "Hidden"}
                  </button>
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  {ad.position} · {ad.clicks} clicks
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(ad)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold py-1.5 rounded">Edit</button>
                  <button onClick={() => remove(ad)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-1.5 rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[460px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">{modal.mode === "create" ? "New Ad" : "Edit Ad"}</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Link URL (optional)</label>
                <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Position</label>
                <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]">
                  <option value="header">Header</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                  <option value="between-listings">Between Listings</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="flex-1 bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold py-2.5 rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdvertisements;