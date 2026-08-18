// CommercialHero.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CommercialHeader from "./CommercialHeader";

const TABS = [
  { label: "BUY", path: "/" },
  { label: "RENT", path: "/rent" },
  { label: "COMMERCIAL", path: "/commercial" },
  { label: "PG/CO-LIVING", path: "/pg-co-living" },
  { label: "PLOTS", path: "/plots" },
];

const CommercialHero = ({ city = "Mumbai" }) => {
  const activeTab = "COMMERCIAL";
  const [dealType, setDealType] = useState("buy");

  return (
    <section className="relative overflow-hidden w-full min-h-[560px] bg-gradient-to-br from-[#1c3a5e] via-[#3a6b9e] to-[#6fa8dc]">
      {/* Radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.18),transparent_55%)]"></div>

      {/* Decorative office line-art (bottom left) */}
      <svg
        className="absolute left-0 bottom-0 h-[70%] w-[40%] opacity-30 pointer-events-none hidden md:block"
        viewBox="0 0 400 350"
        fill="none"
      >
        {/* Office chair */}
        <path
          d="M60 40 h100 v70 h-100 z"
          stroke="#fff"
          strokeWidth="2"
        />
        <line x1="110" y1="110" x2="110" y2="180" stroke="#fff" strokeWidth="2" />
        <path
          d="M70 180 h80 l20 40 h-120 z"
          stroke="#fff"
          strokeWidth="2"
        />
        <line x1="110" y1="220" x2="110" y2="280" stroke="#fff" strokeWidth="2" />
        <line x1="70" y1="300" x2="150" y2="300" stroke="#fff" strokeWidth="2" />

        {/* Small plant */}
        <path d="M260 260 q10 -30 25 0" stroke="#fff" strokeWidth="2" />
        <path d="M270 250 q15 -25 30 5" stroke="#fff" strokeWidth="2" />
        <rect x="255" y="260" width="45" height="35" stroke="#fff" strokeWidth="2" />

        {/* Table */}
        <line x1="0" y1="330" x2="380" y2="330" stroke="#fff" strokeWidth="2" />
      </svg>

      {/* Header sits transparent on top of the gradient */}
      <div className="relative z-20">
        <CommercialHeader city={city} />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 md:px-8 pb-14 pt-4 md:pt-8">
        <div className="max-w-[1300px] ml-40 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-center">
          {/* Left: text + search */}
          <div>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Commercial Real Estate in {city}
            </h1>

            {/* SEARCH CARD */}
            <div className="mt-6 max-w-[750px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Tabs */}
              <div className="bg-[#2b3f56]/90 flex items-center gap-1 px-5 overflow-x-auto">
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

              {/* Search row */}
              <div className="flex items-center gap-3 px-5 py-3 bg-white flex-wrap">
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
                  placeholder="Search Locality"
                  className="flex-1 bg-transparent outline-none py-2 text-[15px] text-gray-800 placeholder:text-gray-500 min-w-[100px]"
                />

                {/* Buy / Lease toggle */}
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4 flex-shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="dealType"
                      checked={dealType === "buy"}
                      onChange={() => setDealType("buy")}
                      className="w-4 h-4 accent-[#6C3EE6]"
                    />
                    <span className="text-sm text-gray-700 font-medium">Buy</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="dealType"
                      checked={dealType === "lease"}
                      onChange={() => setDealType("lease")}
                      className="w-4 h-4 accent-[#6C3EE6]"
                    />
                    <span className="text-sm text-gray-700 font-medium">Lease</span>
                  </label>
                </div>

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

          {/* Right: photo with spotlight-cone line frame */}
          <div className="hidden lg:flex justify-end relative">
            <svg
              className="absolute -top-6 -left-10 w-[220px] h-[220px] opacity-60 pointer-events-none"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path d="M100 0 L40 120 L160 120 Z" stroke="#fff" strokeWidth="1.5" />
              <ellipse cx="100" cy="10" rx="8" ry="4" fill="#ffd966" />
            </svg>
            <div className="relative w-[360px] h-[400px] rounded-lg overflow-hidden shadow-2xl mr-[-10px]">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=750&fit=crop&auto=format"
                alt="Colleagues discussing commercial real estate"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommercialHero;