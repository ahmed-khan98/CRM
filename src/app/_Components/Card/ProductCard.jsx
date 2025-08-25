"use client"

import React, { useEffect, useState } from "react"
import ProductHeader from "../CardComponent/ProductHeader"
import ProductImageSection from "../CardComponent/ProductImageSection"
import TimeCounter from "../CardComponent/TimeCounter"
import ProductInfo from "../CardComponent/ProductInfo"
import ProductBidding from "../CardComponent/ProductBidding"
import { useProductSocket } from "@/app/hooks/useSocket"

const ProductCard = React.memo(({index ,item ,wishlisted,refetch}) => {

    const { socket, isConnected, error } = useProductSocket(item?._id)
    const [realTimeData, setRealTimeData] = useState(null)

    const data = realTimeData || item

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for real-time updates

      socket.emit(`product-auction-start-${item?._id}`)
      socket.emit(`product-auction-end-${item?._id}`)
      socket.emit(`product-bid-${item?._id}`)
      socket.emit(`product-sold-${item?._id}`)

      socket.on(`product-auction-start-${item?._id}`, (updatedProduct) => {
        console.log(updatedProduct, 'product-start-end')

        setRealTimeData((prev) => ({
          ...prev,
          data: updatedProduct,
        }))
      })
      socket.on(`product-auction-end-${item?._id}`, (updatedProduct) => {
        console.log(updatedProduct, 'product-auction-end')
        setRealTimeData((prev) => ({
          ...prev,
          data: updatedProduct,
        }))
      })
      socket.on(`product-bid-${item?._id}`, (updatedProduct) => {
        console.log(updatedProduct, 'product-bid')

        setRealTimeData((prev) => ({
          ...prev,
          data: updatedProduct,
        }))
      })
      socket.on(`product-sold-${item?._id}`, (updatedProduct) => {
        console.log(updatedProduct, 'product-sold')
        setRealTimeData((prev) => ({
          ...prev,
          data: updatedProduct,
        }))
      })

      return () => {
        socket.off(`product_${item?._id}_updated`)
        socket.off(`product_${item?._id}_bid_placed`)
        socket.off(`product_${item?._id}_auction_status`)
        socket.off(`product_${item?._id}_watch_updated`)
      }
    }
  }, [socket, item?._id])



  return (
    <div className="relative bg-gray-100 border-2 border-gray-300 rounded-3xl my-2 shadow-lg flex flex-col hover:border-[#F33E0A] ">
      <ProductHeader name={data.name} id={data._id} />
      <ProductImageSection item={data}  wishlisted={wishlisted}/>
      <TimeCounter 
      refetch={refetch}
      index={index}
      price={data?.price} 
      isAuctionActive={data?.isAuctionActive} 
      remainingAuctionTime={data?.remainingAuctionTime} 
      auctionStartTime={data?.auctionStartTime} 
      isSold={data?.isSold}
      highestBid={data?.highestBid}
      SoldDate={data?.SoldDate}
      auctionEndTime={data?.auctionEndTime} />
      <ProductInfo
        quantity={data?.quantity}
        retail={data?.retail ? data?.retail : 0}
        highestBid={data?.highestBid}
        price={data?.price}
        biddingCount={data?.biddingCount}
      />
      <div className="flex">
        <ProductBidding id={data?._id} isSold={data?.isSold} price={data?.price}  biddingCount={data?.biddingCount} highestBid={data?.highestBid} isAuctionActive={data?.isAuctionActive} automateBidder={data?.automateBidder}/>
      </div>
    </div>
  )
})

export default ProductCard
