"use client"
import { timeAgo } from "@/app/utilities/date"
import React, { useEffect, useState } from "react"
import { Clock, DollarSign, TrendingUp } from "lucide-react"

const TimeCounterRow = ({
  index,
  price,
  isAuctionActive,
  remainingAuctionTime,
  highestBid,
  auctionStartTime,
  isSold,
  auctionEndTime,
  SoldDate,
  handleRefetch
}) => {
  const [timeLeftToStart, setTimeLeftToStart] = useState("")
  const [timeLeftToEnd, setTimeLeftToEnd] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [startTime] = useState(Date.now()) // Track when component mounted
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    let interval

    const updateCountdown = () => {
      // FOR TESTING: Simulate time passing from 3 minutes before auction end
      const end = new Date(auctionEndTime).getTime()
      //const elapsedTime = Date.now() - startTime  //Time since component mounted
      //const now = end - (3+index-9)  * 60 * 1000 + elapsedTime  //Start 3 min before end, then count up
      const now = new Date().getTime() // Use this for production

      const start = new Date(auctionStartTime).getTime()

      // Auction has not started yet
      if (now < start) {
        const diff = start - now
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 0) {
          setTimeLeftToStart(`${hours} hours`)
        } else {
          setTimeLeftToStart(`${minutes} min`)
        }
        setTimeLeftToEnd("")
        setIsUrgent(false)
      }
      // Auction is active
      else if (now >= start && now < end) {
        const diff = end - now
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeftToStart("")

        // If 5 minutes or less, show minutes and seconds
        if (diff <= 5 * 60 * 1000) {
          if (minutes) {
            setTimeLeftToEnd(`${minutes}m ${seconds}s`)
          }
          else {
            setTimeLeftToEnd(`${seconds}s`)
          }
          setIsUrgent(true)
        }
        // If more than 5 minutes, show appropriate format
        else {
          if (hours > 0) {
            setTimeLeftToEnd(`${hours} hr`)
          } else {
            setTimeLeftToEnd(`${minutes} min`)
          }
          setIsUrgent(false)
        }
      } else {
        if (handleRefetch && typeof handleRefetch === "function") {
          handleRefetch()
        }
        setTimeLeftToStart("")
        setTimeLeftToEnd("Auction Ended")
        setIsUrgent(false)
      }
    }

    updateCountdown()
    interval = setInterval(updateCountdown, 1000)

    return () => {
      if (handleRefetch && typeof handleRefetch === "function") {
        handleRefetch()
      }
      clearInterval(interval)
    }
  }, [auctionStartTime, auctionEndTime, startTime])

  return (
    <div className="space-y-2">
      {/* Main Timer Display */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 min-w-0">
        <div className="flex items-center justify-between space-x-4">
          {/* Time Left Section */}
          <div className="flex items-center space-x-2 min-w-0">
            <Clock size={16} className={`${isUrgent ? "text-red-500" : "text-blue-500"} flex-shrink-0`} />
            <div className="min-w-0">
              <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                {isSold ? "Ended" : "Time Left"}
              </p>
              <p
                className={`font-bold text-sm ${isUrgent ? "text-red-600 animate-pulse [animation-duration:0.6s]" : isSold ? "text-gray-500" : "text-blue-600"} truncate`}
              >
                {isSold ? timeAgo(SoldDate) : timeLeftToStart || timeLeftToEnd}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 flex-shrink-0"></div>

          {/* Current Price Section */}
          <div className="flex items-center space-x-2 min-w-0">
            <DollarSign size={16} className="text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Current Price</p>
              <p className="font-bold text-sm text-green-600 truncate">${highestBid}</p>
            </div>
          </div>


        </div>
      </div>


    </div>
  )
}

export default React.memo(TimeCounterRow)
