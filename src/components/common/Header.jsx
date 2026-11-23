import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ClientAuthModal from "./ClientAuthModal";
import propertyDealIcon from "../../assets/property-adda-logo.png";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

export const PropertyDealLogo = ({
  size,
  height = 50,
  className = "",
  alt = "Property Adda",
}) => {
  const logoHeight = size || height;
  return (
    <div className="flex items-center flex-shrink-0">
      <img
        src={propertyDealIcon}
        alt={alt}
        style={{ height: `${logoHeight}px`, width: "auto" }}
        className={`object-contain flex-shrink-0 max-h-[60px] select-none ${className}`}
      />
    </div>
  );
};

export const PropertyAddaLogo = PropertyDealLogo;

const CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Noida",
  "Greater Noida",
  "Gurgaon",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Thane",
];

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dynamicCities, setDynamicCities] = useState(CITIES);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/locations`)
      .then((res) => {
        if (res.data?.cities?.length > 0) {
          setDynamicCities(res.data.cities);
        }
      })
      .catch(() => {});
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All India");
  const [citySearch, setCitySearch] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [clientAuthModalOpen, setClientAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  // ── Dynamic Navigation Dropdown Menus (Live from MongoDB) ──
  const [propertyTypesBuy, setPropertyTypesBuy] = useState([
    { label: "Flats", path: "/?type=apartment", icon: "🏢" },
    { label: "Houses", path: "/?type=house", icon: "🏠" },
    { label: "Builder floors", path: "/?type=builder_floor", icon: "🏬" },
    { label: "Plots", path: "/plots", icon: "🏞️" },
    { label: "Villas", path: "/?type=villa", icon: "🏡" },
    { label: "Commercial properties", path: "/commercial", icon: "🏪" },
  ]);

  const [popularAreasBuy, setPopularAreasBuy] = useState([
    "Thane West",
    "Borivali West",
    "Mira Road East",
    "Kurla West",
    "Kurla East",
    "Santacruz East",
  ]);

  const [searchByBHKBuy, setSearchByBHKBuy] = useState([
    "1 RK for Sale in Mumbai",
    "1 BHK for Sale in Mumbai",
    "2 BHK for Sale in Mumbai",
    "3 BHK for Sale in Mumbai",
    "1 BHK Houses",
    "2 BHK Houses",
  ]);

  const [popularSearchesBuy, setPopularSearchesBuy] = useState([
    "Flats without brokerage",
    "Under construction flats",
    "Affordable projects for sale",
    "Ready to move-in projects",
    "New residential projects",
    "Resale properties",
  ]);

  const [propertyTypesRent, setPropertyTypesRent] = useState([
    { label: "Flats", path: "/rent?type=apartment", icon: "🏢" },
    { label: "Houses", path: "/rent?type=house", icon: "🏠" },
    { label: "PG / Co-living", path: "/pg-co-living", icon: "👥" },
    { label: "Builder floors", path: "/rent?type=builder_floor", icon: "🏬" },
    { label: "Villas", path: "/rent?type=villa", icon: "🏡" },
    { label: "Commercial properties", path: "/commercial", icon: "🏪" },
  ]);

  const [popularAreasRent, setPopularAreasRent] = useState([
    "Thane West",
    "Borivali West",
    "Mira Road East",
    "Kurla West",
    "Kurla East",
    "Santacruz East",
  ]);

  const [searchByBHKRent, setSearchByBHKRent] = useState([
    "1 RK for Rent in Mumbai",
    "1 BHK for Rent in Mumbai",
    "2 BHK for Rent in Mumbai",
    "3 BHK for Rent in Mumbai",
    "1 BHK Houses for Rent",
    "2 BHK Houses for Rent",
  ]);

  const [popularSearchesRent, setPopularSearchesRent] = useState([
    "Flats without brokerage",
    "Fully furnished flats",
    "Bachelor friendly flats",
    "Family friendly flats",
    "Pet friendly flats",
    "Flats near metro",
  ]);

  // Load live dropdown configurations from MongoDB Atlas
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/nav-menus`)
      .then((res) => {
        const menus = res.data?.menus || [];
        const buyersMenu = menus.find((m) => m.menuKey === "buyers");
        if (buyersMenu) {
          if (buyersMenu.propertyTypes?.length > 0) setPropertyTypesBuy(buyersMenu.propertyTypes);
          if (buyersMenu.popularAreas?.length > 0) setPopularAreasBuy(buyersMenu.popularAreas);
          if (buyersMenu.searchByBHK?.length > 0) setSearchByBHKBuy(buyersMenu.searchByBHK);
          if (buyersMenu.popularSearches?.length > 0) setPopularSearchesBuy(buyersMenu.popularSearches);
        }
        const tenantsMenu = menus.find((m) => m.menuKey === "tenants");
        if (tenantsMenu) {
          if (tenantsMenu.propertyTypes?.length > 0) setPropertyTypesRent(tenantsMenu.propertyTypes);
          if (tenantsMenu.popularAreas?.length > 0) setPopularAreasRent(tenantsMenu.popularAreas);
          if (tenantsMenu.searchByBHK?.length > 0) setSearchByBHKRent(tenantsMenu.searchByBHK);
          if (tenantsMenu.popularSearches?.length > 0) setPopularSearchesRent(tenantsMenu.popularSearches);
        }
      })
      .catch(() => {});
  }, []);

  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  // Lock body scroll when city modal is open
  useEffect(() => {
    if (cityModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cityModalOpen]);

  const handleMouseEnter = (menuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(menuKey);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setProfileDropdownOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setOpenMenu(null);
  };

  const sellersMenu = [
    { title: "Developers", desc: "Launch or sell homes with high visibility", link: "/post-property" },
    { title: "Brokers", desc: "List and grow your local property deals", link: "/post-property" },
    { title: "Owners", desc: "Sell or rent easily with 0% brokerage", link: "/post-property" },
  ];

  const servicesMenu = {
    "Housing Edge": [
      { name: "Home Loan Assistance", path: "/#emi-calculator" },
      { name: "Property Legal Verification", path: "/contact" },
      { name: "Housing Premium Partner", path: "/post-property" },
    ],
    Tools: [
      { name: "Home Loan EMI Calculator", path: "/#emi-calculator" },
      { name: "Property Value Calculator", path: "/contact" },
      { name: "Rent Receipt Generator", path: "/rent" },
    ],
  };

  const newsMenu = [
    { title: "Real Estate News", desc: "Latest property price trends & policy updates", link: "/blogs" },
    { title: "Buying Guide", desc: "Expert homebuyer checklist & document guides", link: "/blogs" },
    { title: "Housing Research", desc: "Data-driven quarterly real estate market reports", link: "/blogs" },
  ];

  const filteredCities = dynamicCities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-xs"
    >
      <div className="max-w-[1340px] mx-auto px-3 sm:px-6 h-[64px] sm:h-[72px] md:h-[76px] flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Brand Logo with generous spacing */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8 flex-shrink-0">
          <Link to="/" className="focus:outline-none flex items-center py-1 transition-transform hover:scale-102">
            <PropertyDealLogo height={46} className="h-9 sm:h-11 md:h-[48px] w-auto" />
          </Link>
        </div>

        {/* Center: Desktop Navigation (Removed Home & Latest News per request) */}

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Post Property Quick Button (Mobile & Desktop Responsive) */}
          <Link
            to="/post-property"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#D62839] text-white text-[11px] sm:text-xs font-bold hover:bg-[#b81d2c] shadow-xs transition-all active:scale-95"
          >
            <span>Post Property</span>
            <span className="bg-white/20 text-white text-[9px] sm:text-[9.5px] px-1.5 py-0.2 rounded font-black">
              FREE
            </span>
          </Link>

          {/* User Auth state */}
          {isAuthenticated ? (
            <div className="relative group">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-full border border-[#cbd5e1] bg-white hover:border-[#142D4E] shadow-2xs transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#142D4E] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.firstName?.charAt(0) || user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#142D4E] max-w-[90px] truncate">
                  {user?.firstName || user?.name?.split(" ")[0] || "Profile"}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#64748B]">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className={`absolute right-0 mt-1 w-52 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-2 z-50 animate-fade-in ${
                  profileDropdownOpen ? "block" : "hidden group-hover:block"
                }`}
              >
                <div className="px-3 py-2 border-b border-[#f1f5f9]">
                  <p className="text-xs font-bold text-[#142D4E] truncate">{user?.name || "Client"}</p>
                  <p className="text-[10px] text-[#64748B] truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fff1f2] text-[#D62839]">
                    {user?.userType || "Owner"}
                  </span>
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#142D4E] hover:bg-[#F3F5F8] hover:text-[#D62839] rounded-lg transition-colors"
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#142D4E] hover:bg-[#F3F5F8] hover:text-[#D62839] rounded-lg transition-colors"
                  >
                    <span>📑</span>
                    <span>My Listings</span>
                  </Link>
                  {user?.role === "admin" &&
                    (user?.email?.toLowerCase().includes("admin@property") ||
                      user?.email?.toLowerCase().endsWith("@property-adda.com") ||
                      user?.email?.toLowerCase().endsWith("@propertyadda.com")) && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#D62839] hover:bg-[#fff1f2] rounded-lg transition-colors"
                    >
                      <span>🛡️</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </div>
                <div className="pt-1 border-t border-[#f1f5f9]">
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setClientAuthModalOpen(true);
                setAuthInitialMode("login");
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-[#142D4E] hover:text-[#D62839] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* ── Dedicated Mobile & Desktop City Selector Modal ── */}
      {cityModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setCityModalOpen(false)}
            />

            {/* Modal Dialog */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] p-5 animate-hw-fade">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <h3 className="font-extrabold text-base text-[#142D4E] flex items-center gap-1.5">
                  <span>📍 Select City</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCityModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Search input */}
              <div className="mt-3 relative">
                <input
                  type="text"
                  placeholder="Search city (e.g. Mumbai, Noida, Delhi)..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#2563eb] bg-[#f8fafc]"
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Cities Grid */}
              <div className="mt-3">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-2">
                  Popular Real Estate Hubs
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleCitySelect("All India");
                      setCityModalOpen(false);
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedCity === "All India"
                        ? "bg-[#D62839] text-white shadow-xs"
                        : "bg-[#F3F5F8] text-[#142D4E] hover:bg-[#fff1f2] hover:text-[#D62839]"
                    }`}
                  >
                    <span>🇮🇳 All India</span>
                    {selectedCity === "All India" && <span>✓</span>}
                  </button>
                  {filteredCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        handleCitySelect(c);
                        setCityModalOpen(false);
                      }}
                      className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedCity === c
                          ? "bg-[#D62839] text-white shadow-xs"
                          : "bg-[#F3F5F8] text-[#142D4E] hover:bg-[#fff1f2] hover:text-[#D62839]"
                      }`}
                    >
                      <span className="truncate">{c}</span>
                      {selectedCity === c && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Client Sign In & Sign Up Modal (Gmail OTP & Password) */}
      <ClientAuthModal
        isOpen={clientAuthModalOpen}
        onClose={() => setClientAuthModalOpen(false)}
        initialMode={authInitialMode}
      />
    </header>
  );
};

export default Header;