// ResearchAndInsights.jsx
import React from "react";

const ResearchAndInsights = () => {
  const items = [
    {
      id: 1,
      title: "Price Trends",
      subtitle: "Find property rates & price trends of top locations",
      illustration: (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect x="20" y="60" width="160" height="80" rx="6" fill="#E9E4FB" />
          <path
            d="M40 100 L70 75 L95 90 L125 55 L160 70"
            fill="none"
            stroke="#6C3EE6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="125" cy="55" r="4" fill="#6C3EE6" />
          <rect x="55" y="95" width="50" height="35" rx="3" fill="#0b1a2e" />
          <rect x="60" y="100" width="40" height="6" rx="2" fill="#6C3EE6" />
          <circle cx="85" cy="80" r="14" fill="#FCD9B8" />
          <path d="M71 92 q14 -10 28 0 v14 h-28 z" fill="#6C3EE6" />
          <circle cx="120" cy="82" r="13" fill="#F7B8C4" />
          <path d="M107 93 q13 -9 26 0 v13 h-26 z" fill="#0b1a2e" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "City Insights",
      subtitle: "Get to know about top cities before you invest",
      illustration: (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect x="30" y="40" width="30" height="90" fill="#E9E4FB" />
          <rect x="65" y="60" width="26" height="70" fill="#D9CFF7" />
          <rect x="96" y="35" width="30" height="95" fill="#E9E4FB" />
          <rect x="131" y="55" width="24" height="75" fill="#D9CFF7" />
          <circle cx="125" cy="70" r="13" fill="#F7B8C4" />
          <path d="M112 82 q13 -9 26 0 v40 h-26 z" fill="#6C3EE6" />
          <circle cx="80" cy="90" r="6" fill="#0b1a2e" />
          <path d="M74 98 q6 -4 12 0 v20 h-12 z" fill="#0b1a2e" />
          <ellipse cx="65" cy="128" rx="14" ry="8" fill="#FCD9B8" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Housing Research",
      subtitle: "Find reports on Indian residential market",
      illustration: (
        <svg viewBox="0 0 200 160" className="w-full h-full">
          <rect x="35" y="45" width="26" height="85" fill="#E9E4FB" />
          <rect x="65" y="30" width="30" height="100" fill="#D9CFF7" />
          <rect x="99" y="55" width="24" height="75" fill="#E9E4FB" />
          <rect x="55" y="95" width="55" height="35" rx="3" fill="#FCD34D" />
          <rect x="60" y="100" width="35" height="6" rx="2" fill="#fff" />
          <circle cx="128" cy="70" r="18" fill="none" stroke="#6C3EE6" strokeWidth="5" />
          <line
            x1="140"
            y1="83"
            x2="155"
            y2="98"
            stroke="#6C3EE6"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
          Research and Insights
        </h2>
        <p className="text-gray-500 text-sm">Explore useful real estate insights</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow bg-white"
          >
            <div className="w-[160px] h-[140px]">{item.illustration}</div>
            <h3 className="text-[#0b1a2e] font-bold text-lg mt-4">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResearchAndInsights;