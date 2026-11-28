// frontend/src/components/Homepage/PropertiesSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import sliderSaleImg from '../../assets/slider-sale-investment.jpg';
import sliderRentalImg from '../../assets/slider-rental-home.jpg';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

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
        title: 'Find Your Perfect Property',
        subtitle: 'Plots, homes and investment properties',
        buttonText: 'Explore',
        link: '/?purpose=sale#live-properties',
        tag: 'FOR SALE & INVESTMENT',
        bg: sliderSaleImg,
      },
      {
        id: 2,
        title: 'Find Your Perfect Rental Home',
        subtitle: 'Explore homes and commercial spaces',
        buttonText: 'Explore',
        link: '/rent?purpose=rent#live-properties',
        tag: 'FOR RENT & COMMERCIAL',
        bg: sliderRentalImg,
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
        title: 'Find Your Perfect Rental Home',
        subtitle: 'Explore homes and commercial spaces',
        buttonText: 'Explore',
        link: '/rent?purpose=rent#live-properties',
        tag: 'FOR RENT & COMMERCIAL',
        bg: sliderRentalImg,
      },
      {
        id: 2,
        title: 'Find Your Perfect Property',
        subtitle: 'Plots, homes and investment properties',
        buttonText: 'Explore',
        link: '/?purpose=sale#live-properties',
        tag: 'FOR SALE & INVESTMENT',
        bg: sliderSaleImg,
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
  const [purpose, setPurpose] = useState(
    resolvedCategory === 'rent' ? 'rent' : resolvedCategory === 'commercial' ? 'all' : resolvedCategory === 'plots' ? 'sale' : 'sale'
  );
  const [propertyCategory, setPropertyCategory] = useState(
    resolvedCategory === 'commercial' ? 'Commercial' : 'all'
  );
  const [propertyType, setPropertyType] = useState(
    resolvedCategory === 'plots' ? 'Plot' : ''
  );
  const [searchCity, setSearchCity] = useState('');
  const [budget, setBudget] = useState('');
  const [availableCities, setAvailableCities] = useState([
    'Mumbai', 'Delhi NCR', 'Noida', 'Greater Noida', 'Gurgaon', 'Jaipur', 'Bengaluru', 'Pune', 'Hyderabad', 'Kolkata'
  ]);

  // Load dynamic cities from locations API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/locations`)
      .then((res) => {
        if (res.data?.locations?.length > 0) {
          const fetchedCities = res.data.locations.map((l) => l.city).filter(Boolean);
          const combined = Array.from(new Set([...fetchedCities, ...availableCities]));
          setAvailableCities(combined);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamic content from MongoDB Atlas
  const [dbTiles, setDbTiles] = useState(null);
  const [dbHeadline, setDbHeadline] = useState(null);
  const [dbSlogan, setDbSlogan] = useState(null);

  useEffect(() => {
    const keyMap = {
      buy: 'hero_buy_tiles',
      rent: 'hero_rent_tiles',
    };
    const key = keyMap[resolvedCategory];
    if (key) {
      axios
        .get(`${API_BASE_URL}/home-sections/${key}`)
        .then((res) => {
          if (res.data) {
            if (res.data.title) setDbHeadline(res.data.title);
            if (res.data.subtitle) setDbSlogan(res.data.subtitle);
            if (Array.isArray(res.data.items) && res.data.items.length > 0) {
              setDbTiles(res.data.items);
            }
          }
        })
        .catch(() => {});
    } else {
      setDbTiles(null);
      setDbHeadline(null);
      setDbSlogan(null);
    }
  }, [resolvedCategory]);

  // Sync inputs with URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const purp = params.get('purpose') || params.get('listingType');
    const cat = params.get('propertyCategory');
    const pType = params.get('propertyType');
    const ct = params.get('city');
    const minP = params.get('minPrice');
    const maxP = params.get('maxPrice');

    if (purp) setPurpose(purp);
    if (cat) setPropertyCategory(cat);
    if (pType) setPropertyType(pType);
    if (ct) setSearchCity(ct);
    if (minP || maxP) {
      setBudget(`${minP || ''}-${maxP || ''}`);
    }
  }, [location.search]);

  // Reset slide index when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [resolvedCategory]);

  // Auto carousel rotation (continuous horizontal slide with pause on hover)
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const count = data.slides?.length || 1;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % count);
    }, 4500);
    return () => clearInterval(timer);
  }, [resolvedCategory, data.slides?.length, isHovered]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (purpose && purpose !== 'all') params.set('purpose', purpose);
    if (propertyCategory && propertyCategory !== 'all') params.set('propertyCategory', propertyCategory);
    if (propertyType && propertyType !== 'all') params.set('propertyType', propertyType);
    if (searchCity && searchCity !== 'all') params.set('city', searchCity);
    if (budget && budget !== 'all') {
      const parts = budget.split('-');
      if (parts[0]) params.set('minPrice', parts[0]);
      if (parts[1]) params.set('maxPrice', parts[1]);
    }

    let targetPath = '/';
    if (purpose === 'rent') targetPath = '/rent';
    else if (purpose === 'commercial' || propertyCategory === 'Commercial') targetPath = '/commercial';
    else if (purpose === 'plots' || propertyType === 'Plot') targetPath = '/plots';
    else if (propertyType === 'Pg/hostel') targetPath = '/pg-co-living';

    const searchStr = params.toString();
    navigate(searchStr ? `${targetPath}?${searchStr}#live-properties` : `${targetPath}#live-properties`);

    // Smooth scroll down to the properties inventory section
    setTimeout(() => {
      const el = document.getElementById('live-properties') || document.getElementById('properties-showcase');
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
    <section className="relative bg-[#F3F5F8] overflow-hidden pt-4 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* ── 1. Top Featured Carousel Banner (Category-Specific) ── */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 h-[260px] sm:h-[340px] md:h-[400px] lg:h-[430px] group/slider"
        >
          {/* Horizontal Sliding Track */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {data.slides.map((slide, sIdx) => {
              const isActive = sIdx === currentSlide;
              return (
                <div
                  key={slide.id}
                  className="relative w-full h-full flex-shrink-0 select-none overflow-hidden"
                >
                  <img
                    src={slide.bg}
                    alt={slide.title}
                    className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                    loading="eager"
                  />
                  {/* Subtle dark gradient overlay on left for razor-sharp typography */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/60 to-transparent sm:via-[#0a1628]/45"></div>

                  {/* Slide text with beautiful enter animations */}
                  <div className="absolute inset-0 p-5 sm:p-8 md:p-14 flex flex-col justify-center max-w-2xl text-white">
                    <div
                      className={`transition-all duration-700 ease-out ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b] text-[#0f172a] text-[10px] sm:text-xs font-black tracking-wider uppercase mb-2.5 sm:mb-3 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                        <span>{slide.tag || 'FEATURED'}</span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3 leading-[1.15] drop-shadow-md">
                        {slide.title}
                      </h2>
                      <p className="text-xs sm:text-base md:text-lg font-medium text-slate-100 max-w-xl mb-4 sm:mb-6 drop-shadow-sm leading-relaxed">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div
                      className={`transition-all duration-700 delay-150 ease-out ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <Link
                        to={slide.link}
                        onClick={() => {
                          setTimeout(() => {
                            const el = document.getElementById('live-properties') || document.getElementById('properties-showcase');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 150);
                        }}
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs sm:text-sm md:text-base font-extrabold shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group/btn"
                      >
                        <span>{slide.buttonText || 'Explore'}</span>
                        <span className="transition-transform duration-200 group-hover/btn:translate-x-1.5 font-bold">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prev/Next arrows with sleek glassmorphism */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? data.slides.length - 1 : prev - 1))}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#D62839] text-white flex items-center justify-center backdrop-blur-md transition-all text-xl font-bold cursor-pointer opacity-70 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-90"
            aria-label="Previous Slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % data.slides.length)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#D62839] text-white flex items-center justify-center backdrop-blur-md transition-all text-xl font-bold cursor-pointer opacity-70 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-90"
            aria-label="Next Slide"
          >
            ›
          </button>

          {/* Animated Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {data.slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-7 bg-[#D62839] shadow-sm'
                    : 'w-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── 2. Floating Navbar & Search Widget (Enlarged & Prominently Centered) ── */}
        <div className="relative -mt-10 sm:-mt-14 z-30 max-w-[1180px] mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 p-4 sm:p-6 transition-all">
          {/* Category Tabs linking to each page */}
          <div className="flex items-center gap-2 sm:gap-3 pb-4 border-b border-slate-100 overflow-x-auto no-scrollbar">
            {SEARCH_TABS.map((tab) => {
              const isActive =
                (tab.path === '/' && location.pathname === '/') ||
                (tab.path !== '/' && location.pathname === tab.path);

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D62839] text-white shadow-md shadow-red-500/20 scale-[1.02]'
                      : 'text-[#64748B] hover:text-[#142D4E] hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}

            <Link
              to="/post-property"
              className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-[#D62839] hover:text-[#b81d2c] px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition-all border border-red-200"
            >
              <span>Post Property</span>
              <span className="text-[10px] bg-[#D62839] text-white px-1.5 py-0.5 rounded font-black">
                FREE
              </span>
            </Link>
          </div>

          {/* Search Inputs: ONLY Drop-down selection */}
          <form onSubmit={handleSearch} className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 items-end">
            {/* 1. Purpose Dropdown (For Sale and For Rent only) */}
            <div className="w-full">
              <label className="block text-[11px] font-black text-[#475569] uppercase tracking-wider mb-1.5">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold text-[#142D4E] outline-none focus:border-[#D62839] focus:bg-white focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
              >
                <option value="sale">For Sale (Buy)</option>
                <option value="rent">For Rent / Lease</option>
              </select>
            </div>

            {/* 2. Category Dropdown */}
            <div className="w-full">
              <label className="block text-[10.5px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={propertyCategory}
                onChange={(e) => setPropertyCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#F3F5F8] text-xs font-bold text-[#142D4E] outline-none focus:border-[#D62839] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* 3. Property Type Dropdown */}
            <div className="w-full">
              <label className="block text-[10.5px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#cbd5e1] bg-[#F3F5F8] text-xs font-bold text-[#142D4E] outline-none focus:border-[#D62839] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Flat">Flat / Apartment</option>
                <option value="House/villa">House / Villa</option>
                <option value="Plot">Plot / Land</option>
                <option value="Farm house">Farm house</option>
                <option value="Building">Building / Floor</option>
                <option value="Studio Apartment">Studio Apartment</option>
                <option value="room">Room</option>
                <option value="Pg/hostel">PG / Hostel</option>
                <option value="office space">Office Space</option>
                <option value="Commercial space">Commercial Space</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 4. City Dropdown */}
            <div className="w-full">
              <label className="block text-[11px] font-black text-[#475569] uppercase tracking-wider mb-1.5">
                City
              </label>
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold text-[#142D4E] outline-none focus:border-[#D62839] focus:bg-white focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
              >
                <option value="">All Cities</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 5. Budget Dropdown */}
            <div className="w-full">
              <label className="block text-[11px] font-black text-[#475569] uppercase tracking-wider mb-1.5">
                Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold text-[#142D4E] outline-none focus:border-[#D62839] focus:bg-white focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
              >
                <option value="">Any Budget</option>
                {purpose === 'rent' ? (
                  <>
                    <option value="0-10000">Up to ₹10,000</option>
                    <option value="10000-25000">₹10k - ₹25,000</option>
                    <option value="25000-50000">₹25k - ₹50,000</option>
                    <option value="50000-100000">₹50k - ₹1 Lakh</option>
                    <option value="100000-">₹1 Lakh+</option>
                  </>
                ) : (
                  <>
                    <option value="0-2500000">Up to ₹25 Lakh</option>
                    <option value="2500000-5000000">₹25 L - ₹50 Lakh</option>
                    <option value="5000000-10000000">₹50 L - ₹1 Crore</option>
                    <option value="10000000-20000000">₹1 Cr - ₹2 Crore</option>
                    <option value="20000000-">₹2 Crore+</option>
                  </>
                )}
              </select>
            </div>

            {/* 6. Search CTA Button */}
            <div className="w-full col-span-2 sm:col-span-1">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white font-black text-xs sm:text-sm shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;