import { timeAgo } from "@/app/utilities/date";
import React, { useEffect, useState } from "react";

const TimeCounter = ({ index,price, isAuctionActive, remainingAuctionTime, highestBid, auctionStartTime, isSold, auctionEndTime, SoldDate }) => {

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
            setTimeLeftToEnd(`${hours} hours`)
          } else {
            setTimeLeftToEnd(`${minutes} min`)
          }
          setIsUrgent(false)
        }
      } else {
        setTimeLeftToStart("")
        setTimeLeftToEnd("Auction Ended")
        setIsUrgent(false)
      }
    }

    updateCountdown()
    interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [auctionStartTime, auctionEndTime])

  return (<div className=" text-center py-2 flex justify-center bg-gray-100">
    <div className="mx-2 w-[42%] bg-white rounded-xl py-1 ">

      <span className="text-[12px] text-gray-800 font-semibold uppercase">{isSold ? "Ended" : timeLeftToStart ? "Starts In" : "Time Left"}</span>
      <p
        className={`font-bold text-lg ${isUrgent ? "text-red-600 animate-pulse [animation-duration:0.6s]" : isSold ? "text-gray-500" : "text-blue-600"} truncate`}
      >
        {/* {isSold ? timeAgo(SoldDate) : `${remainingAuctionTime} hours`} */}
        {isSold ? timeAgo(SoldDate) : timeLeftToStart || timeLeftToEnd}
      </p>
      {/* {auctionStartTime &&  <p className="font-bold text-lg pt-0 text-[#F33E0A]">
          {timeLeftToStart || timeLeftToEnd}
        </p>} */}
    </div>
    <div className="mx-2 w-[42%] bg-white rounded-xl py-1 ">
      <span className="text-[12px] text-gray-800 font-semibold uppercase">Current Price</span>

      {/* <p className="text-sm text-gray-600 font-semibold">Current Price</p> */}
      <p className="font-bold text-lg text-gray-800">${highestBid}</p>
    </div>
  </div>)
};

export default React.memo(TimeCounter);
