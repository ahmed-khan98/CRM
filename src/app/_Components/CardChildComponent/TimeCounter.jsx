import React from "react";

const TimeCounter = ({ timeDisplay, status, price }) => (
    <div className=" text-center py-3 flex justify-center">
      <div className="mx-2 w-[42%] bg-white rounded-lg py-2 shadow">
      <span className="text-sm text-gray-700">{status === "upcoming" ? "Coming Soon" : "Time Left"}</span>
        <p  className={`font-bold text-lg  ${
            status === "ended" ? "text-red-500" : status === "upcoming" ? "text-blue-600" : "text-[#F33E0A]"
          }`}>{timeDisplay}</p>

      </div>
      <div className="mx-2 w-[42%] bg-white rounded-lg py-2 shadow">
        <p className="text-sm text-gray-700">Current Price</p>
        <p className="font-semibold text-lg text-gray-700">${price}</p>
      </div>
    </div>
  );
  
  export default React.memo(TimeCounter);
  