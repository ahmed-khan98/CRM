"use client";
import { useAddPaymentMutation } from '@/app/_Services/payment/page';
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';


function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

const WonItems = () => {
    const [loadingStates, setLoadingStates] = useState({});
    const { data, error: isError, isLoading } = useWonItemsQuery();
    const wonItems = data?.data || [];
    const skeletonRows = wonItems.length || 5;
    const [addPayment] = useAddPaymentMutation();
    const router = useRouter();


    const addPayments = async (id) => {
        try {
            setLoadingStates((prev) => ({ ...prev, [id]: true }));
            const response = await addPayment({ "productId": id }).unwrap();
            console.log(response, 'sadaf');

            if (response?.data?.url) {
                window.location.href = response?.data?.url;
            }
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [id]: false }));
        }
    };

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
                                <th className="p-3 border border-[#E9EFF4]">Payment</th>
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
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-18 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-18 mx-auto"></div>
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4]">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-18 mx-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : wonItems.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500 text-lg">
                                        You have not won any items yet.
                                    </td>
                                </tr>
                            ) : (
                                wonItems.map((item, index) => (
                                    <tr key={index} className="text-center text-sm text-[#3A3A49]">
                                        <td className="p-3 border flex justify-center border-[#E9EFF4]" >
                                            <img src={item?.product?.images?.[0]} width="50px" height="50px" className="cursor-pointer rounded" onClick={() => router.push(`/detailproduct/${item._id}`)} />
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] text-[#DD9A19] cursor-pointer" onClick={() => router.push(`/detailproduct/${item._id}`)}>
                                            {item?.product?.name}
                                        </td>
                                        <td className="p-3 border border-[#E9EFF4] ">$ {item?.product?.price}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{item?.product?.quantity}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{item?.product?.highestBid}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{formatDate(item?.product?.biddingStartTime)}</td>
                                        <td className="p-3 border border-[#E9EFF4] ">{formatDate(item?.product?.biddingEndTime)}</td>
                                        <td className="p-3 border center border-[#E9EFF4] ">
                                            {item?.paymentStatus === 'Completed' ?
                                                <button
                                                    className={`bg-green-600 cursor-pointer text-white px-3 py-2 hover:bg-green-500 flex items-center justify-center `}
                                                >Paid
                                                </button>
                                                :
                                                <button
                                                    onClick={() => addPayments(item?.product?._id)}
                                                    disabled={loadingStates[item?.product?._id]} // Sirf clicked button disable hoga
                                                    className={`bg-green-600 cursor-pointer text-white px-3 py-2  hover:bg-green-500 flex items-center justify-center ${loadingStates[item?.product?._id] ? "opacity-50 cursor-not-allowed" : ""
                                                        }`}
                                                >
                                                    {loadingStates[item?.product?._id] ? (
                                                        "Loading..."
                                                    ) : (
                                                        "Pay Now"
                                                    )}
                                                </button>}
                                        </td>
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
