



'use client'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ProductHeader from '../CardComponent/productHeader';
import ProductImageSection from '../CardComponent/productImageSection';
import TimeCounter from '../CardComponent/timeCounter';
import ProductInfo from '../CardComponent/productInfo';

const MissedCard = ({ item, status }) => {

  const [daysSinceEnded, setDaysSinceEnded] = useState(null);
  useEffect(() => {
    if (item?.biddingEndTime) {
      const now = new Date();
      const endTime = new Date(item.biddingEndTime);

      const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const endUTC = Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());

      const diffInMs = nowUTC - endUTC;
      const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      setDaysSinceEnded(daysPassed);
    }
  }, [item?.biddingEndTime]);

  return (
    <div className="relative bg-gradient-to-b from-orange-50 to-white border-1 border-gray-300 rounded-3xl my-4 shadow-lg flex flex-col">
      <ProductHeader name={item?.name} id={item?._id} />
      <ProductImageSection item={item} />
      <TimeCounter timeLeft={daysSinceEnded} type='days' title='Ended' price={item?.price} />
      <ProductInfo quantity={item?.quantity}
        retail={item?.retail ? item?.retail : 0}
        highestBid={item?.highestBid}
        title='Winning Bid:'
        biddingCount={item?.biddingCount}
      />


      <div className="flex flex-row">
        <button className=" rounded-bl-3xl rounded-br-3xl w-full font-bold  text-white bg-gradient-to-r from-red-400 to-red-500 py-3 flex items-center justify-center ">
          <span>Missed</span>
        </button>
      </div>
    </div>
  );
}

export default MissedCard;



