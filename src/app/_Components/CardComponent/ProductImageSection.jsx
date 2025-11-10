'use client'
import Image from 'next/image';
import { CiShare2, CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Loader from "../Loader";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { useAddWishlistMutation, useDeleteWishlistMutation } from "@/app/_Services/wishlist/page";
import toast from "react-hot-toast";
import { UserRoundCheck } from 'lucide-react';

const ProductImageSection = ({ item, wishlisted }) => {
  console.log(wishlisted, 'wishlisted')
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [addWishlist] = useAddWishlistMutation();
  const [deleteWishlist] = useDeleteWishlistMutation();

  const toggleWishlist = async (isWishlisted) => {
    setLoading(true)
    try {
      const action = isWishlisted ? deleteWishlist : addWishlist;
      const response = await action(item._id).unwrap();
      setLoading(false)
      toast.success(response.message);
    } catch (error) {
      setLoading(false)
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative py-[auto] h-[280px] bg-white">
      {/* <img
        src={item?.mainImage || item?.images?.[0]}
        alt="Product"
        onClick={() => router.push(`/detailproduct/${item._id}`)}
      /> */}
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => router.push(`/detailproduct/${item._id}`)}
      >
        <Image
          src={item?.mainImage || item?.images?.[0]}
          alt="Product"
          fill
          className="object-contain"
        />
      </div>
      {/* {item?.watchers?.length > 0 && (
        <div className="absolute top-4 md:left-[73%] left-[75%] bg-[#F33E0A] text-white p-2 h-[25px] shadow-2xl flex items-center justify-center">
          Watcher <span className="ml-1">{item.watchers.length}</span>
        </div>
      )} */}
      <div className="absolute top-12 left-2 h-[30px] w-[30px] bg-[#F33E0A] rounded-full shadow-2xl flex items-center justify-center">
        <CiShare2 className="text-white text-lg" />
      </div>
      <div
        className="absolute top-22 left-2 h-[30px] w-[30px] bg-white rounded-full shadow-xl flex items-center justify-center cursor-pointer"
        onClick={() => toggleWishlist(item?.isWishlisted)}
      >
        {wishlisted ? <FaHeart className="text-red-500 text-lg" /> : loading ? <Loader /> : item?.isWishlisted ? <FaHeart className="text-red-500 text-lg" /> : <CiHeart className="text-black text-lg" />}
      </div>
      {item?.userHighestBid && (
        <div
          className={`absolute top-2 left-2 w-[80px] h-[30px] rounded-full shadow-2xl flex items-center justify-center cursor-pointer 
        ${item?.userHighestBid?.bidAmount === item?.highestBid
              ? "h-40 w-[32px] bg-green-100"
              : "h-32 w-[28px] bg-orange-100"}`}
        >
          {(item?.userHighestBid?.bidAmount === item?.highestBid
            ? "WINNING"
            : "OUTBID"
          ).split("").map((char, i) => (
            <span
              key={i}
              className={`leading-8 ${item?.userHighestBid?.bidAmount === item?.highestBid
                ? "text-green-600"
                : "text-orange-600"
                }`}
            >
              {char}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(ProductImageSection);
