import React from 'react'
import Brand from '../_Components/Home/Brand'
import AuctionCard from '../_Components/Home/AuctionCard'
import AuctionSection from '../_Components/Home/AuctionSectionExtra'
import CarCategories from '../_Components/Home/CarCategory'
import SortMenu from '../_Components/AuctionProduct/SortMenu'
const page = () => {
  return (
    <>
      <div className="mt-10"> 
        
         <AuctionCard /></div>
         <SortMenu />
      <AuctionSection />
      <CarCategories />
      <Brand />
    </>
  )
}

export default page