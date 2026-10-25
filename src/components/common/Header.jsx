import React, { useState, useRef, useEffect } from "react";
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
  const [clientAuthModalOpen, setClientAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  const navRef = useRef(null);
  const timeoutRef = useRef(null);

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
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-[72px] sm:h-[76px] flex items-center justify-between gap-3 md:gap-4">
        {/* Left: Brand Logo & All India Selector with generous spacing */}
        <div className="flex items-center gap-5 sm:gap-7 md:gap-8 flex-shrink-0">
          <Link to="/" className="focus:outline-none flex items-center py-1 mr-2 sm:mr-4 transition-transform hover:scale-102">
            <PropertyDealLogo height={52} className="h-11 sm:h-12 md:h-[52px] w-auto" />
          </Link>

          {/* City / All India Selector Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("city")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "city" ? null : "city")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                openMenu === "city"
                  ? "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                  : "bg-[#f8fafc] text-[#334155] border-[#e2e8f0] hover:bg-[#f1f5f9]"
              }`}
            >
              <span>{selectedCity}</span>
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
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* User Auth state */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-[#e2e8f0] bg-white hover:border-[#2563eb] transition-all">
                <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-[#0f172a] max-w-[80px] truncate">
                  {user?.name || "Account"}
                </span>
              </button>
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#e2e8f0] rounded-xl shadow-xl p-2 hidden group-hover:block z-50">
                <div className="px-3 py-2 border-b border-[#f1f5f9]">
                  <p className="text-xs font-bold text-[#0f172a] truncate">{user?.name}</p>
                  <p className="text-[10px] text-[#64748b] truncate">{user?.email}</p>
                </div>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-xs font-semibold text-[#2563eb] hover:bg-[#eff6ff] rounded-lg mt-1"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setClientAuthModalOpen(true);
                  setAuthInitialMode("login");
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-sm transition-colors cursor-pointer"
              >
                Login
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc] cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e2e8f0] px-4 py-4 space-y-3 animate-hw-fade">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
            <span className="text-xs font-bold text-[#64748b]">Location: {selectedCity}</span>
            <button
              onClick={() => setOpenMenu(openMenu === "city" ? null : "city")}
              className="text-xs font-bold text-[#2563eb] underline"
            >
              Change City
            </button>
          </div>

          {/* Client Authentication in Mobile Drawer */}
          {!isAuthenticated ? (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold text-[#0f172a]">Client Sign In / Sign Up</p>
                <p className="text-[11px] text-[#64748b]">Save favorites & contact owners</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setClientAuthModalOpen(true);
                  setAuthInitialMode("login");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="p-3 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f172a]">{user?.name}</p>
                  <p className="text-[10px] text-[#64748b]">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <Link to="/" className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex justify-between items-center">
              <span>🏠 Buy Flats</span>
              <span>→</span>
            </Link>
            <Link to="/rent" className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex justify-between items-center">
              <span>🔑 Rent Homes</span>
              <span>→</span>
            </Link>
            <Link to="/commercial" className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex justify-between items-center">
              <span>🏢 Commercial</span>
              <span>→</span>
            </Link>
            <Link to="/plots" className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex justify-between items-center">
              <span>🧭 Plots & Land</span>
              <span>→</span>
            </Link>
            <Link to="/pg-co-living" className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] flex justify-between items-center">
              <span>👥 PG / Co-Living</span>
              <span>→</span>
            </Link>
            <Link to="/admin/login" className="p-3 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] flex justify-between items-center">
              <span>🛡️ Admin Portal</span>
              <span>🔑</span>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              to="/post-property"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] text-white font-bold text-sm shadow-md"
            >
              <span>Post Property</span>
              <span className="bg-[#ef4444] text-white text-[10px] px-1.5 py-0.5 rounded font-black">
                FREE
              </span>
            </Link>
          </div>
        </div>
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