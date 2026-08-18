
// src/components/PropertiesIndia.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

const categories = [
  {
    title: 'Flats in India',
    bg: 'bg-[#E9DFF5]',
    border: 'border-[#D8C3F0]',
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80',
  },
  {
    title: 'Plots in India',
    bg: 'bg-[#F4EAD6]',
    border: 'border-[#E8D5B2]',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  },
  {
    title: 'Agricultural Lands in India',
    bg: 'bg-[#DDF3E7]',
    border: 'border-[#BEE7CF]',
    image:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
  },
  {
    title: 'Properties in India',
    bg: 'bg-[#E9DFF5]',
    border: 'border-[#D8C3F0]',
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80',
  },
];

const PropertiesIndia = () => {
  return (
    <section className="bg-[#f3f3f3] py-12 px-4">
      <div className="max-w-[1100px] mx-auto">
        {/* Heading */}
        <h2 className="text-[42px] leading-tight font-bold text-[#1f2937]">
          Properties in India
        </h2>

        <p className="text-[#555] text-[18px] mt-2 mb-8">
          Flats, Plots & Agricultural lands in India
        </p>

        {/* Horizontal Scroll Cards */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {categories.map((item, index) => (
              <div
                key={index}
                className={`relative min-w-[255px] md:min-w-[270px] h-[360px] rounded-xl border ${item.border} ${item.bg} overflow-hidden flex-shrink-0`}
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-20 h-20 border border-pink-300 rounded-full opacity-70 translate-x-8 -translate-y-8"></div>
                <div className="absolute top-4 right-6 w-10 h-10 border border-pink-300 rounded-full opacity-70"></div>

                {/* Decorative dotted pattern */}
                <div className="absolute top-3 left-3 grid grid-cols-4 gap-1 opacity-30">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full bg-[#b98ce3]"
                    ></span>
                  ))}
                </div>

                {/* Title */}
                <div className="px-6 pt-6 relative z-10">
                  <h3 className="text-[20px] font-bold text-[#1f2937] leading-6 max-w-[190px]">
                    {item.title}
                  </h3>
                </div>

                {/* Bottom Image */}
                <div className="absolute bottom-0 left-0 w-full h-[215px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-bottom"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button className="hidden lg:flex absolute right-[-22px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center hover:bg-gray-50 transition">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertiesIndia;

