// NewsAndArticles.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const getItems = (section) => {
  if (!section) return [];
  if (Array.isArray(section.items)) return section.items;
  if (typeof section.items === "string") {
    try {
      const parsed = JSON.parse(section.items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const NewsAndArticles = ({ sectionKey = "news_articles" }) => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/home-sections/${sectionKey}`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error(`Failed to load ${sectionKey}:`, err))
      .finally(() => setLoading(false));
  }, [sectionKey]);

  const items = getItems(section);
  if (!loading && items.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading row */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
            {loading ? "Loading..." : section.title}
          </h2>
          {section?.subtitle && (
            <p className="text-gray-500 text-sm">{section.subtitle}</p>
          )}
        </div>
        <button className="hidden sm:flex items-center border border-[#6C3EE6] text-[#6C3EE6] font-semibold text-sm px-4 py-2 rounded-md hover:bg-[#6C3EE6] hover:text-white transition-colors flex-shrink-0 whitespace-nowrap">
          See all news and articles <span className="ml-1">›</span>
        </button>
      </div>

      {!loading && (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.map((article, idx) => (
              <a key={article.id || idx} href={article.link || "#"}>
                <div className="h-[180px] w-full rounded-lg overflow-hidden mb-3">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-[#0b1a2e] font-bold text-base leading-snug mb-2">
                  {article.title}
                </h3>

                {article.subtitle && (
                  <p className="text-gray-500 text-sm leading-snug mb-3 line-clamp-3">
                    {article.subtitle}
                  </p>
                )}

                {(article.badge || article.price) && (
                  <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{article.badge}</span>
                    <span className="text-gray-500 text-xs">{article.price}</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* REA Group branding */}
      <div className="flex items-center justify-center gap-3 mt-14">
        <span className="text-gray-400 text-2xl md:text-3xl font-light">Part of</span>
        <svg viewBox="0 0 40 40" className="w-9 h-9 md:w-10 md:h-10">
          <circle cx="20" cy="20" r="20" fill="#E31E24" />
          <path d="M20 9 L31 18 V31 H24 V22 H16 V31 H9 V18 Z" fill="#fff" />
        </svg>
        <span className="text-gray-500 text-2xl md:text-3xl font-bold tracking-tight">
          REA Group
          <sup className="text-xs font-normal align-super ml-0.5">®</sup>
        </span>
      </div>
    </section>
  );
};

export default NewsAndArticles;