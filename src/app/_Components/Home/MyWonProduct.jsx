'use client'
import { useAddBidMutation } from '@/app/_Services/products/page';
import { useAddWishlistMutation, useDeleteWishlistMutation } from '@/app/_Services/wishlist/page';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { CiHeart, CiSearch, CiShare2 } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import Loader from '../Loader';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useAddPaymentMutation } from '@/app/_Services/payment/page';

const MyWonProduct = ({ item }) => {

    const router = useRouter();
    const [addWishlist] = useAddWishlistMutation();
    const [deleteWishlist] = useDeleteWishlistMutation();
    const [loading, setLoading] = useState(false);
    const [addBid, { isLoading: isSubmitting }] = useAddBidMutation();
    const [bidValue, setBidValue] = useState(item.product?.highestBid + 1);
    const [timeLeft, setTimeLeft] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const timerRef = useRef(null);
    const token = Cookies.get("token");



    function formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }

    // Function to calculate time left
    const calculateTimeLeft = useCallback(() => {
        const now = Date.now();
        const endTime = new Date(item?.product?.biddingEndTime).getTime();
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
    }, [item?.product?.biddingEndTime]);

    // Set interval for countdown
    useEffect(() => {
        calculateTimeLeft();
        timerRef.current = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timerRef.current);
    }, [calculateTimeLeft]);


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
        <div className="relative  shadow-lg bg-white  border-[3px] border-gray-300 rounded-3xl my-3">
            <p className="text-[#242424] pl-2 text-[16px] font-semibold py-2 mt-2 roboto line-clamp-2">
                {item?.product?.name.length > 50 ? `${item.product?.name.slice(0, 50)}...` : item.product?.name}
            </p>
            <div className="relative h-[300px]">
                <img
                    onClick={() => router.push(`/detailproduct/${item.product?._id}`)}
                    src={item?.product?.images?.[0]}
                    alt="Product"
                    className="w-full h-full object-cover cursor-pointer"
                />
                {
                    item?.product?.watchers?.length === 0 ? "" :
                        <div className="absolute text-white p-2 top-2 md:left-[70%] left-[65%] h-[25px] bg-[#F33E0A] shadow-2xl flex items-center justify-center">
                            Watcher <span className="ml-1">{item?.product?.watchers?.length}</span>
                        </div>
                }
                {/* Icons */}
                <div className="absolute top-2 left-3 h-[30px] w-[30px] bg-[#F33E0A] shadow-2xl rounded-full flex items-center justify-center">
                    <CiShare2 className="text-white text-lg" />
                </div>
                <div
                    onClick={() => toggleWishlist(item.product?._id, item?.product?.isWishlisted)}
                    className="absolute cursor-pointer top-12 left-3 h-[30px] w-[30px] bg-white shadow-xl rounded-full flex items-center justify-center"
                >
                    {loading ? (
                        <Loader />
                    ) : item?.product?.isWishlisted ? (
                        <FaHeart className="text-red-500 text-lg" />
                    ) : (
                        <CiHeart className="text-black text-lg" />
                    )}
                </div>
                <div className="absolute top-22 left-3 h-[30px] w-[30px] bg-white shadow-2xl rounded-full flex items-center justify-center">
                    <CiSearch className="text-black text-lg" />
                </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white shadow-xl w-[90%] mx-auto text-center py-2 rounded -mt-[60px] relative z-1">
                <p className="text-sm font-semibold roboto">End Date:</p>
                <div className="flex justify-center space-x-4 text-lg font-bold">
                    {formatDate(item?.product?.biddingStartTime)}
                    {/* {["hours", "minutes", "seconds"].map((unit) => (
                        <div key={unit} className="flex flex-col items-center">
                            <span>{timeLeft[unit] ?? 0}</span>
                            <span className="text-xs font-normal roboto">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
                        </div>
                    ))} */}
                </div>
            </div>

            {/* Auction Details */}
            <div className="mt-3 text-sm px-6">
                <div className="flex justify-between roboto">
                    <p><strong>Qty:</strong></p>
                    <p>{item?.product?.quantity}</p>
                </div>
                <div className="flex justify-between roboto">
                    <p><strong>Est Retail:</strong></p>
                    <p className="text-gray-600">${item?.product?.price}</p>
                </div>
                <div className="flex justify-between roboto">
                    <p><strong>#Bids:</strong></p>
                    <p>{item?.product?.highestBid}</p>
                </div>
            </div>
            {/* <p
                dangerouslySetInnerHTML={{ __html: item?.product?.description }}
                className="text-center text-gray-800 text-xs mt-2 roboto"
            /> */}

            <div className="bg-gray-200 text-center text-sm py-2 mt-2 roboto">
                Winning Bid: <strong> $ {item?.product?.highestBid}</strong>
            </div>

            {/* Bidding Input and Button */}
            <div className="mt-3 flex flex-row">

                <button className=" rounded-bl-3xl w-full cursor-pointer roboto text-white bg-gradient-to-r from-emerald-500 to-green-700 hover:from-green-700 hover:to-emerald-500 py-3 flex items-center justify-center ">
                    <span>Won</span>
                </button>

                <button onClick={() => addPayments(item?.product?._id)}
                    disabled={loadingStates[item?.product?._id]}
                    className="rounded-br-3xl w-full cursor-pointer roboto text-white bg-blue-500 hover:bg-blue-600 py-3 flex items-center justify-center ">
                    {loadingStates[item?.product?._id] ? (
                        "Loading..."
                    ) : (
                        "Pay Now"
                    )}                </button>

            </div>

        </div>
    );
}

export default MyWonProduct;
