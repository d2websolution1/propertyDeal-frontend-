// TopHighlightedProjects.jsx
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

const TopHighlightedProjects = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/home-sections/top_highlighted_projects`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error("Failed to load Top Highlighted Projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 480, behavior: "smooth" });
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
            {items.map((project, idx) => {
              const [builder, type] = (project.subtitle || "").split(" · ");
              return (
                <a
                  key={project.id || idx}
                  href={project.link || "#"}
                  className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-12px)] relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-[240px] w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg leading-snug">
                      {project.title}
                    </h3>
                    {builder && <p className="text-white/80 text-xs mb-3">{builder}</p>}

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        {type && (
                          <p className="text-white font-semibold text-sm leading-snug">
                            {type}
                          </p>
                        )}
                        {project.location && (
                          <p className="text-white/80 text-sm">{project.location}</p>
                        )}
                      </div>
                      {project.price && (
                        <p className="text-white font-bold text-lg flex-shrink-0 whitespace-nowrap">
                          {project.price}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute top-[120px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
            aria-label="See more projects"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default TopHighlightedProjects;