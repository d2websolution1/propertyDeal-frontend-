// ProminentProjects.jsx
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const ProminentProjects = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/home-sections/prominent_projects`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error("Failed to load Prominent Projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 480, behavior: "smooth" });
    }
  };

  // Nothing to show — hide the section instead of showing an empty block
  if (!loading && (!section || !section.items?.length)) return null;

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
            {section.items.map((project) => (
              <a
                key={project.id}
                href={project.link || "#"}
                className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-12px)] border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-[280px] w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[#0b1a2e] font-bold text-base leading-snug">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-gray-500 text-xs mt-0.5">
                          {project.subtitle}
                        </p>
                      )}
                    </div>
                    {project.price && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-[#0b1a2e] font-bold text-base leading-snug">
                          {project.price}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">Price</p>
                      </div>
                    )}
                  </div>

                  {project.location && (
                    <p className="text-gray-500 text-sm mt-3">{project.location}</p>
                  )}
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute top-[140px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
            aria-label="See more projects"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default ProminentProjects;