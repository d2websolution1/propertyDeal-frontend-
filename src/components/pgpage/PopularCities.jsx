// PopularCities.jsx
import React from "react";
import { Link } from "react-router-dom";

const PopularCities = () => {
  const cities = [
    {
      id: 1,
      name: "Mumbai",
      area: "mumbai",
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=700&h=900&fit=crop&auto=format",
    },
    {
      id: 2,
      name: "Pune",
      area: "pune",
      image:
        "https://images.unsplash.com/photo-1626016470894-e0c11ab7f593?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 3,
      name: "Gurgaon",
      area: "gurgaon",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 4,
      name: "Chennai",
      area: "chennai",
      image:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=700&h=900&fit=crop&auto=format",
    },
    {
      id: 5,
      name: "Noida",
      area: "noida",
      image:
        "https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 6,
      name: "Bengaluru",
      area: "bengaluru",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 7,
      name: "Kolkata",
      area: "kolkata",
      image:
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=700&h=500&fit=crop&auto=format",
    },
  ];

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-14">
      {/* Heading */}
      <h2 className="text-center text-2xl md:text-3xl tracking-wide text-[#0b1a2e] mb-8">
        POPULAR <span className="font-bold">CITIES</span>
      </h2>

      {/* Mosaic grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "180px 180px 180px",
        }}
      >
        {/* Mumbai — tall, spans rows 1-2, column 1 */}
        <Link
          to={`/city/${cities[0].area}`}
          className="relative rounded-lg overflow-hidden group"
          style={{ gridColumn: "1", gridRow: "1 / 3" }}
        >
          <img
            src={cities[0].image}
            alt={cities[0].name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide">
            {cities[0].name.toUpperCase()}
          </p>
        </Link>

        {/* Pune — column 2, row 1 */}
        <Link
          to={`/city/${cities[1].area}`}
          className="relative rounded-lg overflow-hidden group"
          style={{ gridColumn: "2", gridRow: "1" }}
        >
          <img
            src={cities[1].image}
            alt={cities[1].name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide">
            {cities[1].name.toUpperCase()}
          </p>
        </Link>

        {/* Gurgaon — column 3, row 1 */}
        <Link
          to={`/city/${cities[2].area}`}
          className="relative rounded-lg overflow-hidden group"
          style={{ gridColumn: "3", gridRow: "1" }}
        >
          <img
            src={cities[2].image}
            alt={cities[2].name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide">
            {cities[2].name.toUpperCase()}
          </p>
        </Link>

        {/* Chennai — tall, spans rows 2-3, column 2 */}
        <Link
          to={`/city/${cities[3].area}`}
          className="relative rounded-lg overflow-hidden group"
          style={{ gridColumn: "2", gridRow: "2 / 4" }}
        >
          <img
            src={cities[3].image}
            alt={cities[3].name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide">
            {cities[3].name.toUpperCase()}
          </p>
        </Link>

        {/* Noida — column 3, row 2 */}
        <Link
          to={`/city/${cities[4].area}`}
          className="relative rounded-lg overflow-hidden group"
          style={{ gridColumn: "3", gridRow: "2" }}
        >
          <img
            src={cities[4].image}
            alt={cities[4].name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide">
            {cities[4].name.toUpperCase()}
          </p>
        </Link>

        {/* Bengaluru — column 1, row 3 */}
        <Link
          to={`/city/${cities[5].area}`}
          className="relative rounded-lg overflow-hidden group"
          style={{ gridColumn: "1", gridRow: "3" }}
        >
          <img
            src={cities[5].image}
            alt={cities[5].name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide">
            {cities[5].name.toUpperCase()}
          </p>
        </Link>

        {/* Kolkata — column 3, row 3 */}
        <Link
          to={`/city/${cities[6].area}`}
          className="relative rounded-lg overflow-hidden group"
          style={{ gridColumn: "3", gridRow: "3" }}
        >
          <img
            src={cities[6].image}
            alt={cities[6].name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white font-bold text-sm tracking-wide">
            {cities[6].name.toUpperCase()}
          </p>
        </Link>
      </div>
    </section>
  );
};

export default PopularCities;