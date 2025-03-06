"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import images
import banner1 from "../../Assets/banner1.jpg";


const HomeBanner = () => {
  const images = [banner1, banner1, banner1]; 

  return (
    <div className="w-full lg:h-[100vh] h-[50vh] overflow-hidden">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[ Pagination, Navigation]}
        className="h-full w-full"
      >
        {images.map((e, index) => (
          <SwiperSlide className="!flex" key={index}>
            <div className="relative  m-auto  h-[100%] w-[100%]">
            <Image
                src={e}
                alt={`Banner ${index + 1}`}
                layout="fill" // Ensures the image covers the div
                objectFit="cover" // Prevents cropping issues
                objectPosition="top" // Ensures the bottom part is visible
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeBanner;
