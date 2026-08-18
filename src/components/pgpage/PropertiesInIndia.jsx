// PropertiesInIndia.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const PropertiesInIndia = () => {
  const cards = [
    {
      id: 1,
      title: "Flats in India",
      bg: "bg-[#e9e0f7]",
      path: "/flats-in-india",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 2,
      title: "Plots in India",
      bg: "bg-[#fdeecb]",
      path: "/plots",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 3,
      title: "Agricultural Lands in India",
      bg: "bg-[#d6ede0]",
      path: "/agricultural-lands-in-india",
      image:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 4,
      title: "Properties in India",
      bg: "bg-[#e9e0f7]",
      path: "/properties-in-india",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 5,
      title: "Villas in India",
      bg: "bg-[#fdeecb]",
      path: "/villas-in-india",
      image:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&h=400&fit=crop&auto=format",
    },
  ];

  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-12">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl text-[#0b1a2e]">
          Properties <span className="font-bold">in India</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Flats, Plots &amp; Agricultural lands in India
        </p>
      </div>

      {/* Scrollable cards */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        >
          {cards.map((card) => (
            <Link
              key={card.id}
              to={card.path}
              className={`snap-start flex-shrink-0 w-[260px] h-[220px] rounded-xl overflow-hidden relative ${card.bg} hover:shadow-md transition-shadow`}
            >
              <h3 className="absolute top-4 left-4 right-4 text-[#0b1a2e] font-bold text-base leading-snug z-10">
                {card.title}
              </h3>
              <div className="absolute bottom-0 left-0 right-0 h-[65%] rounded-t-xl overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll arrows */}
        <button
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center z-10"
          aria-label="Scroll left"
        >
          <i className="fas fa-chevron-left text-xs"></i>
        </button>
        <button
          onClick={() => scroll(1)}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center z-10"
          aria-label="Scroll right"
        >
          <i className="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </section>
  );
};

export default PropertiesInIndia;