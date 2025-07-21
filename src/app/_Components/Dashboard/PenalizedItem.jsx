'use client'
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import PaidUnPaidCard from '../Card/paidUnPaidCard';
import PurchaseTab from '../Tab/PurchaseTab';
import { usePenalizedProductItemsQuery } from '@/app/_Services/PenaltyFeeProduct/page';


const PenalizedItem = () => {
    const { data, error: isError, isLoading } = usePenalizedProductItemsQuery();
    const skeletonRows = data?.data?.length || 8;
    return (
        // <div className="flex justify-start gap-4 pt-2 md:pt-8 flex-wrap w-full bg-[#FFFFFF]">
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-2">
      <div className="max-w-6xl mx-auto">
            <PurchaseTab />
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:p-2 lg:grid-cols-3 gap-0 container mx-auto p-2">
                {isLoading ? (
                    [...Array(skeletonRows)].map((_, index) => (
                        <AuctionCardSkeleton key={index} />
                    ))
                ) : data?.data?.length === 0 ? (
                    <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 text-2xl text-gray-600">
                        You haven't any Penalized Product                                </p>
                ) : (
                    data?.data?.map((item, index) => (
                        <PaidUnPaidCard key={item.id ?? `auction-${index}`} item={item} status={item?.paymentStatus} />
                    ))
                )}
            </div>
            </div>
        </div>
    );
};

export default PenalizedItem;
