import { timeAgo } from "@/app/utilities/date";
import { Clock, DollarSign } from "lucide-react";
import React, { useEffect, useState } from "react";

const TimeCounter = ({ handleRefetch, isLost, index, price, isAuctionActive, remainingAuctionTime, highestBid, auctionStartTime, isSold, auctionEndTime, SoldDate }) => {

  const [timeLeftToStart, setTimeLeftToStart] = useState("");
  const [timeLeftToEnd, setTimeLeftToEnd] = useState("");
  const [isUrgent, setIsUrgent] = useState(false)
  const [startTime] = useState(Date.now()) // Track when component mounted

  // useEffect(() => {
  //   let interval;

  //   const updateCountdown = () => {
  //     const now = new Date().getTime();
  //     const start = new Date(auctionStartTime).getTime();
  //     const end = new Date(auctionEndTime).getTime();

  //     if (now < start) {
  //       const diff = start - now;
  //       const hours = Math.floor(diff / (1000 * 60 * 60));
  //       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //       setTimeLeftToStart(`${hours}h ${minutes}m`);
  //       setTimeLeftToEnd("");
  //     }
  //     else if (now >= start && now < end) {
  //       const diff = end - now;
  //       const hours = Math.floor(diff / (1000 * 60 * 60));
  //       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //       setTimeLeftToStart("");
  //       setTimeLeftToEnd(`${hours}h ${minutes}m`);
  //     } else {
  //       setTimeLeftToStart("");
  //       setTimeLeftToEnd("Auction Ended");
  //     }
  //   };

  //   updateCountdown();
  //   interval = setInterval(updateCountdown, 1000);

  //   return () => clearInterval(interval);
  // }, [auctionStartTime, auctionEndTime]);


  useEffect(() => {
    let interval

    const updateCountdown = () => {
      const now = new Date().getTime()
      const start = new Date(auctionStartTime).getTime()
      const end = new Date(auctionEndTime).getTime()
      //const elapsedTime = Date.now() - startTime  //Time since component mounted
      //const now = end - (3+index)  * 60 * 1000 + elapsedTime  //Start 3 min before end, then count up

      // Auction has not started yet
      if (now < start) {

        const diff = start - now
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 0) {
          setTimeLeftToStart(`${hours} hrs`)
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
            setTimeLeftToEnd(`${hours} hours`)
          } else {
            setTimeLeftToEnd(`${minutes} min`)
          }
          setIsUrgent(false)
        }
      } else {
        console.log('chala handleRefetch')
        console.log("Auction ended, calling handleRefetch")
        if (handleRefetch && typeof handleRefetch === "function") {
          try {
            handleRefetch()
          } catch (error) {
            console.error("Error calling handleRefetch:", error)
          }
        }
        setTimeLeftToStart("")
        setTimeLeftToEnd("Auction Ended")
        setIsUrgent(false)
      }
    }

    updateCountdown()
    interval = setInterval(updateCountdown, 1000)

    return () => {
      // if (handleRefetch && typeof handleRefetch === "function") {
      //   handleRefetch()
      // }
      clearInterval(interval)
    }

  }, [auctionStartTime, auctionEndTime])

  return <div className="space-y-2 mx-10 my-2 shadow-sm">
    {/* Main Timer Display */}
    <div
      className={`rounded-lg p-2 min-w-0 ${isLost
        ? "bg-[#EF4444]" // 🔴 red when lost
        : "bg-white" // default gradient
        }`}
    >
      <div className="flex items-center justify-center space-x-4">
        {/* Time Left Section */}
        <div className="flex items-center space-x-2 min-w-0">

          <div className="min-w-0">
            <p
              className={`text-center text-sm font-medium uppercase tracking-wide ${isLost ? "text-white" : "text-gray-600"
                }`}
            >
              {isSold ? "Ended" : "Time Left"}
            </p>
            <p
              className={`text-center font-bold text-sm truncate ${isLost
                ? "text-white"
                : isUrgent
                  ? "text-red-600 animate-pulse [animation-duration:0.6s]"
                  : isSold
                    ? "text-gray-500"
                    : "text-blue-600"
                }`}
            >
              {isSold ? timeAgo(SoldDate) : timeLeftToStart || timeLeftToEnd}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`w-px h-10 flex-shrink-0 ${isLost ? "bg-white/60" : "bg-gray-300"
            }`}
        ></div>

        {/* Current Price Section */}
        <div className="flex items-center space-x-2 min-w-0">

          <div className="min-w-0">
            <p
              className={`text-sm font-medium uppercase tracking-wide ${isLost ? "text-white" : "text-gray-600"
                }`}
            >
              Current Price
            </p>
            <p
              className={`font-bold text-md text-center truncate ${isLost ? "text-white" : "text-green-600"
                }`}
            >
              ${highestBid}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

};

export default React.memo(TimeCounter);
