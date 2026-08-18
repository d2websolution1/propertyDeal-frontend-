// MembersTestimonial.jsx
import React, { useState } from "react";

// Cycles a handful of accent colors across words for the "highlighted reading" effect
const HIGHLIGHT_COLORS = ["#e07a3f", "#3b6fd8", "#1a1a1a"];

const ColorizedText = ({ text }) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => {
        // Every 5th-ish word gets an accent color, rest stay default gray
        const highlight = i % 5 === 2 || i % 7 === 0;
        const color = highlight ? HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length] : undefined;
        return (
          <span key={i} style={color ? { color } : undefined}>
            {word}{" "}
          </span>
        );
      })}
    </>
  );
};

const MembersTestimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Mudhit Khannawalia",
      role: "Co Living resident since last year",
      photo:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&h=750&fit=crop&auto=format",
      quote:
        "I am one of those who likes a lot of variety in my meals. Being away from my hometown, I was really worried about this while searching for places to stay. Thankfully, on Housing.com I found out in advance the kind of meals being served in PGs and Co-living properties. Now I am staying in a place that offers a lot to my taste.",
    },
    {
      id: 2,
      name: "Simran Kaur",
      role: "PG resident since 8 months",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&auto=format",
      quote:
        "Moving to a new city for work was stressful, but Housing.com made it so much easier. I could see verified photos, check the amenities and even compare rent before making a decision. It genuinely saved me weeks of searching around.",
    },
    {
      id: 3,
      name: "Rahul Deshmukh",
      role: "Co Living resident since 2 years",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&auto=format",
      quote:
        "What stood out for me was the transparency around house rules and pricing. No hidden charges, no last minute surprises. I've recommended Housing.com to at least five of my colleagues since then.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const total = testimonials.length;
  const active = testimonials[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-stretch">
        {/* Photo */}
        <div className="h-[360px] md:h-auto rounded-lg overflow-hidden">
          <img
            src={active.photo}
            alt={active.name}
            className="w-full h-full object-cover grayscale"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          <h2 className="text-[#0b1a2e] font-bold text-2xl mb-1">
            What our members say
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            These are <span style={{ color: "#e07a3f" }}>genuine</span> feedbacks from our
            member community
          </p>

          {/* Reviewer */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-black">
              <img
                src={active.photo}
                alt={active.name}
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div>
              <p className="text-[#0b1a2e] font-bold text-sm">{active.name}</p>
              <p className="text-gray-500 text-xs italic">{active.role}</p>
            </div>
          </div>

          {/* Quote */}
          <p className="text-gray-700 text-sm leading-relaxed max-w-[600px]">
            <ColorizedText text={active.quote} />
          </p>

          {/* Nav arrows */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={goPrev}
              className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <button
              onClick={goNext}
              className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembersTestimonial;