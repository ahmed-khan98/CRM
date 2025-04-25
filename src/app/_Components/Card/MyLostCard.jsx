



'use client'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ProductHeader from '../CardChildComponent/ProductHeader';
import ProductImageSection from '../CardChildComponent/ProductImageSection';
import TimeCounter from '../CardChildComponent/TimeCounter';
import ProductInfo from '../CardChildComponent/ProductInfo';

const MyLostCard = ({ item,status }) => {

    const [daysSinceEnded, setDaysSinceEnded] = useState(null);
    useEffect(() => {
        if (item?.product?.biddingEndTime) {
          const now = new Date();
          const endTime = new Date(item.product.biddingEndTime);
      
          const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
          const endUTC = Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
      
          const diffInMs = nowUTC - endUTC;
          const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
          setDaysSinceEnded(daysPassed);
        }
      }, [item?.product?.biddingEndTime]);
      
console.log(daysSinceEnded,'daysSinceEnded')
    return (
   <div className="relative bg-gray-200 border-1 border-gray-300 rounded-3xl my-3 shadow-lg">
            <ProductHeader name={item?.product?.name} id={item?.product?._id}/>
            <ProductImageSection item={item?.product} />
            <TimeCounter timeLeft={daysSinceEnded} type='days' title='Ended' price={item?.product?.price} />
            <ProductInfo quantity={item?.product?.quantity}
             retail={item?.product?.retail ? item?.product?.retail : 0}
             highestBid={item?.bidAmount}
             title='Your Bid :'
             biddingCount={item?.product?.biddingCount}
            />

            <div className="bg-[#a7f3d0] text-center text-sm py-2 ">
                Winning Bid: <strong> $ {item?.product?.highestBid}</strong>
            </div>

            <div className="flex flex-row">
                {status === 'paid' ?<button className=" rounded-bl-3xl rounded-br-3xl w-full font-bold  text-white bg-gradient-to-rfrom-blue-300 to-blue-400 py-3 flex items-center justify-center ">
    <span>Paid</span>
</button> :
<button className=" rounded-bl-3xl rounded-br-3xl w-full font-bold  text-white bg-gradient-to-r from-red-400 to-red-500 py-3 flex items-center justify-center ">
    <span>LOST</span>
</button>}
</div>
        </div>
    );
}

export default MyLostCard;



