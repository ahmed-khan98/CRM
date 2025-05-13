"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import ProductHeader from "../CardChildComponent/ProductHeader"
import ProductImageSection from "../CardChildComponent/ProductImageSection"
import TimeCounter from "../CardChildComponent/TimeCounter"
import ProductInfo from "../CardChildComponent/ProductInfo"
import ProductBidding from "../CardChildComponent/ProductBidding"

const ProductCard = React.memo(({ item }) => {
  const [timeLeft, setTimeLeft] = useState({})
  const [auctionStatus, setAuctionStatus] = useState("upcoming") // 'upcoming', 'active', or 'ended'

  const timerRef = useRef(null)

  const calculateTimeLeft = useCallback(() => {
    const now = Date.now()
    const startTime = new Date(item?.biddingStartTime).getTime()
    const endTime = new Date(item?.biddingEndTime).getTime()

    // Check if auction is upcoming, active, or ended
    if (now < startTime) {
      // Auction hasn't started yet
      const diff = startTime - now
      setAuctionStatus("upcoming")

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          total: diff,
        })
      }
    } else if (now >= startTime && now < endTime) {
      // Auction is active
      const diff = endTime - now
      setAuctionStatus("active")

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          total: diff,
        })
      }
    } else {
      const diff = endTime - now
      console.log(diff,'diff')
      setAuctionStatus("ended")
      if (diff < 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          total: diff,
        })
      }
      clearInterval(timerRef.current)
    }
  }, [item?.biddingStartTime, item?.biddingEndTime])

  useEffect(() => {
    calculateTimeLeft()
    timerRef.current = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timerRef.current)
  }, [calculateTimeLeft])

  // Format time for display
  const formatTimeDisplay = () => {


    const { days, hours, minutes, seconds } = timeLeft
    if (auctionStatus === "ended") {
      if (days < 0) {
        return `${days}d ${hours}h ago`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ago`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s ago`
      } else {
        return `${seconds}s `
      }
      }
    // For upcoming auctions
    if (auctionStatus === "upcoming") {
      if (days > 0) {
        return `${days}d ${hours}h`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }
    }

    if (days > 0) {
      return `${days}d ${hours}h `
    } else if (hours > 0) {
      return `${hours}h ${minutes}m `
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s `
    } else {
      return `${seconds}s `
    }

  }

  return (
    <div className="relative bg-gray-200 border-1 border-gray-300 rounded-3xl my-3 shadow-lg flex flex-col">
      <ProductHeader name={item.name} id={item._id} />
      <ProductImageSection item={item} />
      <TimeCounter timeDisplay={formatTimeDisplay()} status={auctionStatus} price={item.price} />
      <ProductInfo
        quantity={item.quantity}
        retail={item?.retail ? item?.retail : 0}
        highestBid={item.highestBid}
        biddingCount={item?.biddingCount}
      />
      <div className="flex">
        <ProductBidding id={item._id} isSold={item.isSold} highestBid={item.highestBid} auctionStatus={auctionStatus} />
      </div>
    </div>
  )
})

export default ProductCard
