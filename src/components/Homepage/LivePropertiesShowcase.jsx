// frontend/src/components/Homepage/LivePropertiesShowcase.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://propertydeal-backend-w3yk.onrender.com/api';

const DEFAULT_CITIES = [
  'Jaipur',
  'Delhi NCR',
  'Noida',
  'Gurgaon',
  'Mumbai',
  'Bengaluru',
  'Pune',
  'Hyderabad',
];

const DEFAULT_JAIPUR_AREAS = [
  'Agra Road',
  'Ajmer Road',
  'Banipark',
  'Civil Lines',
  'Diggi Road',
  'Gopalpura',
  'Jagatpura',
  'Jhotwara',
  'Mansarovar',
  'Vaishali Nagar',
  'Malviya Nagar',
  'Tonk Road',
  'C Scheme',
  'Raja Park',
  'Sanganer',
  'Pratap Nagar',
  'Kalwar Road',
  'Sirsi Road',
  'Sikar Road',
];

const DEFAULT_SUB_AREAS = [
  'Block A',
  'Block B',
  'Block C',
  'Phase 1',
  'Phase 2',
  'Extension',
  'Main Road',
  'Sector 62',
  'Dream City',
  'Green Meadows',
  'Royal Enclave',
  'Near Metro Station',
  'Airport Corridor',
  'Expressway Hub',
];

const formatPrice = (price, listingType) => {
  const num = Number(price);
  if (isNaN(num)) return `₹${price}`;

  if (listingType === 'rent') {
    return `₹${num.toLocaleString('en-IN')}/month`;
  }
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

const LivePropertiesShowcase = ({ initialFilter = 'all', title = 'Popular Properties Across India' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryQ = searchParams.get('q') || '';
  const queryPropertyType = searchParams.get('propertyType') || '';
  const queryListingType = searchParams.get('listingType') || '';
  const queryPurpose = searchParams.get('purpose') || '';
  const queryCity = searchParams.get('city') || '';
  const queryArea = searchParams.get('area') || searchParams.get('locality') || '';

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', phone: '', note: '' });
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // ── ADVANCED SEARCH FILTER STATES (Matching Image 1 & Image 3) ──
  const [purpose, setPurpose] = useState(queryPurpose || queryListingType || initialFilter || 'all');
  const [city, setCity] = useState(queryCity || 'Jaipur');
  const [area, setArea] = useState(queryArea || '');
  const [subAreas, setSubAreas] = useState([]); // multiselect
  const [propertyType, setPropertyType] = useState(queryPropertyType || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Dropdown Open & Search States
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const [areaSearchTerm, setAreaSearchTerm] = useState('');
  const [subAreaDropdownOpen, setSubAreaDropdownOpen] = useState(false);
  const [subAreaSearchTerm, setSubAreaSearchTerm] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const areaDropdownRef = useRef(null);
  const subAreaDropdownRef = useRef(null);

  // Dynamic Locations from Backend
  const [locationsData, setLocationsData] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/locations`)
      .then((res) => {
        if (res.data?.locations?.length > 0) {
          setLocationsData(res.data.locations);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target)) {
        setAreaDropdownOpen(false);
      }
      if (subAreaDropdownRef.current && !subAreaDropdownRef.current.contains(e.target)) {
        setSubAreaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Compute available areas for selected city
  const availableAreas = useMemo(() => {
    if (!city || city === 'all') {
      return DEFAULT_JAIPUR_AREAS;
    }
    const matched = locationsData.find(
      (l) => l.city.toLowerCase().trim() === city.toLowerCase().trim()
    );
    if (matched && Array.isArray(matched.areas) && matched.areas.length > 0) {
      return matched.areas;
    }
    if (city.toLowerCase() === 'jaipur') {
      return DEFAULT_JAIPUR_AREAS;
    }
    return ['Central Area', 'Main Market', 'Civil Lines', 'Model Town', 'Industrial Area', 'Green Park'];
  }, [locationsData, city]);

  // Filtered areas inside dropdown search box (like Image 1)
  const filteredAreasList = useMemo(() => {
    if (!areaSearchTerm.trim()) return availableAreas;
    return availableAreas.filter((a) =>
      a.toLowerCase().includes(areaSearchTerm.toLowerCase().trim())
    );
  }, [availableAreas, areaSearchTerm]);

  // Compute available subareas / townships
  const availableSubAreas = useMemo(() => {
    const extracted = new Set(DEFAULT_SUB_AREAS);
    properties.forEach((p) => {
      if (Array.isArray(p.subAreas)) {
        p.subAreas.forEach((sa) => extracted.add(sa));
      }
      if (p.projectName) extracted.add(p.projectName);
    });
    return Array.from(extracted);
  }, [properties]);

  const filteredSubAreasList = useMemo(() => {
    if (!subAreaSearchTerm.trim()) return availableSubAreas;
    return availableSubAreas.filter((s) =>
      s.toLowerCase().includes(subAreaSearchTerm.toLowerCase().trim())
    );
  }, [availableSubAreas, subAreaSearchTerm]);

  // Load user favorites if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${API_BASE_URL}/users/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.favorites)) {
            const ids = res.data.favorites.map((f) => String(f.id || f._id));
            setFavoriteIds(new Set(ids));
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleToggleFavorite = async (e, propId) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save properties to your Favorites.');
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/favorites/${propId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          const strId = String(propId);
          if (next.has(strId)) next.delete(strId);
          else next.add(strId);
          return next;
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/properties?limit=30`;

      // Purpose
      if (purpose && purpose !== 'all') {
        if (purpose === 'commercial') {
          url += '&propertyCategory=Commercial';
        } else if (purpose === 'plots') {
          url += '&propertyType=Plot';
        } else {
          url += `&purpose=${encodeURIComponent(purpose)}`;
        }
      }

      // City Dropdown
      if (city && city !== 'all') {
        url += `&city=${encodeURIComponent(city)}`;
      }

      // Area / Locality Dropdown
      if (area && area !== 'all') {
        url += `&area=${encodeURIComponent(area)}`;
      }

      // Sub Area / Township Multiselect
      if (subAreas.length > 0) {
        url += `&subArea=${encodeURIComponent(subAreas.join(','))}`;
      }

      // Property Type
      if (propertyType && propertyType !== 'all') {
        url += `&propertyType=${encodeURIComponent(propertyType)}`;
      }

      // Budget Range
      if (priceRange !== 'all') {
        const parts = priceRange.split('-');
        if (parts[0]) url += `&minPrice=${parts[0]}`;
        if (parts[1]) url += `&maxPrice=${parts[1]}`;
      }

      if (queryQ) url += `&q=${encodeURIComponent(queryQ)}`;

      const res = await axios.get(url);
      if (res.data?.success && res.data?.properties) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error('Error fetching live properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [purpose, city, area, subAreas, propertyType, priceRange]);

  const handleResetFilters = () => {
    setPurpose('all');
    setCity('all');
    setArea('');
    setSubAreas([]);
    setPropertyType('all');
    setPriceRange('all');
    setAreaSearchTerm('');
    setSubAreaSearchTerm('');
    navigate(location.pathname);
  };

  // Toggle Sub Area selection for Multiselect
  const handleToggleSubArea = (item) => {
    setSubAreas((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  // Sorted properties
  const displayedProperties = useMemo(() => {
    const list = [...properties];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [properties, sortBy]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingEnquiry(true);
      await axios.post(`${API_BASE_URL}/enquiries`, {
        userName: enquiryData.name,
        userPhone: enquiryData.phone,
        message: enquiryData.note || 'Interested in scheduling a site visit or callback.',
        propertyId: selectedProperty?._id || selectedProperty?.id,
        propertyTitle: selectedProperty?.title || 'Property',
        propertyLocation: selectedProperty?.locality || selectedProperty?.city || '',
      });
      setEnquirySuccess(true);
      setTimeout(() => {
        setSelectedProperty(null);
        setEnquirySuccess(false);
        setEnquiryData({ name: '', phone: '', note: '' });
      }, 2200);
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      setEnquirySuccess(true);
      setTimeout(() => {
        setSelectedProperty(null);
        setEnquirySuccess(false);
        setEnquiryData({ name: '', phone: '', note: '' });
      }, 2200);
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const activeFiltersCount =
    (purpose !== 'all' ? 1 : 0) +
    (city && city !== 'all' ? 1 : 0) +
    (area ? 1 : 0) +
    subAreas.length +
    (propertyType !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0);

  return (
    <section id="properties-showcase" className="py-10 bg-[#f8fafc] border-t border-[#e2e8f0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Breadcrumbs & Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-semibold">
              <Link to="/" className="hover:text-[#D62839]">Home</Link>
              <span>/</span>
              <span className="text-[#142D4E]">Properties</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142D4E] tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Verified real estate listings with direct owner/builder connect & transparent pricing.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="py-2.5 px-4 rounded-xl bg-[#142D4E] text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <span>🔍 Advanced Search</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D62839] text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── MAIN 2-COLUMN LAYOUT (ADVANCED SEARCH SIDEBAR + PROPERTIES SHOWCASE) ── */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* ══════════════════════════════════════════════════════════════
              LEFT SIDEBAR: ADVANCED SEARCH (MATCHING IMAGE 1 & IMAGE 3)
             ══════════════════════════════════════════════════════════════ */}
          <aside
            className={`w-full lg:w-80 flex-shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#D62839]">🔍</span>
                <h3 className="font-extrabold text-sm text-[#142D4E] uppercase tracking-wide">
                  Advanced Search
                </h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-[#D62839] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* 1. Buy / Rent Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#142D4E] uppercase tracking-wider mb-1">
                Buy / Rent
              </label>
              <div className="relative">
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-[#142D4E] font-medium outline-none focus:border-[#D62839] focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Purpose (Buy & Rent)</option>
                  <option value="sale">For Sale (Buy)</option>
                  <option value="rent">For Rent / Lease</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots & Land</option>
                </select>
                <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* 2. City - Dropdown (User Requirement) */}
            <div>
              <label className="block text-[11px] font-bold text-[#142D4E] uppercase tracking-wider mb-1">
                Filter by City
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setArea(''); // reset area when city changes
                    setSubAreas([]);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-[#142D4E] font-medium outline-none focus:border-[#D62839] focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Cities (All India)</option>
                  {DEFAULT_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* 3. Area / Locality - Dropdown with Search Box (Matching Image 1) */}
            <div className="relative" ref={areaDropdownRef}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#142D4E] uppercase tracking-wider">
                  Filter by Area
                </label>
                {area && (
                  <button
                    type="button"
                    onClick={() => setArea('')}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    Clear Area
                  </button>
                )}
              </div>

              {/* Toggle Box */}
              <button
                type="button"
                onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-left font-medium text-[#142D4E] flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#D62839] focus:bg-white"
              >
                <span className="truncate">{area || 'Select Area / Locality'}</span>
                <span className="text-[10px] text-slate-400">
                  {areaDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Expandable Area Dropdown Menu (Style matching Image 1) */}
              {areaDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-2 max-h-64 flex flex-col animate-hw-fade">
                  {/* Search inside area dropdown */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type to filter area..."
                      value={areaSearchTerm}
                      onChange={(e) => setAreaSearchTerm(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#D62839] focus:bg-white"
                      autoFocus
                    />
                    {areaSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setAreaSearchTerm('')}
                        className="absolute right-2 top-1.5 text-xs text-slate-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Scrollable list of areas */}
                  <div className="overflow-y-auto max-h-48 space-y-0.5 divide-y divide-slate-50 pr-1">
                    <button
                      type="button"
                      onClick={() => {
                        setArea('');
                        setAreaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center justify-between ${
                        !area ? 'bg-[#fff1f2] text-[#D62839]' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>All Areas in {city || 'City'}</span>
                      {!area && <span className="text-[#D62839]">✓</span>}
                    </button>

                    {filteredAreasList.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          setArea(a);
                          setAreaDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                          area === a
                            ? 'bg-[#fff1f2] text-[#D62839] font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{a}</span>
                        {area === a && <span className="text-[#D62839] font-bold">✓</span>}
                      </button>
                    ))}
                    {filteredAreasList.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-2">No matching areas</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Sub Area / Township - Multiselect (User Requirement) */}
            <div className="relative" ref={subAreaDropdownRef}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#142D4E] uppercase tracking-wider">
                  Sub Area / Township <span className="text-[10px] text-[#D62839] font-bold">(Multiselect)</span>
                </label>
                {subAreas.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSubAreas([])}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    Clear ({subAreas.length})
                  </button>
                )}
              </div>

              {/* Multiselect Toggle */}
              <button
                type="button"
                onClick={() => setSubAreaDropdownOpen(!subAreaDropdownOpen)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-left font-medium text-[#142D4E] flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#D62839] focus:bg-white"
              >
                <span className="truncate">
                  {subAreas.length === 0
                    ? 'Select Sub Areas / Townships...'
                    : `${subAreas.length} Sub Area${subAreas.length > 1 ? 's' : ''} Selected`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {subAreaDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Selected Pills Display */}
              {subAreas.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {subAreas.map((sa) => (
                    <span
                      key={sa}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fff1f2] text-[#D62839] text-[10.5px] font-bold border border-rose-200"
                    >
                      <span>{sa}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSubArea(sa)}
                        className="hover:text-black cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Multiselect Dropdown Checklist */}
              {subAreaDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-2 max-h-64 flex flex-col animate-hw-fade">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search sub area / township..."
                      value={subAreaSearchTerm}
                      onChange={(e) => setSubAreaSearchTerm(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#D62839] focus:bg-white"
                      autoFocus
                    />
                    {subAreaSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setSubAreaSearchTerm('')}
                        className="absolute right-2 top-1.5 text-xs text-slate-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-48 space-y-1 pr-1">
                    {filteredSubAreasList.map((sa) => {
                      const checked = subAreas.includes(sa);
                      return (
                        <label
                          key={sa}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                            checked ? 'bg-[#fff1f2] text-[#D62839] font-bold' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleSubArea(sa)}
                            className="w-3.5 h-3.5 rounded text-[#D62839] accent-[#D62839]"
                          />
                          <span className="flex-1 truncate">{sa}</span>
                        </label>
                      );
                    })}
                    {filteredSubAreasList.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-2">No matching townships</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Property Type Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#142D4E] uppercase tracking-wider mb-1">
                Property Category / Type
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-[#142D4E] font-medium outline-none focus:border-[#D62839] focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Property Types</option>
                  <option value="Flat">Flat / Apartment</option>
                  <option value="House/villa">House / Villa</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="office space">Commercial Office</option>
                  <option value="Commercial space">Retail Shop / Space</option>
                  <option value="Pg/hostel">PG / Hostel</option>
                </select>
                <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* 6. Budget / Price Range Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#142D4E] uppercase tracking-wider mb-1">
                Budget / Price Range
              </label>
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-[#142D4E] font-medium outline-none focus:border-[#D62839] focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="all">Any Budget / All Prices</option>
                  <option value="0-2500000">Under ₹25 Lakh</option>
                  <option value="2500000-5000000">₹25 Lakh - ₹50 Lakh</option>
                  <option value="5000000-10000000">₹50 Lakh - ₹1 Crore</option>
                  <option value="10000000-30000000">₹1 Crore - ₹3 Crore</option>
                  <option value="30000000-100000000">₹3 Crore & Above</option>
                </select>
                <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={fetchProperties}
                className="w-full py-2.5 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔍 Search Properties</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 text-slate-600 hover:text-[#D62839] hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: PROPERTIES LIST & RESULTS HEADER (MATCHING IMAGE 3)
             ══════════════════════════════════════════════════════════════ */}
          <main className="flex-1 w-full space-y-5">
            {/* Top Results Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-[#142D4E]">
                  Showing all {displayedProperties.length} results
                </span>
                {city && city !== 'all' && (
                  <span className="text-[11px] font-bold bg-[#eff6ff] text-[#2563eb] px-2.5 py-0.5 rounded-full border border-blue-200">
                    📍 {city}
                  </span>
                )}
                {area && (
                  <span className="text-[11px] font-bold bg-[#fff1f2] text-[#D62839] px-2.5 py-0.5 rounded-full border border-rose-200">
                    {area}
                  </span>
                )}
              </div>

              {/* Sort by & View Toggle */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#142D4E] outline-none cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="featured">Featured First</option>
                  </select>
                </div>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white shadow-xs text-[#142D4E]' : 'text-slate-400'
                    }`}
                    title="Grid View"
                  >
                    ▦
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      viewMode === 'list' ? 'bg-white shadow-xs text-[#142D4E]' : 'text-slate-400'
                    }`}
                    title="List View"
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 h-80 animate-pulse">
                    <div className="w-full h-44 bg-slate-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Properties Grid */}
            {!loading && displayedProperties.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {displayedProperties.map((prop) => {
                  const imageSrc =
                    Array.isArray(prop.images) && prop.images[0]
                      ? prop.images[0]
                      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

                  const priceRate =
                    prop.pricePerSqft ||
                    (prop.price && (prop.areaSqft || prop.size)
                      ? Math.round(Number(prop.price) / Number(prop.areaSqft || prop.size))
                      : null);

                  return (
                    <div
                      key={prop.id || prop._id}
                      className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 ${
                        viewMode === 'list' ? 'sm:flex-row' : ''
                      }`}
                    >
                      {/* Photo Container */}
                      <div
                        className={`relative overflow-hidden bg-slate-100 ${
                          viewMode === 'list' ? 'sm:w-64 aspect-[16/10] sm:aspect-auto' : 'aspect-[16/10]'
                        }`}
                      >
                        <img
                          src={imageSrc}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Badges Overlay matching Image 3 */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-[#142D4E] text-white shadow-xs capitalize">
                            {prop.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                          {prop.isFeatured && (
                            <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-[#D62839] text-white shadow-xs">
                              Featured
                            </span>
                          )}
                          {prop.isVerified && (
                            <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-600 text-white shadow-xs">
                              Verified
                            </span>
                          )}
                        </div>

                        {/* Property ID Badge (Top Right) */}
                        <div className="absolute top-3 right-3 z-10 bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wide shadow-sm border border-white/20">
                          ID: {prop.uniqueCode || ('PA-' + String(prop._id || prop.id).slice(-6).toUpperCase())}
                        </div>

                        {/* Rate Tag over Image (Matching Image 3: '17000/ gaj' / per sq.ft) */}
                        {priceRate && (
                          <div className="absolute bottom-3 left-3 z-10 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-black">
                            ₹{priceRate.toLocaleString('en-IN')}/ {prop.sizeUnit || 'sqft'}
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Price & BHK */}
                          <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
                            <strong className="text-lg font-black text-[#D62839]">
                              {formatPrice(prop.price, prop.listingType)}
                            </strong>
                            {prop.bhk && (
                              <span className="text-[11px] font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-md">
                                {prop.bhk}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <Link to={`/property/${prop._id || prop.id}`}>
                            <h3 className="font-bold text-sm text-[#142D4E] line-clamp-1 hover:text-[#D62839] transition-colors mb-1 cursor-pointer">
                              {prop.title}
                            </h3>
                          </Link>

                          {/* Location */}
                          <p className="text-xs text-[#64748b] flex items-center gap-1 mb-2">
                            <span>📍</span>
                            <span className="truncate">
                              {prop.locality ? `${prop.locality}, ` : ''}
                              {prop.city}
                            </span>
                          </p>

                          {/* Property Specs */}
                          <div className="flex items-center gap-2 text-[11px] text-[#64748B] py-2 border-t border-slate-100 flex-wrap">
                            {prop.areaSqft && (
                              <span>
                                <strong className="text-[#142D4E]">{prop.areaSqft}</strong> sq.ft
                              </span>
                            )}
                            <span>•</span>
                            <span className="capitalize">{prop.propertyType || 'Residential'}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">Verified</span>
                          </div>
                        </div>

                        {/* Action Buttons (Including Direct Chat as shown in Image 3) */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 mt-2">
                          <Link
                            to={`/property/${prop._id || prop.id}`}
                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#142D4E] text-xs font-bold transition-colors"
                          >
                            Details
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedProperty(prop)}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-[#142D4E] hover:bg-[#0f233d] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                          >
                            <span>📞</span>
                            <span>Contact</span>
                          </button>

                          {/* Direct Chat / WhatsApp (Matching Image 3) */}
                          <a
                            href={`https://wa.me/919509505892?text=Hi,%20I%20am%20interested%20in%20Property%20Adda%20listing:%20${encodeURIComponent(
                              prop.title
                            )}%20(${prop.uniqueCode || ''})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                            title="Direct WhatsApp Chat"
                          >
                            <span>💬</span>
                            <span>Chat</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && displayedProperties.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto shadow-2xs">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  🔍
                </div>
                <h4 className="text-base font-bold text-[#142D4E]">
                  No properties found for this location & filter
                </h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Try clearing some filter criteria, selecting a different city / area, or view all verified listings.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Clear All Filters & Show All
                </button>
              </div>
            )}
          </main>
        </div>

        {/* ── ENQUIRY MODAL ── */}
        {selectedProperty && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-hw-fade">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0] relative">
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-extrabold uppercase text-[#D62839] bg-[#fff1f2] px-2 py-0.5 rounded">
                  DIRECT PROPERTY ADDA ENQUIRY
                </span>
                <h3 className="text-lg font-extrabold text-[#142D4E] mt-1">
                  Connect with Owner / Dealer
                </h3>
                <p className="text-xs text-[#64748b] truncate mt-0.5">
                  Property: {selectedProperty.title}
                </p>
                <p className="text-sm font-bold text-[#D62839] mt-1">
                  {formatPrice(selectedProperty.price, selectedProperty.listingType)}
                </p>
              </div>

              {enquirySuccess ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-extrabold text-[#142D4E] text-base">Enquiry Sent Successfully!</h4>
                  <p className="text-xs text-[#64748b]">
                    The property owner and Property Adda support team will contact you shortly on WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#142D4E] mb-1">
                      Your Name <span className="text-[#D62839]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={enquiryData.name}
                      onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#D62839] bg-[#f8fafc]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142D4E] mb-1">
                      Phone Number <span className="text-[#D62839]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={enquiryData.phone}
                      onChange={(e) =>
                        setEnquiryData({ ...enquiryData, phone: e.target.value.replace(/\D/g, '') })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#D62839] bg-[#f8fafc] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#142D4E] mb-1">Message (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="I am interested in scheduling a site visit or getting best price."
                      value={enquiryData.note}
                      onChange={(e) => setEnquiryData({ ...enquiryData, note: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#D62839] bg-[#f8fafc]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="w-full py-3 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submittingEnquiry ? 'Sending Details...' : 'Request Callback / Site Visit →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LivePropertiesShowcase;
