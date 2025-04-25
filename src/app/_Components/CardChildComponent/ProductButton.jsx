import { useAddWishlistMutation, useDeleteWishlistMutation } from '@/app/_Services/wishlist/page';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { CiShare2, CiHeart, CiSearch } from "react-icons/ci";
import { FaHeart } from "react-icons/fa"; 

const ProductButton = ({item}) => {
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
    <div className='flex items-center justify-between bg-gray-200 px-2 py-2'>  
    <div className='flex gap-1'>
    <div className=" h-[30px] w-[30px] bg-[#F33E0A] rounded-full shadow-2xl flex items-center justify-center">
        <CiShare2 className="text-white text-lg" />
      </div>
      <div
        className="left-2 h-[30px] w-[30px] bg-white rounded-full shadow-xl flex items-center justify-center cursor-pointer"
        onClick={() => toggleWishlist(item?.isWishlisted)}
      >
        {loading ? <Loader /> : item?.isWishlisted ? <FaHeart className="text-red-500 text-lg" /> : <CiHeart className="text-black text-lg" />}
      </div>
      <div className=" h-[30px] w-[30px] bg-white shadow-2xl rounded-full flex items-center justify-center">
        <CiSearch className="text-black text-lg" />
      </div>
    </div>
      <div>
      {/* {item?.watchers?.length > 0 && ( */}
        <div className=" bg-[#F33E0A] text-white p-2 h-[25px] shadow-2xl  flex items-center justify-center">
          Watcher <span className="ml-1">{item?.watchers.length}</span>
        </div>
      {/* )} */}
      </div>
      
      </div>
  )
}

export default ProductButton