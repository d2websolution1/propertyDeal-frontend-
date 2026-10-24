// frontend/src/pages/public/Plotspage.jsx
import React from 'react';
import PropertiesSection from '../../components/Homepage/PropertiesSection';
import LivePropertiesShowcase from '../../components/Homepage/LivePropertiesShowcase';
import LatestProjects from '../../components/plotspage/LatestProjects';
import PropertiesInIndia from '../../components/pgpage/PropertiesInIndia';
import HomeLoanEmiCalculator from '../../components/Homepage/HomeLoanEmiCalculator';
import HomesWaleFaq from '../../components/Homepage/HomesWaleFaq';
import ManagedPageSections from '../../components/shared/ManagedPageSections';

function Plotspage({ city = 'Mumbai' }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Unified Hero Banner & Navbar Search Widget for Plots */}
      <PropertiesSection category="plots" city={city} />

      {/* Live Verified Plots from Database */}
      <LivePropertiesShowcase initialFilter="plots" title="Residential & Commercial Plots / Land" />

      {/* Projects & Tools */}
      <LatestProjects />
      <PropertiesInIndia />
      <HomeLoanEmiCalculator />
      <HomesWaleFaq />

      {/* Admin-Managed Plots Content Sections */}
      <ManagedPageSections page="plots" />
    </div>
  );
}

export default Plotspage;
