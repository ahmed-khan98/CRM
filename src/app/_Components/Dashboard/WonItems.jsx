'use client'
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import MyWonProduct from '../Home/MyWonProduct';
import AuctionTab from '../Tab/AuctionTab';


const WonItems = ({ text }) => {
    const { data, error: isError, isLoading } = useWonItemsQuery();
    const wonItems = [
        ...(data?.data?.pending || []),
        ...(data?.data?.paid || []),
        ...(data?.data?.penalized || [])
      ];
    const skeletonRows = wonItems.length || 8;

    return (
        // <div className="flex justify-start gap-4 pt-2 md:pt-8 flex-wrap w-full bg-[#FFFFFF]">
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-2">
            <div className="max-w-6xl mx-auto">

                <AuctionTab />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-2 ">
                    {isLoading ? (
                        [...Array(skeletonRows)].map((_, index) => (
                            <AuctionCardSkeleton key={index} />
                        ))
                    ) : wonItems?.length === 0 ? (
                        <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 text-2xl text-gray-600">
                            {text}                                </p>
                    ) : (
                        wonItems?.map((item, index) => (
                            <MyWonProduct key={item.id ?? `auction-${index}`} item={item} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WonItems;
