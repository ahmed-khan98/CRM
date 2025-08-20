"use client";
import { useGetTodayyAuctionsProductQuery } from "@/app/_Services/products/page";
import CardSkeleton from "../Skeleton/CardSkeleton";
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAllProducts } from "@/redux/filterSlice";
import ProductCard from "../Card/ProductCard";

export default function AuctionCard() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.filter.allProducts); // Get all products
  const filteredProducts = useSelector((state) => state.filter.filteredProducts);
  const { data, error, isLoading } = useGetTodayyAuctionsProductQuery();
  useEffect(() => {
    if (data?.data) { 
      dispatch(setAllProducts(data.data));
    }
  }, [data, dispatch]);

  const showNoProductMessage =filteredProducts.length === 0 && allProducts.length > 0 && !isLoading;

  if (error) {
    return      <div className="bg-[#FFFFFF]  gap-6 container mx-auto py-44 md:py-48">

      <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12"
  >
    <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-4">
      {/* <Clock className="h-6 w-6 text-[#F33E0A]" /> */}
    </div>
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      Our New <span className="text-[#F33E0A]">Auction Product</span> Are Coming Soon
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      We're working on exciting new features to enhance your bidding experience. Stay tuned for a revolutionary
      way to participate in auctions.
    </p>
  </motion.div>
  </div>
  }

  return (
     <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6 container mx-auto p-4 pt-44 md:pt-33 ">
    {isLoading ? (
      [...Array(8)].map((_, index) => <CardSkeleton key={index} />)
    ) : showNoProductMessage ? (
      <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold  text-3xl text-gray-500">
      No Product Found
    </p>    
    ) : (
      filteredProducts?.filter((item, index) => !item?.isSold).map((item, index) => (
        <ProductCard key={item?._id ?? `auction-${index}`} item={item}  index={index}/>
      ))
      
    )}
  </div>
  );
}

