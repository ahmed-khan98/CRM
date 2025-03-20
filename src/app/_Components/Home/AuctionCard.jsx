"use client";
import { useGetTodayyAuctionsProductQuery } from "@/app/_Services/products/page";
import AuctionComp from "./AuctionComp";
import CardSkeleton from "../Skeleton/CardSkeleton"
export default function AuctionList() {
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
