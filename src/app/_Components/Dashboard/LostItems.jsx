'use client'
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import AuctionTab from '../Tab/AuctionTab';
import { useLostItemsQuery } from '@/app/_Services/lost/page';
import MyLostCard from '../Card/myLostCard';


const lostItems = () => {
    const { data, error: isError, isLoading } = useLostItemsQuery();
    const lostItems = data?.data || [];
    const skeletonRows = lostItems.length || 8;

    return (
   <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-4">
       <div className="max-w-6xl mx-auto"> 

         {/* <div className="flex justify-start gap-4 pt-2 md:pt-8 flex-wrap w-full bg-[#FFFFFF]"> */}
        <AuctionTab/>
                 <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-6">
                 {isLoading ? (
                                [...Array(skeletonRows)].map((_, index) => (
                                    <AuctionCardSkeleton key={index} />
                                ))
                            ) : lostItems?.length === 0 ? (
                                <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 text-2xl text-gray-600">
                                        You have not lost any items yet.
                                </p>
                            ) : (
                                 lostItems?.map((item, index) => (
                                    <MyLostCard key={item.id ?? `auction-${index}`} item={item} />
                                ))
                            )}
            </div>
        </div>
        </div>
    );
};

export default lostItems;
