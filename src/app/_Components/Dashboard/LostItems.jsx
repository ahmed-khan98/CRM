'use client'
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import AuctionTab from '../Tab/AuctionTab';
import { useLostItemsQuery } from '@/app/_Services/lost/page';
import MyLostCard from '../Card/MyLostCard';


const lostItems = () => {
    const { data, error: isError, isLoading } = useLostItemsQuery();
    const lostItems = data?.data || [];
    const skeletonRows = lostItems.length || 8;

    return (
        <div className="flex justify-start gap-4 mt-4 flex-wrap w-full">
        <AuctionTab/>
                 <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-6">
                 {isLoading ? (
                                [...Array(skeletonRows)].map((_, index) => (
                                    <AuctionCardSkeleton key={index} />
                                ))
                            ) : lostItems?.length === 0 ? (
                                <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold  text-3xl text-gray-500">
                                        You have not lost any items yet.
                                </p>
                            ) : (
                                 lostItems?.map((item, index) => (
                                    <MyLostCard key={item.id ?? `auction-${index}`} item={item} />
                                ))
                            )}
            </div>
        </div>
    );
};

export default lostItems;
