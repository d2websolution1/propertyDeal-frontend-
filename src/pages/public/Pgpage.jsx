// frontend/src/pages/public/Pgpage.jsx
import React from 'react';
import PropertiesSection from '../../components/Homepage/PropertiesSection';
import LivePropertiesShowcase from '../../components/Homepage/LivePropertiesShowcase';
import HomeAtFirstSight from '../../components/pgpage/HomeAtFirstSight';
import PGBenefitsSection from '../../components/pgpage/PGBenefitsSection';
import HandpickedCollections from '../../components/pgpage/HandpickedCollections';
import HomesWaleFaq from '../../components/Homepage/HomesWaleFaq';
import ManagedPageSections from '../../components/shared/ManagedPageSections';

function Pgpage({ city = 'Mumbai' }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Unified Hero Banner & Navbar Search Widget for PG / Co-Living */}
      <PropertiesSection category="pg" city={city} />

      {/* Live Verified PG Accommodations from Database */}
      <LivePropertiesShowcase initialFilter="rent" title="Verified PG Accommodations & Co-Living Spaces" />

      {/* Collections & Amenities */}
      <HomeAtFirstSight />
      <PGBenefitsSection />
      <HandpickedCollections />
      <HomesWaleFaq />

      {/* Admin-Managed PG Content Sections */}
      <ManagedPageSections page="pg" />
    </div>
  );
}

export default Pgpage;
