import React from "react";

const TimeCounter = ({ timeDisplay, status, price }) => {
    console.log(timeDisplay, status, price,'timeDisplay, status, price')
  return (<div className=" text-center py-2 flex justify-center">
      <div className="mx-2 w-[42%] bg-white rounded-lg py-1 ">
      <span className="text-sm text-gray-700 font-semibold">{status === "upcoming" ? "Coming Soon" :  status === "ended" ?'Ended' :"Time Left"}</span>
        <p  className={`font-bold text-lg  ${
            status === "ended" ? "text-red-500" : status === "upcoming" ? "text-blue-600" : "text-[#F33E0A]"
          }`}>{timeDisplay}</p>

      </div>
      <div className="mx-2 w-[42%] bg-white rounded-lg py-1 ">
      <span className="text-sm text-gray-700 font-semibold">Current Price</span>

        {/* <p className="text-sm text-gray-600 font-semibold">Current Price</p> */}
        <p className="font-extrabold text-lg text-gray-800">${price}</p>
      </div>
    </div>)
};
  
  export default React.memo(TimeCounter);
  