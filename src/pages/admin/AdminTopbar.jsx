// AdminTopbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminTopbar = ({ onToggleSidebar, onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-600"
          aria-label="Open menu"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex w-9 h-9 rounded-md hover:bg-gray-100 items-center justify-center text-gray-600"
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-[280px]">
          <i className="fas fa-search text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search users, properties, listings..."
            className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-600"
          aria-label="Toggle theme"
          title="Light / Dark theme"
        >
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"} text-sm`}></i>
        </button>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-600"
          aria-label="Notifications"
        >
          <i className="fas fa-bell text-sm"></i>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#6C3EE6] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.name || "Admin"}
            </span>
            <i className="fas fa-chevron-down text-[10px] text-gray-400 hidden md:block"></i>
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              ></div>
              <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <i className="fas fa-user text-xs text-gray-400"></i>
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <i className="fas fa-cog text-xs text-gray-400"></i>
                  Settings
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <i className="fas fa-sign-out-alt text-xs"></i>
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;