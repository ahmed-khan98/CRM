import Link from "next/link";
import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const page = () => {
  return (
   <div className="w-2/2">
     <div className="flex flex-col items-center justify-center  text-center">
      <div className="bg-green-100 p-6 rounded-full">
        <FaBoxOpen className="text-4xl text-green-500" />
      </div>
      <h2 className="text-lg font-semibold mt-4">No Products Found!</h2>
      <p className="text-gray-600 mt-1">Ready to start selling something awesome?</p>
     <Link href={"/vendors/addproducts"}>
     <button className="mt-4 bg-[#F33E0A] text-white px-5 py-2 cursor-pointer flex items-center space-x-2  transition">
        <FaBoxOpen className="text-lg" />
        <span>ADD NEW PRODUCT</span>
      </button>
     </Link>
    </div>
   </div>
  );
};

export default page;
