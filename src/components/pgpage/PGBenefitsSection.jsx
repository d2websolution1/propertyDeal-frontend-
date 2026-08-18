// PGBenefitsSection.jsx
import React from "react";

const PGBenefitsSection = () => {
  const benefits = [
    {
      id: 1,
      doodle: "Thank God",
      doodleColor: "#ec4899",
      title: "Stress free search",
      subtitle: "Real property photos and Transparent pricing",
      illustration: (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <path d="M10 90 L60 20 L110 90 Z" fill="#fdeecb" />
          <rect x="35" y="55" width="50" height="35" fill="#f0a94e" />
          <rect x="45" y="65" width="14" height="20" fill="#fff" />
          <rect x="63" y="65" width="14" height="12" fill="#8a5cd6" opacity="0.6" />
          <circle cx="85" cy="45" r="12" fill="#f4b8c4" />
          <rect x="75" y="55" width="20" height="24" rx="6" fill="#ec4899" />
          <path d="M15 88 q5 -10 12 0" stroke="#2fb4a4" strokeWidth="2" fill="none" />
          <path d="M25 88 q5 -14 12 0" stroke="#2fb4a4" strokeWidth="2" fill="none" />
        </svg>
      ),
    },
    {
      id: 2,
      doodle: "Yayy",
      doodleColor: "#6C3EE6",
      title: "Find your Match",
      subtitle: "Lots of options to choose from (private, twin & multi-sharing)",
      illustration: (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <path d="M20 55 L60 20 L100 55 V90 H20 Z" fill="#fbe2ee" />
          <rect x="40" y="60" width="16" height="30" fill="#fff" stroke="#8a5cd6" strokeWidth="1.5" />
          <rect x="64" y="60" width="16" height="20" fill="#f0a94e" />
          <circle cx="35" cy="70" r="8" fill="#f4b8c4" />
          <rect x="27" y="78" width="16" height="14" rx="4" fill="#6C3EE6" />
          <circle cx="85" cy="72" r="8" fill="#2fb4a4" />
          <rect x="77" y="80" width="16" height="12" rx="4" fill="#ec4899" />
        </svg>
      ),
    },
    {
      id: 3,
      doodle: "Wow",
      doodleColor: "#ef4444",
      title: "Bon appetite",
      subtitle: "Info on meal type and offerings to know what's cooking",
      illustration: (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <path d="M30 90 L60 25 L90 90 Z" fill="#ede4fb" />
          <rect x="45" y="60" width="30" height="30" fill="#8a5cd6" opacity="0.8" />
          <rect x="52" y="68" width="16" height="10" fill="#fff" />
          <circle cx="60" cy="30" r="6" fill="#f0a94e" />
        </svg>
      ),
    },
    {
      id: 4,
      doodle: "omg",
      doodleColor: "#f59e0b",
      title: "Your Life, Your Rules",
      subtitle: "Advance info on house rules to live like you do",
      illustration: (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          <circle cx="60" cy="55" r="35" fill="#fdeecb" />
          <circle cx="35" cy="45" r="9" fill="#f4b8c4" />
          <rect x="26" y="54" width="18" height="26" rx="6" fill="#6C3EE6" />
          <circle cx="80" cy="45" r="9" fill="#8a5cd6" />
          <rect x="71" y="54" width="18" height="26" rx="6" fill="#2fb4a4" />
          <rect x="45" y="70" width="30" height="6" rx="3" fill="#f0a94e" />
        </svg>
      ),
    },
  ];

  const stats = [
    { value: "30k+", label: "Properties" },
    { value: "40+", label: "Cities" },
    { value: "3.5 Lakh+", label: "Monthly users" },
  ];

  return (
    <>
      <section className="max-w-[1300px] mx-auto px-4 py-12">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl text-[#0b1a2e] mb-8">
          Benefits of our <span className="font-bold">PG/Co-Living</span>
        </h2>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.id} className="flex flex-col items-center text-center">
              <div className="relative w-[110px] h-[100px]">
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold italic whitespace-nowrap"
                  style={{ color: b.doodleColor, fontFamily: "cursive" }}
                >
                  {b.doodle}
                </span>
                {b.illustration}
              </div>
              <h3 className="text-[#0b1a2e] font-bold text-sm mt-2">{b.title}</h3>
              <p className="text-gray-500 text-xs mt-1 max-w-[160px]">
                {b.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#181818] py-10">
        <div className="max-w-[1300px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-white font-extrabold text-3xl md:text-4xl">
                {s.value}
              </p>
              <p className="text-white/60 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PGBenefitsSection;