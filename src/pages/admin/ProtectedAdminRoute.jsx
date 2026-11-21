// ProtectedAdminRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ADMIN_EMAILS = [
  "admin@property-adda.com",
  "admin@propertyadda.com",
];

// Wrap admin routes with this. Strictly restricts admin panel to the site administrator.
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-2xl text-[#D62839]"></i>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in — redirect to admin login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const userEmail = (user?.email || "").toLowerCase().trim();
  const isPrivilegedAdmin =
    user?.role === "admin" &&
    (ADMIN_EMAILS.includes(userEmail) ||
      userEmail.endsWith("@property-adda.com") ||
      userEmail.endsWith("@propertyadda.com"));

  if (!isPrivilegedAdmin) {
    // Logged in as regular client (Owner, Dealer, Agent) — redirect to user dashboard
    return <Navigate to="/my-listings" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
