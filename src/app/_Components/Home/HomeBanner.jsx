"use client";
import React, { useEffect } from "react";
import { useGetBannerQuery } from "@/app/_Services/banner/page";
import { useGetTodayyAuctionsProductQuery } from "@/app/_Services/products/page";
import { useDispatch } from "react-redux";
import { setAllProducts } from "@/redux/filterSlice";
import Link from 'next/link';


const HomeBanner = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetBannerQuery();
  const banner = data?.data?.[0];

  const { data:product} = useGetTodayyAuctionsProductQuery();

  useEffect(() => {
    if (product?.data) {
      dispatch(setAllProducts(product.data));
    }
  }, [product, dispatch]);

  return (
    <div className="container mx-auto  pt-[80px] md:pt-[20px] md:my-12 my-5 px-4 md:px-6">
      <div className="flex flex-col lg:flex-row gap-1 md:min-h-[50vh]">

        {isLoading ? (
          <div className="w-full flex justify-center items-center h-[50vh]">
            <div className="animate-pulse w-full lg:w-[35%] bg-gray-200 h-[250px] mx-4 rounded-lg"></div>
            <div className="animate-pulse w-full lg:w-[60%] bg-gray-200 h-[250px] rounded-lg"></div>
          </div>
        ) : banner ? (
          <>
            <div className="w-full lg:w-[40%] bg-gray-100  flex flex-col justify-between  gap-4 rounded-lg">
              <h1 className="font-semibold text-center md:text-3xl text-xl text-title-md tracking-tight text-[#0E0E0E] pt-4">
                {banner.title}
              </h1>

              <div
                dangerouslySetInnerHTML={{ __html: banner.description }}
                className="text-center text-xl leading-6 text-gray-700 p-2 md:p-0 lg:p-2"
              />
               {banner?.linkUrl &&
              <Link href={banner?.linkUrl} className="p-2 text-center cursor-pointer pt-2 text-lg font-semibold uppercase text-white  bg-cyan-300 rounded-br-md rounded-bl-md ">
               {banner?.linkTitle}
              </Link>}
            </div>

            <div className="w-full lg:w-[60%] rounded-lg overflow-hidden">
              <img
                src={banner.image}
                alt="Home Banner"
                className="w-full h-auto object-cover"
              />
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center items-center h-[50vh]">
            <p className="text-gray-500 text-lg font-semibold">Banner Not Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeBanner;
