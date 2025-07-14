"use client"

import React, { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Trophy, Clock } from "lucide-react"

const BiddingHistory = ({ history, isSold }) => {
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
    <div className="p-5">
      <div className="flex items-center gap-3 mb-2">
        {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Clock className="w-4 h-4 text-blue-600" />
        </div> */}
        <h3 className="text-xl font-bold text-gray-900">Bid History</h3>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {history?.length} bids
        </span>
      </div>

      <div className="space-y-2">
        {visibleBidsHistory?.map((bid, index) => (
          <div
            key={bid._id}
            className={`p-2 rounded-xl border transition-all duration-200 hover:shadow-md ${
              index === 0 && isSold
                ? "bg-green-50 border-green-200 ring-2 ring-green-100"
                : "bg-gray-50 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {index === 0 && isSold ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-green-600" />
                  </div>
                ):''}
                <div>
                  {/* <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 capitalize">{bid?.bidder?.username}</span>
                    {index === 0 && isSold && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Winner
                      </span>
                    )}
                    {index === 0 && !isSold && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        Leading
                      </span>
                    )}
                  </div> */}
                  <p className="text-sm text-gray-600">Bidder #{history?.length - index}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${bid?.bidAmount?.toLocaleString()}</p>
              </div>
                <p className="text-sm text-gray-500">{formatDate(bid.createdAt)}</p>
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
