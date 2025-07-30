"use client"

import React, { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Trophy, Clock, Zap, AlarmClock } from "lucide-react"
import { MdCelebration } from "react-icons/md";
import Cookies from "js-cookie";

const BiddingHistory = ({ history, isSold, isExtended }) => {

  const user = Cookies.get("currentuser")
    ? JSON.parse(Cookies.get("currentuser"))
    : null;
  console.log(user, 'user')

  const [visibleBidsHistory, setVisibleBidsHistory] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setVisibleBidsHistory(history?.slice(0, 3))
  }, [history])

  const toggleBidHistory = () => {
    if (showAll) {
      setVisibleBidsHistory(history?.slice(0, 3))
    } else {
      setVisibleBidsHistory(history)
    }
    setShowAll(!showAll)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex gap-2"> <h3 className="text-md font-bold text-gray-900">Bid History</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            {history?.length} bids
          </span></div>
        {isExtended &&
          <div className="flex items-center gap-1">
            <AlarmClock className="w-5 h-5 text-grey-500" />
            <span className="px-1 py-1 text-gray-600 rounded-full text-sm">
              TIME EXTENDED
            </span>
          </div>}
      </div>

      <div className="space-y-2 w-[100%]">
        {visibleBidsHistory?.map((bid, index) => (
          <div
            key={bid._id}
            className={`px-4 py-1 rounded-xl border transition-all duration-200 hover:shadow ${index === 0 || isSold
              ? "bg-green-100 border-green-200 ring-2 ring-green-100"
              : user?._id === bid?.bidder?._id
                ? "bg-[#f9f6f3] border-[#fae5c8] ring-2 ring-[#fcf3e7]"
                : "bg-gray-50 border-gray-200 hover:bg-gray-50"
              }`}
          >
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center gap-4"> */}
              {/* {index === 0 && isSold ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-green-600" />
                  </div>
                ) : ''} */}

              <p className={`text-md w-[25%] ${user?._id === bid?.bidder?._id ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                {user?._id === bid?.bidder?._id ? (
                  <>
                    You
                    {/* <Zap className="inline w-4 h-4 text-gray-400 ml-1" /> */}
                  </>
                ) : (
                  `Bidder #${history?.length - index}`
                )}
              </p>

              <p className="text-md text-center font-semibold text-gray-700 w-[25%]">${bid?.bidAmount?.toLocaleString()}</p>
              <p className="text-sm text-gray-500 w-30%] text-center ">{formatDate(bid.createdAt)}</p>
              {index === 0 ?
                <div className="w-[20%] flex items-center justify-end">
                  {/* <div className="h-8 bg-green-100 rounded-full flex items-center justify-center w-8"> */}
                    <MdCelebration className="w-5 h-5 text-green-600" />
                  {/* </div> */}
                </div>
                :
                <div className="w-[20%] flex items-center justify-end">
                  {/* <div className="h-8 bg-[#FED7AA] rounded-full flex items-center justify-center w-8"> */}
                    <Zap className="w-4 h-4  text-[#EA580C]" />
                  {/* </div> */}
                </div>}
            </div>
          </div>
        ))}
      </div>

      {history?.length > 3 && (
        <button
          onClick={toggleBidHistory}
          className="w-full mt-2 cursor-pointer flex items-center justify-center gap-2 py-1 text-orange-600 hover:text-orange-700 font-medium transition-colors group"
        >
          <span>{showAll ? "Show Less" : `View ${history?.length - 3} More Bids`}</span>
          {showAll ? (
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          )}
        </button>
      )}
    </div>
  )
}

export default React.memo(BiddingHistory)
