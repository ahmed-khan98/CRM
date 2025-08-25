
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
    <div className="w-full">
    {/* User Bid Display */}
    {userBid && (
      <div className="mb-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          {highestBid !== userBid && (
            <span className="px-2 py-1 rounded-full text-xs font-medium border text-gray-500 bg-[#ebbda5] border-[#f09868]">
              OUTBID
            </span>
          )}
          <div className="flex items-center gap-1 text-gray-700">
            <FaGavel size={12} className="text-[#F33E0A]" />
            <span className="text-xs text-gray-700">Your Bid</span>
          </div>
          <div className="text-sm font-medium">${userBid}</div>
        </div>
      </div>
    )}

    {/* Success/Error Messages */}
    <div className="relative mb-2">
      <AnimatePresence>
        {bidSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 p-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 text-xs"
          >
            <CheckCircle size={14} />
            <div className="flex-1">Bid placed successfully!</div>
            <div className="text-xs">{timeLeft}s</div>
          </motion.div>
        )}

        {bidError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-2 p-2 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 text-xs"
          >
            <AlertCircle size={14} />
            <div className="flex-1">{errorMessage}</div>
            <div className="text-xs">{timeLeft}s</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Bidding Controls */}
    <div className="flex rounded-lg overflow-hidden">
      {isSold ? (
        <button className="w-full text-white font-semibold bg-gradient-to-r from-emerald-500 to-green-700 py-2 px-4 flex items-center justify-center gap-2 text-sm">
          <CheckCircle size={16} />
          Sold
        </button>
      ) : (
        <>
          <div className="relative w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <DollarSign size={14} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={bidValue}
              onChange={(e) => handleBidChange(e.target.value)}
              className="w-full h-full px-6 py-2 bg-[#EBEBEB] text-center font-semibold text-sm outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
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
            className={`w-1/2 text-white py-2 px-2 flex items-center justify-center gap-1 transition-all duration-300 text-sm ${
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
                ? "bg-[#F33E0A] hover:bg-[#d63006]"
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
        </>
      )}
    </div>
  </div>
  )
}

export default React.memo(ProductRowBidding)
