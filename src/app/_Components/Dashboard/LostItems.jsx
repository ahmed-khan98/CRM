'use client'
import { useLostItemsQuery } from '@/app/_Services/lost/page';
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import AuctionTab from '../Tab/AuctionTab';
import MyLostCard from '../Card/MyLostCard';


const lostItems = () => {
    const { data, error: isError, isLoading } = useLostItemsQuery();
    const lostItems = data?.data || [];
    const skeletonRows = lostItems.length || 8;

    return (
   <div className="min-h-screen  py-6 px-4">
       <div className="max-w-6xl mx-auto"> 

         {/* <div className="flex justify-start gap-4 pt-2 md:pt-8 flex-wrap w-full bg-[#FFFFFF]"> */}
        <AuctionTab/>
                 <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-6">
                 {isLoading ? (
                                [...Array(skeletonRows)].map((_, index) => (
                                    <AuctionCardSkeleton key={index} />
                                ))
                            ) : lostItems?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[40vh] col-span-4 py-16 font-semibold  text-3xl text-gray-500">
                                <p className="py-6 text-4xl text-gray-500">
                                    No Items
                                </p>
                                <Link href="/closing-products">
                                    <button className="orange-bg cursor-pointer w-full text-white text-lg font-bold py-3 px-6 rounded-full transition-all hover:bg-orange-700">
                                        BROWSE AUCTION
                                    </button>
                                </Link>
                            </div>
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
