import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ClientAuthModal from "./ClientAuthModal";
import propertyDealIcon from "../../assets/icon-propertydeal.png";

export const PropertyDealLogo = ({
  size,
  height = 50,
  className = "",
  alt = "PropertyDeal",
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
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All India");
  const [citySearch, setCitySearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [clientAuthModalOpen, setClientAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  // Lock body scroll when mobile drawer or city modal is open
  useEffect(() => {
    if (mobileMenuOpen || cityModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, cityModalOpen]);

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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setOpenMenu(null);
  };

  // ── Dropdown Data matching Images 2 & 3 ──
  const propertyTypesBuy = [
    { label: "Flats", path: "/?type=apartment", icon: "🏢" },
    { label: "Houses", path: "/?type=house", icon: "🏠" },
    { label: "Builder floors", path: "/?type=builder_floor", icon: "🏬" },
    { label: "Plots", path: "/plots", icon: "🏞️" },
    { label: "Villas", path: "/?type=villa", icon: "🏡" },
    { label: "Commercial properties", path: "/commercial", icon: "🏪" },
  ];

  const popularAreasBuy = [
    "Thane West",
    "Borivali West",
    "Mira Road East",
    "Kurla West",
    "Kurla East",
    "Santacruz East",
  ];

  const searchByBHKBuy = [
    "1 RK for Sale in Mumbai",
    "1 BHK for Sale in Mumbai",
    "2 BHK for Sale in Mumbai",
    "3 BHK for Sale in Mumbai",
    "1 BHK Houses",
    "2 BHK Houses",
  ];

  const popularSearchesBuy = [
    "Flats without brokerage",
    "Under construction flats",
    "Affordable projects for sale",
    "Ready to move-in projects",
    "New residential projects",
    "Resale properties",
  ];

  const propertyTypesRent = [
    { label: "Flats", path: "/rent?type=apartment", icon: "🏢" },
    { label: "Houses", path: "/rent?type=house", icon: "🏠" },
    { label: "PG / Co-living", path: "/pg-co-living", icon: "👥" },
    { label: "Builder floors", path: "/rent?type=builder_floor", icon: "🏬" },
    { label: "Villas", path: "/rent?type=villa", icon: "🏡" },
    { label: "Commercial properties", path: "/commercial", icon: "🏪" },
  ];

  const popularAreasRent = [
    "Thane West",
    "Borivali West",
    "Mira Road East",
    "Kurla West",
    "Kurla East",
    "Santacruz East",
  ];

  const searchByBHKRent = [
    "1 RK for Rent in Mumbai",
    "1 BHK for Rent in Mumbai",
    "2 BHK for Rent in Mumbai",
    "3 BHK for Rent in Mumbai",
    "1 BHK Houses for Rent",
    "2 BHK Houses for Rent",
  ];

  const popularSearchesRent = [
    "Flats without brokerage",
    "Fully furnished flats",
    "Bachelor friendly flats",
    "Family friendly flats",
    "Pet friendly flats",
    "Flats near metro",
  ];

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

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-xs"
    >
      <div className="max-w-[1340px] mx-auto px-3 sm:px-6 h-[64px] sm:h-[72px] md:h-[76px] flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Brand Logo & All India Selector with generous spacing */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8 flex-shrink-0">
          <Link to="/" className="focus:outline-none flex items-center py-1 transition-transform hover:scale-102">
            <PropertyDealLogo height={46} className="h-9 sm:h-11 md:h-[48px] w-auto" />
          </Link>

          {/* City / All India Selector Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("city")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setCityModalOpen(true);
                } else {
                  setOpenMenu(openMenu === "city" ? null : "city");
                }
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11.5px] sm:text-xs font-semibold transition-colors border ${
                openMenu === "city"
                  ? "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                  : "bg-[#f8fafc] text-[#334155] border-[#e2e8f0] hover:bg-[#f1f5f9]"
              }`}
            >
              <span className="text-[#2563eb]">📍</span>
              <span className="max-w-[70px] sm:max-w-none truncate">{selectedCity}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${
                  openMenu === "city" ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "city" && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl p-4 z-50 animate-hw-fade before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search for city..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-[#e2e8f0] rounded-xl outline-none focus:border-[#2563eb] bg-[#f8fafc]"
                  />
                  <svg
                    className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
                  Popular Cities
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => handleCitySelect("All India")}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                      selectedCity === "All India"
                        ? "bg-[#2563eb] text-white"
                        : "hover:bg-[#f8fafc] text-[#0f172a]"
                    }`}
                  >
                    🇮🇳 All India
                  </button>
                  {filteredCities.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCitySelect(c)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium truncate ${
                        selectedCity === c
                          ? "bg-[#2563eb] text-white font-semibold"
                          : "hover:bg-[#f8fafc] text-[#0f172a]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Dropdowns */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* 1. FOR BUYERS (Image 2) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("buyers")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setOpenMenu(openMenu === "buyers" ? null : "buyers")}
              className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                openMenu === "buyers"
                  ? "bg-[#eff6ff] text-[#2563eb]"
                  : "text-[#1e293b] hover:text-[#2563eb]"
              }`}
            >
              <span>For Buyers</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "buyers" && (
              <div className="absolute left-0 mt-2 w-[780px] bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl p-6 z-50 animate-hw-fade before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                <div className="grid grid-cols-4 gap-6 text-xs">
                  {/* Col 1: Property type */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Property type
                    </h4>
                    <ul className="space-y-2.5">
                      {propertyTypesBuy.map((item) => (
                        <li key={item.label}>
                          <Link
                            to={item.path}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-2 text-[#0f172a] hover:text-[#2563eb] transition-colors py-0.5"
                          >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 2: Popular areas */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Popular areas
                    </h4>
                    <ul className="space-y-2">
                      {popularAreasBuy.map((area) => (
                        <li key={area}>
                          <Link
                            to={`/?q=${encodeURIComponent(area)}`}
                            onClick={() => setOpenMenu(null)}
                            className="text-[#334155] hover:text-[#2563eb] block py-0.5 transition-colors"
                          >
                            {area}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 3: Search by BHK */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Search by BHK
                    </h4>
                    <ul className="space-y-2">
                      {searchByBHKBuy.map((bhk) => (
                        <li key={bhk}>
                          <Link
                            to={`/?q=${encodeURIComponent(bhk)}`}
                            onClick={() => setOpenMenu(null)}
                            className="text-[#334155] hover:text-[#2563eb] block py-0.5 transition-colors"
                          >
                            {bhk}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 4: Popular searches */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Popular searches
                    </h4>
                    <ul className="space-y-2">
                      {popularSearchesBuy.map((item) => (
                        <li key={item}>
                          <Link
                            to={`/?q=${encodeURIComponent(item)}`}
                            onClick={() => setOpenMenu(null)}
                            className="text-[#334155] hover:text-[#2563eb] block py-0.5 transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. FOR TENANTS (Image 3) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("tenants")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setOpenMenu(openMenu === "tenants" ? null : "tenants")}
              className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                openMenu === "tenants"
                  ? "bg-[#eff6ff] text-[#2563eb]"
                  : "text-[#1e293b] hover:text-[#2563eb]"
              }`}
            >
              <span>For Tenants</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "tenants" && (
              <div className="absolute left-0 mt-2 w-[780px] bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl p-6 z-50 animate-hw-fade before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                <div className="grid grid-cols-4 gap-6 text-xs">
                  {/* Col 1: Property type */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Property type
                    </h4>
                    <ul className="space-y-2.5">
                      {propertyTypesRent.map((item) => (
                        <li key={item.label}>
                          <Link
                            to={item.path}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-2 text-[#0f172a] hover:text-[#2563eb] transition-colors py-0.5"
                          >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 2: Popular areas */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Popular areas
                    </h4>
                    <ul className="space-y-2">
                      {popularAreasRent.map((area) => (
                        <li key={area}>
                          <Link
                            to={`/rent?q=${encodeURIComponent(area)}`}
                            onClick={() => setOpenMenu(null)}
                            className="text-[#334155] hover:text-[#2563eb] block py-0.5 transition-colors"
                          >
                            {area}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 3: Search by BHK */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Search by BHK
                    </h4>
                    <ul className="space-y-2">
                      {searchByBHKRent.map((bhk) => (
                        <li key={bhk}>
                          <Link
                            to={`/rent?q=${encodeURIComponent(bhk)}`}
                            onClick={() => setOpenMenu(null)}
                            className="text-[#334155] hover:text-[#2563eb] block py-0.5 transition-colors"
                          >
                            {bhk}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 4: Popular searches */}
                  <div>
                    <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-3">
                      Popular searches
                    </h4>
                    <ul className="space-y-2">
                      {popularSearchesRent.map((item) => (
                        <li key={item}>
                          <Link
                            to={`/rent?q=${encodeURIComponent(item)}`}
                            onClick={() => setOpenMenu(null)}
                            className="text-[#334155] hover:text-[#2563eb] block py-0.5 transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. FOR SELLERS */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("sellers")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setOpenMenu(openMenu === "sellers" ? null : "sellers")}
              className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                openMenu === "sellers"
                  ? "bg-[#eff6ff] text-[#2563eb]"
                  : "text-[#1e293b] hover:text-[#2563eb]"
              }`}
            >
              <span>For Sellers</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "sellers" && (
              <div className="absolute left-0 mt-2 w-72 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl p-4 z-50 animate-hw-fade before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-2.5">
                  Packages for
                </h4>
                <div className="space-y-2">
                  {sellersMenu.map((item) => (
                    <Link
                      key={item.title}
                      to={item.link}
                      onClick={() => setOpenMenu(null)}
                      className="block p-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors"
                    >
                      <strong className="block text-xs font-bold text-[#0f172a]">{item.title}</strong>
                      <span className="text-[11px] text-[#64748b] leading-tight block">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. SERVICES */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("services")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setOpenMenu(openMenu === "services" ? null : "services")}
              className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                openMenu === "services"
                  ? "bg-[#eff6ff] text-[#2563eb]"
                  : "text-[#1e293b] hover:text-[#2563eb]"
              }`}
            >
              <span>Services</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "services" && (
              <div className="absolute left-0 mt-2 w-[420px] bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl p-5 z-50 animate-hw-fade before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                <div className="grid grid-cols-2 gap-5 text-xs">
                  {Object.entries(servicesMenu).map(([group, links]) => (
                    <div key={group}>
                      <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-2.5">
                        {group}
                      </h4>
                      <ul className="space-y-2">
                        {links.map((link) => (
                          <li key={link.name}>
                            <Link
                              to={link.path}
                              onClick={() => setOpenMenu(null)}
                              className="text-[#334155] hover:text-[#2563eb] block py-0.5"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. NEWS & GUIDE */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("news")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setOpenMenu(openMenu === "news" ? null : "news")}
              className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                openMenu === "news"
                  ? "bg-[#eff6ff] text-[#2563eb]"
                  : "text-[#1e293b] hover:text-[#2563eb]"
              }`}
            >
              <span>News & Guide</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "news" && (
              <div className="absolute left-0 mt-2 w-72 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl p-4 z-50 animate-hw-fade before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                <h4 className="font-bold text-[#64748b] text-[11px] uppercase tracking-wider mb-2.5">
                  Property Market Guide
                </h4>
                <div className="space-y-2">
                  {newsMenu.map((item) => (
                    <Link
                      key={item.title}
                      to={item.link}
                      onClick={() => setOpenMenu(null)}
                      className="block p-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors"
                    >
                      <strong className="block text-xs font-bold text-[#0f172a]">{item.title}</strong>
                      <span className="text-[11px] text-[#64748b] leading-tight block">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Post Property Quick Button for sm+ */}
          <Link
            to="/post-property"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-xs transition-all"
          >
            <span>Post Property</span>
            <span className="bg-[#ef4444] text-white text-[9.5px] px-1.5 py-0.2 rounded font-black">
              FREE
            </span>
          </Link>

          {/* User Auth state */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-full border border-[#cbd5e1] bg-white hover:border-[#005744] shadow-2xs transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#005744] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.firstName?.charAt(0) || user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#0f172a] max-w-[90px] truncate">
                  {user?.firstName || user?.name?.split(" ")[0] || "Prince"}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#64748b]">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-2 hidden group-hover:block z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-[#f1f5f9]">
                  <p className="text-xs font-bold text-[#0f172a] truncate">{user?.name || "Client"}</p>
                  <p className="text-[10px] text-[#64748b] truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#005744]">
                    {user?.userType || "Owner"}
                  </span>
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc] hover:text-[#005744] rounded-lg transition-colors"
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc] hover:text-[#005744] rounded-lg transition-colors"
                  >
                    <span>📑</span>
                    <span>My Listings</span>
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors"
                    >
                      <span>🛡️</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </div>
                <div className="pt-1 border-t border-[#f1f5f9]">
                  <button
                    onClick={logout}
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
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xs transition-colors cursor-pointer"
            >
              Login
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8fafc] active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Slide-over Mobile Navigation Drawer ── */}
      {mobileMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop Blur */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide Panel */}
            <div className="relative z-10 w-[88vw] max-w-[380px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-drawer-in">
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-white flex-shrink-0">
                <PropertyDealLogo height={38} className="h-8 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] flex items-center justify-center font-bold text-base transition-transform active:scale-90 cursor-pointer"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 1. User Profile or Sign In Card */}
                {isAuthenticated ? (
                  <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#0f172a]">{user?.name}</p>
                          <span className="text-[9.5px] uppercase font-black px-1.5 py-0.2 rounded bg-blue-100 text-[#2563eb]">
                            {user?.role || "user"}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748b] truncate max-w-[150px]">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-[11px] font-bold text-[#2563eb] bg-[#eff6ff] px-2 py-1 rounded-lg border border-[#bfdbfe]"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex flex-col gap-2.5">
                    <div>
                      <p className="text-sm font-extrabold text-[#0f172a]">Client Sign In / Sign Up</p>
                      <p className="text-[11px] text-[#64748b]">Save favorites & contact verified owners</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setClientAuthModalOpen(true);
                        setAuthInitialMode("login");
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-sm hover:bg-[#1d4ed8] transition-colors cursor-pointer text-center"
                    >
                      Instant Gmail Sign In →
                    </button>
                  </div>
                )}

                {/* 2. City Switcher Row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📍</span>
                    <div>
                      <span className="text-[10px] font-bold text-[#64748b] uppercase block">Selected City</span>
                      <strong className="text-xs font-bold text-[#0f172a]">{selectedCity}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCityModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#2563eb] hover:bg-[#eff6ff] px-2.5 py-1 rounded-lg border border-[#bfdbfe] transition-colors"
                  >
                    Change
                  </button>
                </div>

                {/* 3. Navigation Accordions */}
                <div className="space-y-1.5 pt-1">
                  {/* For Buyers Accordion */}
                  <div className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedAccordion(expandedAccordion === "buyers" ? null : "buyers")}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🏠</span>
                        <span>For Buyers</span>
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className={`transition-transform duration-200 ${expandedAccordion === "buyers" ? "rotate-180 text-[#2563eb]" : "text-[#64748b]"}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {expandedAccordion === "buyers" && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#f1f5f9] bg-[#f8fafc] space-y-3 animate-hw-fade">
                        <div>
                          <span className="text-[10px] font-black text-[#64748b] uppercase tracking-wider block mb-1.5">
                            Property Types
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {propertyTypesBuy.map((item) => (
                              <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#0f172a] hover:text-[#2563eb]"
                              >
                                <span>{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-[#64748b] uppercase tracking-wider block mb-1.5">
                            Search by BHK
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {["1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map((bhk) => (
                              <Link
                                key={bhk}
                                to={`/?bhk=${encodeURIComponent(bhk)}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1.5 text-center rounded-lg bg-white border border-[#e2e8f0] text-[11px] font-medium text-[#334155] hover:text-[#2563eb]"
                              >
                                {bhk}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* For Tenants Accordion */}
                  <div className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedAccordion(expandedAccordion === "tenants" ? null : "tenants")}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🔑</span>
                        <span>For Tenants / Rent</span>
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className={`transition-transform duration-200 ${expandedAccordion === "tenants" ? "rotate-180 text-[#2563eb]" : "text-[#64748b]"}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {expandedAccordion === "tenants" && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#f1f5f9] bg-[#f8fafc] space-y-3 animate-hw-fade">
                        <div>
                          <span className="text-[10px] font-black text-[#64748b] uppercase tracking-wider block mb-1.5">
                            Rental Properties
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {propertyTypesRent.map((item) => (
                              <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#0f172a] hover:text-[#2563eb]"
                              >
                                <span>{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Services & Tools Accordion */}
                  <div className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedAccordion(expandedAccordion === "services" ? null : "services")}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🛠️</span>
                        <span>Services & Calculators</span>
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className={`transition-transform duration-200 ${expandedAccordion === "services" ? "rotate-180 text-[#2563eb]" : "text-[#64748b]"}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {expandedAccordion === "services" && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#f1f5f9] bg-[#f8fafc] space-y-2 animate-hw-fade">
                        <Link
                          to="/#emi-calculator"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-2 rounded-lg bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#0f172a] hover:text-[#2563eb]"
                        >
                          🏦 Home Loan EMI Calculator
                        </Link>
                        <Link
                          to="/contact"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-2 rounded-lg bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#0f172a] hover:text-[#2563eb]"
                        >
                          📜 Property Legal Verification
                        </Link>
                        <Link
                          to="/rent"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-2 rounded-lg bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#0f172a] hover:text-[#2563eb]"
                        >
                          🧾 Rent Receipt Generator
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* News & Guides Accordion */}
                  <div className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedAccordion(expandedAccordion === "news" ? null : "news")}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>📰</span>
                        <span>News & Guides</span>
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className={`transition-transform duration-200 ${expandedAccordion === "news" ? "rotate-180 text-[#2563eb]" : "text-[#64748b]"}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {expandedAccordion === "news" && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#f1f5f9] bg-[#f8fafc] space-y-2 animate-hw-fade">
                        {newsMenu.map((item) => (
                          <Link
                            key={item.title}
                            to={item.link}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block p-2 rounded-lg bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#0f172a] hover:text-[#2563eb]"
                          >
                            <p className="font-bold">{item.title}</p>
                            <p className="text-[10px] text-[#64748b] leading-tight">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Quick Direct Links Grid */}
                <div>
                  <span className="text-[10px] font-black text-[#64748b] uppercase tracking-wider block mb-2">
                    Direct Categories
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <Link
                      to="/commercial"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex items-center justify-between hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors"
                    >
                      <span>🏢 Commercial</span>
                      <span>→</span>
                    </Link>
                    <Link
                      to="/plots"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex items-center justify-between hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors"
                    >
                      <span>🧭 Plots & Land</span>
                      <span>→</span>
                    </Link>
                    <Link
                      to="/pg-co-living"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex items-center justify-between hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors"
                    >
                      <span>👥 PG / Co-Living</span>
                      <span>→</span>
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] flex items-center justify-between hover:bg-blue-100 transition-colors"
                    >
                      <span>🛡️ Admin Portal</span>
                      <span>🔑</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Fixed Footer */}
              <div className="p-4 border-t border-[#e2e8f0] bg-white flex-shrink-0 space-y-2.5">
                <Link
                  to="/post-property"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-md transition-all active:scale-98"
                >
                  <span>Post Property</span>
                  <span className="bg-[#ef4444] text-white text-[10px] px-1.5 py-0.5 rounded font-black">
                    FREE
                  </span>
                </Link>
                <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-[#64748b]">
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#2563eb]">
                    📞 Need Help? Contact Us
                  </Link>
                  <span>•</span>
                  <span>100% Verified</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

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
                <h3 className="font-extrabold text-base text-[#0f172a] flex items-center gap-1.5">
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
                        ? "bg-[#2563eb] text-white shadow-xs"
                        : "bg-[#f8fafc] text-[#0f172a] hover:bg-[#eff6ff] hover:text-[#2563eb]"
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
                          ? "bg-[#2563eb] text-white shadow-xs"
                          : "bg-[#f8fafc] text-[#0f172a] hover:bg-[#eff6ff] hover:text-[#2563eb]"
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