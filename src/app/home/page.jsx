import React from 'react'
import Brand from '../Components/Brand'
import AuctionCard from '../Components/AuctionCard'
import AuctionSection from '../Components/Home/AuctionSection'
import CarCategories from '../Components/Home/CarCategory'
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