'use client';

import { useDispatch, useSelector } from "react-redux";
import AppointmentTab from "@/app/_Components/Tab/AppointmentTab";
import ProductCard from "@/app/_Components/Card/ProductCard";
import { useEffect, useMemo } from "react";
import { setAllProducts } from "@/redux/filterSlice";
import { useGetTodayyAuctionsProductQuery } from "@/app/_Services/products/page";
import AuctionCardSkeleton from "../Skeleton/CardSkeleton";

const Page = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.filter.allProducts);
  const { data, error, isLoading } = useGetTodayyAuctionsProductQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(setAllProducts(data.data));
    }
  }, [data, dispatch]);

  const now = new Date();

  // Filter upcoming products
  const upcomingProducts = useMemo(() => {
    return allProducts?.filter((item) => {
      const startTime = new Date(item?.biddingStartTime);
      return startTime > now;
    });
  }, [allProducts, now]);

  if (error) {
    return (
      <p className="text-center text-red-500">
        Failed to load Upcoming products. Please try again later.
      </p>
    );
  }

  return (
    <div className="flex justify-start gap-4 mt-4 flex-wrap w-full">
      <AppointmentTab />

      <div className="bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto p-6">
        {isLoading ? (
          [...Array(8)].map((_, index) => <AuctionCardSkeleton key={index} />)
        ) : upcomingProducts?.length === 0 ? (
          <p className="flex items-center justify-center h-[40vh] col-span-4 py-16 font-semibold text-3xl text-gray-500">
            No Upcoming Auction Product Found
          </p>
        ) : (
          upcomingProducts.map((item, index) => (
            <ProductCard key={item.id ?? `auction-${index}`} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
