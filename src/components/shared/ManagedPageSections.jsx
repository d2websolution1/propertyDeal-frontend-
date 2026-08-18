import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

const getItemTitle = (item) => item.title || item.name || item.heading || "Section card";
const getItemSubtitle = (item) => item.subtitle || item.description || item.summary || "";
const getItemPrice = (item) => item.price || item.amount || "";
const getItemLocation = (item) => item.location || item.area || item.city || "";
const getItemBadge = (item) => item.badge || item.category || "";
const getItemCta = (item) => item.ctaText || item.buttonText || item.linkText || "View";

const ManagedPageSections = ({ page }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/home-sections/page/${page}`)
      .then((res) => {
        if (isMounted) setSections(res.data || []);
      })
      .catch((err) => {
        console.error(`Failed to load sections for ${page}:`, err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page]);

  if (loading) return null;

  const visibleSections = sections.filter((section) => getItems(section).length > 0);
  if (visibleSections.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="space-y-6 sm:space-y-8">
        {visibleSections.map((section) => {
          const items = getItems(section);
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm"
            >
              <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1a2e]">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-gray-500 text-sm mt-1">{section.subtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {items.map((item, idx) => {
                  const title = getItemTitle(item);
                  const subtitle = getItemSubtitle(item);
                  const price = getItemPrice(item);
                  const location = getItemLocation(item);
                  const badge = getItemBadge(item);
                  const cta = getItemCta(item);

                  return (
                    <a
                      key={item.id || idx}
                      href={item.link || "#"}
                      className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 hover:shadow-md transition-shadow"
                    >
                      {item.image && (
                        <div className="h-[160px] sm:h-[180px] w-full">
                          <img
                            src={item.image}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4 sm:p-5">
                        {(badge || item.category) && (
                          <span className="inline-block mb-2 text-[10px] font-semibold uppercase tracking-wide bg-[#fdf2f8] text-[#be185d] px-2 py-1 rounded-full">
                            {badge || item.category}
                          </span>
                        )}

                        <h3 className="text-[#0b1a2e] font-bold text-base leading-snug">
                          {title}
                        </h3>

                        {subtitle && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-3">{subtitle}</p>
                        )}
                        {location && (
                          <p className="text-gray-500 text-sm mt-2">{location}</p>
                        )}
                        {price && (
                          <p className="text-[#6C3EE6] font-bold text-sm mt-2">{price}</p>
                        )}

                        {(item.link || cta) && (
                          <span className="mt-4 inline-flex items-center rounded-full bg-[#6C3EE6] px-3 py-1.5 text-sm font-semibold text-white">
                            {cta}
                          </span>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ManagedPageSections;
