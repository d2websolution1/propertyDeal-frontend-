// PropertiesSection.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import banner from "../../assets/Homepage-img/banner.png"; // Replace with the actual path to your banner image

const TABS = [
  { label: "BUY", path: "/" },
  { label: "RENT", path: "/rent" },
  { label: "COMMERCIAL", path: "/commercial" },
  { label: "PG/CO-LIVING", path: "/pg-co-living" },
  { label: "PLOTS", path: "/plots" },
];

const DEFAULT_LOCALITIES = [
  "Andheri West",
  "Chembur",
  "Kandivali East",
  "Powai",
  "Kandivali West",
];

const PropertiesSection = ({ city = "Mumbai", localities = DEFAULT_LOCALITIES }) => {
  const location = useLocation();

  return (
    <section className="relative overflow-hidden w-full min-h-[560px] bg-gradient-to-br from-[#2e1a6b] via-[#4527a0] to-[#5a2fae]">
      {/* Decorative skyline silhouette */}
      <svg
        className="absolute left-0 bottom-0 w-full h-[55%] opacity-15 pointer-events-none"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        fill="#fff"
      >
        <rect x="0" y="120" width="60" height="180" />
        <rect x="70" y="80" width="50" height="220" />
        <rect x="130" y="150" width="45" height="150" />
        <rect x="185" y="60" width="55" height="240" />
        <rect x="250" y="110" width="40" height="190" />
        <rect x="300" y="40" width="60" height="260" />
        <rect x="370" y="140" width="50" height="160" />
      </svg>

      {/* Small decorative dots (paper planes / stars) */}
      <div className="absolute left-[8%] top-[18%] w-2 h-2 rounded-full bg-white/40"></div>
      <div className="absolute left-[24%] top-[10%] w-1.5 h-1.5 rounded-full bg-white/30"></div>
      <div className="absolute left-[15%] top-[28%] w-1 h-1 rounded-full bg-white/40"></div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-[1300px] ml-50 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-center">
          {/* Left: text + search */}
          <div >
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Properties to buy in {city}
            </h1>
            <p className="text-white/90 mt-2 text-sm md:text-base">
              <span className="font-bold">7K+</span> listings added daily and{" "}
              <span className="font-bold">71K+</span> total verified
            </p>

            {/* SEARCH CARD */}
            <div className="mt-6 max-w-[750px] rounded-2xl overflow-hidden shadow-2xl bg-white">
              {/* Tabs */}
              <div className="bg-[#241255] px-5 flex items-center gap-1 overflow-x-auto">
                {TABS.map((t) => {
                  const active = location.pathname === t.path;
                  return (
                    <Link
                      key={t.label}
                      to={t.path}
                      className={`relative px-4 py-3 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${
                        active ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {t.label}
                      {active && (
                        <span className="absolute left-4 right-4 -bottom-[1px] h-[2px] bg-white rounded-t" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Search row */}
              <div className="flex items-center gap-3 px-5 py-3 bg-white">
                <svg
                  className="w-5 h-5 text-gray-500 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for locality, landmark, project, or builder"
                  className="flex-1 bg-transparent outline-none py-2 text-[15px] text-gray-800 placeholder:text-gray-500 min-w-[100px]"
                />
                <button className="bg-[#6C3EE6] hover:bg-[#5b34c9] transition-colors text-white font-semibold px-6 py-2.5 rounded-lg text-sm flex-shrink-0">
                  Search
                </button>
              </div>
            </div>

            {/* Popular localities */}
            <div className="mt-4 flex items-center gap-3 flex-wrap max-w-[750px]">
              <span className="flex items-center gap-1.5 text-white/90 text-sm font-semibold flex-shrink-0">
                <i className="fas fa-map-marker-alt text-xs"></i>
                Popular Localities
              </span>
              {localities.map((loc, i) => (
                <Link
                  key={i}
                  to={`/locality/${loc.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-1 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                >
                  {loc}
                  <i className="fas fa-chevron-right text-[9px]"></i>
                </Link>
              ))}
            </div>

            {/* Property owner pill */}
            <div className="mt-5">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full">
                <i className="fas fa-star text-white/90"></i>
                <span className="text-xs md:text-sm">Are you a Property Owner?</span>
                <Link
                  to="/post-property"
                  className="underline font-semibold text-xs md:text-sm"
                >
                  Sell / Rent for FREE
                </Link>
                <span className="text-lg">›</span>
              </div>
            </div>
          </div>

          {/* Right: photo in device/tablet frame */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-[380px] h-[420px]">
              <div className="absolute inset-0 border-[3px] border-white/60 rounded-2xl"></div>
              <div className="absolute inset-[10px] rounded-xl overflow-hidden">
                <img
                  src={banner}
                  alt="Couple looking at properties"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;