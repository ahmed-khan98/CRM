import React from 'react'
// import SubHeading from '../_Components/Home/SubHeading'
import SortMenu from '../_Components/AuctionProduct/SortMenu'
import AuctionClosingSection from '../_Components/Home/AuctionClosingSection'
import { FaGavel } from 'react-icons/fa'

const page = () => {
  return (
    <>
      {/* <SortMenu/> */}
      <SortMenu/>

      {/* <div className="pt-24 md:pt-20">
        <h2 className='text-center font-bold text-2xl text-[#F33E0A]'>LOT PRODUCTS AUCTION</h2>
        <div className="flex items-center justify-center gap-2 w-full my-3">

          <div className="w-1/9 h-[1px] bg-gray-300"></div>
          <h2 className="text-lg font-bold text-black flex items-center gap-1">
            <FaGavel className="text-[#F33E0A]" />
          </h2>
          <div className="w-1/9 h-[1px] bg-gray-300"></div>
        </div>
      </div> */}
      <AuctionClosingSection />

    </>
  )
}

export default page