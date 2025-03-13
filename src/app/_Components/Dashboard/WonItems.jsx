"use client";
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';

const WonItems = () => {
    const { data, error: isError, isLoading } = useWonItemsQuery();
    const wonItems = data?.data || [];
    const skeletonRows = wonItems.length || 5;

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
                                    </tr>
                                ))
                            ) : wonItems.length === 0 ? (
                                // Show message if won items are empty
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500 text-lg">
                                        You have not won any items yet.
                                    </td>
                                </tr>
                            ) : (
                                wonItems.map((item, index) => (
                                    <tr key={index} className="text-center text-sm text-[#3A3A49]">
                                        <td className="p-3 border flex justify-center border-[#E9EFF4]">
                                            <img src={item?.product?.images?.[0]} width="50px" height="50px" />
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] text-[#DD9A19]">
                                            {item?.product?.name}
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] ">$ {item?.product?.price}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{item?.product?.quantity}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{item?.product?.highestBid}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{item?.product?.biddingStartTime}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{item?.product?.biddingEndTime}</td>
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

export default WonItems;
