// AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser?.role !== "admin") {
        setError("This account doesn't have admin access.");
        setLoading(false);
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-md bg-[#ffb300] flex items-center justify-center">
            <i className="fas fa-home text-[#0f172a] text-base"></i>
          </div>
          <span className="font-extrabold text-lg text-[#0f172a]">
            HOUSING<span className="font-normal">.ADMIN</span>
          </span>
        </div>

        <h1 className="text-xl font-bold text-gray-800 text-center mb-1">
          Admin Login
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Sign in with your admin credentials
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg mb-4">
            <i className="fas fa-exclamation-circle mr-1.5"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#6C3EE6] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#6C3EE6] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C3EE6] hover:bg-[#5b34c9] transition-colors text-white font-semibold py-2.5 rounded-lg text-sm mt-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;