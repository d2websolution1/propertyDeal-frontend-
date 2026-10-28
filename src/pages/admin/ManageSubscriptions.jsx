// pages/admin/ManageSubscriptions.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "monthly",
    features: "",
    isActive: true
  });

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/subscriptions");
      setSubscriptions(res.data);
    } catch (err) {
      console.error("Failed to load subscriptions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const openCreate = () => {
    setForm({ name: "", price: "", duration: "monthly", features: "", isActive: true });
    setModal({ mode: "create" });
  };

  const openEdit = (sub) => {
    setForm({
      name: sub.name,
      price: sub.price,
      duration: sub.duration,
      features: sub.features,
      isActive: sub.isActive
    });
    setModal({ mode: "edit", data: sub });
  };

  const save = async () => {
    if (!form.name || !form.price) {
      alert("Name and price are required");
      return;
    }
    try {
      if (modal.mode === "create") {
        await api.post("/admin/subscriptions", form);
      } else {
        await api.put(`/admin/subscriptions/${modal.data.id}`, form);
      }
      setModal(null);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const toggleActive = async (sub) => {
    try {
      await api.put(`/admin/subscriptions/${sub.id}`, { isActive: !sub.isActive });
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const remove = async (sub) => {
    if (!window.confirm(`Delete "${sub.name}" plan?`)) return;
    try {
      await api.delete(`/admin/subscriptions/${sub.id}`);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          <i className="fas fa-plus mr-1.5"></i>
          New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No subscription plans yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{sub.name}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  sub.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {sub.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-3xl font-bold text-[#6C3EE6] mb-4">
                ₹{sub.price}
                <span className="text-sm font-normal text-gray-400">/{sub.duration}</span>
              </p>
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-sm text-gray-500">Features:</p>
                <ul className="mt-2 space-y-1">
                  {sub.features?.split('\n').map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <i className="fas fa-check text-[#6C3EE6] text-xs"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(sub)}
                  className={`flex-1 text-sm font-semibold py-2 rounded-lg ${
                    sub.isActive 
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {sub.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => openEdit(sub)}
                  className="px-4 py-2 text-sm font-semibold bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => remove(sub)}
                  className="px-4 py-2 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-500 rounded-lg"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">
              {modal.mode === "create" ? "New Subscription Plan" : "Edit Plan"}
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Plan Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Duration</label>
                <select
                  value={form.duration}
                  onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Features (one per line)</label>
                <textarea
                  rows={4}
                  value={form.features}
                  onChange={(e) => setForm(f => ({ ...f, features: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  placeholder="24/7 Support&#10;Unlimited Listings&#10;Featured Placement"
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

export default ManageSubscriptions;