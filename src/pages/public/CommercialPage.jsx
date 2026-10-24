// frontend/src/pages/public/CommercialPage.jsx
import React from 'react';
import PropertiesSection from '../../components/Homepage/PropertiesSection';
import LivePropertiesShowcase from '../../components/Homepage/LivePropertiesShowcase';
import RecentlyAddedForSale from '../../components/commercialPage/RecentlyAddedForSale';
import RecentlyAddedForRent from '../../components/commercialPage/RecentlyAddedForRent';
import HousingExperts from '../../components/commercialPage/HousingExperts';
import HomesWaleFaq from '../../components/Homepage/HomesWaleFaq';
import ManagedPageSections from '../../components/shared/ManagedPageSections';

function CommercialPage({ city = 'Mumbai' }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Unified Hero Banner & Navbar Search Widget for Commercial */}
      <PropertiesSection category="commercial" city={city} />

      {/* Live Verified Commercial Properties from Database */}
      <LivePropertiesShowcase initialFilter="commercial" title="Verified Commercial Properties, Shops & Offices" />

      {/* Commercial Sections */}
      <RecentlyAddedForSale />
      <RecentlyAddedForRent />
      <HousingExperts />
      <HomesWaleFaq />

      {/* Admin-Managed Commercial Content Sections */}
      <ManagedPageSections page="commercial" />
    </div>
  );
}

export default CommercialPage;
