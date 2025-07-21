'use client'
import BiddingProductCard from '../Card/biddingProductCard';
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import AuctionTab from '../Tab/AuctionTab';
import { useBiddingItemsQuery } from '@/app/_Services/bidding/page';


const BiddingItems = ({ text }) => {
    const { data, error: isError, isLoading } = useBiddingItemsQuery();
    const biddingItems = data?.data || [];
    const skeletonRows = biddingItems.length || 8;

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
                    ) : biddingItems?.length === 0 ? (
                        <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 text-2xl text-gray-600">
                            {text}                                </p>
                    ) : (
                        biddingItems?.map((item, index) => (
                            <BiddingProductCard key={item.id ?? `auction-${index}`} item={item} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BiddingItems;
