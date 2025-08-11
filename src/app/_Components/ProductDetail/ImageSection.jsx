"use client"

import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import { Navigation, Pagination } from "swiper/modules"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import Image from "next/image"

const ImageSection = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const swiperRef = useRef(null)
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index)
    swiperRef.current?.slideTo(index)
  }

  const handleImageZoom = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <div className="space-y-4 p-4">
      {/* Main Image Carousel */}
      <div className="relative h-96 lg:h-[500px] bg-gray-50 rounded-xl overflow-hidden group">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-white !opacity-50",
            bulletActiveClass: "swiper-pagination-bullet-active !opacity-100",
          }}
          spaceBetween={0}
          slidesPerView={1}
          className="h-full w-full"
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          initialSlide={currentIndex}
        >
          {images?.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-full w-full cursor-zoom-in" onClick={handleImageZoom}>
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Product ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={20} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="cursor-pointer swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <button className="cursor-pointer swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-full">
          {currentIndex + 1} / {images?.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images?.map((img, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg cursor-pointer overflow-hidden border-2 transition-all duration-200 ${currentIndex === index ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-200"
              }`}
          >
            <Image
              src={img || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-cover hover:scale-110 transition-transform duration-200"
            />

          </button>
        ))}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={handleImageZoom}>
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt="Zoomed product"
              width={800}
              height={560}
              className="object-contain w-full h-auto"
            />

            <button
              onClick={handleImageZoom}
              className="absolute top-4  cursor-pointer right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageSection
