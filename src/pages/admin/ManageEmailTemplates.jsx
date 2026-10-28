import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageEmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ subject: "", body: "", isActive: true });

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/email-templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const openEdit = (template) => {
    setForm({ subject: template.subject, body: template.body, isActive: template.isActive });
    setModal({ data: template });
  };

  const save = async () => {
    try {
      await api.put(`/admin/email-templates/${modal.data.id}`, form);
      setModal(null);
      fetchTemplates();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
        <p className="text-gray-500 text-sm mt-0.5">System emails (welcome, OTP, listing status) ka content edit karein</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {templates.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs truncate max-w-[500px]">{t.subject}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                  {t.isActive ? "Active" : "Disabled"}
                </span>
                <button onClick={() => openEdit(t)} className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">{modal.data.name}</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Body (HTML supported — {"{{"}variable{"}}"} use kar sakte hain)
                </label>
                <textarea rows={8} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6] font-mono" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Active (ye email bheji jaayegi)
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

export default ManageEmailTemplates;