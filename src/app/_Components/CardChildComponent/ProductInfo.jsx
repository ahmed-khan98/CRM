import React from "react";

const ProductInfo = ({ quantity, retail, highestBid,biddingCount,title }) => (
    <>
      <div className="text-sm px-6 py-3 bg-white rounded-tl-2xl rounded-tr-2xl shadow-xl">
        <div className="flex justify-between"><p><strong>Qty:</strong></p><p>{quantity}</p></div>
        <div className="flex justify-between"><p><strong>Est Retail:</strong></p><p className="text-gray-600">${retail}</p></div>
        <div className="flex justify-between"><p><strong>#Bids:</strong></p><p>{biddingCount}</p></div>
      </div>
      <div className="text-center text-sm py-3 border-t-2 border-gray-200 bg-white">
        {title ? title: 'Current Bid:'}  <strong>${highestBid}</strong>
      </div>
    </>
  );
  
  export default React.memo(ProductInfo);
  