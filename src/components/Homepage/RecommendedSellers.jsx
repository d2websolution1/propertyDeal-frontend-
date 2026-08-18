// RecommendedSellers.jsx
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getItems = (section) => {
  if (!section) return [];
  if (Array.isArray(section.items)) return section.items;
  if (typeof section.items === "string") {
    try {
      const parsed = JSON.parse(section.items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const RecommendedSellers = ({ sectionKey = "recommended_sellers" }) => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/home-sections/${sectionKey}`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error(`Failed to load ${sectionKey}:`, err))
      .finally(() => setLoading(false));
  }, [sectionKey]);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const items = getItems(section);
  if (!loading && items.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
          {loading ? "Loading..." : section.title}
        </h2>
        {section?.subtitle && <p className="text-gray-500 text-sm">{section.subtitle}</p>}
      </div>

      {!loading && (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((seller, idx) => (
              <a
                key={seller.id || idx}
                href={seller.link || "#"}
                className="snap-start flex-shrink-0 w-[260px] rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
              >
                {/* Header */}
                <div className="bg-[#0b1a2e] px-4 py-3.5 flex items-center gap-2.5">
                  {seller.image && (
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={seller.image}
                        alt={seller.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-sm flex-1 truncate text-white">
                    {seller.title}
                  </h3>
                  <i className="fas fa-chevron-right text-xs text-white"></i>
                </div>

                {/* Body */}
                <div className="p-4">
                  {seller.subtitle && (
                    <p className="text-xs text-gray-600 mb-3">{seller.subtitle}</p>
                  )}

                  {seller.location && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {seller.location.split(",").map((loc, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-full"
                        >
                          {loc.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="w-full border border-[#6C3EE6] text-[#6C3EE6] hover:bg-[#6C3EE6] hover:text-white rounded-md py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    <i className="fas fa-phone-alt text-xs"></i>
                    {seller.badge || "Show Contact"}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute top-[80px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
            aria-label="See more sellers"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default RecommendedSellers;