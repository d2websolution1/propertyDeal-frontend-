// HomeAtFirstSight.jsx
import React from "react";

const HomeAtFirstSight = () => {
  const features = [
    {
      id: 1,
      text: "Verified & Onboarded by our experts",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#f59e0b">
          <circle cx="12" cy="12" r="12" opacity="0.15" />
          <path
            d="M7 12.5l3 3 7-7"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      highlight: "bg-[#fdeecb]",
    },
    {
      id: 2,
      text: "Every property detail on just a click",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#6C3EE6">
          <path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z" />
        </svg>
      ),
      highlight: "bg-[#ede4fb]",
    },
    {
      id: 3,
      text: "Genuine & vast userbase",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ec4899">
          <circle cx="8" cy="9" r="3" />
          <circle cx="16" cy="9" r="3" />
          <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6H2z" />
          <path d="M13 14.2c2.9.6 5 3 5 5.8h-3.2c0-1.8-.7-3.4-1.8-4.6z" />
        </svg>
      ),
      highlight: "bg-[#fbe2ee]",
    },
  ];

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-14 relative overflow-hidden">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl text-[#0b1a2e] mb-8">
        Home at <span className="font-bold">First Sight</span>
      </h2>

      {/* Checklist */}
      <div className="flex flex-col gap-4 mb-10 max-w-[420px]">
        {features.map((f) => (
          <div key={f.id} className="flex items-center gap-3">
            <span className="flex-shrink-0">{f.icon}</span>
            <span className={`text-[#1e2a3a] font-medium text-[15px] px-1 ${f.highlight}`}>
              {f.text}
            </span>
          </div>
        ))}
      </div>

      {/* Illustration area */}
      <div className="relative h-[420px] hidden md:block">
        {/* Dot grid pattern (bottom-left) */}
        <div
          className="absolute left-0 bottom-0 w-[130px] h-[130px] opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Small yellow dot */}
        <div className="absolute left-[145px] bottom-[70px] w-3 h-3 rounded-full bg-[#f5d576]"></div>

        {/* Large cream circle (behind phone) */}
        <div className="absolute right-[60px] top-0 w-[280px] h-[280px] rounded-full bg-[#fdf1cf] border-2 border-[#f5d576]"></div>

        {/* Group of people illustration (simplified flat vector) */}
        <svg
          className="absolute left-[280px] bottom-0 w-[260px] h-[220px]"
          viewBox="0 0 260 220"
          fill="none"
        >
          {/* Decorative shapes behind */}
          <polygon points="20,140 90,80 90,180" fill="#fbe2ee" />
          <polygon points="70,60 140,20 140,120" fill="#ede4fb" opacity="0.7" />
          <rect x="120" y="70" width="60" height="60" fill="#fdf1cf" transform="rotate(20 150 100)" />

          {/* Person 1 (sitting, left) */}
          <circle cx="55" cy="150" r="12" fill="#f4b8c4" />
          <rect x="42" y="162" width="26" height="34" rx="6" fill="#f97ba0" />

          {/* Sofa */}
          <rect x="80" y="175" width="90" height="22" rx="4" fill="#f0a94e" />
          <rect x="80" y="160" width="18" height="37" rx="4" fill="#e0993f" />
          <rect x="152" y="160" width="18" height="37" rx="4" fill="#e0993f" />

          {/* Person 2 (sitting, middle) */}
          <circle cx="110" cy="150" r="12" fill="#8a5cd6" />
          <rect x="97" y="162" width="26" height="34" rx="6" fill="#5b3ab8" />

          {/* Person 3 (sitting, right) */}
          <circle cx="150" cy="148" r="12" fill="#2fb4a4" />
          <rect x="137" y="160" width="26" height="36" rx="6" fill="#20857a" />

          {/* Floating icons */}
          <rect x="185" y="100" width="16" height="20" rx="2" fill="#f97ba0" transform="rotate(-15 193 110)" />
          <rect x="195" y="130" width="14" height="18" rx="2" fill="#8a5cd6" transform="rotate(10 202 139)" />
        </svg>

        {/* Phone mockup */}
        <div className="absolute left-[500px] bottom-0 w-[150px] h-[300px] bg-white rounded-[24px] border-[3px] border-[#0b1a2e] shadow-2xl overflow-hidden">
          {/* App header */}
          <div className="bg-[#3b2f8e] h-8 flex items-center px-2">
            <div className="w-3 h-3 rounded-sm bg-[#ffb300] mr-1"></div>
            <span className="text-white text-[8px] font-bold">HOUSING.COM</span>
          </div>
          {/* App body */}
          <div className="p-2">
            <div className="bg-gray-100 rounded h-6 mb-2"></div>
            <div className="bg-[#fdf1cf] rounded h-24 mb-2 relative">
              <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                <span className="text-[6px]">♥</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-14 h-2 bg-gray-200 rounded"></div>
              <div className="w-8 h-2 bg-[#6C3EE6] rounded"></div>
            </div>
            <div className="grid grid-cols-3 gap-1 mb-2">
              <div className="h-8 bg-gray-100 rounded"></div>
              <div className="h-8 bg-gray-100 rounded"></div>
              <div className="h-8 bg-gray-100 rounded"></div>
            </div>
            <div className="bg-[#3cb878] rounded h-6"></div>
          </div>
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#0b1a2e]/30 rounded-full"></div>
        </div>

        {/* Standing person (right of phone) */}
        <svg
          className="absolute left-[650px] bottom-0 w-[130px] h-[280px]"
          viewBox="0 0 130 280"
          fill="none"
        >
          <circle cx="55" cy="40" r="20" fill="#f4b8c4" />
          <path d="M35 30 q20 -25 40 0 v10 h-40 z" fill="#1a1a1a" />
          <rect x="30" y="60" width="50" height="80" rx="10" fill="#6C3EE6" />
          <rect x="15" y="70" width="20" height="55" rx="8" fill="#f4b8c4" />
          <rect x="75" y="70" width="20" height="55" rx="8" fill="#f4b8c4" />
          <rect x="35" y="135" width="18" height="90" fill="#1e2a3a" />
          <rect x="58" y="135" width="18" height="90" fill="#1e2a3a" />
          <rect x="30" y="215" width="26" height="16" rx="4" fill="#ec4899" />
          <rect x="55" y="215" width="26" height="16" rx="4" fill="#ec4899" />
        </svg>

        {/* Small plant (bottom right) */}
        <svg
          className="absolute right-[10px] bottom-0 w-[70px] h-[100px]"
          viewBox="0 0 70 100"
          fill="none"
        >
          <ellipse cx="35" cy="80" rx="22" ry="18" fill="#f0a94e" />
          <path d="M35 80 q-10 -30 0 -50" stroke="#1a5c4a" strokeWidth="4" fill="none" />
          <ellipse cx="20" cy="35" rx="10" ry="16" fill="#2fb4a4" transform="rotate(-20 20 35)" />
          <ellipse cx="35" cy="20" rx="10" ry="18" fill="#1a5c4a" />
          <ellipse cx="50" cy="35" rx="10" ry="16" fill="#2fb4a4" transform="rotate(20 50 35)" />
        </svg>
      </div>
    </section>
  );
};

export default HomeAtFirstSight;