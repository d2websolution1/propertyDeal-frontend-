// frontend/src/components/common/AdBanner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://propertydeal-backend-w3yk.onrender.com/api';

const AdBanner = ({ position = 'header', className = '' }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API_BASE_URL}/ads${position ? `?position=${position}` : ''}`)
      .then((res) => {
        if (isMounted) {
          const fetchedAds = Array.isArray(res.data) ? res.data : [];
          setAds(fetchedAds);
        }
      })
      .catch((err) => {
        console.warn(`AdBanner (${position}) fetch notice:`, err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [position]);

  const handleAdClick = async (ad) => {
    try {
      const adId = ad._id || ad.id;
      if (adId) {
        axios.post(`${API_BASE_URL}/ads/${adId}/click`).catch(() => {});
      }
    } catch (e) {
      // ignore
    }
    if (ad.link) {
      if (ad.link.startsWith('http://') || ad.link.startsWith('https://')) {
        window.open(ad.link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = ad.link;
      }
    }
  };

  if (loading || ads.length === 0) return null;

  return (
    <div className={`w-full max-w-[1300px] mx-auto px-4 sm:px-6 my-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <div
            key={ad._id || ad.id}
            onClick={() => handleAdClick(ad)}
            className="group relative overflow-hidden rounded-2xl bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {/* Sponsored Badge */}
            <div className="absolute top-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-xs text-white text-[9.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              Ad · Sponsored
            </div>

            {/* Banner Image Container */}
            <div className="w-full h-36 sm:h-44 md:h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
              <img
                src={ad.image}
                alt={ad.title || 'Sponsored Advertisement'}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>

            {/* Banner Title & Call to Action Footer */}
            <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 bg-gradient-to-r from-slate-50 to-white">
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] truncate group-hover:text-[#2563eb] transition-colors">
                  {ad.title}
                </h4>
                <p className="text-[11px] text-[#64748b] truncate mt-0.5">
                  Verified Real Estate Partner
                </p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#2563eb] bg-blue-50 group-hover:bg-[#2563eb] group-hover:text-white px-2.5 py-1 rounded-lg transition-colors shadow-2xs">
                <span>View</span>
                <span>→</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdBanner;

