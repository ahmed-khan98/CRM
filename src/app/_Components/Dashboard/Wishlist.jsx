"use client";
import { useGetAllWishlistQuery } from "@/app/_Services/wishlist/page";
import { useRouter } from 'next/navigation';
import AuctionCardSkeleton from "../Skeleton/CardSkeleton";
import AuctionComp from "../Home/AuctionComp";

const Wishlist = () => {
    const { data, error: isError, isLoading } = useGetAllWishlistQuery();
    const wishlistItems = data?.data?.products || [];
    const router = useRouter();

    const skeletonRows = wishlistItems?.length || 8;


    return (
        <>
     <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto p-6">
     {/* <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-[#E9EFF4]">
                        <thead className="text-xs">
                            <tr className="text-center text-[#878790]">
                                <th className="p-3 border border-[#E9EFF4]">IMG</th>
                                <th className="p-3 border border-[#E9EFF4]"> Product Title </th>
                                <th className="p-3 border border-[#E9EFF4]">Price ⬍</th>
                                <th className="p-3 border border-[#E9EFF4]">Status </th>
                                <th className="p-3 border border-[#E9EFF4]">Quantity ⬍</th>
                                <th className="p-3 border border-[#E9EFF4]">Highest Bids</th>
                                <th className="p-3 border border-[#E9EFF4]">Start Date</th>
                                <th className="p-3 border border-[#E9EFF4]">End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [...Array(skeletonRows)].map((_, index) => (
                                    <tr key={index} className="text-center text-sm">
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="w-12 h-12 bg-gray-200 animate-pulse mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : wishlistItems?.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500 text-lg">
                                        Your wishlist is empty.
                                    </td>
                                </tr>
                            ) : (
                                wishlistItems?.map((item, index) => (
                                    <tr key={index} className="text-center text-sm text-[#3A3A49]" >
                                        <td className="p-3 border flex justify-center border-[#E9EFF4]">
                                            <img src={item?.images?.[0]} width="50px" height="50px" className="rounded cursor-pointer" onClick={() => router.push(`/detailproduct/${item._id}`)} />
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] text-[#DD9A19] cursor-pointer" onClick={() => router.push(`/detailproduct/${item._id}`)}>
                                            {item?.name}
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] ">$ {item?.price}</td>
                                        <td
                                            className={`p-3 border border-[#E9EFF4] font-medium ${item?.isSold ? "text-[green]" : "text-yellow-500"
                                                }`}
                                        >
                                            {item?.isSold ? "Sold" : "Unsold"}
                                        </td>

                                        <td className="p-3 border border-[#E9EFF4] ">{item?.quantity}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{item?.highestBid}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{formatDate(item?.biddingStartTime)}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{formatDate(item?.biddingEndTime)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div> */}
                 {isLoading ? (
                                [...Array(skeletonRows)].map((_, index) => (
                                    <AuctionCardSkeleton key={index} />
                                ))
                            ) : wishlistItems?.length === 0 ? (
                                <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold montserrat text-3xl text-gray-500">
                                        Your wishlist is empty.
                                </p>
                            ) : (
                                wishlistItems?.map((item, index) => (
                                    <AuctionComp key={item.id ?? `auction-${index}`} item={item} />
                                    // <tr key={index} className="text-center text-sm text-[#3A3A49]" >
                                    //     <td className="p-3 border flex justify-center border-[#E9EFF4]">
                                    //         <img src={item?.images?.[0]} width="50px" height="50px" className="rounded cursor-pointer" onClick={() => router.push(`/detailproduct/${item._id}`)} />
                                    //     </td>
                                    //     <td className="p-3 border border-[#E9EFF4] text-[#DD9A19] cursor-pointer" onClick={() => router.push(`/detailproduct/${item._id}`)}>
                                    //         {item?.name}
                                    //     </td>
                                    //     <td className="p-3 border border-[#E9EFF4] ">$ {item?.price}</td>
                                    //     <td
                                    //         className={`p-3 border border-[#E9EFF4] font-medium ${item?.isSold ? "text-[green]" : "text-yellow-500"
                                    //             }`}
                                    //     >
                                    //         {item?.isSold ? "Sold" : "Unsold"}
                                    //     </td>

                                    //     <td className="p-3 border border-[#E9EFF4] ">{item?.quantity}</td>
                                    //     <td className="p-3 border border-[#E9EFF4] ">{item?.highestBid}</td>
                                    //     <td className="p-3 border border-[#E9EFF4] ">{formatDate(item?.biddingStartTime)}</td>
                                    //     <td className="p-3 border border-[#E9EFF4] ">{formatDate(item?.biddingEndTime)}</td>
                                    // </tr>
                                ))
                            )}
            </div>
        </>
    );
};

export default Wishlist;
