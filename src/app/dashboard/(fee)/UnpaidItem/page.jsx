'use client'
import { motion } from "framer-motion"
import PaidUnPaidCard from '@/app/_Components/Card/PaidUnPaidCard';
// import AuctionCardSkeleton from '@/app/_Components/Skeleton/CardSkeleton';
import FeeTab from '@/app/_Components/Tab/FeeTab';
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';
import { Box, DollarSign } from 'lucide-react';
  

const page = () => {
    const { data, error: isError, isLoading } = useWonItemsQuery();
    const wonItems = data?.data?.pending || []
    const skeletonRows = wonItems?.length || 8;

    if (isLoading) {
        return (
          <div className="min-h-screen  flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#F33E0A] border-t-transparent rounded-full"
            />
            <span className="ml-4 text-[#F33E0A] font-semibold">Loading your fees... 🚀</span>
          </div>
        )
      }
      

    return (
        // <div className="flex justify-start gap-4 pt-2 md:pt-8 flex-wrap w-full bg-[#FFFFFF]">
        <div className="min-h-screen  py-4 sm:px-1 md:px-2">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col gap-2 justify-between items-start mx-2 md:mx-0 md:items-center md:flex-row">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-7 w-7 text-red-600" />
                        <h3 className="text-[#242424] text-[24px] font-bold">Fees Due</h3>
                    </div>
                    <FeeTab />
                </div>
                
                    {wonItems?.length === 0 ? (
                       <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 mx-3 md:mx-0 mt-10 text-center">
                       <Box className="h-16 w-16 text-gray-300 mbg-[#5f2781]" />
                       <h3 className="text-xl font-semibold text-gray-700">No Un Paid Product </h3>
                       <p className="text-gray-500 mt-2">
                         You don't have any Un paid products fees.      
                       </p>
                     </div>
                    ) : 
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:p-2 lg:grid-cols-3 gap-0 container mx-auto p-2">
                       {wonItems?.map((item, index) => (
                            <PaidUnPaidCard key={item.id ?? `auction-${index}`} item={item} status={item?.paymentStatus} paymentDeadline={item?.paymentDeadline} deliveryMethod={item?.deliveryMethod} deliveryStatus={item?.deliveryStatus} />
                        ))}
                </div>
                    }

            </div>
        </div>
    );
};

export default page;
