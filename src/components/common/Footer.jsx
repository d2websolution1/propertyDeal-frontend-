// frontend/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PropertyDealLogo } from './Header';

const Footer = () => {
  const topCities = [
    'Flats in Mumbai',
    'Flats in Delhi NCR',
    'Properties in Noida',
    'Flats in Greater Noida West',
    'Properties in Gurgaon',
    'Apartments in Bengaluru',
    'Homes in Pune',
    'Plots on Yamuna Expressway',
  ];

  return (
    <footer className="bg-[#0f172a] text-[#94a3b8] pt-14 pb-8 border-t border-[#1e293b] relative">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#1e293b]">
          {/* Brand Col */}
          <div className="space-y-4">
            <PropertyDealLogo size={36} textColor="text-white" />
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              India's trusted real estate marketplace. Buy, sell, or rent flats, builder floors, plots, and commercial properties directly from owners and verified agents.
            </p>
            <div className="text-xs text-[#cbd5e1] font-semibold">
              Over 71,000+ verified listings across major Indian cities.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore PropertyDeal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Residential Properties for Sale</Link></li>
              <li><Link to="/rent" className="hover:text-white transition-colors">Flats & Houses for Rent</Link></li>
              <li><Link to="/commercial" className="hover:text-white transition-colors">Commercial Shops & Office Spaces</Link></li>
              <li><Link to="/plots" className="hover:text-white transition-colors">Residential Plots & Land</Link></li>
              <li><Link to="/pg-co-living" className="hover:text-white transition-colors">PG & Co-Living Spaces</Link></li>
              <li><Link to="/post-property" className="text-[#f59e0b] hover:underline font-bold">Post Property for FREE →</Link></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Popular Searches
            </h4>
            <ul className="space-y-2.5 text-xs">
              {topCities.map((city, idx) => (
                <li key={idx}>
                  <Link to={`/?q=${encodeURIComponent(city)}`} className="hover:text-white transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Admin & Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563eb] text-white font-bold hover:bg-[#1d4ed8] transition-colors shadow-xs"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>PropertyDeal Admin Login</span>
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-[#94a3b8]">
                Admin Credentials: <br />
                <span className="text-[#f59e0b] font-mono">admin@propertydeal.com</span> / <span className="text-[#f59e0b] font-mono">admin123</span>
              </li>
              <li className="pt-2"><a href="tel:+919876543210" className="hover:text-white">Customer Support: +91 98765 43210</a></li>
              <li><a href="mailto:support@propertydeal.com" className="hover:text-white">Email: support@propertydeal.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <p>© {new Date().getFullYear()} PropertyDeal Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Action */}
      <a
        href="https://wa.me/919876543210?text=Hi%20PropertyDeal,%20I%20am%20interested%20in%20properties"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-5 bottom-6 z-50 w-13 h-13 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform animate-hw-pulse-glow"
        title="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2 1.054.94 1.62 1.026 1.83 1.116.21.09.332.072.455-.069.123-.141.52-.607.66-.815.14-.208.28-.173.473-.101.193.072 1.226.578 1.438.684.212.106.353.159.405.249.052.09.052.52-.092.925z" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer;