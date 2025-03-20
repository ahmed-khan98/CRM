import React from 'react'
import Brand from '../_Components/Home/Brand'
import AuctionCard from '../_Components/Home/AuctionCard'
import AuctionSection from '../_Components/Home/AuctionSection'
import CarCategories from '../_Components/Home/CarCategory'
const page = () => {
  return (
    <>
      <div className="mt-10">  <AuctionCard /></div>
      <AuctionSection />
      <CarCategories />
      <Brand />
    </>
  )
}

export default page