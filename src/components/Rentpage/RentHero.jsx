// RentHero.jsx  — this is the PAGE rendered directly on the "/rent" route
import React from "react";
import { Link } from "react-router-dom";

const TABS = [
  { label: "BUY", path: "/" },
  { label: "RENT", path: "/rent" },
  { label: "COMMERCIAL", path: "/commercial" },
  { label: "PG/CO-LIVING", path: "/pg-co-living" },
  { label: "PLOTS", path: "/plots" },
];

const RentHero = () => {
  const activeTab = "RENT";

  return (
    <section className="relative overflow-hidden w-full min-h-[520px] bg-gradient-to-br from-[#f0a8a6] via-[#e6949c] to-[#cf8290]">
      {/* Decorative line-art (left side) */}
      <svg
        className="absolute left-0 top-0 h-full w-[45%] opacity-25 pointer-events-none hidden md:block"
        viewBox="0 0 400 500"
        fill="none"
      >
        <rect x="30" y="260" width="90" height="90" stroke="#fff" strokeWidth="2" />
        <rect x="130" y="300" width="60" height="50" stroke="#fff" strokeWidth="2" />
        <line x1="60" y1="260" x2="60" y2="120" stroke="#fff" strokeWidth="2" />
        <circle cx="60" cy="100" r="20" stroke="#fff" strokeWidth="2" />
        <path d="M40 100 Q60 60 80 100" stroke="#fff" strokeWidth="2" />
        <rect x="200" y="80" width="45" height="60" stroke="#fff" strokeWidth="2" />
        <rect x="250" y="90" width="45" height="50" stroke="#fff" strokeWidth="2" />
        <line x1="200" y1="140" x2="295" y2="140" stroke="#fff" strokeWidth="2" />
        <circle cx="330" cy="200" r="15" stroke="#fff" strokeWidth="2" />
        <path d="M300 380 Q350 350 400 380" stroke="#fff" strokeWidth="2" />
        <rect x="60" y="380" width="70" height="70" rx="4" stroke="#fff" strokeWidth="2" />
      </svg>

      {/* CONTENT */}
      <div className="relative z-10 pl-4 md:pl-8 py-10 md:py-14 min-h-[520px] ">
        <div className="max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-center">
          {/* Left: text + search */}
          <div className="pr-4 ml-30 md:pr-8">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Properties for rent in India
            </h1>
            <p className="text-white/90 mt-2 text-sm md:text-base">
              <span className="font-bold">7K+</span> listings added daily and{" "}
              <span className="font-bold">71K+</span> total verified
            </p>

            {/* SEARCH CARD */}
            <div className="mt-6 max-w-[800px] rounded-2xl overflow-hidden shadow-2xl bg-white">
              {/* Tabs */}
              <div className="bg-[#3d2b2b] flex items-center gap-1 px-5 overflow-x-auto">
                {TABS.map((t) => {
                  const active = t.label === activeTab;
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

              {/* Search row — icon and text centered with balanced padding */}
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
                  className="flex-1 bg-transparent outline-none py-2 text-[15px] text-gray-800 placeholder:text-gray-500 min-w-[100px] text-center sm:text-left"
                />
                <button className="bg-[#6C3EE6] hover:bg-[#5b34c9] transition-colors text-white font-semibold px-6 py-2.5 rounded-lg text-sm flex-shrink-0">
                  Search
                </button>
              </div>
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

          {/* Right: photo with white frame — pushed to the far edge */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-[340px] h-[380px] rotate-3 bg-white/90 rounded-lg shadow-2xl p-2 mr-[-30px]">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=650&fit=crop&auto=format"
                alt="Couple looking for a rental property"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
  );
};

export default RentHero;