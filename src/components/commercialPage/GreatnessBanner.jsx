// GreatnessBanner.jsx
import React from "react";

const GreatnessBanner = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10">
      {/* Come home to Greatness banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#5b2fae] via-[#7c3aed] to-[#9d5ce8] min-h-[320px]">
        {/* Dotted texture pattern */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        {/* Diagonal shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>

        <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-10 px-8 md:px-14 py-12 md:py-16">
          {/* Left: heading */}
          <div className="text-center md:text-left flex-shrink-0">
            <h2 className="text-white font-extrabold text-3xl md:text-4xl leading-tight">
              Come home
              <br />
              to G<span className="text-[#c4b5fd]">rea</span>tness
            </h2>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-20 bg-white/30 flex-shrink-0"></div>

          {/* Ranked */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-white font-bold text-sm tracking-wide">
              RANKED
            </span>
            <span className="text-white font-extrabold text-6xl md:text-7xl leading-none">
              5
              <sup className="text-xl md:text-2xl align-super">th</sup>
            </span>
          </div>

          <p className="text-white/90 text-sm max-w-[200px] text-center md:text-left flex-shrink-0">
            Best Companies to Work For 2024 by Great Place to Work
            <sup className="text-[10px]">®</sup>
          </p>

          {/* Badges */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Great Place to Work badge */}
            <div className="relative w-[90px]">
              <svg viewBox="0 0 100 120" className="w-full">
                <path d="M5 5 H95 V95 L50 115 L5 95 Z" fill="#e01e37" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-3 px-2 text-center">
                <p className="text-white font-extrabold text-[13px] leading-tight">
                  Great
                  <br />
                  Place
                  <br />
                  To Work
                  <sup className="text-[7px]">®</sup>
                </p>
                <p className="text-white text-[9px] font-semibold mt-1">
                  Certified
                </p>
                <p className="text-white/80 text-[6px] mt-0.5">
                  FEB 2024 - FEB 2025
                </p>
                <p className="text-white/80 text-[6px]">INDIA</p>
              </div>
            </div>

            {/* Best Workplaces Asia badge */}
            <div className="relative w-[90px]">
              <svg viewBox="0 0 100 110" className="w-full">
                <polygon
                  points="50,2 95,26 95,74 50,98 5,74 5,26"
                  fill="#1a2f6e"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                <p className="text-white text-[8px] font-semibold leading-tight">
                  Great
                  <br />
                  Place
                  <br />
                  To Work
                </p>
                <p className="text-white font-extrabold text-[11px] leading-tight mt-1">
                  Best
                  <br />
                  Workplaces
                  <br />
                  Asia
                  <sup className="text-[6px]">™</sup>
                </p>
                <p className="text-white/80 text-[8px] mt-1">2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part of REA Group */}
      <div className="flex items-center justify-center gap-3 mt-14">
        <span className="text-gray-400 text-2xl md:text-3xl font-light">
          Part of
        </span>
        <svg viewBox="0 0 40 40" className="w-9 h-9 md:w-10 md:h-10">
          <circle cx="20" cy="20" r="20" fill="#E31E24" />
          <path d="M20 9 L31 18 V31 H24 V22 H16 V31 H9 V18 Z" fill="#fff" />
        </svg>
        <span className="text-gray-500 text-2xl md:text-3xl font-bold tracking-tight">
          REA Group
          <sup className="text-xs font-normal align-super ml-0.5">®</sup>
        </span>
      </div>
    </section>
  );
};

export default GreatnessBanner;