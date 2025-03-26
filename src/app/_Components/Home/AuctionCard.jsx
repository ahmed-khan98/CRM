"use client";
import { useGetTodayyAuctionsProductQuery } from "@/app/_Services/products/page";
import AuctionComp from "./AuctionComp";
import CardSkeleton from "../Skeleton/CardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAllProducts } from "@/redux/filterSlice";

export default function AuctionCard() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.filter.allProducts); // Get all products
  const filteredProducts = useSelector((state) => state.filter.filteredProducts);
  const { data, error, isLoading } = useGetTodayyAuctionsProductQuery();

  console.log("All Products:", allProducts);
  console.log("Filtered Products:", filteredProducts);

  useEffect(() => {
    if (data?.data) {
      dispatch(setAllProducts(data.data));
    }
  }, [data, dispatch]);

  // ✅ Fixing No Product Found Logic
  const showNoProductMessage =
  filteredProducts.length === 0 && allProducts.length > 0 && !isLoading;

  return (
     <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto p-6">
    {isLoading ? (
      [...Array(8)].map((_, index) => <CardSkeleton key={index} />)
    ) : showNoProductMessage ? (
      <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold montserrat text-3xl text-gray-500">
      No Product Found
    </p>    
    ) : (
      filteredProducts.map((item, index) => (
        <AuctionComp key={item.id ?? `auction-${index}`} item={item} />
      ))
    )}
  </div>
  );
}

