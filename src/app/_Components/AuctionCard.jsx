"use client";
import { useEffect, useState } from "react";
import { useGetTodayyAuctionsProductQuery } from "../_Services/products/page";
import AuctionComp from "./Home/AuctionComp";
import CardSkeleton from "./Skeleton/CardSkeleton";

export default function AuctionList() {
  const { data, error: isError, isLoading ,refetch } = useGetTodayyAuctionsProductQuery(undefined,{
    refetchOnMountOrArgChange: true, // ✅ Page load hone par fresh data fetch hoga
    refetchOnFocus: true, // ✅ Jab bhi user tab ko dubara active kare, refetch ho
  });

  useEffect(() => {
    refetch(); // ✅ Page load hone par force refetch
  }, []);  
  const skeletonCount = data?.data?.length || 4; 

  
  return (
    <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto p-6">
      {isLoading
        ? 
          [...Array(skeletonCount)].map((_, index) => <CardSkeleton key={index} />)
        :  
          data?.data?.map((item, index) => (
            <AuctionComp key={item.id ?? `auction-${index}`} item={item} />
          ))
        }          
    </div>
  );
}
