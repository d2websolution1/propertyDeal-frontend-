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

const EMPTY_PAYMENT_FORM = {
  userName: "",
  userEmail: "",
  userPhone: "",
  userType: "Owner",
  plan: "Owner Fast-Track Verified",
  amount: "999",
  paymentMethod: "UPI",
  status: "completed",
  notes: "",
};

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState(EMPTY_PAYMENT_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/payments");
      const list = res.data?.payments || (Array.isArray(res.data) ? res.data : []);
      setPayments(list);
    } catch (err) {
      console.error("Failed to fetch payments from DB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Real-time calculations directly from loaded database records
  const completedPayments = payments.filter((p) => p.status === "completed");
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const failedPayments = payments.filter((p) => p.status === "failed");
  const refundedPayments = payments.filter((p) => p.status === "refunded");

  const totalRevenue = completedPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );
  const pendingAmount = pendingPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );
  const refundedAmount = refundedPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const averageOrder =
    completedPayments.length > 0
      ? Math.round(totalRevenue / completedPayments.length)
      : 0;

  // Filtered payments by tab & search query
  const filteredPayments = payments.filter((payment) => {
    const matchesFilter = filter === "all" ? true : payment.status === filter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      payment.transactionId?.toLowerCase().includes(q) ||
      payment.userName?.toLowerCase().includes(q) ||
      payment.userEmail?.toLowerCase().includes(q) ||
      payment.plan?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!newPayment.userName || !newPayment.userEmail || !newPayment.amount) {
      alert("Name, email and amount are required!");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/admin/payments", {
        ...newPayment,
        amount: Number(newPayment.amount),
      });
      setIsModalOpen(false);
      setNewPayment(EMPTY_PAYMENT_FORM);
      await fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record payment in DB");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>💳</span> Real-Time Payments & Invoices
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live MongoDB
            </span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Real database audit records for listing packages, verified tags, and subscriptions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-xs cursor-pointer inline-flex items-center gap-2 transition-all active:scale-95"
          >
            <i className="fas fa-plus"></i>
            <span>Record New Payment</span>
          </button>
          <button
            onClick={fetchPayments}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer inline-flex items-center gap-2 transition-all active:scale-95"
            title="Reload from MongoDB"
          >
            <i className={`fas fa-sync-alt text-blue-600 ${loading ? "fa-spin" : ""}`}></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats - 100% Calculated from Live Database */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
              ₹
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#005744] mt-2">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Calculated from completed transactions</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider">Completed</p>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
              <i className="fas fa-check-circle"></i>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
            {completedPayments.length}{" "}
            <span className="text-sm font-bold text-gray-400">
              (₹{totalRevenue.toLocaleString("en-IN")})
            </span>
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Paid & active packages in DB</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-amber-800 text-xs font-bold uppercase tracking-wider">Pending</p>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
              <i className="fas fa-clock"></i>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">
            {pendingPayments.length}{" "}
            <span className="text-sm font-bold text-gray-400">
              (₹{pendingAmount.toLocaleString("en-IN")})
            </span>
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Awaiting bank/UPI settlement</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-indigo-800 text-xs font-bold uppercase tracking-wider">Average Ticket</p>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
              <i className="fas fa-chart-line"></i>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-700 mt-2">
            ₹{averageOrder.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Per completed client order</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold w-fit overflow-x-auto max-w-full">
          {[
            { key: "all", label: `All (${payments.length})` },
            { key: "completed", label: `Completed (${completedPayments.length})` },
            { key: "pending", label: `Pending (${pendingPayments.length})` },
            { key: "failed", label: `Failed (${failedPayments.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-2 rounded-lg transition-all capitalize cursor-pointer whitespace-nowrap ${
                filter === tab.key ? "bg-white text-gray-900 shadow-xs font-extrabold" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search Txn ID, name, email, plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#2563eb] bg-white shadow-2xs"
          />
          <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <i className="fas fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
            <p className="text-xs font-semibold">Loading real transactions from MongoDB...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-lg">
              <i className="fas fa-receipt"></i>
            </div>
            <p className="text-sm font-bold text-gray-700">No payment records found</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {search
                ? `No transactions matched "${search}".`
                : "No payments recorded under this filter yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Invoice / Txn ID</th>
                  <th className="px-5 py-3.5">User & Contact</th>
                  <th className="px-5 py-3.5">User Role</th>
                  <th className="px-5 py-3.5">Plan / Description</th>
                  <th className="px-5 py-3.5">Method</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id || payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-700">
                      {payment.transactionId}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-900 block">{payment.userName}</span>
                      <span className="text-[11px] text-gray-500 block">{payment.userEmail}</span>
                      {payment.userPhone && (
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${payment.userPhone}`}
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <i className="fas fa-phone-alt text-[9px]"></i> {payment.userPhone}
                          </a>
                          <a
                            href={`https://wa.me/${payment.userPhone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-600 hover:underline font-bold"
                          >
                            <i className="fab fa-whatsapp"></i> Chat
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {payment.userType || "Owner"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-800 block">{payment.plan}</span>
                      {payment.propertyTitle && (
                        <span className="text-[10px] text-gray-400 truncate max-w-[200px] block">
                          Listing: {payment.propertyTitle}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 inline-flex items-center gap-1.5">
                        <i className="fas fa-wallet text-[10px] text-gray-500"></i>
                        {payment.paymentMethod || "UPI"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-black text-sm text-[#005744]">
                      ₹{(Number(payment.amount) || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusBadge(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Record New Payment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>📝</span> Record Manual Payment Transaction
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newPayment.userName}
                    onChange={(e) => setNewPayment({ ...newPayment, userName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@gmail.com"
                    value={newPayment.userEmail}
                    onChange={(e) => setNewPayment({ ...newPayment, userEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={newPayment.userPhone}
                    onChange={(e) => setNewPayment({ ...newPayment, userPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">User Role</label>
                  <select
                    value={newPayment.userType}
                    onChange={(e) => setNewPayment({ ...newPayment, userType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb] bg-white"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Dealer / Agent">Dealer / Agent</option>
                    <option value="Builder">Builder</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Plan / Package</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dealer Pro Boost"
                    value={newPayment.plan}
                    onChange={(e) => setNewPayment({ ...newPayment, plan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="999"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={newPayment.paymentMethod}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb] bg-white"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="Razorpay">Razorpay Gateway</option>
                    <option value="NetBanking">Net Banking</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Offline / Cash">Offline / Cash Deposit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb] bg-white"
                  >
                    <option value="completed">Completed (Paid)</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notes / Remarks</label>
                <textarea
                  rows="2"
                  placeholder="Optional internal remark or invoice reference"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#2563eb]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Saving to DB..." : "Save Record in MongoDB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;