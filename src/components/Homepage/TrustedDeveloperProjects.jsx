// TrustedDeveloperProjects.jsx
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

const TrustedDeveloperProjects = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/home-sections/trusted_developer_projects`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error("Failed to load Trusted Developer Projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
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
                  className="snap-start flex-shrink-0 w-[300px] rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
                >
                  <div className="h-[180px] w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-[#0b1a2e] font-bold text-base leading-snug">
                      {project.title}
                    </h3>
                    {builder && <p className="text-gray-500 text-xs mb-3">{builder}</p>}

                    {type && <p className="text-gray-700 text-sm">{type}</p>}
                    {project.location && (
                      <p className="text-gray-500 text-sm mb-4">{project.location}</p>
                    )}

                    {project.price && (
                      <p className="text-[#0b1a2e] font-bold text-base">{project.price}</p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute top-[240px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
            aria-label="See more projects"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default TrustedDeveloperProjects;