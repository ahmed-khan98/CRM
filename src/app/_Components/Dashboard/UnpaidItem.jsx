'use client'
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import PaidUnPaidCard from '../Card/PaidUnPaidCard';
import PurchaseTab from '../Tab/PurchaseTab';


const UnpaidItem = () => {
    const { data, error: isError, isLoading } = useWonItemsQuery();
    const wonItems = data?.data?.pending || []
    const skeletonRows = wonItems?.length || 8;
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
                ) : wonItems?.length === 0 ? (
                    <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold  text-3xl text-gray-500">
                        You haven't any Un Paid Product                                </p>
                ) : (
                    wonItems?.map((item, index) => (
                        <PaidUnPaidCard key={item.id ?? `auction-${index}`} item={item} status={item?.paymentStatus} paymentDeadline={item?.paymentDeadline} deliveryMethod={item?.deliveryMethod} deliveryStatus={item?.deliveryStatus}/>
                    ))
                )}
            </div>
            </div>
        </div>
    );
};

export default UnpaidItem;
