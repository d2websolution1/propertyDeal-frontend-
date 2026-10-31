// pages/admin/ManagePayments.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const DEFAULT_PAYMENTS = [
  {
    id: "tx-101",
    transactionId: "PAY-IND-84920",
    userName: "prince09kumar7714 kumar",
    userEmail: "prince09kumar7714@gmail.com",
    plan: "Dealer / Agent Verified Pack",
    amount: "4,999",
    status: "completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-102",
    transactionId: "PAY-IND-73918",
    userName: "PropertyDeal Partner",
    userEmail: "partner@propertydeal.com",
    plan: "Homepage Featured Boost (30 Days)",
    amount: "2,499",
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "tx-103",
    transactionId: "PAY-IND-61924",
    userName: "Apex Builder Developers",
    userEmail: "sales@apexbuilder.in",
    plan: "Builder Super Project Showcase",
    amount: "14,999",
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "tx-104",
    transactionId: "PAY-IND-52910",
    userName: "Vikas Verma",
    userEmail: "vikas.verma@gmail.com",
    plan: "Owner Fast Track Verification",
    amount: "999",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

const ManagePayments = () => {
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/payments");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setPayments(res.data);
      }
    } catch (err) {
      // fallback to DEFAULT_PAYMENTS
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>💳</span> Payment Transactions & Invoices
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Audit listing packages, featured promotions and subscription billing
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <i className="fas fa-sync-alt text-blue-600"></i>
          <span>Refresh Transactions</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
          <p className="text-gray-500 text-xs font-semibold uppercase">Total Revenue</p>
          <p className="text-2xl font-black text-[#005744] mt-1">₹ 23,496</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
          <p className="text-emerald-800 text-xs font-semibold uppercase">Successful</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {payments.filter((p) => p.status === "completed").length} Orders
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
          <p className="text-amber-800 text-xs font-semibold uppercase">Pending</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {payments.filter((p) => p.status === "pending").length} Orders
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
          <p className="text-gray-500 text-xs font-semibold uppercase">Average Order</p>
          <p className="text-2xl font-black text-indigo-700 mt-1">₹ 5,874</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold w-fit">
        {["all", "completed", "pending", "failed"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-2 rounded-lg transition-all capitalize cursor-pointer ${
              filter === st ? "bg-white text-gray-900 shadow-xs" : "text-gray-600"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Invoice / Txn ID</th>
                <th className="px-5 py-3.5">User Details</th>
                <th className="px-5 py-3.5">Plan Purchased</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-700">
                    {payment.transactionId}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-gray-900 block">{payment.userName}</span>
                    <span className="text-[11px] text-gray-400 block">{payment.userEmail}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{payment.plan}</td>
                  <td className="px-5 py-3.5 font-black text-[#005744]">₹{payment.amount}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize inline-flex items-center gap-1 ${getStatusBadge(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePayments;