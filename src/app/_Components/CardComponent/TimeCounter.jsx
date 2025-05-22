import React, { useEffect, useState } from "react";

const TimeCounter = ({ status, price, isAuctionActive, remainingAuctionTime }) => {
  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    let interval;

    if (isAuctionActive && remainingAuctionTime) {
      const endTime = new Date().getTime() + remainingAuctionTime * 60 * 60 * 1000;

      const updateCountdown = () => {
        const now = new Date().getTime();
        const diff = endTime - now;

        if (diff <= 0) {
          setDisplayTime("Auction Ended");
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setDisplayTime(`${hours} hours ${minutes}min`);
        }
      };

      updateCountdown(); // initialize once immediately
      interval = setInterval(updateCountdown, 1000);
    } else {
      if (remainingAuctionTime) {
        const hours = Math.floor(remainingAuctionTime);
        const minutes = Math.round((remainingAuctionTime % 1) * 60);
        setDisplayTime(`${hours} hours`);
      } else {
        setDisplayTime("Ended");
      }
    }

    return () => clearInterval(interval);
  }, [isAuctionActive, remainingAuctionTime]);

  return (<div className=" text-center py-2 flex justify-center bg-gray-100">
    <div className="mx-2 w-[42%] bg-white rounded-lg py-1 ">

      <span className="text-sm text-gray-700 font-semibold">{"Time Left"}</span>
      <p className={`font-bold text-lg text-[#F33E0A]}`}>{displayTime}</p>
    </div>
    <div className="mx-2 w-[42%] bg-white rounded-lg py-1 ">
      <span className="text-sm text-gray-700 font-semibold">Current Price</span>

      {/* <p className="text-sm text-gray-600 font-semibold">Current Price</p> */}
      <p className="font-extrabold text-lg text-gray-800">${price}</p>
    </div>
  </div>)
};

export default React.memo(TimeCounter);
