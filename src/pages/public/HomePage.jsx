// frontend/src/pages/public/HomePage.jsx
import React from 'react';
import PropertiesSection from '../../components/Homepage/PropertiesSection';
import LivePropertiesShowcase from '../../components/Homepage/LivePropertiesShowcase';
import ProminentProjects from '../../components/Homepage/ProminentProjects';
import HomeLoanEmiCalculator from '../../components/Homepage/HomeLoanEmiCalculator';
import HomesWaleFaq from '../../components/Homepage/HomesWaleFaq';
import ManagedPageSections from '../../components/shared/ManagedPageSections';
import AdBanner from '../../components/common/AdBanner';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      {/* 1. Hero Banner Carousel & Interactive Search Widget */}
      <PropertiesSection />

      {/* Header Position Advertisements */}
      <AdBanner position="header" className="pt-2" />

      {/* 2. Live Verified Properties from Backend Database */}
      <LivePropertiesShowcase />

      {/* Between Listings Advertisements */}
      <AdBanner position="between-listings" />

      {/* 3. Luxury & Featured Projects */}
      <ProminentProjects />

      {/* Sidebar / Promotional Sponsored Ads */}
      <AdBanner position="sidebar" />

      {/* 4. Interactive Home Loan EMI Calculator */}
      <HomeLoanEmiCalculator />

      {/* 5. HomesWale Trust Pillars & FAQs */}
      <HomesWaleFaq />

      {/* Footer Position Advertisements */}
      <AdBanner position="footer" />

      {/* 6. Admin Managed Dynamic Sections */}
      <ManagedPageSections page="homepage" />
    </div>
  );
}

export default HomePage;
