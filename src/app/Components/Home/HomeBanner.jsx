"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import images
import banner1 from "../../Assets/bannerimg1.png";


const HomeBanner = () => {
  const images = [banner1, banner1, banner1]; 

  return (
    <div className="w-full lg:h-[90vh] h-[50vh] overflow-hidden">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[ Pagination, Navigation]}
        className="h-full w-full"
      >
        {images.map((img, index) => (
          <SwiperSlide className="!flex" key={index}>
            <div className="relative  m-auto  h-[100%] w-[100%]">
              <Image
                src={img}
                alt={`Banner ${index + 1}`}
                layout="fill"
                className=""
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeBanner;
