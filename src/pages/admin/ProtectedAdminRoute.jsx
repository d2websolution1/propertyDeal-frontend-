// ProtectedAdminRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Wrap admin routes with this. Redirects non-admins away.
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-2xl text-[#6C3EE6]"></i>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in — redirect to admin login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    // Logged in but not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;