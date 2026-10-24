// frontend/src/pages/public/RentPage.jsx
import React from 'react';
import PropertiesSection from '../../components/Homepage/PropertiesSection';
import LivePropertiesShowcase from '../../components/Homepage/LivePropertiesShowcase';
import RecommendedSellers from '../../components/Homepage/RecommendedSellers';
import HomeLoanEmiCalculator from '../../components/Homepage/HomeLoanEmiCalculator';
import HomesWaleFaq from '../../components/Homepage/HomesWaleFaq';
import ManagedPageSections from '../../components/shared/ManagedPageSections';

function RentPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Unified Hero Banner & Navbar Search Widget for Rent */}
      <PropertiesSection category="rent" city="Mumbai" />

      {/* Live Verified Rental Properties from Database */}
      <LivePropertiesShowcase initialFilter="rent" title="Verified Flats & Houses for Rent" />

      {/* Recommended Sellers / Owners */}
      <RecommendedSellers sectionKey="rent_recommended_sellers" />

      {/* Financial Tools */}
      <HomeLoanEmiCalculator />

      {/* FAQs */}
      <HomesWaleFaq />

      {/* Admin-Managed Rent Content Sections */}
      <ManagedPageSections page="rent" />
    </div>
  );
}

export default RentPage;