import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const PAGE_OPTIONS = ["all", "homepage", "rent", "buy", "commercial", "plots", "pg"];
const EMPTY_FORM = { title: "", image: "", link: "", showOnPages: ["homepage"], delaySeconds: 3, startDate: "", endDate: "" };

const ManageBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ mode: "create" }); };
  const openEdit = (b) => {
    setForm({
      title: b.title, image: b.image, link: b.link || "",
      showOnPages: b.showOnPages || ["homepage"], delaySeconds: b.delaySeconds,
      startDate: b.startDate || "", endDate: b.endDate || "",
    });
    setModal({ mode: "edit", data: b });
  };

  const togglePage = (page) => {
    setForm((f) => {
      const exists = f.showOnPages.includes(page);
      return { ...f, showOnPages: exists ? f.showOnPages.filter((p) => p !== page) : [...f.showOnPages, page] };
    });
  };

  const save = async () => {
    if (!form.title.trim() || !form.image.trim()) {
      alert("Title aur image URL dono zaroori hain");
      return;
    }
    try {
      if (modal.mode === "create") await api.post("/admin/banners", form);
      else await api.put(`/admin/banners/${modal.data.id}`, form);
      setModal(null);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const toggleActive = async (b) => {
    try {
      await api.put(`/admin/banners/${b.id}`, { isActive: !b.isActive });
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete "${b.title}"?`)) return;
    try {
      await api.delete(`/admin/banners/${b.id}`);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pop-up Banners</h1>
          <p className="text-gray-500 text-sm mt-0.5">Site load hote hi dikhne wale promotional pop-ups manage karein</p>
        </div>
        <button onClick={openCreate} className="bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          <i className="fas fa-plus mr-1.5"></i>New Banner
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          Abhi tak koi banner nahi hai — pehla banner banayein.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="h-[120px] bg-gray-100">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-gray-800 text-sm truncate">{b.title}</p>
                  <button
                    onClick={() => toggleActive(b)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${b.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {b.isActive ? "Active" : "Hidden"}
                  </button>
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  {(b.showOnPages || []).join(", ")} · {b.delaySeconds}s delay
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(b)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold py-1.5 rounded">Edit</button>
                  <button onClick={() => remove(b)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-1.5 rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">{modal.mode === "create" ? "New Banner" : "Edit Banner"}</h3>
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
                <label className="block text-xs font-semibold text-gray-600 mb-1">Show On Pages</label>
                <div className="flex flex-wrap gap-2">
                  {PAGE_OPTIONS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePage(p)}
                      className={`text-xs px-3 py-1.5 rounded-full border ${
                        form.showOnPages.includes(p) ? "bg-[#6C3EE6] text-white border-[#6C3EE6]" : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Delay (seconds before showing)</label>
                <input type="number" value={form.delaySeconds} onChange={(e) => setForm((f) => ({ ...f, delaySeconds: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
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

export default ManageBanners;