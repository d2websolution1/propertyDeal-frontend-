// HandpickedCollections.jsx
import React from "react";

const HandpickedCollections = () => {
  const collections = [
    {
      id: 1,
      label: "For Guys",
      image:
        "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&h=600&fit=crop&auto=format",
    },
    {
      id: 2,
      label: "For Girls",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop&auto=format",
    },
    {
      id: 3,
      label: "Food Available",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=600&fit=crop&auto=format",
    },
    {
      id: 4,
      label: "Private Room",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=600&fit=crop&auto=format",
    },
  ];

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-12">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl text-[#0b1a2e] mb-8">
        Our handpicked <span className="font-bold">Collections</span>
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {collections.map((c) => (
          <div
            key={c.id}
            className="relative h-[260px] rounded-lg overflow-hidden group cursor-pointer"
          >
            <img
              src={c.image}
              alt={c.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-bold text-base">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HandpickedCollections;