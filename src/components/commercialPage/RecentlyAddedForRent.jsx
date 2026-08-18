// RecentlyAddedForRent.jsx
import React from "react";

const RecentlyAddedForRent = () => {
  const properties = [
    {
      id: 1,
      title: "Ready to use Office Spa…",
      builder: "by Sudesh Kapoor",
      details: "1173 sq.ft",
      location: "Nariman Point, Mumbai",
      price: "₹4.4 Lacs",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 2,
      title: "Warehouse",
      builder: "by Girish Kumar Dubey",
      details: "100000 sq.ft",
      location: "Vajulsar, Haranwali, Mumbai",
      price: "₹30 Lacs",
      image:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 3,
      title: "Ready to use Office Spa…",
      builder: "by Nimeet Parekh",
      details: "400 sq.ft",
      location: "Lower Parel, Mumbai",
      price: "₹2.7 Lacs",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&h=500&fit=crop&auto=format",
    },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl text-[#0b1a2e] mb-6">
        Recently Added Properties <span className="font-bold">for Rent</span>
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
          >
            {/* Image */}
            <div className="h-[160px] w-full">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-[#0b1a2e] font-bold text-base truncate">
                {property.title}
              </h3>
              <p className="text-gray-500 text-xs mb-3">{property.builder}</p>

              <p className="text-gray-700 text-sm">{property.details}</p>
              <p className="text-gray-500 text-sm mb-3">{property.location}</p>

              <p className="text-[#0b1a2e] font-bold text-base">
                {property.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyAddedForRent;