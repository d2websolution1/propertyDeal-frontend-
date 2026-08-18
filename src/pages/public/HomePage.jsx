import React from 'react'

import PropertiesSection from '../../components/Homepage/PropertiesSection'
import HousingTopPicks from '../../components/Homepage/HousingTopPicks'
import ProminentProjects from '../../components/Homepage/ProminentProjects'
import TopHighlightedProjects from '../../components/Homepage/TopHighlightedProjects'
import FeaturedDevelopers from '../../components/Homepage/FeaturedDevelopers'
import TrustedDeveloperProjects from '../../components/Homepage/TrustedDeveloperProjects'
import ResearchAndInsights from '../../components/Homepage/ResearchAndInsights'
import RecommendedSellers from '../../components/Homepage/RecommendedSellers'
import NewlyAddedProperties from '../../components/Homepage/NewlyAddedProperties'
import PropertyResearchTools from '../../components/Homepage/PropertyResearchTools'
import SellPropertyBanner from '../../components/Homepage/SellPropertyBanner'
import NewsAndArticles from '../../components/Homepage/NewsAndArticles'
import ManagedPageSections from '../../components/shared/ManagedPageSections'

function HomePage() {
  return (
    <>
     <PropertiesSection />
     <HousingTopPicks/>
     <ProminentProjects/>
     <TopHighlightedProjects/>
     <FeaturedDevelopers/>
     <TrustedDeveloperProjects/>
     <ResearchAndInsights/>
     <RecommendedSellers/>
     <NewlyAddedProperties/>
     <PropertyResearchTools/>
     <SellPropertyBanner/>
     <NewsAndArticles/>
     <ManagedPageSections page="homepage" />
    </>
  )
}

export default HomePage
