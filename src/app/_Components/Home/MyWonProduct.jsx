'use client'
import { Package, DollarSign, BarChart2 } from "lucide-react"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { CiHeart, CiSearch, CiShare2 } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import { useAddPaymentMutation } from '@/app/_Services/payment/page';

const MyWonProduct = ({ item }) => {

    const router = useRouter();
    const [loadingStates, setLoadingStates] = useState({});

    function formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }


    const [addPayment] = useAddPaymentMutation();


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
        <div className="relative bg-gradient-to-b from-orange-50 to-white border-1 border-gray-300 rounded-3xl my-4 shadow-lg flex flex-col">
            <Link
                href={`/detailproduct/${item?.product?._id}`}
                className="text-[18px] font-semibold py-2 px-3 h-14 rounded-t-3xl  cursor-pointer block"
            >
                <p className="line-clamp-2 overflow-hidden text-ellipsis underline">
                    {item?.product?.name.length > 50 ? `${item.product?.name.slice(0, 50)}...` : item.product?.name}
                </p>
            </Link>
            <div className="relative h-[290px]">
                <img
                    onClick={() => router.push(`/detailproduct/${item.product?._id}`)}
                    src={item?.product?.images?.[0]}
                    alt="Product"
                    className="w-full h-[290px] object-contain cursor-pointer"
                />
                {/* {
                    item?.product?.watchers?.length === 0 ? "" :
                        <div className="absolute text-white p-2 top-2 md:left-[70%] left-[65%] h-[25px] bg-[#F33E0A] shadow-2xl flex items-center justify-center">
                            Watcher <span className="ml-1">{item?.product?.watchers?.length}</span>
                        </div>
                } */}
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

            <div className="bg-white shadow-xl w-[80%] mx-auto text-center py-2 px-2 rounded -mt-[60px] relative z-1">
                <div className='flex justify-between py-1'>
                    <p className="text-sm ">Start Date:</p>
                    <div className="flex justify-center space-x-4 font-semibold">
                        {formatDate(item?.product?.biddingStartTime)}
                    </div>
                </div>
                <div className='flex justify-between py-1'>
                    <p className="text-sm ">End Date:</p>
                    <div className="flex justify-center space-x-4 font-semibold">
                        {formatDate(item?.product?.biddingEndTime)}
                    </div>
                </div>
            </div>
            {/* {["hours", "minutes", "seconds"].map((unit) => (
                        <div key={unit} className="flex flex-col items-center">
                            <span>{timeLeft[unit] ?? 0}</span>
                            <span className="text-xs font-normal ">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
                        </div>
                    ))} */}
            <div className="bg-white px-4 py-5 rounded-t-2xl shadow-sm border-b border-gray-100">

                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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
                            <span className="text-sm text-gray-700">Current Price</span>
                        </div>
                        <span className="text-sm font-medium">${item?.product?.price || 0}</span>
                    </div>
                </div>
            </div>


            <div className="bg-[#dbfce7] text-[#00885E] text-center text-sm py-2 ">
                Winning Bid: <strong> $ {item?.product?.highestBid}</strong>
            </div>

            <div className="flex flex-row">

                <button className=" rounded-bl-3xl w-full font-bold cursor-pointer  text-white bg-[#10b981] py-3 flex items-center justify-center ">
                    <span>WON</span>
                </button>
                {
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
                            )}                </button>}
            </div>

        </div>
    );
}

export default MyWonProduct;
