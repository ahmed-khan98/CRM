'use client'
import { useAddBidMutation } from '@/app/_Services/products/page';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { CiHeart, CiSearch, CiShare2 } from 'react-icons/ci';
import { ImHammer2 } from 'react-icons/im';

const AuctionComp = ({ item }) => {
    const router = useRouter();

    const [addBid, { isLoading: isSubmitting }] = useAddBidMutation();
    const [bidValue, setBidValue] = useState(item.highestBid + 1);
    const [timeLeft, setTimeLeft] = useState({});
    const timerRef = useRef(null);

    // Function to calculate time left
    const calculateTimeLeft = useCallback(() => {
        const now = Date.now();
        const endTime = new Date(item?.biddingEndTime).getTime();
        const diff = endTime - now;

        if (diff > 0) {
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        } else {
            clearInterval(timerRef.current);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
            setBidValue(bidValue+1)
            router.replace(router.asPath); 
        } catch (error) {
            toast.error(error.data?.message || "Failed to place bid");
        }
    };



    return (
        <div className="relative shadow-lg bg-white">
            {/* Image and Icons */}
            <div className="relative">
                <img
                    onClick={() => router.push(`/detailproduct/${item._id}`)}
                    src={item?.images?.[0]}
                    alt="Product"
                    className="w-full h-full object-cover cursor-pointer"
                />
                {/* Watchers */}
                {
                    item?.watchers?.length === 0 ? "": 
                    <div className="absolute text-white p-2 top-2 left-[70%] h-[25px] bg-[#F33E0A] shadow-2xl flex items-center justify-center">
                    Watcher <span className="ml-1">{item?.watchers?.length}</span>
                </div>
                }
                {/* Icons */}
                <div className="absolute top-2 left-3 h-[30px] w-[30px] bg-[#F33E0A] shadow-2xl rounded-full flex items-center justify-center">
                    <CiShare2 className="text-white text-lg" />
                </div>
                <div className="absolute top-12 left-3 h-[30px] w-[30px] bg-white shadow-xl rounded-full flex items-center justify-center">
                    <CiHeart className="text-black text-lg" />
                </div>
                <div className="absolute top-22 left-3 h-[30px] w-[30px] bg-white shadow-2xl rounded-full flex items-center justify-center">
                    <CiSearch className="text-black text-lg" />
                </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white shadow-xl w-[90%] mx-auto text-center py-2 rounded -mt-[60px] relative z-1">
                <p className="text-sm font-semibold montserrat">Time left:</p>
                <div className="flex justify-center space-x-4 text-lg font-bold">
                    {["days", "hours", "minutes", "seconds"].map((unit) => (
                        <div key={unit} className="flex flex-col items-center">
                            <span>{timeLeft[unit] ?? 0}</span>
                            <span className="text-xs font-normal montserrat">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Auction Details */}
            <div className="mt-3 text-sm px-6">
                <div className="flex justify-between montserrat">
                    <p><strong>Qty:</strong></p>
                    <p>{item?.quantity}</p>
                </div>
                <div className="flex justify-between montserrat">
                    <p><strong>Est Retail:</strong></p>
                    <p className="text-gray-600">${item?.price}</p>
                </div>
                <div className="flex justify-between montserrat">
                    <p><strong>#Bids:</strong></p>
                    <p>{item?.highestBid}</p>
                </div>
            </div>

            <p className="text-center text-gray-500 text-xs mt-2 montserrat">{item?.description}</p>

            <div className="bg-gray-200 text-center text-sm py-2 mt-2 montserrat">
                Current Bid: <strong> $ {item?.highestBid}</strong>
            </div>
            {/* Bidding Input and Button */}
            <div className="mt-3 flex">
                <input
                    type="number"
                    min={bidValue + 1}
                    className="w-1/2 px-3 py-2 bg-[#EBEBEB] text-center montserrat outline-none"
                    onChange={(e) => handleBidChange(item._id, e.target.value)}
                    value={bidValue}
                />

                <button
                    disabled={bidValue <= item?.highestBid || isSubmitting}
                    onClick={() => submitBid(item._id)}
                    className={`w-1/2  montserrat text-white py-2 flex items-center justify-center space-x-2
                        ${Number(bidValue) > Number(item?.highestBid) ? 'bg-[#F33E0A] hover:bg-[#d63006]' : 'bg-gray-400 cursor-not-allowed'}
                    `}
                >
                    <ImHammer2 className="transform rotate-80" />
                    <span>{isSubmitting ? "Submitting..." : "Submit BID"}</span>
                </button>
            </div>
        </div>
    );
}

export default AuctionComp;
