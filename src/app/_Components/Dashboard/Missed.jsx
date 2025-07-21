'use client';
import AppointmentTab from "@/app/_Components/Tab/page";
import MissedCard from "../Card/missedCard";
import { useGetMissedProductQuery } from "@/app/_Services/products/page";
import AuctionCardSkeleton from "../Skeleton/CardSkeleton";

const Page = () => {
    const { data, error, isLoading } = useGetMissedProductQuery();

    
  if (error) {
    return (
      <p className="text-center text-red-500">
        Failed to load Missed products. Please try again later.
      </p>
    );
  }

    return (
        <div className="flex justify-start gap-4 mt-4 flex-wrap w-full">
            <AppointmentTab />

            <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-6">
                 {isLoading ? (
                          [...Array(8)].map((_, index) => <AuctionCardSkeleton key={index} />)
                        ) : data?.data?.length === 0 ? (
                    <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 text-2xl text-gray-600">
                        No Missed Product Found
                    </p>
                ) : (
                    data?.data?.map((item, index) => (
                        <MissedCard key={item._id ?? `auction-${index}`} item={item} status="missed" />
                    ))
                )}
            </div>
        </div>
    );
};

export default Page;
