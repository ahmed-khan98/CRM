import React from 'react'
import SubHeading from '../_Components/Home/SubHeading'
import AuctionCard from '../_Components/Home/AuctionCard'
import SortMenu from '../_Components/AuctionProduct/SortMenu'

const page = () => {
  return (
  <>
        <SortMenu/>
        <SubHeading heading={"Latest Auctions"} />
      <AuctionCard />
  
  </>
  )
}

export default page