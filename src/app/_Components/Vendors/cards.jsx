"use client"
import { CiHeart, CiSearch, CiShare2 } from "react-icons/ci";
import { FaBoxOpen } from "react-icons/fa";
import { useGetMyProductQuery } from "@/app/_Services/products/page";
import { useCallback, useEffect, useRef, useState } from "react";
import CardsComponents from "./CardsComponents";
import AuctionCardSkeleton from "../Skeleton/CardSkeleton";


export default function Cards() {

    const { data, error: isError, isLoading } = useGetMyProductQuery();
    const skeletonCount = data?.data?.length || 4; 
    console.log(skeletonCount,'dsaf')
    return (
        <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto p-6">


            {data?.data.length === 0 ? (
                <div className="flex flex-col items-center text-center ">
                    <div className="bg-green-100 p-6 rounded-full">
                        <FaBoxOpen className="text-4xl text-green-500" />
                    </div>
                    <h2 className="text-lg font-semibold mt-4">No Products Found!</h2>
                    <p className="text-gray-600 mt-1">Ready to start selling something awesome?</p>
                </div>
            ) : (

              <>
               {isLoading
                      ? 
                        [...Array(skeletonCount)].map((_, index) => <AuctionCardSkeleton key={index} />)
                      :  
                        data?.data?.map((item) => <CardsComponents key={item.id} item={item} />)}
              
              </>
            )}
        </div>
    );
}
