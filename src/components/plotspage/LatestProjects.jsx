import React from "react";
import {
  ChevronRight,
} from "lucide-react";

const LatestProjects = () => {
  const projects = [
    {
      name: "Mahagun Mywoods",
      details: "2, 2.5, 3, 4 BHK Apartments",
      location: "GH-04, Sector-16 C, Greater Noida",
      price: "₹78.83 L - 2.03 Cr",
      image:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80",
    },
    {
      name: "Lodha Upper Thane",
      details: "1, 2, 3 BHK Apartments",
      location: "Bhiwandi, Thane",
      price: "₹54.0 L - 1.36 Cr",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80",
    },
    {
      name: "ABA Cleo County",
      details: "3, 4 BHK Apartments",
      location: "Sector 121, Noida",
      price: "₹2.43 Cr - 10.25 Cr",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
    },
    {
      name: "Shantee Spring Field",
      builder: "by Shantee Homes",
      details: "Studio, 1, 2 BHK Apartments",
      location: "Naigaon East, Naigaon",
      price: "₹15.45 L - 1.1 Cr",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    },
    {
      name: "Prestige Lakeside Habitat",
      details: "1, 2, 2.5, 3, 3.5, 4 BHK Apartments",
      location: "Whitefield, Bangalore",
      price: "₹1.23 Cr - 3.93 Cr",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80",
    },
    {
      name: "Prateek Grand City",
      builder: "by Prateek Realtors India Pvt Ltd",
      details: "Property",
      location: "Siddharth Vihar, Ghaziabad",
      price: "Price on Request",
      image:
        "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=80",
    },
  ];

  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-[1100px] mx-auto relative">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-[#111827] mb-1">
          Latest Projects
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Most recently launched projects to explore.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow duration-300 flex h-[155px]"
            >
              {/* Image */}
              <div className="w-[42%] h-full">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="w-[58%] p-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#111827] leading-5 mb-1 line-clamp-2">
                    {project.name}
                  </h3>

                  {project.builder && (
                    <p className="text-[12px] text-gray-500 mb-1 truncate">
                      {project.builder}
                    </p>
                  )}

                  <p className="text-[13px] text-gray-700 leading-4 mb-1 line-clamp-2">
                    {project.details}
                  </p>

                  <p className="text-[13px] text-gray-500 truncate">
                    {project.location}
                  </p>
                </div>

                <p className="text-[15px] font-bold text-[#111827] mt-2">
                  {project.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button className="hidden lg:flex absolute right-[-28px] top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center hover:bg-gray-50">
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default LatestProjects;