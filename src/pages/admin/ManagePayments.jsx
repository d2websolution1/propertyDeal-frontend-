// pages/admin/ManagePayments.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = filter === "all" 
    ? payments 
    : payments.filter(p => p.status === filter);

  const getStatusBadge = (status) => {
    const colors = {
      completed: "bg-green-50 text-green-600",
      pending: "bg-yellow-50 text-yellow-600",
      failed: "bg-red-50 text-red-500",
      refunded: "bg-gray-50 text-gray-500"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage all payment transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-gray-400 text-xs uppercase">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">₹12,45,000</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-gray-400 text-xs uppercase">Completed</p>
          <p className="text-2xl font-bold text-green-600">₹9,80,000</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-gray-400 text-xs uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">₹2,15,000</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-gray-400 text-xs uppercase">Refunded</p>
          <p className="text-2xl font-bold text-red-500">₹50,000</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            filter === "all" ? "bg-[#6C3EE6] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          All ({payments.length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            filter === "completed" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("failed")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            filter === "failed" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Failed
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          No payments found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Transaction ID</th>
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">
                    #{payment.transactionId}
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <span className="font-medium text-gray-800">{payment.userName}</span>
                      <p className="text-gray-400 text-xs">{payment.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{payment.plan}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">₹{payment.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;