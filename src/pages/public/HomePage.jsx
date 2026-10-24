// frontend/src/pages/public/HomePage.jsx
import React from 'react';
import PropertiesSection from '../../components/Homepage/PropertiesSection';
import LivePropertiesShowcase from '../../components/Homepage/LivePropertiesShowcase';
import ProminentProjects from '../../components/Homepage/ProminentProjects';
import HomeLoanEmiCalculator from '../../components/Homepage/HomeLoanEmiCalculator';
import HomesWaleFaq from '../../components/Homepage/HomesWaleFaq';
import ManagedPageSections from '../../components/shared/ManagedPageSections';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      {/* 1. Hero Banner Carousel & Interactive Search Widget */}
      <PropertiesSection />

      {/* 2. Live Verified Properties from Backend Database */}
      <LivePropertiesShowcase />

      {/* 3. Luxury & Featured Projects */}
      <ProminentProjects />

      {/* 4. Interactive Home Loan EMI Calculator */}
      <HomeLoanEmiCalculator />

      {/* 5. HomesWale Trust Pillars & FAQs */}
      <HomesWaleFaq />

      {/* 6. Admin Managed Dynamic Sections */}
      <ManagedPageSections page="homepage" />
    </div>
  );
}

export default HomePage;
