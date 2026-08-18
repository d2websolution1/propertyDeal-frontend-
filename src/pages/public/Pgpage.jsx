import React from 'react'
import PGCoLivingHero from '../../components/pgpage/PGCoLivingHero'
import HomeAtFirstSight from '../../components/pgpage/HomeAtFirstSight'
import PGBenefitsSection from '../../components/pgpage/PGBenefitsSection'
import HandpickedCollections from '../../components/pgpage/HandpickedCollections'
import PopularCities from '../../components/pgpage/PopularCities'
import PropertiesInIndia from '../../components/pgpage/PropertiesInIndia'
import BuyPropertiesInStates from '../../components/pgpage/BuyPropertiesInStates'
import HomeLoansSection from '../../components/pgpage/HomeLoansSection'
import NewsAndArticles from '../../components/Homepage/NewsAndArticles'
import MembersTestimonial from '../../components/pgpage/MembersTestimonial'
import FeaturedIn from '../../components/pgpage/FeaturedIn'
import ManagedPageSections from '../../components/shared/ManagedPageSections'

function Pgpage() {
  return (
    <div>
      <PGCoLivingHero/>
      <HomeAtFirstSight/>
      <PGBenefitsSection/>
<HandpickedCollections />
<PopularCities/>
<PropertiesInIndia />
<BuyPropertiesInStates />
<HomeLoansSection/>
<MembersTestimonial />
<FeaturedIn />
<NewsAndArticles/>
<ManagedPageSections />
    </div>
  )
}

export default Pgpage
