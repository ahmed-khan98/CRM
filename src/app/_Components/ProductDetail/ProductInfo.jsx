"use client"

import { useAddBidMutation } from "@/app/_Services/products/page"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Rating } from "react-simple-star-rating"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Clock, DollarSign, Award, Tag, Gavel } from "lucide-react"

const ProductInfo = ({
  name,
  rating,
  tag,
  retail,
  condition,
  price,
  buyerPremium,
  shortDescription,
  remainingAuctionTime,
  isSold,
  id,
  highestBid,
  isAuctionActive,
}) => {
  const [showFull, setShowFull] = useState(false)
  const [timeLeft, setTimeLeft] = useState(remainingAuctionTime)
  const maxLength = 300
  const isLong = shortDescription?.length > maxLength
  const displayedText = showFull ? shortDescription : shortDescription?.slice(0, maxLength)
  const [addBid, { isLoading: isSubmitting }] = useAddBidMutation()
  const [bidValue, setBidValue] = useState(0)
  const router = useRouter()

  useEffect(() => {
    setBidValue(highestBid + 1)
  }, [highestBid])

  // Countdown timer effect
  useEffect(() => {
    if (!isSold && remainingAuctionTime > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 3600000) // Update every hour

      return () => clearInterval(timer)
    }
  }, [remainingAuctionTime, isSold])

  const handleBidChange = (value) => {
    setBidValue(Number(value))
  }

  const submitBid = async () => {
    if (bidValue <= highestBid) {
      toast.error("Bid amount must be greater than the highest bid!")
      return
    }
    try {
      const response = await addBid({
        id: id,
        bidAmount: bidValue,
        bidType: isAuctionActive ? "live" : "pre",
      }).unwrap()
      toast.success(response?.message)
      setBidValue(bidValue + 1)
    } catch (error) {
      toast.error(error.data?.message || "Failed to place bid")
    }
  }

  const token = Cookies.get("token")

  const formatTimeLeft = (hours) => {
    if (hours <= 0) return "Auction Ended"
    if (hours < 24) return `${hours} hours`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours} hours `
  }

  return (
    <div className="p-4 space-y-3">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{name}</h1>

        {/* Rating and Quality */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Rating size={20} SVGstyle={{ display: "inline-block" }} initialValue={rating ?? 0} readonly />
            <span className="text-sm text-gray-600">({rating}/5)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <Award className="w-4 h-4" />
            Quality
          </div>
        </div>

        {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
              <span
              
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                <Tag className="w-3 h-3" />
                {condition}
              </span>
            {tag.map((tagItem, index) => tag?.length > 0 && (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                <Tag className="w-3 h-3" />
                {tagItem}
              </span>
            )
        )}
          </div>
      </div>

      {/* Description */}
      <div className="bg-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {displayedText}
          {isLong && !showFull && "..."}
        </p>
        {isLong && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-blue-600 hover:text-blue-700 font-medium mt-1 transition-colors cursor-pointer"
          >
            {showFull ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Pricing Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="bg-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <span className="text-md font-medium text-gray-600">Estimated Retail</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${retail}</p>
        </div>

        <div className="bg-gray-200 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-md font-medium text-blue-600">Current Price</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">${price}</p>
        </div>

        <div className="bg-gray-200 rounded-xl p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Buyer's Premium</span>
            <span className="font-bold text-gray-900">
              {`${buyerPremium}${buyerPremium?.includes("%") ? "" : "%"}`}
            </span>
          </div>
        </div>
      </div>


      <div
        className={`flex items-center justify-between p-2 rounded-xl ${
          isSold
            ? "bg-green-50 border border-green-200"
            : timeLeft <= 24
              ? "bg-red-50 border border-red-200"
              : "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <Clock
            className={`w-5 h-5 ${isSold ? "text-green-600" : timeLeft <= 24 ? "text-red-600" : "text-blue-600"}`}
          />
          {/* <div> */}
            <p className="text-sm font-medium text-gray-600">{isSold ? 'Auction Status' :'Time Left'}</p>
            <p className={`font-bold ${isSold ? "text-green-700" : timeLeft <= 24 ? "text-red-700" : "text-blue-700"}`}>
              {isSold ? "SOLD" : formatTimeLeft(timeLeft)}
            </p>
          {/* </div> */}
        </div>
        {isAuctionActive && !isSold && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            LIVE
          </div>
        )}
      </div>

      {/* Bidding Section */}
      <div className="border-t border-gray-300 pt-1">
        {isSold ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-2 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-green-700 mb-1">Item Sold!</h3>
            <p className="text-green-600">This auction has ended successfully.</p>
          </div>
        ) : token ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Next Minimum Bid</span>
              <span className="font-bold text-gray-900">${highestBid + 1}</span>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  min={highestBid + 1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-semibold text-center"
                  onChange={(e) => handleBidChange(e.target.value)}
                  value={bidValue}
                  placeholder={`Min $${highestBid + 1}`}
                />
              </div>
              <button
                disabled={bidValue <= highestBid || isSubmitting || timeLeft <= 0}
                onClick={submitBid}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 cursor-pointer ${
                  Number(bidValue) > Number(highestBid) && timeLeft > 0
                    ? "bg-[#FB3B11] hover:bg-[#e03610] hover:scale-105 shadow-lg"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4" />
                    Place Bid
                  </div>
                )}
              </button>
            </div>

            {bidValue <= highestBid && <p className="text-sm text-red-600">Bid must be higher than ${highestBid}</p>}
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="w-full cursor-pointer bg-[#FB3B11] hover:bg-[#e03610] hover:scale-102 shadow-lg text-white font-semibold py-4 rounded-xl transition-all duration-200 "
          >
            Login to Start Bidding
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
