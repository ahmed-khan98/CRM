"use client";
import { useEffect, useState } from "react";
import { useGetTodayyAuctionsProductQuery } from "../_Services/products/page";
import AuctionComp from "./Home/AuctionComp";
import CardSkeleton from "./Skeleton/CardSkeleton";
import { useRouter } from "next/navigation";

export default function AuctionList() {
  const router = useRouter();
  const { data, error: isError, isLoading  } = useGetTodayyAuctionsProductQuery(); 

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
