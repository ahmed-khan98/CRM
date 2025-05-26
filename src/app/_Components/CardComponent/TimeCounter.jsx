import React, { useEffect, useState } from "react";

const TimeCounter = ({ price, isAuctionActive, remainingAuctionTime,auctionStartTime,isSold,auctionEndTime}) => {

  const [timeLeftToStart, setTimeLeftToStart] = useState("");
  const [timeLeftToEnd, setTimeLeftToEnd] = useState("");

  useEffect(() => {
    let interval;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(auctionStartTime).getTime();
      const end = new Date(auctionEndTime).getTime();

      // Auction has not started yet
      if (now < start) {
        const diff = start - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftToStart(`${hours}h ${minutes}m`);
        setTimeLeftToEnd(""); // clear after start
      }
      // Auction is active
      else if (now >= start && now < end) {
        const diff = end - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftToStart(""); // hide start countdown
        setTimeLeftToEnd(`${hours}h ${minutes}m`);
      } else {
        setTimeLeftToStart(""); // Auction passed
        setTimeLeftToEnd("Auction Ended");
      }
    };

    updateCountdown(); // initial run
    interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [auctionStartTime, auctionEndTime]);

  return (<div className=" text-center py-3 flex justify-center bg-gray-100">
    <div className="mx-2 w-[42%] bg-white rounded-xl py-1 shadow ">

      <span className="text-[12px] text-gray-800 font-semibold uppercase">{isSold ? 'Ended':"Time Left"}</span>
      <p className={`font-bold text-lg pt-0 text-[#F33E0A]}`}>{`${remainingAuctionTime} hours`}</p>
      {/* {auctionStartTime &&  <p className="font-bold text-lg pt-0 text-[#F33E0A]">
          {timeLeftToStart || timeLeftToEnd}
        </p>} */}
    </div>
    <div className="mx-2 w-[42%] bg-white rounded-xl py-1 shadow">
      <span className="text-[12px] text-gray-800 font-semibold uppercase">Current Price</span>

      {/* <p className="text-sm text-gray-600 font-semibold">Current Price</p> */}
      <p className="font-bold text-lg text-gray-800">${price}</p>
    </div>
  </div>)
};

export default React.memo(TimeCounter);
