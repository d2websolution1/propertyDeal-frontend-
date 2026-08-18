// HousingTopPicks.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

const PEEK = 150; // width (px) of next card's peek visible on the right

const HousingTopPicks = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1000);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/home-sections/housing_top_picks`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error("Failed to load Housing's top picks:", err))
      .finally(() => setLoading(false));
  }, []);

  const properties = getItems(section);
  const total = properties.length;
  const cardWidth = Math.max(containerWidth - PEEK, 320);

  const measure = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (isPlaying && total > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % total);
      }, 4000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, total]);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % total);
  const togglePlay = () => setIsPlaying((p) => !p);

  if (!loading && total === 0) return null;

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

      {!loading && total > 0 && (
        <>
          {/* Top thumbnail strip */}
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {properties.map((property, index) => (
              <button
                key={property.id || index}
                onClick={() => setActiveIndex(index)}
                className="flex-shrink-0 w-[140px] text-left focus:outline-none group"
              >
                <div
                  className={`h-[90px] rounded-lg overflow-hidden border-2 transition-colors ${
                    index === activeIndex
                      ? "border-[#6C3EE6]"
                      : "border-transparent group-hover:border-gray-300"
                  }`}
                >
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className={`text-xs mt-1 truncate ${
                    index === activeIndex
                      ? "text-[#0b1a2e] font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {property.title}
                </p>
              </button>
            ))}
          </div>

          {/* Main slider */}
          <div className="relative">
            <div
              ref={containerRef}
              className="relative w-full h-[400px] overflow-hidden rounded-2xl"
            >
              {/* Sliding track */}
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * cardWidth}px)` }}
              >
                {properties.map((property, idx) => {
                  const [companyName, propertyType] = (property.subtitle || "").split(" · ");
                  const logoLetter = (companyName || property.title || "?").charAt(0).toUpperCase();

                  return (
                    <div
                      key={property.id || idx}
                      className="h-full flex-shrink-0 flex shadow-lg"
                      style={{ width: `${cardWidth}px` }}
                    >
                      {/* Left info panel */}
                      <div className="w-[300px] flex-shrink-0 bg-gradient-to-br from-[#f3ecff] via-[#fbe8f0] to-[#fff1e8] p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-md text-white flex items-center justify-center font-bold text-lg bg-[#0b1a2e] flex-shrink-0">
                              {logoLetter}
                            </div>
                            <div className="min-w-0">
                              {companyName && (
                                <p className="font-bold text-[#0b1a2e] leading-tight text-sm truncate">
                                  {companyName}
                                </p>
                              )}
                              <a
                                href={property.link || "#"}
                                className="text-[#6C3EE6] text-xs font-semibold hover:text-[#5b34c9]"
                              >
                                View Projects
                              </a>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-[#0b1a2e] mb-1">
                            {property.title}
                          </h3>
                          {property.location && (
                            <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                              <i className="fas fa-map-marker-alt text-[#6C3EE6]"></i>
                              {property.location}
                            </p>
                          )}

                          {property.price && (
                            <p className="text-[#6C3EE6] font-bold text-lg mb-0.5">
                              {property.price}
                            </p>
                          )}
                          {propertyType && (
                            <p className="text-gray-600 text-sm mb-3">{propertyType}</p>
                          )}

                          {property.badge && (
                            <p className="text-gray-600 text-xs mb-4 flex items-center gap-1">
                              <i className="fas fa-map-pin text-[#6C3EE6]"></i>
                              {property.badge}
                            </p>
                          )}
                        </div>

                        <button className="w-full bg-[#6C3EE6] hover:bg-[#5b34c9] text-white font-semibold py-2.5 rounded-lg transition-colors">
                          Contact
                        </button>
                      </div>

                      {/* Right image */}
                      <div className="relative flex-1 bg-black overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Play / Pause button */}
              {total > 1 && (
                <button
                  onClick={togglePlay}
                  className="absolute top-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20"
                  style={{ right: `${PEEK + 12}px` }}
                  aria-label={isPlaying ? "Pause slider" : "Play slider"}
                >
                  {isPlaying ? (
                    <i className="fas fa-pause text-sm"></i>
                  ) : (
                    <i className="fas fa-play text-sm ml-0.5"></i>
                  )}
                </button>
              )}
            </div>

            {total > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] flex items-center justify-center transition-shadow z-20"
                  aria-label="Previous property"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <button
                  onClick={goNext}
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] flex items-center justify-center transition-shadow z-20"
                  style={{ right: `${Math.max(PEEK - 20, 8)}px` }}
                  aria-label="Next property"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {total > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {properties.map((property, index) => (
                <button
                  key={property.id || index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-6 bg-[#6C3EE6]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default HousingTopPicks;