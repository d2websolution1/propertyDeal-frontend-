// ProminentProjects.jsx
import React, { useRef } from "react";

const ProminentProjects = () => {
  const projects = [
    {
      id: 1,
      title: "Jains Central Park East",
      builder: "by Jain Constructions",
      price: "₹1.22 Cr - 1.42 Cr",
      type: "3 BHK Apartment",
      location: "Narapally, Hyderabad",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&h=600&fit=crop&auto=format",
    },
    {
      id: 2,
      title: "KMR Luxor Exclusive",
      builder: "by KMR Estates & Builders Pvt.Ltd.",
      price: "₹1.06 Cr - 1.27 Cr",
      type: "2.5, 3 BHK Apartments",
      location: "Miyapur, Hyderabad",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop&auto=format",
    },
    {
      id: 3,
      title: "Sri Sai Enclave",
      builder: "by Sri Sai Builders",
      price: "₹85 L - 1.1 Cr",
      type: "2, 3 BHK Apartments",
      location: "Kondapur, Hyderabad",
      image:
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&h=600&fit=crop&auto=format",
    },
    {
      id: 4,
      title: "Aparna Sarovar Zenith",
      builder: "by Aparna Constructions",
      price: "₹1.5 Cr - 2.2 Cr",
      type: "3, 4 BHK Apartments",
      location: "Nallagandla, Hyderabad",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&h=600&fit=crop&auto=format",
    },
  ];

  const scrollRef = useRef(null);

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
          Prominent projects to explore
        </h2>
        <p className="text-gray-500 text-sm">Best projects to look out for</p>
      </div>

      {/* Cards row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-12px)] border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="h-[280px] w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[#0b1a2e] font-bold text-base leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {project.builder}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#0b1a2e] font-bold text-base leading-snug">
                      {project.price}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">Price</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[#0b1a2e] font-bold text-sm">
                    {project.type}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {project.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute top-[140px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
          aria-label="See more projects"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
};

export default ProminentProjects;