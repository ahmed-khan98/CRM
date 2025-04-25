import React from "react";

const TimeCounter = ({ timeLeft,type, title,price }) => (
    <div className="mx-auto text-center py-3 flex justify-center">
      <div className="mx-2 w-[42%] bg-white rounded-xl py-1 shadow">
        <p className="text-sm">{title}</p>
        <p className="font-semibold text-lg">{timeLeft ?? 0} {type}</p>
      </div>
      <div className="mx-2 w-[42%] bg-white rounded-xl py-1 shadow">
        <p className="text-sm">Current Price</p>
        <p className="font-semibold text-lg">${price}</p>
      </div>
    </div>
  );
  
  export default React.memo(TimeCounter);
  