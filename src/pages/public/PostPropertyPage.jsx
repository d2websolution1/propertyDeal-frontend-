// frontend/src/pages/public/PostPropertyPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import ClientAuthModal from '../../components/common/ClientAuthModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://propertydeal-backend-w3yk.onrender.com/api";

const INDIAN_STATES = [
  'Uttar Pradesh', 'Delhi NCR', 'Maharashtra', 'Haryana', 'Karnataka', 
  'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'West Bengal',
  'Punjab', 'Madhya Pradesh', 'Kerala', 'Goa', 'Uttarakhand', 'Chandigarh'
];

const PROPERTY_TYPES = [
  { value: 'Flat', label: 'Flat / Apartment' },
  { value: 'House/villa', label: 'House / Villa' },
  { value: 'Plot', label: 'Plot / Land' },
  { value: 'Farm house', label: 'Farm house' },
  { value: 'Building', label: 'Building' },
  { value: 'Studio Apartment', label: 'Studio Apartment' },
  { value: 'room', label: 'Room' },
  { value: 'Pg/hostel', label: 'PG / Hostel' },
  { value: 'office space', label: 'Office Space' },
  { value: 'Commercial space', label: 'Commercial Space' },
  { value: 'Other', label: 'Other (mention manually)' },
];

const FACILITY_OPTIONS = [
  'Gated society',
  'Park',
  'Security',
  'Clubhouse',
  'Gym',
  'Home theater',
  'Swimming pool',
  'Lift'
];

const AMENITY_OPTIONS = [
  'Bed',
  'Almirah',
  'Dining table',
  'AC',
  'Fan',
  'Lights',
  'Geyser',
  'Modular kitchen',
  'RO water',
  'Fridge',
  'Chimney',
  'Gas connection',
  'Gas stove',
  'Sofa',
  'TV',
  'Wi-Fi'
];

const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];

const PHOTO_CATEGORIES = [
  'Exterior view',
  'Living room',
  'Bedrooms',
  'Bathrooms',
  'Kitchen',
  'Floor plan',
  'Master plan',
  'Location map'
];

// Helper to format Indian currency in words
const formatIndianPrice = (num) => {
  const val = Number(num);
  if (!val || isNaN(val)) return '';
  if (val >= 10000000) {
    return `₹ ${(val / 10000000).toFixed(2)} Crore`;
  }
  if (val >= 100000) {
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  }
  if (val >= 1000) {
    return `₹ ${(val / 1000).toFixed(1)} Thousand`;
  }
  return `₹ ${val.toLocaleString('en-IN')}`;
};

// Client-side image compressor using HTML5 canvas
const compressPhoto = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const OWNER_PLANS = [
  { id: 'owner-starter', name: 'Free Starter (30 Days)', price: '₹0', originalPrice: '₹999', days: 30, limit: 2, featured: 0, tag: 'FREE' },
  { id: 'owner-gold', name: 'Gold Owner Plan (60 Days)', price: '₹499', originalPrice: '₹1499', days: 60, limit: 5, featured: 1, tag: 'POPULAR' },
  { id: 'owner-annual', name: 'Annual Owner Plan (365 Days)', price: '₹1499', originalPrice: '₹3999', days: 365, limit: 20, featured: 5, tag: 'BEST VALUE' },
];

const AGENT_PLANS = [
  { id: 'agent-std', name: 'Standard Agent Plan (45 Days)', price: '₹999', originalPrice: '₹1999', days: 45, limit: 20, featured: 2, tag: 'STARTER' },
  { id: 'agent-pro', name: 'Pro Agent Plan (90 Days)', price: '₹1999', originalPrice: '₹3999', days: 90, limit: 50, featured: 5, tag: 'MOST POPULAR' },
  { id: 'agent-annual', name: 'Annual Agent Plan (365 Days)', price: '₹4999', originalPrice: '₹9999', days: 365, limit: 200, featured: 20, tag: 'UNLIMITED LEADS' },
];

export default function PostPropertyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  // Edit Mode Query Handling
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const editId = searchParams.get('edit');
  const isEditMode = Boolean(editId);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Pre-post Auth Gate States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup');
  const [selectedRole, setSelectedRole] = useState('Owner');

  // Auto-generated Property ID (display preview)
  const [autoPropertyId, setAutoPropertyId] = useState(() => 'PA-' + Math.floor(100000 + Math.random() * 900000));

  // 1. Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('Sale'); // 'Sale' | 'Rent'
  const [propertyCategory, setPropertyCategory] = useState('Residential'); // 'Residential' | 'Commercial'
  const [propertyType, setPropertyType] = useState('Flat');
  const [otherPropertyType, setOtherPropertyType] = useState('');

  // 2. Size & Dimensions
  const [sizeType, setSizeType] = useState('Super Built-up Area'); // 'Carpet Area' | 'Super Built-up Area' | 'Plot Area'
  const [sizeValue, setSizeValue] = useState('');
  const [sizeUnit, setSizeUnit] = useState('sqft'); // 'sqft' | 'sq yard' | 'acre'
  const [plotFrontFt, setPlotFrontFt] = useState('');
  const [plotDepthFt, setPlotDepthFt] = useState('');
  const [frontRoadFt, setFrontRoadFt] = useState('');
  const [isCorner, setIsCorner] = useState(false);
  const [isParkFacing, setIsParkFacing] = useState(false);
  const [isTwoSideOpen, setIsTwoSideOpen] = useState(false);
  const [facing, setFacing] = useState(['East']);

  // 3. Price & Commercials
  const [expectedPrice, setExpectedPrice] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [maintenanceCharges, setMaintenanceCharges] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);

  // Rate & Price Calculator states (Per Gaj / Per Sq.Ft calculation)
  const [calcInputGajRate, setCalcInputGajRate] = useState('');
  const [calcInputSqftRate, setCalcInputSqftRate] = useState('');
  const [calcActiveMode, setCalcActiveMode] = useState('gaj'); // 'gaj' | 'sqft'

  // 4. Status, Furnishing, Facilities & Amenities
  const [constructionStatus, setConstructionStatus] = useState('Ready to move'); // 'Ready to move' | 'Under construction'
  const [furnishing, setFurnishing] = useState('Semi-furnished'); // 'Non-furnished' | 'Semi-furnished' | 'Fully furnished'
  const [facilities, setFacilities] = useState(['Gated society', 'Security', 'Lift']);
  const [amenities, setAmenities] = useState(['Fan', 'Lights', 'Modular kitchen', 'RO water']);

  // 5. Room counts (defaults to 0 for plots and new listings)
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [hall, setHall] = useState('0');
  const [kitchen, setKitchen] = useState('0');
  const [balcony, setBalcony] = useState('0');
  const [parking, setParking] = useState('None');

  // 6. Location
  const [state, setState] = useState('Rajasthan');
  const [city, setCity] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [subAreas, setSubAreas] = useState('');
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');

  // Property Approval / Recognised By (JDA, DDA, Collector, etc. Managed by Admin)
  const [authoritiesList, setAuthoritiesList] = useState([
    'JDA Approved',
    'DDA Approved',
    'Collector Approved',
    'Municipal Corporation',
    'Other Collector',
    'Gram Panchayat Approved',
    'RERA Registered',
    'Freehold / Registry Ready',
  ]);
  const [approvedAuthority, setApprovedAuthority] = useState('JDA Approved');
  const [customAuthority, setCustomAuthority] = useState('');

  // Dynamic locations from Admin
  const [locationsData, setLocationsData] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/locations`)
      .then((res) => {
        if (res.data?.locations?.length > 0) {
          setLocationsData(res.data.locations);
          if (!city && res.data.locations[0]?.city) {
            setCity(res.data.locations[0].city);
            if (res.data.locations[0].state) setState(res.data.locations[0].state);
          }
        }
      })
      .catch(() => {});

    // Fetch approved authorities
    axios
      .get(`${API_BASE_URL}/authorities`)
      .then((res) => {
        if (Array.isArray(res.data?.authorities) && res.data.authorities.length > 0) {
          setAuthoritiesList(res.data.authorities);
        }
      })
      .catch(() => {});
  }, []);

  const currentCityAreas = useMemo(() => {
    if (!city) return [];
    const matched = locationsData.find(
      (l) => l.city.toLowerCase() === city.trim().toLowerCase()
    );
    return matched?.areas || ['Sector 62', 'Indirapuram', 'Vaishali', 'Gomti Nagar', 'Mansarovar', 'Malviya Nagar'];
  }, [locationsData, city]);

  // 7. Photos
  const [selectedCategory, setSelectedCategory] = useState('Exterior view');
  const [photos, setPhotos] = useState([]); // array of { url: string, category: string, isFeatured: boolean }
  const [photoError, setPhotoError] = useState('');

  // 8. Contact Info
  const [contactName, setContactName] = useState(user?.name || user?.firstName || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [reraNumber, setReraNumber] = useState(user?.reraNumber || '');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);

  // Fetch property details for Edit Mode
  useEffect(() => {
    if (!editId) return;
    let isMounted = true;
    setLoadingEdit(true);

    axios
      .get(`${API_BASE_URL}/properties/${editId}`)
      .then((res) => {
        if (!isMounted) return;
        const p = res.data?.property;
        if (p) {
          if (p.uniqueCode) setAutoPropertyId(p.uniqueCode);
          setTitle(p.title || '');
          setDescription(p.description || '');
          setPurpose(p.purpose === 'rent' || p.listingType === 'rent' ? 'Rent' : 'Sale');
          setPropertyCategory(p.propertyCategory || 'Residential');
          setPropertyType(p.propertyType || 'Flat');
          setOtherPropertyType(p.otherPropertyType || '');
          setSizeType(p.sizeType || 'Super Built-up Area');
          setSizeValue(p.size || p.areaSqft ? String(p.size || p.areaSqft) : '');
          setSizeUnit(p.sizeUnit || 'sqft');
          setPlotFrontFt(p.plotFrontFt ? String(p.plotFrontFt) : '');
          setPlotDepthFt(p.plotDepthFt ? String(p.plotDepthFt) : '');
          setFrontRoadFt(p.frontRoadFt ? String(p.frontRoadFt) : '');
          setIsCorner(Boolean(p.isCorner));
          setIsParkFacing(Boolean(p.isParkFacing));
          setIsTwoSideOpen(Boolean(p.isTwoSideOpen));
          if (Array.isArray(p.facing) && p.facing.length > 0) setFacing(p.facing);
          setExpectedPrice(p.price ? String(p.price) : '');
          setBookingAmount(p.bookingAmount ? String(p.bookingAmount) : '');
          setMaintenanceCharges(p.maintenanceCharges ? String(p.maintenanceCharges) : '');
          setIsNegotiable(Boolean(p.isNegotiable));
          setConstructionStatus(p.constructionStatus || 'Ready to move');
          setFurnishing(p.furnishing || 'Semi-furnished');
          if (Array.isArray(p.facilities)) setFacilities(p.facilities);
          if (Array.isArray(p.amenities)) setAmenities(p.amenities);
          if (p.bedrooms) setBedrooms(String(p.bedrooms));
          if (p.bathrooms) setBathrooms(String(p.bathrooms));
          if (p.hall) setHall(String(p.hall));
          if (p.kitchen) setKitchen(String(p.kitchen));
          if (p.balcony) setBalcony(String(p.balcony));
          if (Array.isArray(p.parking) && p.parking[0]) setParking(p.parking[0]);
          else if (typeof p.parking === 'string') setParking(p.parking);
          if (p.state) setState(p.state);
          if (p.city) setCity(p.city);
          if (Array.isArray(p.areas) && p.areas.length > 0) setSelectedAreas(p.areas);
          else if (p.locality) setSelectedAreas([p.locality]);
          if (Array.isArray(p.subAreas)) setSubAreas(p.subAreas.join(', '));
          if (p.projectName) setProjectName(p.projectName);
          if (p.address) setAddress(p.address);
          if (p.approvedAuthority) setApprovedAuthority(p.approvedAuthority);
          if (p.contactName) setContactName(p.contactName);
          if (p.contactPhone) setContactPhone(p.contactPhone);
          if (p.contactEmail) setContactEmail(p.contactEmail);
          if (p.reraNumber) setReraNumber(p.reraNumber);
          if (Array.isArray(p.images) && p.images.length > 0) {
            setPhotos(
              p.images.map((img, idx) => ({
                url: img,
                category: 'Exterior view',
                isFeatured: img === p.featuredImage || idx === 0,
              }))
            );
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load property for editing:', err);
        setSubmitError('Failed to load property details for editing.');
      })
      .finally(() => {
        if (isMounted) setLoadingEdit(false);
      });

    return () => {
      isMounted = false;
    };
  }, [editId]);

  // Fetch subscription plans if needed
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/subscriptions/plans`)
      .then((res) => {
        if (res.data?.plans) setAvailablePlans(res.data.plans);
      })
      .catch(() => {});
  }, []);

  // Area Conversions & Real Estate Rate Calculator
  const areaBreakdown = useMemo(() => {
    const s = Number(sizeValue);
    if (!s || s <= 0) return null;
    let sqft = 0;
    let gaj = 0;
    if (sizeUnit === 'sqft') {
      sqft = s;
      gaj = s / 9;
    } else if (sizeUnit === 'sq yard') {
      gaj = s;
      sqft = s * 9;
    } else if (sizeUnit === 'acre') {
      sqft = s * 43560;
      gaj = s * 4840;
    }
    return {
      sqft: parseFloat(sqft.toFixed(2)),
      gaj: parseFloat(gaj.toFixed(2)),
    };
  }, [sizeValue, sizeUnit]);

  // Rates Calculated (Per Gaj & Per Sq.Ft)
  const ratesCalculated = useMemo(() => {
    const p = Number(expectedPrice);
    if (!p || p <= 0 || !areaBreakdown) return null;
    const rateSqft = areaBreakdown.sqft > 0 ? p / areaBreakdown.sqft : 0;
    const rateGaj = areaBreakdown.gaj > 0 ? p / areaBreakdown.gaj : 0;
    return {
      rateSqft: rateSqft >= 1 ? Math.round(rateSqft) : parseFloat(rateSqft.toFixed(2)),
      rateGaj: rateGaj >= 1 ? Math.round(rateGaj) : parseFloat(rateGaj.toFixed(2)),
    };
  }, [expectedPrice, areaBreakdown]);

  // Calculated Total Amount from Gaj Rate input
  const totalFromGaj = useMemo(() => {
    const r = Number(calcInputGajRate);
    if (!r || r <= 0 || !areaBreakdown?.gaj) return null;
    return Math.round(r * areaBreakdown.gaj);
  }, [calcInputGajRate, areaBreakdown]);

  // Calculated Total Amount from Sq.Ft Rate input
  const totalFromSqft = useMemo(() => {
    const r = Number(calcInputSqftRate);
    if (!r || r <= 0 || !areaBreakdown?.sqft) return null;
    return Math.round(r * areaBreakdown.sqft);
  }, [calcInputSqftRate, areaBreakdown]);

  // Price Per Unit for legacy compatibility
  const pricePerUnit = useMemo(() => {
    const p = Number(expectedPrice);
    const s = Number(sizeValue);
    if (!p || !s || s <= 0) return null;
    const rate = p / s;
    return rate >= 1 ? Math.round(rate) : parseFloat(rate.toFixed(2));
  }, [expectedPrice, sizeValue]);

  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name || user.firstName || '');
      if (!contactPhone && user.phone) setContactPhone(user.phone);
      if (!contactEmail && user.email) setContactEmail(user.email);
      if (!reraNumber && user.reraNumber) setReraNumber(user.reraNumber);
    }
  }, [user]);

  // Handle Photo Upload with Compression
  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 20) {
      setPhotoError('You can upload a maximum of 20 photos.');
      return;
    }
    setPhotoError('');

    try {
      const compressedList = [];
      for (const file of files) {
        if (!file.type.match(/^image\//i)) continue;
        const compressed = await compressPhoto(file, 1000, 1000, 0.82);
        compressedList.push({
          url: compressed,
          category: selectedCategory,
          isFeatured: photos.length === 0 && compressedList.length === 0,
        });
      }
      setPhotos((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Error compressing photos:', err);
      setPhotoError('Failed to process image. Please try another photo.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((p) => p.isFeatured)) {
        updated[0].isFeatured = true;
      }
      return updated;
    });
  };

  const setAsFeaturedPhoto = (index) => {
    setPhotos((prev) =>
      prev.map((photo, i) => ({
        ...photo,
        isFeatured: i === index,
      }))
    );
  };

  const toggleFacility = (facility) => {
    setFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleFacing = (direction) => {
    setFacing((prev) =>
      prev.includes(direction) ? prev.filter((d) => d !== direction) : [...prev, direction]
    );
  };

  const toggleArea = (areaName) => {
    setSelectedAreas((prev) =>
      prev.includes(areaName) ? prev.filter((a) => a !== areaName) : [...prev, areaName]
    );
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!title.trim()) {
      setSubmitError('Property Title is compulsory. Please enter a descriptive title.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!city.trim()) {
      setSubmitError('Please select or enter the City.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!expectedPrice || Number(expectedPrice) <= 0) {
      setSubmitError('Please enter a valid Price.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!agreeTerms) {
      setSubmitError('Please agree to the Terms and confirmation statement.');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const featuredPhoto = photos.find((p) => p.isFeatured)?.url || photos[0]?.url || '';

      const payload = {
        title: title.trim(),
        uniqueCode: autoPropertyId,
        description: description.trim(),
        purpose: purpose.toLowerCase(),
        listingType: purpose.toLowerCase() === 'rent' ? 'rent' : 'sale',
        propertyCategory,
        propertyType: propertyType === 'Other' && otherPropertyType ? otherPropertyType : propertyType,
        otherPropertyType: propertyType === 'Other' ? otherPropertyType : '',
        sizeType,
        size: Number(sizeValue) || null,
        areaSqft: Number(sizeValue) || null,
        sizeUnit,
        plotFrontFt: plotFrontFt ? Number(plotFrontFt) : null,
        plotDepthFt: plotDepthFt ? Number(plotDepthFt) : null,
        frontRoadFt: frontRoadFt ? Number(frontRoadFt) : null,
        isCorner,
        isParkFacing,
        isTwoSideOpen,
        facing,
        price: Number(expectedPrice),
        bookingAmount: bookingAmount ? Number(bookingAmount) : null,
        maintenanceCharges: maintenanceCharges ? Number(maintenanceCharges) : null,
        isNegotiable,
        constructionStatus,
        furnishing,
        facilities,
        amenities,
        bedrooms,
        bathrooms,
        hall,
        kitchen,
        balcony,
        parking,
        images: photos.map((p) => p.url),
        featuredImage: featuredPhoto,
        state,
        city: city.trim(),
        locality: selectedAreas[0] || (currentCityAreas[0] || 'Central Area'),
        areas: selectedAreas,
        subAreas: subAreas ? subAreas.split(',').map((s) => s.trim()).filter(Boolean) : [],
        projectName: projectName.trim(),
        approvedAuthority:
          approvedAuthority === 'Other'
            ? (customAuthority.trim() || 'Other Approved')
            : (approvedAuthority || 'None / Not Applicable'),
        address: address.trim(),
        reraNumber: reraNumber.trim(),
        contactName: contactName.trim() || user?.name || 'Property Adda Partner',
        whatsappAlerts: false,
        ownerName: contactName.trim() || user?.name || 'Property Adda Partner',
        ownerPhone: contactPhone.trim() || user?.phone || '',
        ownerEmail: contactEmail.trim() || user?.email || '',
        postedByType: user?.userType || 'Owner',
      };

      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/properties/user/${editId}`, payload, { headers });
        alert('Property listing updated successfully!');
        navigate('/my-listings');
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/properties`, payload, { headers });
      setSuccessData(res.data.property || { uniqueCode: autoPropertyId, status: 'pending' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to post property:', err);
      if (err.response?.data?.quotaExceeded) {
        setShowSubscriptionModal(true);
      }
      setSubmitError(
        err.response?.data?.message || 'Failed to post property. Please check your inputs and try again.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  // Plan Click Handler: Send request to Admin Panel & Redirect directly to WhatsApp
  const handleUpgradePlan = (plan) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // 1. Send details to Admin Panel
    axios
      .post(
        `${API_BASE_URL}/subscriptions/request`,
        {
          planName: plan.name,
          planPrice: plan.price,
          userName: user?.name,
          userEmail: user?.email,
          userPhone: user?.phone,
          userType: user?.userType || 'Owner',
        },
        { headers }
      )
      .catch((err) => console.warn('Could not log subscription request:', err));

    // 2. Redirect directly to WhatsApp
    const adminPhone = '919509505892';
    const pPrice = plan.price === '₹0' || plan.price === 0 ? 'Free' : plan.price;
    const msg = encodeURIComponent(
      `Hello Property Adda Admin,\n\nI want to subscribe to this listing plan:\n• Plan: ${plan.name}\n• Price: ${pPrice}\n• Name: ${user?.name || 'Property Owner'}\n• Phone: ${user?.phone || 'N/A'}\n• Email: ${user?.email || 'N/A'}\n• Account Role: ${user?.userType || 'Owner'}\n\nPlease share payment details and approve my posted property listings.`
    );
    window.open(`https://wa.me/${adminPhone}?text=${msg}`, '_blank');
  };

  // Success view
  if (successData) {
    const isApproved = successData.status === 'approved';
    const propCode = successData.uniqueCode || autoPropertyId;
    const waText = encodeURIComponent(
      `Hello Admin, I have submitted property listing (ID: ${propCode}) on Property Adda and want to activate my plan and approve my listing.`
    );

    return (
      <div className="min-h-screen bg-[#f8fafc] py-14 px-4 sm:px-6 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
            🎉
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">
            {isApproved ? 'Property Posted & Live!' : 'Property Sent to Admin for Review & Approval!'}
          </h2>
          <p className="text-sm text-[#475569] mt-2 leading-relaxed">
            {isApproved
              ? 'Your listing is live on Property Adda. Buyers and tenants can now view and contact you.'
              : 'Aapki property admin verification queue me successfully submit ho gayi hai. Admin team aapse WhatsApp / Call par contact karegi, ya aap turant neeche WhatsApp par chat karke plan select aur listing approve karwa sakte hain.'}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-left w-full space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-xs text-[#64748b]">Property ID / Code:</span>
              <span className="text-xs font-black text-[#005744] bg-[#ecfdf5] px-2.5 py-0.5 rounded-md font-mono">
                {propCode}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-xs text-[#64748b]">Listing Status:</span>
              <span className="text-xs font-black px-2 py-0.5 rounded uppercase bg-amber-100 text-amber-800">
                {successData.status || 'Pending Approval'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-xs text-[#64748b]">Type & Purpose:</span>
              <span className="text-xs font-bold text-[#0f172a] capitalize">
                {successData.propertyType} • {successData.purpose || successData.listingType}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-[#64748b]">City:</span>
              <span className="text-xs font-bold text-[#0f172a]">{successData.city}</span>
            </div>
          </div>

          {/* Direct WhatsApp Contact Button for Plan Payment & Approval */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left">
            <h4 className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <span>💬</span> Chat with Admin for Plan & Instant Approval
            </h4>
            <p className="text-[11px] text-emerald-700 mb-3">
              Admin team will guide you on the best plan options and activate your listing promptly upon payment confirmation.
            </p>
            <a
              href={`https://wa.me/919509505892?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>💬</span> Chat with Admin on WhatsApp Now →
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/my-listings"
              className="w-full py-3 px-4 rounded-xl bg-[#142D4E] text-white font-bold text-xs hover:bg-[#0f233d] shadow-md transition-all text-center"
            >
              Manage in My Listings →
            </Link>
            <Link
              to={`/property/${propCode}`}
              className="w-full py-3 px-4 rounded-xl bg-[#D62839] text-white font-bold text-xs hover:bg-[#b81d2c] shadow-md transition-all text-center"
            >
              Preview Property Page →
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setPhotos([]);
                setExpectedPrice('');
                setDescription('');
              }}
              className="w-full py-3 px-4 rounded-xl border border-[#cbd5e1] text-[#334155] font-bold text-xs hover:bg-[#f8fafc] transition-all cursor-pointer"
            >
              + Post Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Require Account before posting property (Owner / Dealer / Builder)
  const token = localStorage.getItem('token');
  if (!user && !token) {
    return (
      <div className="min-h-screen bg-[#F3F5F8] py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-[#fff1f2] border-2 border-[#D62839] text-[#D62839] rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold mb-4">
            🏢
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D62839] bg-[#fff1f2] px-3 py-1 rounded-full">
            Step 1 · Account Required
          </span>
          <h2 className="text-2xl font-extrabold text-[#142D4E] mt-3">
            Choose Account Type to Post Property
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Direct buyer inquiries, verified badges, and listing management ke liye post property se pehle account banana zaroori hai. Please select your role:
          </p>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6 text-left">
            <button
              type="button"
              onClick={() => setSelectedRole('Owner')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedRole === 'Owner'
                  ? 'border-[#D62839] bg-[#fff1f2]/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">🏠</span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'Owner' ? 'border-[#D62839] bg-[#D62839]' : 'border-slate-300'
                }`}>
                  {selectedRole === 'Owner' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-[#142D4E]">Individual Owner</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Posting my own flat, house, or plot. 0% Brokerage.</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('Dealer / Agent')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedRole === 'Dealer / Agent'
                  ? 'border-[#D62839] bg-[#fff1f2]/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">🤝</span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'Dealer / Agent' ? 'border-[#D62839] bg-[#D62839]' : 'border-slate-300'
                }`}>
                  {selectedRole === 'Dealer / Agent' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-[#142D4E]">Dealer / Agent</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Licensed broker, dealer or agent managing multiple client properties.</p>
            </button>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#D62839] hover:bg-[#b81d2c] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Create {selectedRole} Account & Post Property →
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#142D4E] hover:text-[#D62839] transition-all cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          </div>

          <ClientAuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            initialMode={authModalMode}
            nextUrl="/post-property"
          />
        </div>
      </div>
    );
  }

  // Calculate plan status and validity
  const isPlanExpired = Boolean(user?.planExpiresAt && new Date(user.planExpiresAt) < new Date());
  const hasActivePlan = Boolean(user?.activePlan && !isPlanExpired);

  const purchasedDateStr = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const expiryDateStr = user?.planExpiresAt
    ? new Date(user.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Valid for 30 Days';

  const rolePlans = user?.userType === 'Dealer / Agent' ? AGENT_PLANS : OWNER_PLANS;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 font-sans text-[#0f172a]">
      <div className="max-w-5xl mx-auto">
        {/* Account Verification & Role Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#142D4E] text-white flex items-center justify-center font-bold text-sm">
              {(user?.name || user?.firstName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#142D4E]">
                  Posting as: <strong className="text-[#D62839]">{user?.name || user?.firstName || 'Partner'}</strong>
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-[#fff1f2] text-[#D62839] px-2 py-0.5 rounded">
                  {user?.userType || 'Owner'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {user?.email || user?.phone} · Direct buyer inquiries will be routed to your dashboard
              </p>
            </div>
          </div>
          <Link
            to="/my-listings"
            className="text-xs font-bold text-[#142D4E] hover:text-[#D62839] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            My Listings & Leads →
          </Link>
        </div>

        {/* Active Subscription & Plan Validity Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white border border-blue-200/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center text-xl shadow-xs flex-shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#142D4E] uppercase tracking-wide">
                  Active Plan: <span className="text-[#2563eb]">{user?.activePlan || 'Free Starter Plan'}</span>
                </span>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ● Active
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-[#2563eb] px-2 py-0.5 rounded-full">
                  {user?.listingLimit ? `${user.listingLimit} Listings Quota` : '2 Listings'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 mt-1.5 flex-wrap">
                <span>
                  📅 <strong>Plan Purchased:</strong> {purchasedDateStr}
                </span>
                <span>
                  ⏳ <strong>Plan Expires:</strong> <strong className="text-rose-600">{expiryDateStr}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSubscriptionModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#2563eb] border border-blue-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer ml-auto"
          >
            Upgrade / Change Plan →
          </button>
        </div>
        {/* Main Title Banner */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a]">
                {isEditMode ? 'Edit Property Listing' : 'Post Property on Property Adda'}
              </h1>
              <span className="bg-[#2563eb] text-white text-[11px] font-black px-2 py-0.5 rounded-md tracking-wide">
                {isEditMode ? 'EDIT' : 'FREE'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              {isEditMode
                ? 'Update property details, photos, dimensions, amenities, or pricing.'
                : 'Reach thousands of verified buyers & tenants with zero brokerage.'}
            </p>
          </div>

          {/* Auto-generated Property ID Badge */}
          <div className="px-4 py-2 rounded-2xl bg-white border border-[#cbd5e1] shadow-2xs flex items-center gap-2">
            <span className="text-xs text-[#64748b]">Property ID:</span>
            <span className="font-mono font-black text-xs text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-md">
              {autoPropertyId}
            </span>
          </div>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{submitError}</span>
            </div>
            {submitError.includes('Listing limit reached') && (
              <button
                type="button"
                onClick={() => setShowSubscriptionModal(true)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs cursor-pointer ml-3"
              >
                Upgrade Plan →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── 1. PROPERTY OVERVIEW & PURPOSE ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Property Purpose & Type</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dropdown - Purpose */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Purpose <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] outline-none focus:border-[#2563eb]"
                >
                  <option value="Sale">Sale (Buy / Resale)</option>
                  <option value="Rent">Rent / Lease</option>
                </select>
              </div>

              {/* Dropdown - Commercial / Residential */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] outline-none focus:border-[#2563eb]"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Dropdown - Property Type */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setPropertyType(newType);
                    if (newType === 'Plot') {
                      setBedrooms('0');
                      setBathrooms('0');
                      setHall('0');
                      setKitchen('0');
                      setBalcony('0');
                      setParking('None');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] outline-none focus:border-[#2563eb]"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Other Property Type Manual Mention */}
            {propertyType === 'Other' && (
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Mention Property Type Manually <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={otherPropertyType}
                  onChange={(e) => setOtherPropertyType(e.target.value)}
                  placeholder="e.g. Penthouse, Triplex, Institutional Plot, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            )}

            {/* Title & Description (Manual Inputs - Compulsory) */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Property Title <span className="text-rose-500">* (Compulsory)</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spacious 3 BHK Luxury Apartment with Open Garden View..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Description <span className="text-[#64748b] font-medium">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property, ventilation, society amenities, nearby metro/schools, etc. (Optional)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium outline-none focus:border-[#2563eb] resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── 2. SIZE, DIMENSIONS & ROAD ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Size, Dimensions & Facing</h2>
            </div>

            {/* Size Type, Value, Unit with Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Size Type
                </label>
                <select
                  value={sizeType}
                  onChange={(e) => setSizeType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="Super Built-up Area">Super Built-up Area</option>
                  <option value="Carpet Area">Carpet Area</option>
                  <option value="Plot Area">Plot Area</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Size Value <span className="text-rose-500">*</span>
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) setSizeValue(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 text-xs font-semibold text-[#142D4E] mb-1.5 cursor-pointer outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Select Standard Size --</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="111.11">111.11 (100 Gaj)</option>
                  <option value="150">150</option>
                  <option value="166.67">166.67 (150 Gaj)</option>
                  <option value="200">200</option>
                  <option value="222.22">222.22 (200 Gaj)</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="800">800</option>
                  <option value="1000">1000</option>
                  <option value="1200">1200</option>
                  <option value="1500">1500</option>
                  <option value="1800">1800</option>
                  <option value="2000">2000</option>
                  <option value="2500">2500</option>
                  <option value="3000">3000</option>
                  <option value="5000">5000</option>
                </select>
                <input
                  type="number"
                  required
                  value={sizeValue}
                  onChange={(e) => setSizeValue(e.target.value)}
                  placeholder="Or type size e.g. 1500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Unit Dropdown
                </label>
                <select
                  value={sizeUnit}
                  onChange={(e) => setSizeUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="sqft">sq. ft.</option>
                  <option value="sq yard">sq. yard (Gaj)</option>
                  <option value="acre">acre</option>
                </select>
              </div>
            </div>

            {/* Plot Dimensions & Road Size with Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Front in ft (Plot dimensions)
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) setPlotFrontFt(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 text-xs font-semibold text-[#142D4E] mb-1.5 cursor-pointer outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Select Front (ft) --</option>
                  <option value="15">15 ft</option>
                  <option value="20">20 ft</option>
                  <option value="25">25 ft</option>
                  <option value="30">30 ft</option>
                  <option value="35">35 ft</option>
                  <option value="40">40 ft</option>
                  <option value="45">45 ft</option>
                  <option value="50">50 ft</option>
                  <option value="60">60 ft</option>
                  <option value="80">80 ft</option>
                  <option value="100">100 ft</option>
                </select>
                <input
                  type="number"
                  value={plotFrontFt}
                  onChange={(e) => setPlotFrontFt(e.target.value)}
                  placeholder="Or type front e.g. 30"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Depth in ft (Plot dimensions)
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) setPlotDepthFt(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 text-xs font-semibold text-[#142D4E] mb-1.5 cursor-pointer outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Select Depth (ft) --</option>
                  <option value="30">30 ft</option>
                  <option value="35">35 ft</option>
                  <option value="40">40 ft</option>
                  <option value="45">45 ft</option>
                  <option value="50">50 ft</option>
                  <option value="55">55 ft</option>
                  <option value="60">60 ft</option>
                  <option value="70">70 ft</option>
                  <option value="80">80 ft</option>
                  <option value="90">90 ft</option>
                  <option value="100">100 ft</option>
                </select>
                <input
                  type="number"
                  value={plotDepthFt}
                  onChange={(e) => setPlotDepthFt(e.target.value)}
                  placeholder="Or type depth e.g. 50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Front Road size in ft
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) setFrontRoadFt(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 text-xs font-semibold text-[#142D4E] mb-1.5 cursor-pointer outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Select Road Size (ft) --</option>
                  <option value="20">20 ft Road</option>
                  <option value="30">30 ft Road</option>
                  <option value="40">40 ft Road</option>
                  <option value="60">60 ft Road</option>
                  <option value="80">80 ft Sector Road</option>
                  <option value="100">100 ft Main Road</option>
                  <option value="120">120 ft Express Road</option>
                  <option value="160">160 ft Highway Road</option>
                  <option value="200">200 ft Bypass Road</option>
                </select>
                <input
                  type="number"
                  value={frontRoadFt}
                  onChange={(e) => setFrontRoadFt(e.target.value)}
                  placeholder="Or type road size e.g. 40"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Checkboxes: Corner / park facing / 2 sides open */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-2">
                Property Highlights (Checkboxes)
              </label>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCorner}
                    onChange={(e) => setIsCorner(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb]"
                  />
                  <span>Corner Plot / Unit</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isParkFacing}
                    onChange={(e) => setIsParkFacing(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb]"
                  />
                  <span>Park Facing</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTwoSideOpen}
                    onChange={(e) => setIsTwoSideOpen(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb]"
                  />
                  <span>2 Sides Open</span>
                </label>
              </div>
            </div>

            {/* Facing (Multi-select) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Facing (Multi-select)
              </label>
              <div className="flex flex-wrap gap-2">
                {FACING_OPTIONS.map((dir) => {
                  const isChecked = facing.includes(dir);
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => toggleFacing(dir)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{dir}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 3. PRICE & AUTO-CALCULATED RATE ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Pricing & Rates</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  {purpose === 'Rent' ? 'Rent value / month' : 'Expected Sale Price'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#64748b] font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    placeholder={purpose === 'Rent' ? 'e.g. 25000' : 'e.g. 6500000'}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#0f172a] outline-none focus:border-[#2563eb]"
                  />
                </div>
                {expectedPrice && (
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#2563eb]">
                      {formatIndianPrice(expectedPrice)} {purpose === 'Rent' ? '/ month' : ''}
                    </span>
                    {purpose !== 'Rent' && ratesCalculated && (
                      <span className="text-[#059669] font-bold bg-[#ecfdf5] px-2 py-0.5 rounded">
                        ⚡ ₹{ratesCalculated.rateGaj.toLocaleString('en-IN')}/गज • ₹{ratesCalculated.rateSqft.toLocaleString('en-IN')}/sqft
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Booking / Security Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#64748b] font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={bookingAmount}
                    onChange={(e) => setBookingAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>
            </div>

            {/* Real Estate Rate & Price Calculator (प्रति वर्ग गज / प्रति वर्ग फुट कैलकुलेटर) */}
            {purpose !== 'Rent' && (
              <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧮</span>
                    <div>
                      <h4 className="text-xs font-black text-[#142D4E] uppercase tracking-wide">
                        Property Rate & Price Calculator (रियल एस्टेट कैलकुलेटर)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        प्रति वर्ग फुट (Sq.Ft) व प्रति गज (Gaj) दर निकालें या दर से कुल कीमत कैलकुलेट करें
                      </p>
                    </div>
                  </div>
                  {areaBreakdown ? (
                    <span className="text-[11px] font-bold text-[#2563eb] bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                      📐 Area: {sizeValue} {sizeUnit} ≈ <strong>{areaBreakdown.gaj} Gaj</strong> (वर्ग गज) | <strong>{areaBreakdown.sqft} Sq.Ft</strong>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded">
                      Section 2 me area enter karein
                    </span>
                  )}
                </div>

                {/* Live Rates Display */}
                {expectedPrice && areaBreakdown && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3">
                    <div className="p-2.5 bg-white rounded-xl border border-blue-100 text-center shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Rate per Gaj (प्रति गज)</span>
                      <span className="text-sm font-black text-[#2563eb]">
                        ₹ {ratesCalculated?.rateGaj ? ratesCalculated.rateGaj.toLocaleString('en-IN') : '0'} / गज
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-blue-100 text-center shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Rate per Sq.Ft (प्रति वर्ग फुट)</span>
                      <span className="text-sm font-black text-[#059669]">
                        ₹ {ratesCalculated?.rateSqft ? ratesCalculated.rateSqft.toLocaleString('en-IN') : '0'} / sq.ft
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-blue-100 text-center shadow-2xs col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Price (कुल राशि)</span>
                      <span className="text-sm font-black text-[#D62839]">
                        {formatIndianPrice(expectedPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Interactive Rate-to-Price calculation tools */}
                <div className="mt-3 pt-2.5 border-t border-blue-100">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-[#142D4E]">Calculate Total Price by Rate:</span>
                    <button
                      type="button"
                      onClick={() => setCalcActiveMode('gaj')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        calcActiveMode === 'gaj'
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      By Rate per Gaj (प्रति गज दर)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcActiveMode('sqft')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        calcActiveMode === 'sqft'
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      By Rate per Sq.Ft (प्रति वर्ग फुट दर)
                    </button>
                  </div>

                  {calcActiveMode === 'gaj' ? (
                    <div className="p-3 bg-white rounded-xl border border-blue-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Enter Rate per Gaj (₹ प्रति गज दर डालें)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            value={calcInputGajRate}
                            onChange={(e) => setCalcInputGajRate(e.target.value)}
                            placeholder="e.g. 25000"
                            className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none focus:border-[#2563eb]"
                          />
                        </div>
                      </div>
                      {totalFromGaj ? (
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Calculated Total Amount</span>
                            <span className="text-sm font-black text-[#D62839]">
                              ₹ {totalFromGaj.toLocaleString('en-IN')} ({formatIndianPrice(totalFromGaj)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setExpectedPrice(String(totalFromGaj));
                            }}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all whitespace-nowrap"
                          >
                            ✓ Apply as Price
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400">
                          {areaBreakdown?.gaj ? `Multiplies with ${areaBreakdown.gaj} Gaj` : 'Enter size in Section 2 to calculate'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-blue-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Enter Rate per Sq.Ft (₹ प्रति वर्ग फुट दर डालें)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            value={calcInputSqftRate}
                            onChange={(e) => setCalcInputSqftRate(e.target.value)}
                            placeholder="e.g. 3500"
                            className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold outline-none focus:border-[#2563eb]"
                          />
                        </div>
                      </div>
                      {totalFromSqft ? (
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Calculated Total Amount</span>
                            <span className="text-sm font-black text-[#D62839]">
                              ₹ {totalFromSqft.toLocaleString('en-IN')} ({formatIndianPrice(totalFromSqft)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setExpectedPrice(String(totalFromSqft));
                            }}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all whitespace-nowrap"
                          >
                            ✓ Apply as Price
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400">
                          {areaBreakdown?.sqft ? `Multiplies with ${areaBreakdown.sqft} Sq.Ft` : 'Enter size in Section 2 to calculate'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563eb]"
                />
                <span>Price is Negotiable</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b]">Monthly maintenance:</span>
                <input
                  type="number"
                  value={maintenanceCharges}
                  onChange={(e) => setMaintenanceCharges(e.target.value)}
                  placeholder="₹ Optional"
                  className="w-28 px-2 py-1 rounded-lg border border-[#cbd5e1] text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── 4. STATUS, FURNISHING & ROOM COUNTS ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Status, Furnishing & Rooms</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Dropdown - Construction Status
                </label>
                <select
                  value={constructionStatus}
                  onChange={(e) => setConstructionStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="Ready to move">Ready to move</option>
                  <option value="Under construction">Under construction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Dropdown - Furnishing
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="Non-furnished">Non-furnished</option>
                  <option value="Semi-furnished">Semi-furnished</option>
                  <option value="Fully furnished">Fully furnished</option>
                </select>
              </div>
            </div>

            {/* Room details dropdowns */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#334155]">
                  Room & Parking Details (Starts from 0)
                </label>
                {propertyType === 'Plot' && (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ℹ️ Plots / Land have 0 bedrooms & bathrooms
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Bedrooms</span>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['0', '1', '2', '3', '4', '4+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Bathrooms</span>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['0', '1', '2', '3', '3+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Hall</span>
                  <select
                    value={hall}
                    onChange={(e) => setHall(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['0', '1', '2', '2+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Kitchen</span>
                  <select
                    value={kitchen}
                    onChange={(e) => setKitchen(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['0', '1', '2', '2+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Balcony</span>
                  <select
                    value={balcony}
                    onChange={(e) => setBalcony(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    {['0', '1', '2', '3', '3+'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-[#64748b] block mb-1">Parking</span>
                  <select
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold"
                  >
                    <option value="None">None (0)</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Car & Bike">Car & Bike</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Facilities Multiple Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-2">
                Facilities (Multiple Checkboxes: Gated society, park, security, clubhouse, gym, home theater, swimming pool, lift)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FACILITY_OPTIONS.map((fac) => {
                  const isChecked = facilities.includes(fac);
                  return (
                    <label
                      key={fac}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#2563eb] bg-[#eff6ff] text-[#1e40af]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFacility(fac)}
                        className="w-4 h-4 rounded text-[#2563eb]"
                      />
                      <span>{fac}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Amenities Multiple Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#334155] mb-2">
                Amenities (Multiple Checkboxes: Bed, almirah, dining table, AC, fan, lights, geyser, modular kitchen, RO water, fridge, chimney, gas connection, gas stove, sofa, TV, wi-fi)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AMENITY_OPTIONS.map((am) => {
                  const isChecked = amenities.includes(am);
                  return (
                    <label
                      key={am}
                      className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(am)}
                        className="w-3.5 h-3.5 rounded text-emerald-600"
                      />
                      <span className="truncate">{am}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 5. LOCATION (DROPDOWNS, AREAS, ADDRESS) ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                5
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Location & Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  City (Select from dropdown) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-bold outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Select City --</option>
                  {locationsData.map((l) => (
                    <option key={l.id || l._id || l.city} value={l.city}>
                      {l.city} ({l.state || 'India'})
                    </option>
                  ))}
                  {/* Fallbacks */}
                  {!locationsData.some((l) => l.city === 'Mumbai') && <option value="Mumbai">Mumbai</option>}
                  {!locationsData.some((l) => l.city === 'Delhi NCR') && <option value="Delhi NCR">Delhi NCR</option>}
                  {!locationsData.some((l) => l.city === 'Noida') && <option value="Noida">Noida</option>}
                  {!locationsData.some((l) => l.city === 'Gurgaon') && <option value="Gurgaon">Gurgaon</option>}
                  {!locationsData.some((l) => l.city === 'Jaipur') && <option value="Jaipur">Jaipur</option>}
                </select>
              </div>

              {/* Township / Apartment / Project Name with Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Township / Apartment / Project Name
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) setProjectName(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/50 text-xs font-semibold text-[#142D4E] mb-1.5 cursor-pointer outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Choose Township / Project from Dropdown --</option>
                  <option value="ATS Knightsbridge">ATS Knightsbridge</option>
                  <option value="Gaur City">Gaur City</option>
                  <option value="DLF Phase 5">DLF Phase 5</option>
                  <option value="Mahima Panorama">Mahima Panorama</option>
                  <option value="Vatika Infotech City">Vatika Infotech City</option>
                  <option value="Ashiana Town">Ashiana Town</option>
                  <option value="Omaxe City">Omaxe City</option>
                  <option value="Eldeco Township">Eldeco Township</option>
                  <option value="Godrej Woods">Godrej Woods</option>
                  <option value="Supertech Eco Village">Supertech Eco Village</option>
                  <option value="Green Meadows">Green Meadows</option>
                  <option value="Dream City">Dream City</option>
                  <option value="Royal Enclave">Royal Enclave</option>
                </select>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Or type custom township / project e.g. ATS Knightsbridge..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Area Multi-select */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Area (Select from available areas in {city || 'City'})
              </label>
              <div className="flex flex-wrap gap-2">
                {currentCityAreas.map((areaName) => {
                  const isChecked = selectedAreas.includes(areaName);
                  return (
                    <button
                      key={areaName}
                      type="button"
                      onClick={() => toggleArea(areaName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#2563eb] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{areaName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub area & Address with Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Sub Area / Block / Sector
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      setSubAreas((prev) => (prev ? `${prev}, ${e.target.value}` : e.target.value));
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/50 text-xs font-semibold text-[#142D4E] mb-1.5 cursor-pointer outline-none focus:border-[#2563eb]"
                >
                  <option value="">-- Choose Sub Area / Block from Dropdown --</option>
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Phase 1">Phase 1</option>
                  <option value="Phase 2">Phase 2</option>
                  <option value="Extension">Extension</option>
                  <option value="Main Road Facing">Main Road Facing</option>
                  <option value="Near Metro Station">Near Metro Station</option>
                  <option value="Sector 62">Sector 62</option>
                  <option value="Sector 18 Pocket 2">Sector 18 Pocket 2</option>
                </select>
                <input
                  type="text"
                  value={subAreas}
                  onChange={(e) => setSubAreas(e.target.value)}
                  placeholder="e.g. Block C, Sector 18 Pocket 2, Metro Gate 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Property Approved / Recognised By (Optional)
                </label>
                <select
                  value={approvedAuthority}
                  onChange={(e) => setApprovedAuthority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] outline-none focus:border-[#2563eb]"
                >
                  <option value="">None / Not Applicable (Optional)</option>
                  {authoritiesList.map((auth) => (
                    <option key={auth} value={auth}>
                      {auth}
                    </option>
                  ))}
                  <option value="Other">Other (Type Manually)</option>
                </select>
                {approvedAuthority === 'Other' && (
                  <input
                    type="text"
                    value={customAuthority}
                    onChange={(e) => setCustomAuthority(e.target.value)}
                    placeholder="Type authority name manually (e.g. HUDA, Collector, Gram Panchayat)"
                    className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Full Address (Text)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tower, flat number or landmark details"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          {/* ── 6. PICTURES UPLOAD & SELECT FEATURED IMAGE ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                  6
                </span>
                <h2 className="text-base font-bold text-[#0f172a]">
                  Pictures Upload & Select Featured Image
                </h2>
              </div>
              <span className="text-xs text-[#64748b]">
                {photos.length} / 20 uploaded
              </span>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {PHOTO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#2563eb] text-white shadow-xs'
                      : 'bg-[#f8fafc] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Drag and Drop Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#cbd5e1] hover:border-[#2563eb] bg-[#f8fafc] rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#e2e8f0] mb-2 group-hover:scale-105 transition-transform text-2xl">
                📷
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#0f172a]">
                Click or drag images to upload under <span className="text-[#2563eb]">"{selectedCategory}"</span>
              </p>
              <p className="text-[11px] text-[#64748b] mt-1">
                Supports JPG, PNG, WebP (auto-compressed for fast loading)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {photoError && <p className="text-xs text-rose-600 font-semibold">{photoError}</p>}

            {/* Photo List & Select Featured Image */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-4/3 bg-[#f1f5f9] group transition-all ${
                      photo.isFeatured ? 'border-[#2563eb] shadow-md ring-2 ring-[#2563eb]/20' : 'border-slate-200'
                    }`}
                  >
                    <img src={photo.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                    {/* Featured Star Badge */}
                    {photo.isFeatured ? (
                      <span className="absolute top-1.5 left-1.5 bg-[#2563eb] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        ⭐ Featured Image
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAsFeaturedPhoto(idx);
                        }}
                        className="absolute inset-x-2 bottom-2 bg-white/90 hover:bg-white text-[#2563eb] text-[10px] font-bold py-1 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center"
                      >
                        Set as Featured ⭐
                      </button>
                    )}

                    {/* Category Label */}
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                      {photo.category}
                    </span>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(idx);
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white text-xs flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 7. ADMIN BADGE NOTICE & CONTACT ── */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white text-xs font-black flex items-center justify-center">
                7
              </span>
              <h2 className="text-base font-bold text-[#0f172a]">Contact & Admin Badges</h2>
            </div>

            {/* Featured / Verified Notice */}
            <div className="p-3.5 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-xs flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-bold text-[#1e40af]">
                  Featured & Verified Badges — Reviewed by Admin Only
                </p>
                <p className="text-[11px] text-[#3b82f6] mt-0.5">
                  To ensure quality & authenticity for buyers, only verified accounts and properties inspected by Property Adda administrators carry the Verified & Featured badges.
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Contact Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 9672056670"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  RERA Registration No. (Optional)
                </label>
                <input
                  type="text"
                  value={reraNumber}
                  onChange={(e) => setReraNumber(e.target.value)}
                  placeholder="e.g. RAJ/P/2023/1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0f172a]">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563eb]"
                />
                <span>
                  I confirm that all details provided are accurate and I agree to{' '}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563eb] underline hover:text-[#1d4ed8]"
                  >
                    Property Adda Terms of Use
                  </a>.
                </span>
              </label>
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || loadingEdit}
              className="w-full py-4 px-6 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-base shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>{isEditMode ? 'Saving Changes...' : 'Publishing Property Listing...'}</span>
              ) : (
                <span>{isEditMode ? 'Save & Update Property Listing →' : 'Post Property Listing Now →'}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── SUBSCRIPTION QUOTA MODAL ── */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 font-sans max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Listing Limit Reached — Upgrade Your Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a subscription plan to continue posting and boost your real estate deals.
                </p>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              {rolePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                    user?.activePlan === plan.name
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase bg-[#2563eb] text-white px-2 py-0.5 rounded">
                        {plan.tag}
                      </span>
                      {user?.activePlan === plan.name && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{plan.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {plan.limit} Listings • {plan.days} Days Validity • Direct inquiries
                    </p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <p className="text-2xl font-black text-[#D62839]">{plan.price}</p>
                      <span className="text-xs text-slate-400 line-through">{plan.originalPrice}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={submitting || user?.activePlan === plan.name}
                    onClick={() => handleUpgradePlan(plan)}
                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-all ${
                      user?.activePlan === plan.name
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                    }`}
                  >
                    {user?.activePlan === plan.name ? '✓ Currently Active' : `Select ${plan.price} Plan →`}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-slate-400">
              Instant activation • Listing limits updated immediately upon online payment
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
