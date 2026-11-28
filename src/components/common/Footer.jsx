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
    <footer className="bg-[#142D4E] text-slate-300 pt-14 pb-8 border-t border-[#1e3a61] relative">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#1e3a61]">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="bg-white px-3.5 py-1.5 rounded-xl inline-block shadow-sm">
              <PropertyDealLogo height={38} className="h-9 w-auto" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real estate at one place - India's trusted property marketplace. Buy, sell, or rent flats, builder floors, plots, and commercial properties directly from owners and verified agents.
            </p>
            <div className="text-xs text-slate-200 font-semibold">
              Over 71,000+ verified listings across Delhi NCR, Jaipur, Mumbai & major Indian cities.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Properties
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Residential Properties for Sale</Link></li>
              <li><Link to="/rent" className="hover:text-white transition-colors">Flats & Houses for Rent</Link></li>
              <li><Link to="/commercial" className="hover:text-white transition-colors">Commercial Shops & Offices</Link></li>
              <li><Link to="/plots" className="hover:text-white transition-colors">Residential Plots & Land</Link></li>
              <li><Link to="/pg-co-living" className="hover:text-white transition-colors">PG & Co-Living Spaces</Link></li>
              <li><Link to="/post-property" className="text-[#D62839] hover:text-[#ff4d5e] font-extrabold inline-block pt-1">Post Property for FREE →</Link></li>
            </ul>
          </div>

          {/* Latest News & Support (Moved from Header) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <span>📰</span> Latest News & Support
            </h4>
            <div className="space-y-2.5">
              {/* 1. Latest News & Blogs */}
              <Link
                to="/blogs"
                className="block p-2.5 rounded-xl bg-[#1b3a63]/80 hover:bg-[#22477a] border border-[#264977] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📰</span>
                    <strong className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                      Latest News & Blogs
                    </strong>
                  </div>
                  <span className="text-[10px] text-blue-300 font-bold">Explore →</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Real estate market news, price trends & homebuyer guides
                </p>
              </Link>

              {/* 2. About Us */}
              <Link
                to="/about-us"
                className="block p-2.5 rounded-xl bg-[#1b3a63]/80 hover:bg-[#22477a] border border-[#264977] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">ℹ️</span>
                    <strong className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      About Us
                    </strong>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">Read →</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Learn about Property Adda, 100% verified listings & transparency
                </p>
              </Link>

              {/* 3. Contact Support */}
              <Link
                to="/contact-us"
                className="block p-2.5 rounded-xl bg-[#1b3a63]/80 hover:bg-[#22477a] border border-[#264977] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📞</span>
                    <strong className="text-xs font-bold text-white group-hover:text-green-300 transition-colors">
                      Contact Support
                    </strong>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">Live Desk →</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  +91 9672 056 670 • WhatsApp chat & instant inquiries desk
                </p>
              </Link>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact & Helpdesk
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <i className="fas fa-phone-alt text-[#D62839] text-xs"></i>
                <a href="tel:+919672056670" className="hover:text-white">+91 9672 056 670</a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-phone-alt text-[#D62839] text-xs"></i>
                <a href="tel:+919509505892" className="hover:text-white">+91 9509 505 892</a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-envelope text-[#D62839] text-xs"></i>
                <a href="mailto:info@property-adda.com" className="hover:text-white">info@property-adda.com</a>
              </li>
              <li className="pt-2 text-[11px] text-slate-300 flex items-center gap-2">
                <i className="fas fa-clock text-[#D62839] text-xs"></i>
                <span>Mon - Sat: 9:00 AM – 7:00 PM</span>
              </li>
              <li className="text-[11px] text-slate-300 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-[#D62839] text-xs"></i>
                <span>Jaipur & Delhi NCR, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular Searches Bar */}
        <div className="py-3.5 border-b border-[#1e3a61]/80 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-300">
          <span className="text-white font-bold uppercase tracking-wider text-[10px]">Popular Searches:</span>
          {topCities.map((city, idx) => (
            <React.Fragment key={idx}>
              <Link to={`/?q=${encodeURIComponent(city)}`} className="hover:text-white hover:underline transition-colors">
                {city}
              </Link>
              {idx < topCities.length - 1 && <span className="text-slate-600">|</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2020 Property Adda. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about-us" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact-us" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy-policy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/admin/login" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors text-slate-400 hover:text-slate-200">Admin Portal</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Action */}
      <a
        href="https://wa.me/919509505892?text=Hi%20Property%20Adda,%20I%20am%20interested%20in%20properties"
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