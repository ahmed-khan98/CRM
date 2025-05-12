import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';

const ImageSection = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = useRef(null);

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
        swiperRef.current?.slideTo(index);
    };

    return (
        <>
        <div className="h-[30vh] lg:h-[45vh] relative">

            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
                className="h-full w-full max-w-xl m-auto"
                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                initialSlide={currentIndex}
            >
                {images?.map((img, i) => (
                    <SwiperSlide key={i}>
                        <img
                            src={img}
                            alt={`Product ${i + 1}`}
                            className="object-contain w-full h-full"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute bottom-4 right-4 bg-gray-800 text-white text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-lg z-10">
                {currentIndex + 1}/{images?.length}
            </div>
        </div>
        <div className="flex justify-start gap-4 mt-4 flex-wrap">
                {images?.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-20 h-20 border-2 rounded overflow-hidden cursor-pointer ${currentIndex === index ? "border-[#F33E0A]" : "border-gray-300"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
        </>
        )
}

export default ImageSection