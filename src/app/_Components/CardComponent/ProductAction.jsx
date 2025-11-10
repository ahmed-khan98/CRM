'use client'
import Image from 'next/image';
import { CiShare2, CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Loader from "../Loader";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { useAddWishlistMutation, useDeleteWishlistMutation } from "@/app/_Services/wishlist/page";
import toast from "react-hot-toast";

const ProductAction = ({ item, wishlisted }) => {
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
        <div className="flex items-center justify-between bg-green-200 p-2">

            <p className='text-green-700 font-semibold'>WINNING</p>
            <div className='flex items-center justify-around gap-2'>
                <div className=" bg-[#F33E0A] rounded-full h-[30px] w-[30px] shadow-2xl flex items-center justify-center">
                    <CiShare2 className="text-white text-lg" />
                </div>
                <div
                    className=" bg-white rounded-full shadow-xl h-[30px] w-[30px] cursor-pointer flex items-center justify-center"
                    onClick={() => toggleWishlist(item?.isWishlisted)}
                >
                    {wishlisted ? <FaHeart className="text-red-500 text-lg" /> : loading ? <Loader /> : item?.isWishlisted ? <FaHeart className="text-red-500 text-lg" /> : <CiHeart className="text-black text-lg" />}
                </div>
            </div>

        </div>
    )
}

export default React.memo(ProductAction);
