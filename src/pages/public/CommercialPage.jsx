import React from 'react'
import CommercialHero from '../../components/commercialPage/CommercialHero'
import RecentlyAddedForSale from '../../components/commercialPage/RecentlyAddedForSale'
import RecentlyAddedForRent from '../../components/commercialPage/RecentlyAddedForRent'
import HousingExperts from '../../components/commercialPage/HousingExperts'
import CommercialNewsAndArticles from '../../components/commercialPage/CommercialNewsAndArticles'
import GreatnessBanner from '../../components/commercialPage/GreatnessBanner'
import ManagedPageSections from '../../components/shared/ManagedPageSections'

function CommercialPage() {
  return (
    <div>
    
      <CommercialHero/>
      <RecentlyAddedForSale/>
      <RecentlyAddedForRent/>
      <HousingExperts/>
      <CommercialNewsAndArticles/>
      <GreatnessBanner/>
      <ManagedPageSections page="commercial" />
    </div>
  )
}

export default CommercialPage
