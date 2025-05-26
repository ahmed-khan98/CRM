"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import ProductHeader from "../CardComponent/ProductHeader"
import ProductImageSection from "../CardComponent/ProductImageSection"
import TimeCounter from "../CardComponent/TimeCounter"
import ProductInfo from "../CardComponent/ProductInfo"
import ProductBidding from "../CardComponent/ProductBidding"

const ProductCard = React.memo(({ item }) => {

  return (
    <div className="relative bg-gray-100 border-1 border-gray-400 rounded-3xl my-4 shadow-lg flex flex-col">
      <ProductHeader name={item.name} id={item._id} />
      <ProductImageSection item={item} />
      <TimeCounter 
      price={item.price} 
      isAuctionActive={item?.isAuctionActive} 
      remainingAuctionTime={item?.remainingAuctionTime} 
      auctionStartTime={item?.auctionStartTime} 
      isSold={item.isSold}
      SoldDate={item.SoldDate}
      auctionEndTime={item?.auctionEndTime} />
      <ProductInfo
        quantity={item.quantity}
        retail={item?.retail ? item?.retail : 0}
        highestBid={item.highestBid}
        biddingCount={item?.biddingCount}
      />
      <div className="flex">
        <ProductBidding id={item._id} isSold={item.isSold} highestBid={item.highestBid} isAuctionActive={item?.isAuctionActive} />
      </div>
    </div>
  )
})

export default ProductCard
