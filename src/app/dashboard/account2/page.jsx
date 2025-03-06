import React from 'react'
import { FaChartLine, FaEye, FaGavel } from 'react-icons/fa'

const page = () => {
  return (
    <>
       <div className="w-2/2  px-3">
        <div className=" bg-white">

       <p className="text-gray-700">
         Hello <span className="font-bold">sohailaqueel</span> (not sohailaqueel?{" "}
         <a href="#" className="text-blue-600 hover:underline">
           Log out
         </a>
         )
       </p>

      
       <p className="text-gray-600 mt-2">
         From your account dashboard you can view your{" "}
         <a href="#" className="text-blue-600 hover:underline">
           recent orders
         </a>
         , manage your{" "}
         <a href="#" className="text-blue-600 hover:underline">
           shipping and billing addresses
         </a>
         , and edit your{" "}
         <a href="#" className="text-blue-600 hover:underline">
           password
         </a>{" "}
         and{" "}
         <a href="#" className="text-blue-600 hover:underline">
           account details
         </a>
         .
       </p>

      
       <h2 className="text-xl font-bold mt-6">Auction Quick Links</h2>
       <div className="grid grid-cols-3 gap-4 mt-4">
         <div className="border border-[#DDDDDD] p-4 text-center  cursor-pointer">
           <FaGavel className="text-2xl mx-auto mb-2" />
           <p className="font-semibold">My Auction Bids</p>
         </div>
         <div className="border border-[#DDDDDD] p-4 text-center cursor-pointer">
           <FaEye className="text-2xl mx-auto mb-2" />
           <p className="font-semibold">My Watchlist</p>
         </div>
         <div className="border border-[#DDDDDD] p-4 text-center cursor-pointer">
           <FaChartLine className="text-2xl mx-auto mb-2" />
           <p className="font-semibold">My Auction Activity</p>
         </div>
       </div>

     
       <div className="border border-[#DDDDDD] p-4 mt-6 flex items-center justify-between">
   <div>
     <p className="font-bold">Become a Vendor</p>
     <p className="text-gray-600 text-sm">
       Vendors can sell products and manage a store with a vendor dashboard.
     </p>
   </div>
   <button className="bg-[#2C3E50] text-white px-4 py-2 text-sm">
     Become a Vendor
   </button>
 </div>

     </div> 
     </div>
   </>
  )
}

export default page