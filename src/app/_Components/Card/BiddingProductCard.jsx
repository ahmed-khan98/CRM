



'use client'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ProductHeader from '../CardComponent/ProductHeader';
import ProductImageSection from '../CardComponent/ProductImageSection';
import TimeCounter from '../CardComponent/TimeCounter';
import ProductInfo from '../CardComponent/ProductInfo';
import ProductBidding from '../CardComponent/ProductBidding';

const BiddingProductCard = ({ item }) => {

    return (
        <div className="relative bg-gradient-to-b bg-gray-100 border-2 border-gray-300 rounded-3xl my-4 shadow-lg flex flex-col hover:border-[#F33E0A]">
            <ProductHeader name={item?.product?.name} id={item?.product?._id} />
            <ProductImageSection item={item?.product} />
            <TimeCounter
                status={item?.product?.isSold}
                price={item?.product?.price}
                isAuctionActive={item?.product?.isAuctionActive}
                remainingAuctionTime={item?.product?.remainingAuctionTime}
                auctionStartTime={item?.product?.auctionStartTime}
                auctionEndTime={item?.product?.auctionEndTime} 
                isSold={item?.product?.isSold}
                SoldDate={item?.product?.SoldDate}
                />

            <ProductInfo
                quantity={item?.product?.quantity}
                retail={item?.product?.retail ? item?.product?.retail : 0}
                highestBid={item?.product?.highestBid}
                biddingCount={item?.product?.biddingCount}
            />
            <div className="flex">
                <ProductBidding
                    id={item?.product?._id}
                    isSold={item?.product?.isSold}
                    highestBid={item?.product?.highestBid}
                    userBid={item?.userHighestBid}
                    biddingCount={item?.product?.biddingCount}

                />
            </div>
        </div>
    );
}

export default BiddingProductCard;



