
import { useAddBidMutation } from "@/app/_Services/products/page"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { ArrowUp, DollarSign, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FaGavel } from "react-icons/fa6"

const ProductRowBidding = ({
  id,
  isSold,
  highestBid,
  isAuctionActive,
  userBid,
  biddingCount,
  automateBidder,
}) => {
  const [addBid, { isLoading: isSubmitting }] = useAddBidMutation()
  const token = Cookies.get("token")
  const userCookie = Cookies.get("currentuser")
  const user = userCookie ? JSON.parse(userCookie) : null
  const [bidValue, setBidValue] = useState(
    !biddingCount
      ? highestBid
      : automateBidder
        ? automateBidder?.bidder === user?._id
          ? automateBidder?.highestBid + 1
          : highestBid + 1
        : highestBid + 1,
  )
  const [bidSuccess, setBidSuccess] = useState(false)
  const [bidError, setBidError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [timeLeft, setTimeLeft] = useState(3)

  // Reset success/error states after a delay
  useEffect(() => {
    let timer
    if (bidSuccess || bidError) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setBidSuccess(false)
            setBidError(false)
            setTimeLeft(3)
            return 3
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [bidSuccess, bidError])

  const handleBidChange = (value) => {
    let cleanedValue = value.replace(/\D/g, "")
    if (cleanedValue.length > 1) {
      cleanedValue = cleanedValue.replace(/^0+/, "")
    }
    setBidValue(cleanedValue)
  }

  const submitBid = async () => {
    try {
      const response = await addBid({
        id,
        bidAmount: Number(bidValue),
        bidType: isAuctionActive ? "live" : "pre",
      }).unwrap()
      setBidSuccess(true)
      setBidValue((prev) => prev + 1)
    } catch (error) {
      setErrorMessage(error.data?.message || "Failed to place bid")
      setBidError(true)
    }
  }

  if (!token) {
    return (
      <div className="flex items-center">
        <Link href="/login">
          <button className="px-4 py-2 text-white bg-[#F33E0A] hover:bg-[#d63006] rounded-lg transition-all duration-300 text-sm font-semibold">
            Login to Bid
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 relative">
      {/* User's Current Bid Display */}
      {userBid && (
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border">
          <FaGavel size={12} className="text-[#F33E0A]" />
          <span className="text-xs text-gray-600">Your Bid:</span>
          <span className="text-sm font-semibold">${userBid}</span>
          {highestBid !== userBid && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600 border border-orange-200">
              OUTBID
            </span>
          )}
        </div>
      )}

      {/* Success/Error Messages */}
      <AnimatePresence>
        {bidSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute -top-12 left-0 right-0 z-20 p-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 text-sm"
          >
            <CheckCircle size={16} />
            <span>Bid placed successfully!</span>
            <span className="text-xs">({timeLeft}s)</span>
          </motion.div>
        )}

        {bidError && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute -top-12 left-0 right-0 z-20 p-2 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 text-sm"
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
            <span className="text-xs">({timeLeft}s)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bidding Controls */}
      {isSold ? (
        <div className="flex items-center">
          <button className="px-4 py-2 text-white font-semibold bg-gradient-to-r from-emerald-500 to-green-700 rounded-lg flex items-center gap-2 cursor-not-allowed">
            <CheckCircle size={16} />
            Sold
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Bid Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <DollarSign size={14} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={bidValue}
              onChange={(e) => handleBidChange(e.target.value)}
              className="w-24 px-8 py-2 bg-gray-100 text-center font-semibold text-sm outline-none rounded-lg border border-gray-200 focus:border-[#F33E0A] focus:ring-1 focus:ring-[#F33E0A] transition-all"
              placeholder="0"
            />
          </div>

          {/* Place Bid Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={submitBid}
            disabled={
              (!biddingCount
                ? bidValue < highestBid
                : automateBidder && automateBidder?.bidder === user?._id
                  ? bidValue < (automateBidder?.highestBid || 0) + 1
                  : bidValue < (highestBid || 0) + 1) ||
              isSubmitting ||
              timeLeft <= 0
            }
            className={`cursor-pointer px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all duration-300 text-sm font-semibold ${
              (
                !biddingCount
                  ? Number(bidValue) >= Number(highestBid)
                  : Number(bidValue) >
                    Number(
                      automateBidder
                        ? automateBidder?.bidder === user?._id
                          ? automateBidder?.highestBid
                          : highestBid
                        : highestBid,
                    )
              ) && timeLeft > 0
                ? "bg-[#F33E0A] hover:bg-[#d63006] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Bidding...</span>
              </>
            ) : (
              <>
                <ArrowUp size={14} />
                <span>Place Bid</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default React.memo(ProductRowBidding)
