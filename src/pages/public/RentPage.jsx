import React from 'react'
import RentHero from '../../components/Rentpage/RentHero'
import NewlyAddedProperties from '../../components/Homepage/NewlyAddedProperties'
import ResearchAndInsights from '../../components/Homepage/ResearchAndInsights'
import RecommendedSellers from '../../components/Homepage/RecommendedSellers'
import SellPropertyBanner from '../../components/Homepage/SellPropertyBanner'
import NewsAndArticles from '../../components/Homepage/NewsAndArticles'
import ManagedPageSections from '../../components/shared/ManagedPageSections'

function RentPage() {
  return (
    <div>
      <RentHero />
      <NewlyAddedProperties sectionKey="rent_newly_added_properties" />
      <ResearchAndInsights />
      <RecommendedSellers sectionKey="rent_recommended_sellers" />
      <SellPropertyBanner />
      <NewsAndArticles sectionKey="rent_news_articles" />
      <ManagedPageSections page="rent" />
    </div>
  )
}

export default RentPage