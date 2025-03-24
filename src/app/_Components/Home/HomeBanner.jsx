import Link from "next/link";
import React from "react";

const HomeBanner = () => {
  return (
    <>
      <div className="container mx-auto md:my-12 my-10  mt-5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex flex-col lg:flex-row gap-1 md:h-[60vh] h-auto">
        <div className="w-full lg:w-[33.85%] md:rounded-lg rounded-none rounded-l-none lg:rounded-l-lg overflow-hidden flex items-center">
          <div className="h-full w-full bg-neutral-800 p-6 md:p-10 flex flex-col gap-4 text-left  lg:rounded-none justify-center">
            <h1 className=" montserrat font-light text-center md:text-4xl text-2xl text-title-md md:text-headline-md tracking-tighter md:tracking-tightest text-white">
            Browse, Shop & Save At Our Online Auction
            </h1>
            <p className=" montserrat text-body-md md:text-body-lg md:text-[20px] text-center text-white">
            Welcome to our site! Each week, we offer an exciting range of products, including restaurant equipment, home goods, groceries, electronics, and beauty items.
<br />
All products are sold as-is with no reserves, giving you a unique opportunity to save big. Don't let these incredible deals slip away—check out our live auction listings!
            </p>
           
          </div>
        </div>
        <div className="w-full lg:w-[66.15%] md:rounded-lg rounded-none lg:rounded-r-lg rounded-r-none overflow-hidden grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid-rows-6 md:grid-flow-col gap-px h-full">
          <div className="row-span-2 relative">
            <img src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg" alt="Home & Household Essentials" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-2 relative">
            <img src="https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg" alt="Clothing, Shoes & Accessories" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-2 relative">
            <img src="https://images.pexels.com/photos/191360/pexels-photo-191360.jpeg" alt="Baby" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-3 relative">
            <img src="https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg" alt="Electronics" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-3 relative">
            <img src="https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg" alt="Home Improvement" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-2 relative">
            <img src="https://images.pexels.com/photos/7658756/pexels-photo-7658756.jpeg" alt="Patio & Garden" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-2 relative">
            <img src="https://images.pexels.com/photos/5928036/pexels-photo-5928036.jpeg" alt="Beauty & Personal Care" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-2 relative">
            <img src="https://images.pexels.com/photos/213162/pexels-photo-213162.jpeg" alt="Furniture & Appliances" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-3 relative">
            <img src="https://images.pexels.com/photos/257970/pexels-photo-257970.jpeg" alt="Outdoors & Sports" className="h-full w-full object-cover cursor-pointer" />
          </div>
          <div className="row-span-3 relative">
            <img src="https://images.pexels.com/photos/12833286/pexels-photo-12833286.jpeg" alt="Pool" className="h-full w-full object-cover cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
