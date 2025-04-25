'use client'
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';
import AuctionCardSkeleton from '../Skeleton/CardSkeleton';
import PaidUnPaidCard from '../Card/PaidUnPaidCard';
import PurchaseTab from '../Tab/PurchaseTab';


const PaidItems = ({ status }) => {
    const { data, error: isError, isLoading } = useWonItemsQuery();
    const wonItems = data?.data?.filter(e => e.paymentStatus == status) || [];
    const skeletonRows = wonItems.length || 8;
    return (
        <div className="flex justify-start gap-4 flex-wrap w-full">
            <PurchaseTab />
            <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-6">
                {isLoading ? (
                    [...Array(skeletonRows)].map((_, index) => (
                        <AuctionCardSkeleton key={index} />
                    ))
                ) : wonItems?.length === 0 ? (
                    <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold  text-3xl text-gray-500">
                        You haven't any {status == 'paid' ? 'Paid' : 'Un Paid'} Product                                </p>
                ) : (
                    wonItems?.map((item, index) => (
                        <PaidUnPaidCard key={item.id ?? `auction-${index}`} item={item} status={status} />
                    ))
                )}
            </div>
        </div>
    );
};

export default PaidItems;
