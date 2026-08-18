// BuyPropertiesInStates.jsx
import React from "react";
import { Link } from "react-router-dom";

const BuyPropertiesInStates = () => {
  const states = [
    {
      id: 1,
      name: "Haryana",
      area: "haryana",
      image:
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 2,
      name: "Uttar Pradesh",
      area: "uttar-pradesh",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 3,
      name: "Maharashtra",
      area: "maharashtra",
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 4,
      name: "Karnataka",
      area: "karnataka",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 5,
      name: "Tamil Nadu",
      area: "tamil-nadu",
      image:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 6,
      name: "West Bengal",
      area: "west-bengal",
      image:
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 7,
      name: "Telangana",
      area: "telangana",
      image:
        "https://images.unsplash.com/photo-1621996659490-3399ca88ef53?w=500&h=400&fit=crop&auto=format",
    },
    {
      id: 8,
      name: "Gujarat",
      area: "gujarat",
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=400&fit=crop&auto=format",
    },
  ];

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-12">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl text-[#0b1a2e]">
          Buy <span className="font-bold">Properties in</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Properties to buy in states of top 12 cities
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {states.map((state) => (
          <Link
            key={state.id}
            to={`/buy/${state.area}`}
            className="relative h-[150px] rounded-lg overflow-hidden group"
          >
            <img
              src={state.image}
              alt={state.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>
            <p className="absolute bottom-3 left-3 text-white font-bold text-sm">
              {state.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BuyPropertiesInStates;