'use client'
import { useGetAllWishlistQuery } from "@/app/_Services/wishlist/page";
import AuctionCardSkeleton from "../Skeleton/CardSkeleton";
import ProductCard from "../Card/ProductCard";
import AuctionTab from "../Tab/AuctionTab";
import Link from "next/link";

const page = () => {
    const { data, error: isError, isLoading } = useGetAllWishlistQuery();
    const wishlistItems = data?.data||[];
    const skeletonRows = wishlistItems?.length || 8;

    return (
        // <div className="flex justify-start gap-4 pt-2 md:pt-8 flex-wrap w-full ">
             <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6 px-2">
      <div className="max-w-6xl mx-auto">

            <AuctionTab />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-2">
            {isLoading ?
                    [...Array(skeletonRows)].map((_, index) => (
                        <AuctionCardSkeleton key={index} />
                    ))
                
                : wishlistItems?.length === 0 ?
                    <div className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold  text-3xl text-gray-500">
                        <Link href="/auction-product">
                            <button className="orange-bg cursor-pointer w-full text-white text-lg font-bold py-3 px-6 rounded-full transition-all hover:bg-orange-700">
                                BROWSE AUCTION
                            </button>
                        </Link>
                    </div>
                    : 
                        wishlistItems?.map((item, index) => (
                            <ProductCard key={item.id ?? `auction-${index}`} item={item} />

                        ))
            }
        </div>
        </div>
        </div>
    );
};

export default page;
