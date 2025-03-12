"use client";
import { useState } from "react";
import { useGetTodayyAuctionsProductQuery } from "../_Services/products/page";
import AuctionComp from "./Home/AuctionComp";
import CardSkeleton from "./Skeleton/CardSkeleton";

export default function AuctionList() {
  const { data, error: isError, isLoading } = useGetTodayyAuctionsProductQuery();

  
  const skeletonCount = data?.data?.length || 4; 

  return (
    <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto p-6">
      {isLoading
        ? 
          [...Array(skeletonCount)].map((_, index) => <CardSkeleton key={index} />)
        :  
          data?.data?.map((item) => <AuctionComp key={item.id} item={item} />)}
    </div>
  );
}
