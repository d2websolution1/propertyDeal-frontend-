// NewlyAddedProperties.jsx
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

// sectionKey defaults to the Homepage key so existing usage keeps working unchanged.
// Pass a different key (e.g. "rent_newly_added_properties") to show separate content on another page.
const NewlyAddedProperties = ({ sectionKey = "newly_added_properties" }) => {
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
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
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
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((property, idx) => (
              <a
                key={property.id || idx}
                href={property.link || "#"}
                className="snap-start flex-shrink-0 w-[260px]"
              >
                <div className="h-[180px] w-full rounded-lg overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pt-3">
                  <h3 className="text-[#0b1a2e] font-bold text-base leading-snug">
                    {property.title}
                  </h3>
                  {property.subtitle && (
                    <p className="text-gray-500 text-sm">{property.subtitle}</p>
                  )}
                  {property.location && (
                    <p className="text-gray-500 text-sm">{property.location}</p>
                  )}
                  {property.price && (
                    <p className="text-[#6C3EE6] font-bold text-sm mt-1">{property.price}</p>
                  )}
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute top-[90px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
            aria-label="See more properties"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default NewlyAddedProperties;