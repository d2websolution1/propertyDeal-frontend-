import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const EMPTY_FORM = { title: "", content: "", metaTitle: "", metaDescription: "", isPublished: true };

const ManageCmsPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/cms");
      setPages(res.data);
    } catch (err) {
      console.error("Failed to load pages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ mode: "create" }); };
  const openEdit = (page) => {
    setForm({
      title: page.title, content: page.content,
      metaTitle: page.metaTitle || "", metaDescription: page.metaDescription || "",
      isPublished: page.isPublished,
    });
    setModal({ mode: "edit", data: page });
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title aur content dono zaroori hain");
      return;
    }
    try {
      if (modal.mode === "create") await api.post("/admin/cms", form);
      else await api.put(`/admin/cms/${modal.data.id}`, form);
      setModal(null);
      fetchPages();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const remove = async (page) => {
    if (!window.confirm(`Delete "${page.title}"?`)) return;
    try {
      await api.delete(`/admin/cms/${page.id}`);
      fetchPages();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">CMS Pages</h1>
          <p className="text-gray-500 text-sm mt-0.5">About Us, Privacy Policy, Terms jaisi static pages manage karein</p>
        </div>
        <button onClick={openCreate} className="bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          <i className="fas fa-plus mr-1.5"></i>New Page
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : pages.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          Abhi tak koi page nahi hai — pehla page banayein.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm">{page.title}</p>
                <p className="text-gray-400 text-xs font-mono">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${page.isPublished ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                  {page.isPublished ? "Published" : "Draft"}
                </span>
                <button onClick={() => openEdit(page)} className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded">Edit</button>
                <button onClick={() => remove(page)} className="bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">{modal.mode === "create" ? "New CMS Page" : "Edit CMS Page"}</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Content</label>
                <textarea rows={8} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Title</label>
                <input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Description</label>
                <textarea rows={2} value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
                Published (live site par dikhega)
              </label>
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

export default ManageCmsPages;