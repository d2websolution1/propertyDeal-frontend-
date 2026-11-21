// AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

// Axios instance with token attached automatically
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ADMIN_EMAILS = [
  "admin@property-adda.com",
  "admin@propertyadda.com",
  "pkrdx71@gmail.com",
  "prince09kumar7714@gmail.com",
];

export const normalizeUser = (u) => {
  if (!u) return null;
  const email = (u.email || "").toLowerCase().trim();
  if (
    ADMIN_EMAILS.includes(email) ||
    email.endsWith("@property-adda.com") ||
    email.endsWith("@propertyadda.com")
  ) {
    return { ...u, role: "admin" };
  }
  return u;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, try to restore session from a saved token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        setUser(normalizeUser(res.data.user || res.data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: loggedInUser } = res.data;
    localStorage.setItem("token", token);
    const normalized = normalizeUser(loggedInUser);
    setUser(normalized);
    return normalized;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await api.post("/auth/register", payload);
    const { token, user: newUser } = res.data;
    const normalized = normalizeUser(newUser);
    if (token) {
      localStorage.setItem("token", token);
      setUser(normalized);
    }
    return normalized;
  }, []);

  const sendOtp = useCallback(async (payload) => {
    const res = await api.post("/auth/send-otp", payload);
    return res.data;
  }, []);

  const verifyOtp = useCallback(async (payload) => {
    const res = await api.post("/auth/verify-otp", payload);
    const { token, user: verifiedUser } = res.data;
    const normalized = normalizeUser(verifiedUser);
    if (token) {
      localStorage.setItem("token", token);
      setUser(normalized);
    }
    return normalized;
  }, []);

  const googleAuth = useCallback(async (payload) => {
    const res = await api.post("/auth/google-auth", payload);
    const { token, user: authedUser } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      setUser(authedUser);
    }
    return authedUser;
  }, []);

  const instantGmailAuth = useCallback(async (payload) => {
    const body = typeof payload === "string" ? { email: payload } : payload;
    const res = await api.post("/auth/instant-gmail", body);
    const { token, user: authedUser } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      setUser(authedUser);
    }
    return authedUser;
  }, []);

  const mobileRegister = useCallback(async (payload) => {
    const res = await api.post("/auth/mobile-register", payload);
    const { token, user: newUser } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      setUser(newUser);
    }
    return newUser;
  }, []);

  const mobileLogin = useCallback(async (payload) => {
    const res = await api.post("/auth/mobile-login", payload);
    const { token, user: loggedUser } = res.data;
    const normalized = normalizeUser(loggedUser);
    if (token) {
      localStorage.setItem("token", token);
      setUser(normalized);
    }
    return normalized;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const res = await api.put("/auth/profile", payload);
    const updatedUser = res.data.user;
    if (updatedUser) {
      setUser(normalizeUser(updatedUser));
    }
    return res.data;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      const freshUser = normalizeUser(res.data.user || res.data);
      setUser(freshUser);
      return freshUser;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    refreshUser,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    sendOtp,
    verifyOtp,
    googleAuth,
    instantGmailAuth,
    mobileRegister,
    mobileLogin,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;