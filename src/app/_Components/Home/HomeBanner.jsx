import Link from "next/link";
import React from "react";
import MainImages from "../../../app/Assets/MainImages.png";
import Image from "next/image";


const HomeBanner = () => {
  return (
    <>
     <div className="container pt-[50px] mx-auto md:my-12 my-5 px-4 md:px-6 flex flex-col lg:flex-row gap-1 md:h-[60vh] h-auto">
  <div className="w-full lg:w-[33.8%] md:rounded-lg rounded-none rounded-l-none lg:rounded-l-lg overflow-hidden flex items-center">
    <div className="h-full w-full bg-[#D8D8D8] p-6 md:p-10 flex flex-col gap-4 text-left lg:rounded-none justify-center">
      <h1 className="roboto font-semibold text-center md:text-4xl text-2xl text-title-md md:text-headline-md tracking-tighter md:tracking-tightest text-[#0E0E0E] ">
        Browse, Shop & Save At Our Online Auction
      </h1>
      <p className="roboto text-body-md md:text-body-lg md:text-[20px] text-center text-[#7d7d7d]">
        Welcome to our site! Each week, we offer an exciting range of products, including restaurant equipment, home goods, groceries, electronics, and beauty items.
        <br />
        All products are sold as-is with no reserves, giving you a unique opportunity to save big. Don't let these incredible deals slip away—check out our live auction listings!
      </p>
    </div>
  </div>
  <div className="w-full lg:w-[66.15%] md:rounded-lg rounded-none lg:rounded-r-lg rounded-r-none  h-full">
    <Image
      src={MainImages}
      alt="Home Banner"
      className="w-full h-full"
    />
  </div>
</div>

    </>
  );
};

export default HomeBanner;
