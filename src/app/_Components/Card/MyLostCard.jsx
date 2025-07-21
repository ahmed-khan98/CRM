



'use client'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ProductHeader from '../CardComponent/productHeader';
import ProductImageSection from '../CardComponent/productImageSection';
import TimeCounter from '../CardComponent/timeCounter';
import ProductInfo from '../CardComponent/productInfo';

const MyLostCard = ({ item, status }) => {

    return (
        <div className="relative bg-gradient-to-b bg-gray-100 border-2 border-gray-300 rounded-3xl my-4 shadow-lg flex flex-col">
            <ProductHeader name={item?.product?.name} id={item?.product?._id} />
            <ProductImageSection item={item?.product} />
                  <TimeCounter 
                  price={item?.product?.price} 
                  isAuctionActive={item?.product?.isAuctionActive} 
                  remainingAuctionTime={item?.product?.remainingAuctionTime} 
                  auctionStartTime={item?.product?.auctionStartTime} 
                  isSold={item?.product?.isSold}
                  SoldDate={item?.product?.SoldDate}
                  auctionEndTime={item?.product?.auctionEndTime} />
          
            <ProductInfo quantity={item?.product?.quantity}
                retail={item?.product?.retail ? item?.product?.retail : 0}
                highestBid={item?.bidAmount}
                isSold={item?.isSold}
                SoldDate={item?.SoldDate}
                title='Your Bid :'
                biddingCount={item?.product?.biddingCount}
            />

            <div className="bg-gradient-to-r from-emerald-500 to-green-700 text-center text-white text-sm py-2 ">
                Winning Bid: <strong> $ {item?.product?.highestBid}</strong>
            </div>

            <div className="flex flex-row">
                {status === 'paid' ? <button className=" rounded-bl-3xl rounded-br-3xl w-full font-bold  text-white bg-gradient-to-rfrom-blue-300 to-blue-400 py-3 flex items-center justify-center ">
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



