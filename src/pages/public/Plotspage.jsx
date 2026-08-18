import React from 'react'
import PlotsHero from '../../components/plotspage/PlotsHero'
import LatestProjects from '../../components/plotspage/LatestProjects'
import PropertiesInIndia from '../../components/pgpage/PropertiesInIndia'
import BuyPropertiesInStates from '../../components/pgpage/BuyPropertiesInStates'
import HomeLoansSection from '../../components/pgpage/HomeLoansSection'
import NewsAndArticles from '../../components/Homepage/NewsAndArticles'
import GreatnessBanner from '../../components/commercialPage/GreatnessBanner'
import ManagedPageSections from '../../components/shared/ManagedPageSections'

function Plotspage() {
  return (
    <div>
      <PlotsHero/>
      <LatestProjects/>
      <PropertiesInIndia/>
      <BuyPropertiesInStates />
      <HomeLoansSection/>
      <NewsAndArticles/>
      <GreatnessBanner/>
      <ManagedPageSections page="plots" />
    </div>
  )
}

export default Plotspage
