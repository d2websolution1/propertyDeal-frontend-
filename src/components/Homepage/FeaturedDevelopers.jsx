// FeaturedDevelopers.jsx
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

// Safely returns an array of items, whether the backend sent a real array
// or a JSON-stringified array.
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

const FeaturedDevelopers = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/home-sections/featured_developers`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error("Failed to load Featured Developers:", err))
      .finally(() => setLoading(false));
  }, []);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  const items = getItems(section);
  if (!loading && items.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
          {loading ? "Loading..." : section.title}
        </h2>
        {section?.subtitle && (
          <p className="text-gray-500 text-sm">{section.subtitle}</p>
        )}
      </div>

      {!loading && (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((dev, idx) => (
              <a
                key={dev.id || idx}
                href={dev.link || "#"}
                className="snap-start flex-shrink-0 w-[320px] rounded-2xl border border-gray-100 border-t-4 border-t-[#6C3EE6] shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  {/* Logo + name + stats */}
                  <div className="flex items-start gap-3 mb-3">
                    {dev.image && (
                      <div className="w-14 h-14 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center">
                        <img
                          src={dev.image}
                          alt={dev.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#0b1a2e] font-bold text-base leading-snug mb-1">
                        {dev.title}
                      </h3>
                      {dev.badge && (
                        <p className="text-[#6C3EE6] font-semibold text-xs">
                          {dev.badge}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {dev.subtitle && (
                    <p className="text-gray-500 text-sm leading-snug line-clamp-3 mb-3">
                      {dev.subtitle}
                    </p>
                  )}

                  {/* Location + price */}
                  <div className="flex items-center justify-between">
                    {dev.location && (
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <i className="fas fa-map-marker-alt text-[#6C3EE6]"></i>
                        {dev.location}
                      </span>
                    )}
                    {dev.price && (
                      <span className="text-[#0b1a2e] font-bold text-sm">
                        {dev.price}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute top-[110px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
            aria-label="See more developers"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedDevelopers;