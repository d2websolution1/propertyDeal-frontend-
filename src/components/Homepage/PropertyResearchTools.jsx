// PropertyResearchTools.jsx
import React from "react";

const PropertyResearchTools = () => {
  const tools = [
    {
      id: 1,
      title: "EMI Calculator",
      subtitle: "Find your monthly EMI",
      active: true,
      illustration: (
        <svg viewBox="0 0 160 120" className="w-full h-full">
          <circle cx="110" cy="70" r="45" fill="#FBE4C4" />
          <rect x="105" y="65" width="45" height="10" rx="2" fill="#F4C892" />
          <path d="M115 70 l20 -18 l20 18 v30 h-40 z" fill="#F4C892" />
          <rect x="35" y="35" width="45" height="70" rx="6" fill="#B45309" />
          <rect x="41" y="45" width="33" height="42" rx="2" fill="#fff" />
          <rect x="46" y="52" width="23" height="4" rx="1" fill="#B45309" />
          <rect x="46" y="60" width="18" height="4" rx="1" fill="#F4C892" />
          <rect x="46" y="68" width="20" height="4" rx="1" fill="#F4C892" />
          <circle cx="57" cy="98" r="3.5" fill="#fff" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Eligibility Calculator",
      subtitle: "Find your home loan limit",
      active: true,
      illustration: (
        <svg viewBox="0 0 160 120" className="w-full h-full">
          <circle cx="110" cy="70" r="45" fill="#FBE4C4" />
          <rect x="105" y="65" width="45" height="10" rx="2" fill="#F4C892" />
          <path d="M115 70 l20 -18 l20 18 v30 h-40 z" fill="#F4C892" />
          <rect x="38" y="30" width="48" height="72" rx="4" fill="#fff" stroke="#e5b877" strokeWidth="2" />
          <rect x="53" y="24" width="18" height="10" rx="2" fill="#B45309" />
          <rect x="46" y="45" width="20" height="20" rx="3" fill="#fff" stroke="#B45309" strokeWidth="2" />
          <path d="M50 55 l4 4 l8 -8" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="70" y="50" width="10" height="4" rx="1" fill="#B45309" />
          <rect x="46" y="72" width="20" height="20" rx="3" fill="#fff" stroke="#B45309" strokeWidth="2" />
          <path d="M50 82 l4 4 l8 -8" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="70" y="77" width="10" height="4" rx="1" fill="#B45309" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Affordability Calculator",
      subtitle: "Find the best budget for your home search",
      active: true,
      illustration: (
        <svg viewBox="0 0 160 120" className="w-full h-full">
          <circle cx="110" cy="70" r="45" fill="#FBE4C4" />
          <rect x="105" y="65" width="45" height="10" rx="2" fill="#F4C892" />
          <path d="M115 70 l20 -18 l20 18 v30 h-40 z" fill="#F4C892" />
          <rect x="35" y="55" width="55" height="42" rx="6" fill="#B45309" />
          <path d="M35 62 a12 12 0 0 1 12 -12 h31 v12 z" fill="#92400E" />
          <circle cx="74" cy="76" r="8" fill="#F4C892" />
          <rect x="46" y="40" width="35" height="22" rx="3" fill="#F4C892" transform="rotate(-8 46 40)" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Area Calculator",
      subtitle: "Calculator for land area conversion",
      active: false,
      illustration: (
        <svg viewBox="0 0 160 120" className="w-full h-full opacity-50">
          <circle cx="110" cy="70" r="45" fill="#F3EEE7" />
          <rect x="105" y="65" width="45" height="10" rx="2" fill="#E9E1D3" />
          <path d="M115 70 l20 -18 l20 18 v30 h-40 z" fill="#E9E1D3" />
          <rect x="35" y="35" width="45" height="65" rx="4" fill="#D8D2C6" />
          <rect x="42" y="45" width="12" height="12" fill="#fff" />
          <rect x="58" y="45" width="12" height="12" fill="#fff" />
          <rect x="42" y="61" width="12" height="12" fill="#fff" />
          <rect x="58" y="61" width="12" height="12" fill="#fff" />
          <rect x="42" y="77" width="28" height="10" fill="#fff" />
        </svg>
      ),
    },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
          User property research tools
        </h2>
        <p className="text-gray-500 text-sm">
          Calculate your borrowing power and understand your financial options
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`relative border border-gray-200 rounded-lg p-4 pb-16 hover:shadow-md transition-shadow bg-white ${
              !tool.active ? "opacity-60" : ""
            }`}
          >
            <h3
              className={`font-bold text-base leading-snug ${
                tool.active ? "text-[#B45309]" : "text-gray-400"
              }`}
            >
              {tool.title}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{tool.subtitle}</p>

            <div className="w-full h-[110px] mt-4">{tool.illustration}</div>

            <button
              disabled={!tool.active}
              className={`absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${
                tool.active
                  ? "bg-[#D97706] hover:bg-[#B45309]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              aria-label={`Open ${tool.title}`}
            >
              <i className="fas fa-arrow-right text-sm"></i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyResearchTools;