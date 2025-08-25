'use client'
import { Package, DollarSign, BarChart2 } from "lucide-react"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { CiHeart, CiShare2 } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import { timeAgo } from "@/app/utilities/date";

const MyWonProduct = ({ item }) => {

    const router = useRouter();
    const [loadingStates, setLoadingStates] = useState({});

    // function formatDate(dateString) {
    //     return new Date(dateString).toLocaleString('en-US', {
    //         dateStyle: 'medium',
    //         timeStyle: 'short'
    //     });
    // }

    const truncateWords = (str, limit = 8) => {
        if (!str) return "";
        const words = str.split(" ");
        return words.length > limit
          ? words.slice(0, limit).join(" ") + "..."
          : str;
      };
      
      const truncatedName = truncateWords(item.product?.name, 8);

    return (
        <div className="relative bg-gradient-to-b from-green-50 to-white border-2 border-gray-300 rounded-3xl my-4 shadow-lg flex flex-col hover:border-green-600  ">
            <Link
                href={`/detailproduct/${item?.product?._id}`}
                className="text-[18px] font-semibold pt-3 px-3 h-16 rounded-t-3xl text-[#0578ff] cursor-pointer  bg-orange-50"
            >
                <p className="capitalize line-clamp-2 overflow-hidden text-ellipsis underline">
                    {truncatedName}
                </p>
            </Link>
            <div className="relative h-[290px]">
                <img
                    onClick={() => router.push(`/detailproduct/${item.product?._id}`)}
                    src={item?.product?.mainImage}
                    alt="Product"
                    className="w-full h-[290px] object-contain cursor-pointer"
                />

                <div className="absolute top-2 left-3 h-[30px] w-[30px] bg-[#F33E0A] shadow-2xl rounded-full flex items-center justify-center">
                    <CiShare2 className="text-white text-lg" />
                </div>
                <div
                    onClick={() => toggleWishlist(item.product?._id, item?.product?.isWishlisted)}
                    className="absolute cursor-pointer top-12 left-3 h-[30px] w-[30px] bg-white shadow-xl rounded-full flex items-center justify-center"
                >
                    {item?.product?.isWishlisted ? (
                        <FaHeart className="text-red-500 text-lg" />
                    ) : (
                        <CiHeart className="text-black text-lg" />
                    )}
                </div>

            </div>
            <div className=" text-center py-3 flex justify-center bg-green-200">
                <div className="mx-2 w-[42%]  bg-gradient-to-r from-green-500 to-green-600 rounded-xl py-1 shadow ">

                    <span className="text-[12px]  font-semibold uppercase text-white">{item?.product?.isSold ? 'Ended' : "Time Left"}</span>
                    <p className={`font-bold text-sm pt-0 text-[#F33E0A]}`}>{timeAgo(item?.product?.SoldDate)}</p>

                </div>
                <div className="mx-2 w-[42%] bg-gradient-to-r from-green-500 to-green-600 rounded-xl py-1 shadow">
                    <span className="text-[12px]  text-white  font-semibold uppercase">Current Price</span>

                    <p className="font-bold text-lg text-white">${item?.product?.highestBid}</p>
                </div>
            </div>

            <div className="bg-white px-4 py-3 rounded-t-2xl shadow-sm border-b border-gray-100 ">

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Package size={16} className="text-[#F33E0A]" />
                            <span className="text-sm text-gray-700">Quantity</span>
                        </div>
                        <span className="text-sm font-medium">{item?.product?.quantity}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <DollarSign size={16} className="text-[#F33E0A]" />
                            <span className="text-sm text-gray-700">Retail</span>
                        </div>
                        <span className="text-sm font-medium">${item?.product?.retail || 0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <BarChart2 size={16} className="text-[#F33E0A]" />
                            <span className="text-sm text-gray-700">Bids</span>
                        </div>
                        <span className="text-sm font-medium">{item?.product?.biddingCount || 0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <DollarSign size={16} className="text-[#F33E0A]" />
                            <span className="text-sm text-gray-700">Winning Bid</span>
                        </div>
                        <span className="text-sm font-medium">${item?.product?.highestBid || 0}</span>
                    </div>
                </div>
            </div>


            {/* <div className="bg-[#dbfce7] text-[#00885E] text-center text-sm py-2 ">
                Winning Bid: <strong> $ {item?.product?.highestBid}</strong>
            </div> */}

            <div className="flex flex-row">

                <button onClick={
                    // () => addPayments(item?._id,item?.product?._id)
                    () => {
                        setLoadingStates((prev) => ({ ...prev, [item?.product?._id]: true }));
                        router.push(`/dashboard/feeConfirmation?type=auction_payment&id=${item?._id}&amount=${item?.winningBid}&product=${item?.product?.name}&sku=${item?.product?.sku}&productId=${item?.product?._id}`)
                    }}
                    disabled={loadingStates[item?.product?._id]}
                    className="rounded-br-3xl rounded-bl-3xl w-full font-bold cursor-pointer  text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 flex items-center justify-center ">
                    {loadingStates[item?.product?._id] ? (
                        "Loading..."
                    ) : (
                        "Click to pay"
                    )}                </button>
                {/* {
                    item?.paymentStatus === 'Completed' ?
                        <button
                            className="rounded-br-3xl w-full font-bold  text-white bg-gradient-to-r from-blue-300 to-blue-400 py-3 flex items-center justify-center ">
                            Paid
                        </button> : <button onClick={() => addPayments(item?.product?._id)}
                            disabled={loadingStates[item?.product?._id]}
                            className="rounded-br-3xl w-full font-bold cursor-pointer  text-white bg-gradient-to-r from-blue-500 to-blue-400  hover:from-blue-400 hover:to-blue-500 py-3 flex items-center justify-center ">
                            {loadingStates[item?.product?._id] ? (
                                "Loading..."
                            ) : (
                                "Pay Now"
                            )}                </button>} */}
            </div>

        </div>
    );
}

export default MyWonProduct;
