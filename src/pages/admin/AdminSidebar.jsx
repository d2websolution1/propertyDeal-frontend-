import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import propertyDealIcon from "../../assets/icon-propertydeal.png";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", icon: "fa-chart-pie", path: "/admin" }],
  },
  {
    label: "Content & Marketing",
    items: [
      { label: "All Pages Content", icon: "fa-th-large", path: "/admin/content" },
      { label: "Advertisements", icon: "fa-ad", path: "/admin/advertisements" },
      { label: "CMS Pages", icon: "fa-file-alt", path: "/admin/cms" },
      { label: "Blog Management", icon: "fa-blog", path: "/admin/blogs" },
      { label: "Pop-up Banners", icon: "fa-window-restore", path: "/admin/banners" },
      { label: "Bulk WhatsApp / SMS / Email", icon: "fa-paper-plane", path: "/admin/bulk-messaging" },
    ],
  },
  {
    label: "Users & Listings",
    items: [
      { label: "Manage Users", icon: "fa-users", path: "/admin/users" },
      { label: "Manage Properties", icon: "fa-building", path: "/admin/properties" },
      { label: "Approve / Reject Listings", icon: "fa-check-circle", path: "/admin/listings/approvals" },
      { label: "Featured Listings", icon: "fa-star", path: "/admin/listings/featured" },
      { label: "Verified Property Tags", icon: "fa-shield-alt", path: "/admin/listings/verified" },
      { label: "Enquiries", icon: "fa-comment-dots", path: "/admin/enquiries" },
    ],
  },
  {
    label: "Billing",
    items: [
      { label: "Payments", icon: "fa-credit-card", path: "/admin/payments" },
      { label: "Subscription Plans", icon: "fa-layer-group", path: "/admin/subscriptions" },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Reports & Analytics", icon: "fa-chart-line", path: "/admin/reports" },
      { label: "New Listing Report", icon: "fa-file-invoice", path: "/admin/reports/listings" },
      { label: "New User & Vendor Report", icon: "fa-user-plus", path: "/admin/reports/users" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "General Settings", icon: "fa-cog", path: "/admin/settings" },
      { label: "Multi-language", icon: "fa-language", path: "/admin/settings/language" },
      { label: "Security & SSL", icon: "fa-lock", path: "/admin/settings/security" },
      { label: "Active Sessions", icon: "fa-laptop", path: "/admin/settings/sessions" },
    ],
  },
];

const AdminSidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = useState(
    NAV_GROUPS.reduce((acc, g) => ({ ...acc, [g.label]: true }), {})
  );

  const toggleGroup = (label) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    if (onCloseMobile) onCloseMobile();
    navigate("/admin/login", { replace: true });
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#0f172a] text-white select-none">
      {/* Logo Header */}
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-white/10 flex-shrink-0">
        <img
          src={propertyDealIcon}
          alt="PropertyDeal Logo"
          className="w-8 h-8 object-contain flex-shrink-0 rounded-md"
        />
        {!collapsed && (
          <span className="font-extrabold text-base tracking-tight whitespace-nowrap text-white">
            Property<span className="text-[#3b82f6]">Deal</span>
            <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 ml-1.5 bg-white/10 px-1.5 py-0.5 rounded">ADMIN</span>
          </span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            {!collapsed && (
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2 py-2 text-[11px] font-bold tracking-wider text-white/40 uppercase hover:text-white/60 transition-colors"
              >
                {group.label}
                <i
                  className={`fas fa-chevron-down text-[9px] transition-transform ${
                    openGroups[group.label] ? "" : "-rotate-90"
                  }`}
                ></i>
              </button>
            )}

            {(collapsed || openGroups[group.label]) && (
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        isActive
                          ? "bg-[#2563eb] text-white font-bold shadow-xs"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      } ${collapsed ? "justify-center" : ""}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <i className={`fas ${item.icon} text-sm w-4 text-center flex-shrink-0`}></i>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info & Direct Logout Button */}
      <div className="p-3 border-t border-white/10 flex-shrink-0 bg-[#0b1120]">
        {!collapsed && user && (
          <div className="mb-2 px-1">
            <p className="text-xs font-bold text-white truncate">{user.name || "Administrator"}</p>
            <p className="text-[10px] text-white/40 truncate">{user.email || "admin@propertydeal.com"}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:text-white bg-red-500/10 hover:bg-red-600 transition-all cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
          title="Logout Admin"
        >
          <i className="fas fa-sign-out-alt text-sm flex-shrink-0"></i>
          {!collapsed && <span>Logout Admin</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-screen z-30 transition-all duration-200 ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar (overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-[260px] h-full">{sidebarContent}</div>
          <div
            className="flex-1 bg-black/50"
            onClick={onCloseMobile}
            aria-label="Close menu"
          ></div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;