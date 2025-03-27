import Link from "next/link";
import React from "react";
import MainImages from "../../../app/Assets/MainImages.png";
import Image from "next/image";

const HomeBanner = () => {
  return (
    <div className="container mx-auto pt-[50px] md:my-12 my-5 px-4 md:px-6">
      <div className="flex flex-col lg:flex-row gap-1 md:min-h-[50vh]">
        
        <div className="w-full lg:w-[40%] bg-[#D8D8D8] p-6 md:p-10 lg:p-12 flex flex-col gap-4 text-left justify-center rounded-lg">
          <h1 className="roboto font-semibold text-center md:text-4xl text-2xl text-title-md tracking-tight text-[#0E0E0E]">
            Browse, Shop & Save At Our Online Auction
          </h1>
          <p className="roboto text-body-md md:text-lg text-center text-[#7d7d7d]">
            Welcome to our site! Each week, we offer an exciting range of products, including restaurant equipment, home goods, groceries, electronics, and beauty items.
            <br />
            All products are sold as-is with no reserves, giving you a unique opportunity to save big. Don't let these incredible deals slip away—check out our live auction listings!
          </p>
        </div>

        <div className="w-full lg:w-[60%] rounded-lg overflow-hidden">
          <Image
            src={MainImages}
            alt="Home Banner"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default HomeBanner;
