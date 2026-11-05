// NewsAndArticles.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [dynamicBlogs, setDynamicBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch both section settings and real dynamic published blogs
    Promise.all([
      axios.get(`${API_BASE_URL}/home-sections/${sectionKey}`).catch(() => ({ data: null })),
      axios.get(`${API_BASE_URL}/blogs`).catch(() => ({ data: [] })),
    ])
      .then(([sectionRes, blogsRes]) => {
        if (sectionRes.data) setSection(sectionRes.data);
        if (Array.isArray(blogsRes.data) && blogsRes.data.length > 0) {
          setDynamicBlogs(blogsRes.data.slice(0, 3));
        }
      })
      .finally(() => setLoading(false));
  }, [sectionKey]);

  const items = dynamicBlogs.length > 0
    ? dynamicBlogs.map((b) => ({
        id: b.id || b._id,
        title: b.title,
        subtitle: b.excerpt || b.content?.replace(/<[^>]+>/g, '').slice(0, 100) + '...',
        image: b.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        badge: b.category || 'Guide',
        link: `/blogs/${b.slug}`,
      }))
    : getItems(section);

  if (!loading && items.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading row */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b1a2e]">
            {loading ? "Loading..." : section?.title || "News & Articles"}
          </h2>
          {section?.subtitle && (
            <p className="text-gray-500 text-sm">{section.subtitle}</p>
          )}
        </div>
        <Link
          to="/blogs"
          className="hidden sm:flex items-center border border-[#005744] text-[#005744] font-semibold text-sm px-4 py-2 rounded-md hover:bg-[#005744] hover:text-white transition-colors flex-shrink-0 whitespace-nowrap"
        >
          See all news and articles <span className="ml-1">›</span>
        </Link>
      </div>

      {!loading && (
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.map((article, idx) => (
              <Link
                key={article.id || idx}
                to={article.link?.startsWith('/') ? article.link : `/blogs`}
                className="group block"
              >
                <div className="h-[180px] w-full rounded-lg overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-[#0b1a2e] font-bold text-base leading-snug mb-2 group-hover:text-[#005744] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {article.subtitle && (
                  <p className="text-gray-500 text-sm leading-snug mb-3 line-clamp-3">
                    {article.subtitle}
                  </p>
                )}

                {article.badge && (
                  <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                    <span className="text-[#005744] font-extrabold text-xs uppercase">{article.badge}</span>
                    <span className="text-gray-400 text-xs font-bold">Read article →</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsAndArticles;
