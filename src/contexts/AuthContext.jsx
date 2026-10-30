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
        setUser(res.data.user || res.data);
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
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await api.post("/auth/register", payload);
    const { token, user: newUser } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      setUser(newUser);
    }
    return newUser;
  }, []);

  const sendOtp = useCallback(async (payload) => {
    const res = await api.post("/auth/send-otp", payload);
    return res.data;
  }, []);

  const verifyOtp = useCallback(async (payload) => {
    const res = await api.post("/auth/verify-otp", payload);
    const { token, user: verifiedUser } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      setUser(verifiedUser);
    }
    return verifiedUser;
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

  const updateProfile = useCallback(async (payload) => {
    const res = await api.put("/auth/profile", payload);
    const updatedUser = res.data.user;
    if (updatedUser) {
      setUser(updatedUser);
    }
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    sendOtp,
    verifyOtp,
    googleAuth,
    instantGmailAuth,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;