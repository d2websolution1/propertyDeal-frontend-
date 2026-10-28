// ProminentProjects.jsx
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const DEFAULT_PROJECTS = [
  {
    id: 'prom_1',
    title: "Jains Central Park East",
    builder: "by Jain Constructions",
    price: "₹1.22 Cr - 1.42 Cr",
    type: "3 BHK Apartment",
    location: "Narapally, Hyderabad",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&h=600&fit=crop&auto=format",
  },
  {
    id: 'prom_2',
    title: "KMR Luxor Exclusive",
    builder: "by KMR Estates & Builders Pvt.Ltd.",
    price: "₹1.06 Cr - 1.27 Cr",
    type: "2.5, 3 BHK Apartments",
    location: "Miyapur, Hyderabad",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop&auto=format",
  },
  {
    id: 'prom_3',
    title: "Sri Sai Enclave",
    builder: "by Sri Sai Builders",
    price: "₹85 L - 1.1 Cr",
    type: "2, 3 BHK Apartments",
    location: "Kondapur, Hyderabad",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&h=600&fit=crop&auto=format",
  },
  {
    id: 'prom_4',
    title: "Aparna Sarovar Zenith",
    builder: "by Aparna Constructions",
    price: "₹1.5 Cr - 2.2 Cr",
    type: "3, 4 BHK Apartments",
    location: "Nallagandla, Hyderabad",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&h=600&fit=crop&auto=format",
  },
];

const ProminentProjects = () => {
  const [sectionData, setSectionData] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/home-sections/prominent_projects`)
      .then((res) => {
        if (res.data) {
          setSectionData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const title = sectionData?.title || "Prominent projects to explore";
  const subtitle = sectionData?.subtitle || "Best projects to look out for";
  const rawItems = sectionData?.items;
  const items = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : DEFAULT_PROJECTS;

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 480, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
          {title}
        </h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      {/* Cards row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((project, idx) => {
            const projectImg = project.image || project.img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&h=600&fit=crop&auto=format";
            const projectTitle = project.title || "Luxury Project";
            const projectBuilder = project.subtitle || project.builder || project.desc || "";
            const projectPrice = project.price || "";
            const projectType = project.badge || project.type || "Apartment";
            const projectLocation = project.location || "";

            return (
              <div
                key={project.id || idx}
                className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-12px)] border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
              >
                {/* Image */}
                <div className="h-[280px] w-full overflow-hidden bg-gray-100">
                  <img
                    src={projectImg}
                    alt={projectTitle}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[#0b1a2e] font-bold text-base leading-snug">
                        {projectTitle}
                      </h3>
                      {projectBuilder && (
                        <p className="text-gray-500 text-xs mt-0.5">
                          {projectBuilder}
                        </p>
                      )}
                    </div>
                    {projectPrice && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-[#0b1a2e] font-bold text-base leading-snug text-[#2563eb]">
                          {projectPrice}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">Price</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[#0b1a2e] font-bold text-sm">
                        {projectType}
                      </p>
                      {projectLocation && (
                        <p className="text-gray-500 text-sm mt-0.5">
                          📍 {projectLocation}
                        </p>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-xs font-bold text-[#2563eb] hover:underline"
                      >
                        Explore →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute top-[140px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10 cursor-pointer"
          aria-label="See more projects"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
};

export default ProminentProjects;