"use client";
import { useGetAllWishlistQuery } from "@/app/_Services/wishlist/page";
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }
const Wishlist = () => {
    const { data, error: isError, isLoading } = useGetAllWishlistQuery();
    const wishlistItems = data?.data?.products || [];

    const skeletonRows = wishlistItems?.length || 5;


    return (
        <>
            <div className="w-2/2 px-3 pb-4">
                <div className="overflow-x-auto">
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
                                    <tr key={index} className="text-center text-sm text-[#3A3A49]">
                                        <td className="p-3 border flex justify-center border-[#E9EFF4]">
                                            <img src={item?.images?.[0]} width="50px" height="50px" />
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] text-[#DD9A19]">
                                            {item?.name}
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] ">$ {item?.price}</td>
                                        <td
                                            className={`p-3 border border-[#E9EFF4] font-medium ${item?.isSold ? "text-[green]" : "text-red-500"
                                                }`}
                                        >
                                            {item?.isSold ? "Sold" : "Pending"}
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
                </div>
            </div>
        </>
    );
};

export default Wishlist;
