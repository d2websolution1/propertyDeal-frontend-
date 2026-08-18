// SellPropertyBanner.jsx
import React from "react";

const SellPropertyBanner = () => {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
          Have a property to sell?
        </h2>
      </div>

      {/* Banner */}
      <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-gradient-to-r from-[#f3ecff] via-[#f8f2fc] to-[#f3ecff]">
        {/* Decorative wave shape */}
        <svg
          className="absolute right-0 bottom-0 w-[45%] h-full opacity-80"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0 200 C100 120 150 180 250 140 C320 115 360 150 400 130 L400 200 Z"
            fill="#E4D8FB"
          />
        </svg>

        <div className="relative flex items-center justify-between gap-4 px-6 md:px-10 py-8 md:py-10">
          {/* Left illustration: hand with key + house */}
          <div className="hidden sm:block w-[110px] md:w-[140px] flex-shrink-0">
            <svg viewBox="0 0 160 160" className="w-full h-full">
              <rect x="60" y="70" width="70" height="60" fill="#E4D8FB" />
              <polygon points="55,70 95,40 135,70" fill="#D7C4F7" />
              <rect x="105" y="85" width="18" height="18" fill="#fff" />
              <path
                d="M20 130 C30 110 45 95 60 90 L75 75 L70 70 L80 60 L90 70 L82 78 L95 60"
                fill="none"
                stroke="#6C3EE6"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="95" cy="58" r="10" fill="#F43F5E" />
              <circle cx="95" cy="58" r="4" fill="#fff" />
            </svg>
          </div>

          {/* Center content */}
          <div className="flex-1 text-center">
            <p className="text-[#0b1a2e] font-bold text-base md:text-xl mb-4">
              List your property &amp; connect with clients faster!
            </p>
            <button className="border-2 border-[#6C3EE6] text-[#6C3EE6] font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#6C3EE6] hover:text-white transition-colors">
              Sell your property
            </button>
          </div>

          {/* Right illustration: two people + car */}
          <div className="hidden sm:block w-[130px] md:w-[170px] flex-shrink-0">
            <svg viewBox="0 0 200 160" className="w-full h-full">
              <circle cx="70" cy="45" r="14" fill="#FCD9B8" />
              <path d="M50 65 q20 -16 40 0 v45 h-40 z" fill="#F43F5E" />
              <circle cx="120" cy="40" r="14" fill="#8B4E2C" />
              <path d="M100 60 q20 -16 40 0 v50 h-40 z" fill="#1E293B" />
              <rect x="30" y="120" width="150" height="28" rx="8" fill="#6C3EE6" />
              <circle cx="60" cy="150" r="10" fill="#0b1a2e" />
              <circle cx="150" cy="150" r="10" fill="#0b1a2e" />
              <rect x="45" y="100" width="60" height="24" rx="4" fill="#8B5CF6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellPropertyBanner;