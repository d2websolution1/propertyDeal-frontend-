// PlotsHero.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const TABS = [
  { label: "BUY", path: "/" },
  { label: "RENT", path: "/rent" },
  { label: "COMMERCIAL", path: "/commercial" },
  { label: "PG/CO-LIVING", path: "/pg-co-living" },
  { label: "PLOTS", path: "/plots" },
];

const PlotsHero = () => {
  const location = useLocation();

  return (
    <section className="relative overflow-hidden w-full min-h-[520px]">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=900&fit=crop&auto=format')",
        }}
      />

      {/* Dark green overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e14]/95 via-[#2b4620]/80 to-[#1a2e14]/40"></div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 md:px-8 py-10 md:py-14 min-h-[520px] flex flex-col justify-center">
        <div className="max-w-[1300px] ml-60 mx-auto w-full">
          <div className="max-w-[750px]">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Plots for sale in India
            </h1>

            {/* SEARCH CARD */}
            <div className="mt-6 rounded-2xl overflow-hidden shadow-2xl">
              {/* Tabs */}
              <div className="bg-[#1c1c14]/90 flex items-center gap-1 px-5 overflow-x-auto">
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
              <div className="flex items-center gap-3 px-4 py-3 bg-white">
                <select className="flex-1 bg-transparent outline-none py-2 text-[15px] text-gray-700 cursor-pointer appearance-none">
                  <option>Select City</option>
                  <option>Mumbai</option>
                  <option>Bengaluru</option>
                  <option>Pune</option>
                  <option>Delhi</option>
                  <option>Hyderabad</option>
                </select>
                <i className="fas fa-chevron-down text-gray-400 text-xs -ml-8 pointer-events-none"></i>
                <button className="bg-[#3cb878] hover:bg-[#2ea568] transition-colors text-white font-semibold px-6 py-2.5 rounded-full text-sm flex-shrink-0">
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
        </div>
      </div>
    </section>
  );
};

export default PlotsHero;