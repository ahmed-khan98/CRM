"use client";
import { useGetTodayyAuctionsProductQuery } from "@/app/_Services/products/page";
import CardSkeleton from "../Skeleton/CardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAllProducts } from "@/redux/filterSlice";
import ProductCard from "../Card/ProductCard";

export default function AuctionCard() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.filter.allProducts); // Get all products
  const filteredProducts = useSelector((state) => state.filter.filteredProducts);
  const { data, error, isLoading } = useGetTodayyAuctionsProductQuery();
console.log(filteredProducts,'filteredProducts')
  useEffect(() => {
    if (data?.data) { 
      dispatch(setAllProducts(data.data));
    }
  }, [data, dispatch]);

  // ✅ Fixing No Product Found Logic
  const showNoProductMessage =filteredProducts.length === 0 && allProducts.length > 0 && !isLoading;

  if (error) {
    return <p className="text-center text-red-500">Failed to load products. Please try again later.</p>;
  }

  return (
     <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto p-4 md:pt-20 pt-30">
    {isLoading ? (
      [...Array(8)].map((_, index) => <CardSkeleton key={index} />)
    ) : showNoProductMessage ? (
      <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold  text-3xl text-gray-500">
      No Product Found
    </p>    
    ) : (
      filteredProducts?.filter((item, index) => !item?.isSold).map((item, index) => (
        <ProductCard key={item.id ?? `auction-${index}`} item={item} />
      ))
      
    )}
  </div>
  );
}

