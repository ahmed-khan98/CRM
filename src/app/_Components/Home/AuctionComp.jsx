'use client'
import { useAddBidMutation } from '@/app/_Services/products/page';
import { useAddWishlistMutation, useDeleteWishlistMutation } from '@/app/_Services/wishlist/page';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { CiHeart, CiSearch, CiShare2 } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import { ImHammer2 } from 'react-icons/im';
import Loader from '../Loader';
import Link from 'next/link';
import Cookies from 'js-cookie';

const AuctionComp = ({ item }) => {

    const router = useRouter();
    const [addWishlist] = useAddWishlistMutation();
    const [deleteWishlist] = useDeleteWishlistMutation();
    const [loading, setLoading] = useState(false);
    const [addBid, { isLoading: isSubmitting }] = useAddBidMutation();
    const [bidValue, setBidValue] = useState(item.highestBid + 1);
    const [timeLeft, setTimeLeft] = useState({});
    const timerRef = useRef(null);
    const token = Cookies.get("token");


    // Function to calculate time left
    const calculateTimeLeft = useCallback(() => {
        const now = Date.now();
        const endTime = new Date(item?.biddingEndTime).getTime();
        const diff = endTime - now;

        if (diff > 0) {
            setTimeLeft({
                // days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        } else {
            clearInterval(timerRef.current);
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        }
    }, [item?.biddingEndTime]);

    // Set interval for countdown
    useEffect(() => {
        calculateTimeLeft();
        timerRef.current = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timerRef.current);
    }, [calculateTimeLeft]);

    // Handle bid input change
    const handleBidChange = (id, value) => {
        setBidValue(Number(value));
    };

    // Submit bid function
    const submitBid = async () => {
        if (bidValue <= item?.highestBid) {
            toast.error("Bid amount must be greater than the highest bid!");
            return;
        }
        try {
            const response = await addBid({ id: item._id, bidAmount: bidValue }).unwrap();
            toast.success(response?.message);
            setBidValue(bidValue + 1)
            router.replace(router.asPath);
        } catch (error) {
            toast.error(error.data?.message || "Failed to place bid");
        }
    };

    const toggleWishlist = async (id, isWishlisted) => {
        setLoading(true);
        try {
            if (isWishlisted) {
                const response = await deleteWishlist(id).unwrap();
                toast.success(response.message);
            } else {
                const response = await addWishlist(id).unwrap();
                toast.success(response.message);
            }
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong");
        }
        setLoading(false);
    };

    return (
        <div className="relative  shadow-lg bg-white  border-[1px] border-gray-300 rounded-2xl my-3">
            <p className="text-[#242424] text-[16px] font-semibold py-2 px-3 h-11">
                {item?.name.length > 70 ? `${item.name.slice(0, 70)}...` : item.name}
            </p>
            <div className="relative h-[250px]">
                <img
                    onClick={() => router.push(`/detailproduct/${item._id}`)}
                    src={item?.images?.[0]}
                    alt="Product"
                    className="w-full h-[250px] object-contain cursor-pointer"
                />
                {
                    item?.watchers?.length === 0 ? "" :
                        <div className="absolute text-white p-2 top-4 md:left-[70%] left-[65%] h-[25px] bg-[#F33E0A] shadow-2xl flex items-center justify-center">
                            Watcher <span className="ml-1">{item?.watchers?.length}</span>
                        </div>
                }
                {/* Icons */}
                <div className="absolute top-4 left-3 h-[30px] w-[30px] bg-[#F33E0A] shadow-2xl rounded-full flex items-center justify-center">
                    <CiShare2 className="text-white text-lg" />
                </div>
                <div
                    onClick={() => toggleWishlist(item._id, item?.isWishlisted)}
                    className="absolute cursor-pointer top-14 left-3 h-[30px] w-[30px] bg-white shadow-xl rounded-full flex items-center justify-center"
                >
                    {loading ? (
                        <Loader />
                    ) : item?.isWishlisted ? (
                        <FaHeart className="text-red-500 text-lg" />
                    ) : (
                        <CiHeart className="text-black text-lg" />
                    )}
                </div>
                <div className="absolute top-24 left-3 h-[30px] w-[30px] bg-white shadow-2xl rounded-full flex items-center justify-center">
                    <CiSearch className="text-black text-lg" />
                </div>
            </div>

            {/* Countdown Timer */}
            {/* -mt-[60px] relative z-1" */}
            <div className="bg-gray-200 mx-auto text-center py-3 flex justify-center"
            >
                <div className="mx-2 w-[42%] bg-white rounded-xl py-1">
                    <p className=" text-sm">Time left</p>
                    {["hours"].map((unit) => (
                        <p className="font-semibold  text-lg">{timeLeft[unit] ?? 0} {unit}</p>
                    ))}
                </div>
                <div className="mx-2 w-[42%] bg-white rounded-xl py-1">
                    <p className="text-sm">Current Price</p>
                    <p className="font-semibold text-lg">{item?.price}</p>
                </div>
            </div>

            <div className="my-2 text-sm px-6">
                <div className="flex justify-between ">
                    <p><strong>Qty:</strong></p>
                    <p>{item?.quantity}</p>
                </div>
                <div className="flex justify-between ">
                    <p><strong>Est Retail:</strong></p>
                    <p className="text-gray-600">${item?.price}</p>
                </div>
                <div className="flex justify-between ">
                    <p><strong>#Bids:</strong></p>
                    <p>{item?.highestBid}</p>
                </div>
            </div>

            <div className="text-center text-sm py-2 border-t-2 border-gray-300">
                Current Bid: <strong> $ {item?.highestBid}</strong>
            </div>


            <div className="mt-3 flex">
                {item?.isSold ? (
                    <button className="w-full cursor-pointer  text-white font-semibold bg-gradient-to-r from-emerald-500 to-green-700 hover:from-green-700 hover:to-emerald-500  py-3 flex items-center justify-center rounded-b-2xl">
                        <span>Sold</span>
                    </button>
                ) : token ? (
                    <>
                        <input
                            type="text"
                            className="w-1/2 px-3 py-2 bg-[#EBEBEB] text-center  outline-none rounded-bl-2xl
        appearance-none [&::-webkit-outer-spin-button]:appearance-none 
        [&::-webkit-inner-spin-button]:appearance-none"
                            onChange={(e) => handleBidChange(item._id, e.target.value)}
                            value={bidValue}
                        />
                        <button
                            disabled={bidValue <= item?.highestBid || isSubmitting}
                            onClick={() => submitBid(item._id)}
                            className={`w-1/2 cursor-pointer  text-white py-3 flex items-center justify-center space-x-2
    ${Number(bidValue) > Number(item?.highestBid) ? 'orange-bg hover:bg-[#d63006]' : 'bg-gray-400 cursor-not-allowed'}
    rounded-br-2xl
  `}
                        >
                            {/* <ImHammer2 className="transform rotate-80" /> */}
                            <span>{isSubmitting ? "Submitting..." : "Submit BID"}</span>
                        </button>

                    </>
                ) : (
                    <button
                        className="w-full cursor-pointer  text-white orange-bg hover:bg-[#d63006] py-3 flex items-center justify-center rounded-b-2xl"
                    >
                        <Link href="/login">
                            Login to Bid
                        </Link>
                    </button>
                )}
            </div>

        </div>
    );
}

export default AuctionComp;
