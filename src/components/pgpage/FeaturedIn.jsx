// FeaturedIn.jsx
import React from "react";

const FeaturedIn = () => {
  return (
    <section className="w-full bg-[#f3f4f6] py-10">
      <div className="max-w-[1300px] mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-14">
        <p className="text-gray-500 text-sm font-medium flex-shrink-0">Featured in</p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-12">
          {/* Your Story */}
          <span
            className="text-[#e11d3f] font-black text-lg leading-none uppercase tracking-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your
            <br />
            Story
          </span>

          {/* Business Insider */}
          <span
            className="text-gray-700 font-bold text-base leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            BUSINESS
            <br />
            INSIDER
          </span>

          {/* The Economic Times */}
          <span
            className="text-gray-600 italic text-base"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Economic Times
          </span>

          {/* Business Today */}
          <span className="text-[#1e73be] italic font-bold text-base">
            Business Today
          </span>

          {/* Inc42 */}
          <span className="text-gray-900 font-black text-lg">
            Inc<span className="text-[#e11d3f]">42</span>
          </span>

          {/* Dailyhunt */}
          <span className="flex items-center gap-1.5 text-gray-800 font-bold text-base">
            <span className="grid grid-cols-2 gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
            </span>
            dailyhunt
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;