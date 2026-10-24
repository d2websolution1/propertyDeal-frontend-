// frontend/src/components/Homepage/PropertiesSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const CATEGORY_DATA = {
  buy: {
    tabId: 'BUY',
    headline: 'Properties to Buy',
    slogan: '7,000+ verified listings added daily directly from owners & top builders.',
    searchPlaceholder: 'Search by city, locality, project or landmark...',
    types: [
      { value: '', label: 'All Residential' },
      { value: 'Apartment', label: 'Flat / Apartment' },
      { value: 'Villa', label: 'Luxury Villa' },
      { value: 'Plot', label: 'Residential Plot' },
      { value: 'Builder Floor', label: 'Builder Floor' },
    ],
    slides: [
      {
        id: 1,
        title: 'Trump Towers & Luxury Residences',
        subtitle: 'Ultra-luxury 3 & 4 BHK branded residences with private decks',
        location: 'Sector 94 · Expressway Corridor',
        price: 'From ₹2.5 Cr*',
        tag: 'FEATURED',
        bg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        link: '/commercial',
      },
      {
        id: 2,
        title: 'Modern High-Rise Apartments',
        subtitle: 'Ready-to-move homes with world-class clubhouse & sports arenas',
        location: 'Noida · Greater Noida · Gurgaon · Mumbai',
        price: 'From ₹45 Lakh*',
        tag: 'BEST VALUE',
        bg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
        link: '/rent',
      },
      {
        id: 3,
        title: 'Premium Plots & Land Investments',
        subtitle: 'High-growth residential & commercial plots near upcoming airport',
        location: 'Yamuna Expressway (YEIDA)',
        price: 'From ₹35 Lakh*',
        tag: 'HIGH ROI',
        bg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
        link: '/plots',
      },
      {
        id: 4,
        title: 'Post Free Property on PropertyDeal',
        subtitle: 'Direct enquiries on WhatsApp & phone with zero brokerage',
        location: 'All India · Verified Network',
        price: '100% Free',
        tag: 'FOR OWNERS',
        bg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        link: '/post-property',
      },
    ],
    tiles: [
      {
        title: 'Owner Properties',
        badge: '0% Brokerage',
        desc: 'Direct owner deals →',
        link: '/?filter=owner',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Luxury Projects',
        badge: 'New Launch',
        desc: 'Gated townships →',
        link: '/commercial',
        img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Ready to Move',
        badge: 'Instant Key',
        desc: 'Immediate possession →',
        link: '/?status=ready',
        img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Budget Homes',
        badge: 'Under ₹50 L',
        desc: 'Affordable options →',
        link: '/?max=5000000',
        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  rent: {
    tabId: 'RENT',
    headline: 'Properties for Rent',
    slogan: 'Verified flats, furnished apartments & houses on rent with zero hassle.',
    searchPlaceholder: 'Search flats or houses for rent by locality or society...',
    types: [
      { value: '', label: 'All Rental Homes' },
      { value: 'Apartment', label: 'Furnished Apartment' },
      { value: 'Independent House', label: 'Independent House / Villa' },
      { value: 'Builder Floor', label: 'Builder Floor' },
      { value: 'Studio', label: '1 RK / Studio Flat' },
    ],
    slides: [
      {
        id: 1,
        title: 'Fully Furnished Flats for Rent',
        subtitle: 'Modern apartments with AC, modular kitchen, sofa & power backup',
        location: 'Mumbai · Bangalore · Pune · Delhi NCR',
        price: 'From ₹15,000/mo*',
        tag: 'READY TO MOVE',
        bg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
        link: '/rent',
      },
      {
        id: 2,
        title: 'Gated Society Rental Homes',
        subtitle: '24x7 security, swimming pool, gym & dedicated car parking',
        location: 'Gaur City · Sector 16B · Noida Expressway',
        price: 'From ₹12,000/mo*',
        tag: 'FAMILY FRIENDLY',
        bg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
        link: '/rent',
      },
      {
        id: 3,
        title: 'Direct Owner Rentals (Zero Brokerage)',
        subtitle: 'Connect straight with property owners with transparent rental agreements',
        location: 'All Top Localities',
        price: 'Save Brokerage',
        tag: 'ZERO BROKERAGE',
        bg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
        link: '/post-property',
      },
    ],
    tiles: [
      {
        title: 'Fully Furnished',
        badge: 'Move-in Ready',
        desc: 'With AC & furniture →',
        link: '/rent?furnishing=fully',
        img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Owner Flats',
        badge: '0% Brokerage',
        desc: 'Direct contact →',
        link: '/rent?filter=owner',
        img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Budget Rentals',
        badge: 'Under ₹15k/mo',
        desc: 'Affordable rentals →',
        link: '/rent?max=15000',
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Luxury Penthouses',
        badge: 'Premium Living',
        desc: 'Sky villas & decks →',
        link: '/rent?min=35000',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  commercial: {
    tabId: 'COMMERCIAL',
    headline: 'Commercial Real Estate',
    slogan: 'Shops, retail showrooms, corporate offices & business spaces with high footfall.',
    searchPlaceholder: 'Search commercial shops, offices, or business complexes...',
    types: [
      { value: '', label: 'All Commercial' },
      { value: 'Shop', label: 'Retail Shop / Mall' },
      { value: 'Office', label: 'Office Space / IT Park' },
      { value: 'Showroom', label: 'Commercial Showroom' },
      { value: 'Warehouse', label: 'Warehouse / Godown' },
    ],
    slides: [
      {
        id: 1,
        title: 'High Footfall Retail Shops & Showrooms',
        subtitle: 'Ground floor retail spaces in top commercial malls with assured rental yields',
        location: 'Char Murti Chowk · Sector 18 · Connaught Place',
        price: 'From ₹35 Lakh*',
        tag: 'HIGH FOOTFALL',
        bg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
        link: '/commercial',
      },
      {
        id: 2,
        title: 'Grade-A Corporate Office Spaces',
        subtitle: 'Furnished plug & play office cabins, meeting rooms & cafeteria amenities',
        location: 'Noida Expressway · Gurgaon Cyber City · BKC Mumbai',
        price: 'Lease & Sale',
        tag: 'CORPORATE HUBS',
        bg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        link: '/commercial',
      },
      {
        id: 3,
        title: 'Commercial SCO Plots & Land',
        subtitle: 'Shop-cum-office plots for hotels, banks, clinics & retail establishments',
        location: 'Prime High-Growth Corridors',
        price: 'High ROI',
        tag: 'SCO PLOTS',
        bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
        link: '/commercial',
      },
    ],
    tiles: [
      {
        title: 'Retail Shops',
        badge: 'High Footfall',
        desc: 'Mall & market shops →',
        link: '/commercial?type=Shop',
        img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Office Spaces',
        badge: 'IT & Business',
        desc: 'Plug & play offices →',
        link: '/commercial?type=Office',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Commercial Land',
        badge: 'SCO & Retail',
        desc: 'Commercial plots →',
        link: '/commercial',
        img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Assured Returns',
        badge: 'Up to 12% ROI',
        desc: 'Pre-leased assets →',
        link: '/commercial',
        img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  plots: {
    tabId: 'PLOTS',
    headline: 'Plots & Land Investments',
    slogan: 'Residential, industrial & agricultural land with clear registry and bank loan facility.',
    searchPlaceholder: 'Search residential or commercial plots by sector or expressway...',
    types: [
      { value: '', label: 'All Plots & Land' },
      { value: 'Residential Plot', label: 'Residential Sector Plot' },
      { value: 'Commercial Land', label: 'Commercial Land / SCO' },
      { value: 'Industrial', label: 'Industrial Authority Plot' },
      { value: 'Agricultural', label: 'Agricultural Land / Farmhouse' },
    ],
    slides: [
      {
        id: 1,
        title: 'Yamuna Expressway (YEIDA) Authority Plots',
        subtitle: 'Sectors 18 & 20 plots within 15 minutes of Noida International Airport (Jewar)',
        location: 'Yamuna Expressway Corridor',
        price: 'From ₹45 Lakh*',
        tag: 'NEAR AIRPORT',
        bg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
        link: '/plots',
      },
      {
        id: 2,
        title: 'Gated Township Residential Plots',
        subtitle: '100 to 500 Sq. Yd. plots with asphalt roads, streetlights, parks & instant registry',
        location: 'Greater Noida · Gurgaon · Dholera · Hyderabad',
        price: 'Bank Loan Ready',
        tag: 'GATED TOWNSHIP',
        bg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        link: '/plots',
      },
      {
        id: 3,
        title: 'Farmhouses & Green Acres',
        subtitle: 'Serene weekend getaway land with organic farming and private clubhouse access',
        location: 'Expressway Belts',
        price: 'High Appreciation',
        tag: 'FARMHOUSES',
        bg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
        link: '/plots',
      },
    ],
    tiles: [
      {
        title: 'YEIDA Plots',
        badge: 'Jewar Airport',
        desc: 'Authority sectors →',
        link: '/plots?locality=YEIDA',
        img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Gated Townships',
        badge: 'Clear Title',
        desc: 'Boundary walled →',
        link: '/plots',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Commercial Land',
        badge: 'SCO Corridors',
        desc: 'Main road facing →',
        link: '/plots?type=Commercial',
        img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Farmhouse Plots',
        badge: 'Green Living',
        desc: 'Nature retreats →',
        link: '/plots?type=Farmhouse',
        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  pg: {
    tabId: 'PG',
    headline: 'PG & Co-Living Spaces',
    slogan: 'Furnished rooms with 3 meals daily, high-speed WiFi, laundry & zero security deposit.',
    searchPlaceholder: 'Search PG, hostel or co-living near college or IT tech park...',
    types: [
      { value: '', label: 'All PG & Co-Living' },
      { value: 'Single Sharing', label: 'Private Room (Single)' },
      { value: 'Twin Sharing', label: 'Twin Sharing Room' },
      { value: 'Triple Sharing', label: 'Triple Sharing Room' },
      { value: 'Girls PG', label: 'Girls Only Hostel / PG' },
      { value: 'Boys PG', label: 'Boys Only Hostel / PG' },
    ],
    slides: [
      {
        id: 1,
        title: 'Premium Student & Professional PG',
        subtitle: 'Fully air-conditioned rooms, attached washrooms, 3 hot meals & biometric entry',
        location: 'Knowledge Park · Sector 62 Noida · Koramangala · Hinjewadi',
        price: 'From ₹7,500/mo*',
        tag: 'ALL MEALS INCLUDED',
        bg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
        link: '/pg-co-living',
      },
      {
        id: 2,
        title: 'Modern Co-Living Tech Residencies',
        subtitle: 'High-speed 300 Mbps Wi-Fi, PlayStation gaming lounge, gym & community events',
        location: 'Near Metro & IT Tech Parks',
        price: 'From ₹9,000/mo*',
        tag: 'CO-LIVING SPACES',
        bg: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80',
        link: '/pg-co-living',
      },
      {
        id: 3,
        title: 'Zero Brokerage & Zero Lock-in',
        subtitle: 'Flexible monthly stays with daily housekeeping & laundry included',
        location: 'Verified Top Hosts',
        price: 'Instant Booking',
        tag: 'ZERO BROKERAGE',
        bg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
        link: '/post-property',
      },
    ],
    tiles: [
      {
        title: 'Private Rooms',
        badge: 'Single Sharing',
        desc: 'Dedicated privacy →',
        link: '/pg-co-living?type=Single',
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Twin Sharing',
        badge: 'Budget Friendly',
        desc: 'Shared amenities →',
        link: '/pg-co-living?type=Twin',
        img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Girls Hostels',
        badge: '24x7 Security',
        desc: 'Safe & secure →',
        link: '/pg-co-living?type=Girls',
        img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Luxury Co-Living',
        badge: 'Gaming & Gym',
        desc: 'Modern lifestyle →',
        link: '/pg-co-living',
        img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
};

const SEARCH_TABS = [
  { id: 'BUY', label: 'BUY', path: '/' },
  { id: 'RENT', label: 'RENT', path: '/rent' },
  { id: 'COMMERCIAL', label: 'COMMERCIAL', path: '/commercial' },
  { id: 'PLOTS', label: 'PLOTS', path: '/plots' },
  { id: 'PG', label: 'PG / CO-LIVING', path: '/pg-co-living' },
];

const PropertiesSection = ({ category = 'buy', city = 'Mumbai' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active category based on prop or pathname
  const resolvedCategory =
    CATEGORY_DATA[category] ? category :
    location.pathname === '/rent' ? 'rent' :
    location.pathname === '/commercial' ? 'commercial' :
    location.pathname === '/plots' ? 'plots' :
    location.pathname === '/pg-co-living' ? 'pg' : 'buy';

  const data = CATEGORY_DATA[resolvedCategory];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [propertyType, setPropertyType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync inputs with URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const pType = params.get('propertyType');
    if (q !== null) setSearchQuery(q);
    if (pType !== null) setPropertyType(pType);
  }, [location.search]);

  // Reset slide index when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [resolvedCategory]);

  // Auto carousel rotation (continuous horizontal slide)
  useEffect(() => {
    const count = data.slides?.length || 1;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % count);
    }, 2800);
    return () => clearInterval(timer);
  }, [resolvedCategory, data.slides?.length]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (propertyType) params.set('propertyType', propertyType);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());

    let targetPath = '/';
    if (resolvedCategory === 'rent') targetPath = '/rent';
    else if (resolvedCategory === 'commercial') targetPath = '/commercial';
    else if (resolvedCategory === 'plots') targetPath = '/plots';
    else if (resolvedCategory === 'pg') targetPath = '/pg-co-living';

    const searchStr = params.toString();
    navigate(searchStr ? `${targetPath}?${searchStr}` : targetPath);

    // Smooth scroll down to the properties inventory section
    setTimeout(() => {
      const el = document.getElementById('properties-showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setSearchQuery('Mumbai West'),
        () => setSearchQuery('Delhi NCR')
      );
    }
  };

  return (
    <section className="relative bg-[#f8fafc] overflow-hidden pt-4 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* ── 1. Top Featured Carousel Banner (Category-Specific) ── */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-md border border-[#e2e8f0] h-[220px] sm:h-[280px] md:h-[330px]"
        >
          {/* Horizontal Sliding Track */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {data.slides.map((slide) => (
              <div
                key={slide.id}
                className="relative w-full h-full flex-shrink-0"
              >
                <img
                  src={slide.bg}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-transparent"></div>

                {/* Slide text */}
                <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-between max-w-2xl text-white">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f59e0b] text-[#0f172a] text-[11px] font-black tracking-wider uppercase mb-2">
                      <span>{slide.tag}</span>
                    </div>
                    <span className="block text-xs sm:text-sm font-medium text-blue-200 tracking-wide mb-1">
                      {slide.location}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-lg mb-2">
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
                      <span className="text-[10px] text-gray-300 block uppercase font-bold">Price</span>
                      <strong className="text-sm sm:text-lg font-extrabold text-[#fde047]">
                        {slide.price}
                      </strong>
                    </div>

                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Explore Now</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev/Next arrows */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? data.slides.length - 1 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors text-xl font-bold cursor-pointer"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % data.slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors text-xl font-bold cursor-pointer"
            aria-label="Next"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {data.slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'w-6 bg-[#f59e0b]' : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── 2. Floating Navbar & Search Widget (Identical on ALL pages!) ── */}
        <div className="relative -mt-6 sm:-mt-8 z-30 max-w-[1080px] mx-auto bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-3 sm:p-4">
          {/* Category Tabs linking to each page */}
          <div className="flex items-center gap-1 sm:gap-2 pb-3 border-b border-[#f1f5f9] overflow-x-auto">
            {SEARCH_TABS.map((tab) => {
              const isActive =
                (tab.path === '/' && location.pathname === '/') ||
                (tab.path !== '/' && location.pathname === tab.path);

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-sm'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}

            <Link
              to="/post-property"
              className="ml-auto hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] px-3 py-1.5 rounded-lg bg-[#eff6ff]"
            >
              <span>Post Property</span>
              <span className="text-[9.5px] bg-[#ef4444] text-white px-1.5 py-0.2 rounded font-black">
                FREE
              </span>
            </Link>
          </div>

          {/* Search Inputs */}
          <form onSubmit={handleSearch} className="pt-3 flex flex-col md:flex-row items-center gap-2.5">
            {/* Type selector */}
            <div className="w-full md:w-[220px] flex-shrink-0">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-xs sm:text-sm font-semibold text-[#0f172a] outline-none focus:border-[#2563eb] transition-colors cursor-pointer"
              >
                {data.types.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Query input */}
            <div className="w-full flex-1 relative flex items-center">
              <svg
                className="absolute left-3.5 w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={data.searchPlaceholder}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e2e8f0] text-xs sm:text-sm text-[#0f172a] placeholder:text-gray-400 outline-none focus:border-[#2563eb] transition-colors"
              />
              <button
                type="button"
                onClick={handleUseLocation}
                title="Use current location"
                className="absolute right-3 text-gray-400 hover:text-[#2563eb] transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </button>
            </div>

            {/* Search CTA */}
            <button
              type="submit"
              className="w-full md:w-auto px-7 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 flex-shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Search</span>
              <span>→</span>
            </button>
          </form>
        </div>

        {/* ── 3. Page Context Headline ── */}
        <div className="mt-7 text-center max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            {data.headline} in {city} & Across India
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#64748b]">
            {data.slogan}{' '}
            <Link to="/post-property" className="text-[#2563eb] font-bold hover:underline">
              Post your property free →
            </Link>
          </p>
        </div>

        {/* ── 4. Category-Specific Quick Tiles Grid ── */}
        <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {data.tiles.map((tile, i) => (
            <Link
              key={i}
              to={tile.link}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#e2e8f0] h-32 sm:h-38 p-4 flex flex-col justify-end text-white transition-transform hover:-translate-y-1"
            >
              <img
                src={tile.img}
                alt={tile.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-lg sm:text-xl font-black text-[#fde047] leading-none block mb-1">
                  {tile.badge}
                </span>
                <strong className="text-xs sm:text-sm font-bold block text-white">{tile.title}</strong>
                <span className="text-[10.5px] text-slate-200 block">{tile.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;