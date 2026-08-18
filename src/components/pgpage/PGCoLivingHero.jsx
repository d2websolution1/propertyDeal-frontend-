// PGCoLivingHero.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const TABS = [
  { label: "BUY", path: "/" },
  { label: "RENT", path: "/rent" },
  { label: "COMMERCIAL", path: "/commercial" },
  { label: "PG/CO-LIVING", path: "/pg-co-living" },
  { label: "PLOTS", path: "/plots" },
];

const PGCoLivingHero = () => {
  const location = useLocation();

  return (
    <section className="relative overflow-hidden w-full min-h-[560px] bg-gradient-to-br from-[#6b2f0f] via-[#c2691f] to-[#e8944a]">
      {/* Decorative kitchen/room line-art (left side) */}
      <svg
        className="absolute left-0 top-0 h-full w-[35%] opacity-25 pointer-events-none hidden md:block"
        viewBox="0 0 300 500"
        fill="none"
      >
        {/* Hanging lamp */}
        <line x1="70" y1="0" x2="70" y2="70" stroke="#fff" strokeWidth="2" />
        <path d="M30 70 h80 l-15 30 h-50 z" stroke="#fff" strokeWidth="2" />

        {/* Wine glass */}
        <path d="M15 200 q0 40 25 40 q25 0 25 -40 z" stroke="#fff" strokeWidth="2" />
        <line x1="40" y1="240" x2="40" y2="280" stroke="#fff" strokeWidth="2" />
        <line x1="20" y1="280" x2="60" y2="280" stroke="#fff" strokeWidth="2" />

        {/* Frame on wall */}
        <rect x="120" y="150" width="70" height="90" stroke="#fff" strokeWidth="2" />

        {/* Bowl / cup */}
        <path d="M40 400 q40 0 40 30 q-40 15 -80 0 q0 -30 40 -30 z" stroke="#fff" strokeWidth="2" />

        {/* Table / cabinet */}
        <line x1="0" y1="460" x2="230" y2="460" stroke="#fff" strokeWidth="2" />
        <rect x="10" y="460" width="200" height="40" stroke="#fff" strokeWidth="2" />
        <line x1="60" y1="460" x2="60" y2="500" stroke="#fff" strokeWidth="2" />
        <line x1="140" y1="460" x2="140" y2="500" stroke="#fff" strokeWidth="2" />
      </svg>

      {/* Decorative paper-plane */}
      <svg
        className="absolute right-[28%] top-[12%] w-8 h-8 opacity-40 hidden md:block"
        viewBox="0 0 24 24"
        fill="#fff"
      >
        <path d="M2 12l19-9-4 9 4 9-19-9zm4-1l9 1-9 1v-2z" />
      </svg>

      {/* CONTENT */}
      <div className="relative z-10 px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-[1300px] ml-50 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-center">
          {/* Left: text + search + promo */}
          <div>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              PG/Co-Living in India
            </h1>

            {/* SEARCH CARD */}
            <div className="mt-6 max-w-[750px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Tabs */}
              <div className="bg-[#3a2417]/90 flex items-center gap-1 px-5 overflow-x-auto">
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

            {/* Promo banner */}
            <div className="mt-4 max-w-[700px] relative rounded-xl overflow-hidden bg-gradient-to-r from-[#5c1a4a] to-[#7a2560]">
              <span className="absolute top-3 left-4 bg-[#e9569a] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                NEW
              </span>
              <div className="flex items-center justify-between gap-4 pl-4 pr-2 py-4">
                <div className="pt-3">
                  <p className="text-white font-bold text-base md:text-lg">
                    Unlimited PG's with Premium
                  </p>
                  <p className="text-white/80 text-xs md:text-sm mt-0.5">
                    Upgrade to Premium &amp; access unlimited PG's
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden hidden sm:block">
                    <img
                      src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=200&h=200&fit=crop&auto=format"
                      alt="Roommates in a PG"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
                    aria-label="See Premium details"
                  >
                    <i className="fas fa-chevron-right text-sm"></i>
                  </button>
                </div>
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

          {/* Right: photo with rotated frame + decorations */}
          <div className="hidden lg:flex justify-end relative">
            <svg
              className="absolute -top-4 right-6 w-[90%] h-[90%] opacity-70 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <rect
                x="8"
                y="8"
                width="84"
                height="84"
                rx="8"
                stroke="#fff"
                strokeWidth="1"
                transform="rotate(6 50 50)"
                fill="none"
              />
            </svg>
            <div className="relative w-[340px] h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=550&fit=crop&auto=format"
                alt="Roommates working together"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-8 w-4 h-4 rounded-full bg-[#ffd966] border-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PGCoLivingHero;