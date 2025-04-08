import React from 'react'
import SubHeading from '../_Components/Home/SubHeading'
import AuctionCard from '../_Components/Home/AuctionCard'
import SortMenu from '../_Components/AuctionProduct/SortMenu'

const page = () => {
  return (
  <>
        <SortMenu/>
        {/* <div className=' md:pt-14'>
        <SubHeading heading={"Latest Auctions"} />
        </div> */}
      <AuctionCard />
  
  </>
  )
}

export default page