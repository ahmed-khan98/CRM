"use client"

import { useAddBidMutation } from "@/app/_Services/products/page"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { ArrowUp, TrendingUp, DollarSign, Loader2, AlertCircle, CheckCircle, Frown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FaGavel } from 'react-icons/fa6'


const ProductBidding = ({ id, isSold, highestBid, isAuctionActive, userBid, biddingCount, price, automateBidder }) => {
  const [addBid, { isLoading: isSubmitting }] = useAddBidMutation()
  const token = Cookies.get("token")
  const userCookie = Cookies.get("currentuser");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const [bidValue, setBidValue] = useState(!biddingCount ? highestBid : automateBidder ? automateBidder?.bidder === user?._id ? automateBidder?.highestBid + 1 : highestBid + 1 : highestBid + 1)
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
    let cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > 1) {
      cleanedValue = cleanedValue.replace(/^0+/, '');
    }
    setBidValue(cleanedValue);
  };


  const submitBid = async () => {
    // if (bidValue <= highestBid) {
    //   setErrorMessage("Bid amount must be greater than the highest bid!")
    //   setBidError(true)
    //   return
    // }

    try {
      const response = await addBid({ id, bidAmount: Number(bidValue), bidType: isAuctionActive ? 'live' : 'pre' }).unwrap()
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

          <div className="flex justify-between items-center">{highestBid === userBid ? <span className='px-3 py-1 rounded-full text-xs font-medium border text-green-600 bg-green-200 border-green-600 '> {''}WINNIN  G</span>:
            <span className='px-3 py-1 rounded-full text-xs font-medium border text-gray-500 bg-[#ebbda5] border-[#f09868]'> {''}OUTBID</span>}
            <div className="flex items-center gap-1 text-gray-700">
              <FaGavel size={14} className="text-[#F33E0A]" />
              <span className="text-sm text-gray-700">Your Bid</span>
            </div>
            <div className="text-md font-medium">${userBid}</div>
          </div>

          {/* <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={16} className="text-[#F33E0A]" />
                      <span className="text-sm text-gray-700">Retail</span>
                    </div>
                    <span className="text-sm font-medium">${retail || 0}</span>
                  </div> */}


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
                type="text"
                value={bidValue}
                onChange={(e) => handleBidChange(e.target.value)}
                className="w-full h-full px-10 py-4 bg-[#EBEBEB] text-center font-semibold text-lg outline-none rounded-bl-3xl appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              // min={biddingCount ? highestBid + 1 :Math.floor(price)  + 1}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={submitBid}
              // disabled={
              //   biddingCount === 0
              //     ? bidValue <= Math.floor(price) 
              //     : bidValue <= highestBid || isSubmitting
              // }
              disabled={
                (!biddingCount ? bidValue < highestBid :
                  (automateBidder && automateBidder?.bidder === user?._id)
                    ? bidValue < (automateBidder?.highestBid || 0) + 1
                    : bidValue < (highestBid || 0) + 1
                ) || isSubmitting || timeLeft <= 0
              }

              className={`cursor-pointer w-1/2 text-white py-4 flex items-center justify-center gap-2 rounded-br-3xl transition-all duration-300 ${(!biddingCount ? Number(bidValue) >= Number(highestBid) :
                Number(bidValue) > Number(automateBidder ? automateBidder?.bidder === user?._id ? automateBidder?.highestBid :
                  highestBid : highestBid)) && timeLeft > 0 ? "bg-[#F33E0A] hover:bg-[#d63006]"
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
