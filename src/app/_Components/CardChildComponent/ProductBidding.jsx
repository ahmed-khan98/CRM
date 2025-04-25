'use client'
import { useAddBidMutation } from "@/app/_Services/products/page";
import Link from "next/link";
import React, { useState } from "react";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";


const ProductBidding = ({ id,isSold, highestBid }) => {
    const [addBid, { isLoading: isSubmitting }] = useAddBidMutation();
    const token = Cookies.get("token");  
    const [bidValue, setBidValue] = useState(highestBid + 1);

  const handleBidChange = (value) => {
    setBidValue(Number(value));
  };

  const submitBid = async () => {
    if (bidValue <= highestBid) {
      toast.error("Bid amount must be greater than the highest bid!");
      return;
    }
    try {
      const response = await addBid({ id, bidAmount: bidValue }).unwrap();
      toast.success(response?.message);
      setBidValue((prev) => prev + 1);
      // router.refresh();
    } catch (error) {
      console.log(error,'error')
      toast.error(error.data?.message || "Failed to place bid ssssssss--->>>");
    }
  };

  if (isSold) {
    return (
      <button className="w-full text-white font-semibold bg-gradient-to-r from-emerald-500 to-green-700 hover:from-green-700 hover:to-emerald-500 py-3 flex items-center justify-center rounded-b-23l">
        Sold
      </button>
    );
  }

  if (!token) {
    return (
      <Link href="/login" className="w-full">
        <button className="w-full text-white orange-bg hover:bg-[#d63006] py-3 flex items-center justify-center rounded-b-23l cursor-pointer">
          Login to Bid
        </button>
      </Link>
    );
  }

  return (
    <>
      <input
        type="number"
        value={bidValue}
        onChange={(e) => handleBidChange(e.target.value)}
        className="w-1/2 px-3 py-2 bg-[#EBEBEB] text-center outline-none rounded-bl-3xl appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={submitBid}
        disabled={bidValue <= highestBid || isSubmitting}
        className={`w-1/2 text-white py-3 flex items-center justify-center space-x-2 rounded-br-3xl ${
          bidValue > highestBid ? 'orange-bg hover:bg-[#d63006]' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        <span>{isSubmitting ? "Submitting..." : "Submit BID"}</span>
      </button>
    </>
  );
};

export default React.memo(ProductBidding);
