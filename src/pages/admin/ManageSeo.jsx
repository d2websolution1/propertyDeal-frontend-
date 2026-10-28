import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageSeo = () => {
  const [seoList, setSeoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const fetchSeo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/seo");
      setSeoList(res.data);
    } catch (err) {
      console.error("Failed to load SEO settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  const openEdit = (seo) => {
    setForm({
      metaTitle: seo.metaTitle || "",
      metaDescription: seo.metaDescription || "",
      metaKeywords: seo.metaKeywords || "",
      ogImage: seo.ogImage || "",
      canonicalUrl: seo.canonicalUrl || "",
    });
    setModal({ data: seo });
  };

  const save = async () => {
    try {
      await api.put(`/admin/seo/${modal.data.id}`, form);
      setModal(null);
      fetchSeo();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SEO Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Har page ke liye meta title, description aur keywords set karein
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {seoList.map((seo) => (
            <div
              key={seo.id}
              className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between"
            >
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm">{seo.pageLabel}</p>
                <p className="text-gray-400 text-xs truncate max-w-[500px]">
                  {seo.metaTitle || "Meta title set nahi hai"}
                </p>
              </div>
              <button
                onClick={() => openEdit(seo)}
                className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg flex-shrink-0"
              >
                <i className="fas fa-pen mr-1.5 text-[10px]"></i>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">
              SEO — {modal.data.pageLabel}
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Title</label>
                <input
                  value={form.metaTitle}
                  onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Keywords (comma separated)</label>
                <input
                  value={form.metaKeywords}
                  onChange={(e) => setForm((f) => ({ ...f, metaKeywords: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">OG Image URL</label>
                <input
                  value={form.ogImage}
                  onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Canonical URL</label>
                <input
                  value={form.canonicalUrl}
                  onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
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

export default ManageSeo;