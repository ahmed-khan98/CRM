"use client"

import { useAddBidMutation } from "@/app/_Services/products/page"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { ArrowUp, Clock, TrendingUp, DollarSign, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const ProductBidding = ({ id, isSold, highestBid, isAuctionActive, userBid ,biddingCount,price}) => {
  const [addBid, { isLoading: isSubmitting }] = useAddBidMutation()
  const token = Cookies.get("token")
  const [bidValue, setBidValue] = useState(biddingCount ? highestBid + 1 : Math.floor(price)  + 1)
  const [showBidTips, setShowBidTips] = useState(false)
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
    const newValue = Math.max(0, Number(value))
    setBidValue(newValue)
  }

  const submitBid = async () => {
    if (bidValue <= highestBid) {
      setErrorMessage("Bid amount must be greater than the highest bid!")
      setBidError(true)
      return
    }

    try {
      const response = await addBid({ id, bidAmount: bidValue, bidType: isAuctionActive ? 'live' : 'pre' }).unwrap()
      setBidSuccess(true)
      setBidValue((prev) => prev + 1)
    } catch (error) {
      setErrorMessage(error.data?.message || "Failed to place bid")
      setBidError(true)
    }
  }



  if (!token) {
    return (
      <div className="w-full rounded-b-3xl overflow-hidden">
        <Link href="/login" className="w-full block">
          <button className="cursor-pointer w-full text-white bg-[#F33E0A] hover:bg-[#d63006] py-4 flex items-center justify-center gap-2 transition-all duration-300">
            {/* <DollarSign size={20} /> */}
            Login to Bid
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative">
        <AnimatePresence>
          {showBidTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 p-4 text-sm text-blue-800 rounded-t-xl absolute bottom-full left-0 right-0 z-10 shadow-md"
            >
              <h4 className="font-semibold mb-1 flex items-center gap-1">
                <TrendingUp size={16} /> Bidding Tips
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your bid must be higher than the current highest bid</li>
                <li>Once submitted, bids cannot be retracted</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {userBid &&
        <div className="px-4 py-2 bg-white">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1 text-gray-700">
              <Clock size={16} />
              <span className="text-sm font-medium">Your Bid</span>
            </div>
            <div className="text-xl font-bold text-gray-900">${userBid}</div>
          </div>

        
        </div>}
      <div className="relative">

        <AnimatePresence>
          {bidSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 absolute bottom-full left-0 right-0 z-10"
            >
              <CheckCircle size={18} />
              <div className="flex-1">Bid placed successfully!</div>
              <div className="text-xs">{timeLeft}s</div>
            </motion.div>
          )}

          {bidError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 absolute bottom-full left-0 right-0 z-10"
            >
              <AlertCircle size={18} />
              <div className="flex-1">{errorMessage}</div>
              <div className="text-xs">{timeLeft}s</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex rounded-b-3xl overflow-hidden">
        {isSold ? <div className="w-full rounded-b-3xl overflow-hidden">
          <button className="w-full text-white font-semibold bg-gradient-to-r from-emerald-500 to-green-700 py-4 flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            Sold
          </button>
        </div> :
          <>
            <div className="relative w-1/2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <DollarSign size={18} className="text-gray-500" />
              </div>
              <input
                type="number"
                value={bidValue}
                onChange={(e) => handleBidChange(e.target.value)}
                className="w-full h-full px-10 py-4 bg-[#EBEBEB] text-center font-semibold text-lg outline-none rounded-bl-3xl appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={biddingCount ? highestBid + 1 :Math.floor(price)  + 1}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={submitBid}
              disabled={
                biddingCount === 0
                  ? bidValue <= Math.floor(price) 
                  : bidValue <= highestBid || isSubmitting
              }
                            className={`cursor-pointer w-1/2 text-white py-4 flex items-center justify-center gap-2 rounded-br-3xl transition-all duration-300 ${bidValue > highestBid && !isSubmitting
                ? "bg-[#F33E0A] hover:bg-[#d63006]"
                : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Bidding...</span>
                </>
              ) : (
                <>
                  <ArrowUp size={20} />
                  <span>Place Bid</span>
                </>
              )}
            </motion.button>
            </>
        }
      </div>
    </div>
  )
}

export default React.memo(ProductBidding)
