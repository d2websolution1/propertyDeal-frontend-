// HousingExperts.jsx
import React, { useRef } from "react";

const HousingExperts = () => {
  const experts = [
    {
      id: 1,
      name: "Dedhia Realtors",
      avatar:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format",
      experience: "27 years",
      listings: "68",
      localities: ["Juhu", "Vile Parle West"],
    },
    {
      id: 2,
      name: "Sudesh Kapoor",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&auto=format",
      experience: "51 years",
      listings: "90",
      localities: ["Cuffe Parade", "Colaba"],
    },
    {
      id: 3,
      name: "Nimeet Parekh",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
      experience: "11 years",
      listings: "40",
      localities: ["Worli", "Lower Parel"],
    },
    {
      id: 4,
      name: "Girish Kumar Dubey",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&auto=format",
      experience: "10 years",
      listings: "39",
      localities: ["Naigaon East", "Vajulsar"],
    },
  ];

  const scrollRef = useRef(null);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl text-[#0b1a2e]">
          Housing <span className="font-bold">Experts</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Sellers with complete knowledge about locality and verified listings
        </p>
      </div>

      {/* Cards row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="snap-start flex-shrink-0 w-[260px] rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow bg-white"
            >
              {/* Avatar + name + badge */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#0b1a2e] font-bold text-sm leading-tight">
                    {expert.name}
                  </h3>
                  <span className="inline-block mt-1 bg-[#fdeccb] text-[#b45309] text-[10px] font-bold px-2 py-0.5 rounded">
                    HOUSING EXPERT
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-3">
                <div>
                  <p className="text-[#0b1a2e] font-bold text-sm">
                    {expert.experience}
                  </p>
                  <p className="text-gray-400 text-xs">Experience</p>
                </div>
                <div>
                  <p className="text-[#0b1a2e] font-bold text-sm">
                    {expert.listings}
                  </p>
                  <p className="text-gray-400 text-xs">Total listings</p>
                </div>
              </div>

              {/* Locality pills */}
              <div className="flex flex-wrap gap-2">
                {expert.localities.map((loc, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-full"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute top-[70px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
          aria-label="See more experts"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
};

export default HousingExperts;