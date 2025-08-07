'use client'

import { CiShare2, CiHeart, CiSearch } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Loader from "../Loader";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { useAddWishlistMutation, useDeleteWishlistMutation } from "@/app/_Services/wishlist/page";
import toast from "react-hot-toast";

const ProductImageSection = ({ item,wishlisted}) => {
  console.log(wishlisted,'wishlisted')
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
    <div className="relative h-[280px] bg-white">
      <img
        src={item?.mainImage || item?.images?.[0]}
        alt="Product"
        onClick={() => router.push(`/detailproduct/${item._id}`)}
        className="w-full h-[280px] object-contain cursor-pointer"
      />
      {/* {item?.watchers?.length > 0 && (
        <div className="absolute top-4 md:left-[73%] left-[75%] bg-[#F33E0A] text-white p-2 h-[25px] shadow-2xl flex items-center justify-center">
          Watcher <span className="ml-1">{item.watchers.length}</span>
        </div>
      )} */}
      <div className="absolute top-4 left-2 h-[30px] w-[30px] bg-[#F33E0A] rounded-full shadow-2xl flex items-center justify-center">
        <CiShare2 className="text-white text-lg" />
      </div>
      <div
        className="absolute top-14 left-2 h-[30px] w-[30px] bg-white rounded-full shadow-xl flex items-center justify-center cursor-pointer"
        onClick={() => toggleWishlist(item?.isWishlisted)}
      >
        {wishlisted ? <FaHeart className="text-red-500 text-lg" /> : loading ? <Loader /> : item?.isWishlisted ? <FaHeart className="text-red-500 text-lg" /> : <CiHeart className="text-black text-lg" />}
      </div>
    </div>
  )
}

export default React.memo(ProductImageSection);
