import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AUDIENCE_OPTIONS = [
  { value: "all", label: "Saare Users" },
  { value: "blocked", label: "Blocked Users" },
];

const BulkMessaging = () => {
  const [channel, setChannel] = useState("email");
  const [audience, setAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [previewCount, setPreviewCount] = useState(null);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get("/admin/bulk-messaging/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.get(`/admin/bulk-messaging/audience-preview?audience=${audience}`);
        setPreviewCount(res.data.count);
      } catch (err) {
        setPreviewCount(null);
      }
    };
    fetchPreview();
  }, [audience]);

  const send = async () => {
    if (!message.trim()) {
      alert("Message likhna zaroori hai");
      return;
    }
    if (channel === "email" && !subject.trim()) {
      alert("Email ke liye subject zaroori hai");
      return;
    }
    if (!window.confirm(`${previewCount ?? "?"} logo ko ${channel} bhejna hai — confirm karein?`)) return;

    setSending(true);
    try {
      const res = await api.post("/admin/bulk-messaging/send", { channel, audience, subject, message });
      alert(res.data.message);
      setMessage("");
      setSubject("");
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bulk WhatsApp / SMS / Email</h1>
        <p className="text-gray-500 text-sm mt-0.5">Users ko ek saath message bhejein</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex gap-2 mb-4">
          {["whatsapp", "sms", "email"].map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${
                channel === c ? "bg-[#6C3EE6] text-white" : "bg-gray-50 text-gray-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]">
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {previewCount !== null && (
              <p className="text-xs text-gray-400 mt-1">{previewCount} log is audience mein hain</p>
            )}
          </div>

          {channel === "email" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]" />
          </div>

          <button
            onClick={send}
            disabled={sending}
            className="bg-[#6C3EE6] hover:bg-[#5b34c9] disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg"
          >
            {sending ? "Sending..." : `Send ${channel}`}
          </button>
        </div>
      </div>

      <h2 className="font-bold text-gray-800 text-sm mb-3">Recent History</h2>
      {loadingHistory ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-400 text-sm">Abhi tak koi message nahi bheja gaya.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2">Channel</th>
                <th className="text-left px-4 py-2">Audience</th>
                <th className="text-left px-4 py-2">Recipients</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((log) => (
                <tr key={log.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 capitalize">{log.channel}</td>
                  <td className="px-4 py-2">{log.audience}</td>
                  <td className="px-4 py-2">{log.recipientCount}</td>
                  <td className="px-4 py-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      log.status === "sent" ? "bg-green-50 text-green-600" : log.status === "failed" ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-400"
                    }`}>
                      {log.status}
                    </span>
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

export default BulkMessaging;