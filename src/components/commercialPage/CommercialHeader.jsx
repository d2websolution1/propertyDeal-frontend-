// CommercialHeader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CommercialHeader = ({ city = "Mumbai" }) => {
  const [cityMenuOpen, setCityMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-[#173654] via-[#2c5478] to-[#3f7099] border-b border-white/10">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo + city */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#ffb300] flex items-center justify-center flex-shrink-0">
              <i className="fas fa-home text-[#0b1a2e] text-sm"></i>
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              HOUSING<span className="font-normal">.COM</span>
            </span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setCityMenuOpen((o) => !o)}
              className="flex items-center gap-1 text-white text-sm font-medium hover:text-white/80 transition-colors"
            >
              {city}
              <i
                className={`fas fa-chevron-down text-xs transition-transform ${
                  cityMenuOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-1.5 text-white text-sm font-semibold hover:text-white/80 transition-colors">
            <i className="fas fa-mobile-alt"></i>
            Download App
          </button>

          <Link
            to="/post-property"
            className="hidden sm:flex items-center gap-1.5 text-white text-sm font-semibold hover:text-white/80 transition-colors"
          >
            Post Property
            <span className="bg-[#e53935] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              FREE
            </span>
          </Link>

          <div className="flex items-center gap-2 bg-white rounded-full pl-1 pr-1 py-1">
            <button
              aria-label="Menu"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#3b2f6e]"
            >
              <i className="fas fa-bars text-sm"></i>
            </button>
            <div className="w-7 h-7 rounded-full bg-[#6C3EE6] flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user text-white text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CommercialHeader;