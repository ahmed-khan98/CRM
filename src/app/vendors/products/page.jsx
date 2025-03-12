import Link from "next/link";
import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import Cards from '../../_Components/Vendors/cards'
const page = () => {
  return (
   <div className="w-2/2">

    <Cards />
     <div className="flex flex-col items-center justify-center  text-center">
     
     <Link href={"/vendors/addproducts"}>
     <button className=" bg-[#F33E0A] mt-5 text-white px-5 py-2 cursor-pointer flex items-center space-x-2  transition">
        <FaBoxOpen className="text-lg" />
        <span>ADD NEW PRODUCT</span>
      </button>
     </Link>
    </div>
   </div>
  );
};

export default page;
