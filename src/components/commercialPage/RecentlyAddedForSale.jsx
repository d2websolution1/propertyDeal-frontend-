// RecentlyAddedForSale.jsx
import React from "react";

const RecentlyAddedForSale = () => {
  const properties = [
    {
      id: 1,
      title: "Ready to use Office Spa…",
      builder: "by Sudesh Kapoor",
      details: "575 sq.ft | 5% p.a.",
      location: "Nariman Point, Mumbai",
      price: "₹3.5 Cr",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 2,
      title: "Shop",
      builder: "by Dedhia Realtors",
      details: "432 sq.ft | 5% p.a.",
      location: "Suvarna Nagar, Vile Parle W…",
      price: "₹4.25 Cr",
      image:
        "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 3,
      title: "Commercial Plot",
      builder: "by Girish Kumar Dubey",
      details: "217800 sq.ft | 20% p.a.",
      location: "Naigaon East, Mumbai",
      price: "₹44.0 Cr",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&h=500&fit=crop&auto=format",
    },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl text-[#0b1a2e] mb-6">
        Recently Added Properties <span className="font-bold">for Sale</span>
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

export default RecentlyAddedForSale;