import Image from "next/image";
import mobile from '../Assets/auctionimg1.png';
import mobile2 from '../Assets/auctionimg2.png';

import { ImHammer2 } from "react-icons/im";
import { CiHeart, CiSearch, CiShare2 } from "react-icons/ci";

const auctionData = [
  {imgUrl:mobile, id: 1, watchers: 8, qty: 1, retail: 3000, bids: 3, currentBid: 10 },
  { imgUrl:mobile2,id: 2, watchers: 5, qty: 1, retail: 2500, bids: 5, currentBid: 15 },
  { imgUrl:mobile,id: 3, watchers: 12, qty: 1, retail: 4000, bids: 7, currentBid: 20 },
  { imgUrl:mobile2,id: 4, watchers: 3, qty: 1, retail: 1500, bids: 2, currentBid: 5 },
];

export default function AuctionList() {
  return (
    <div className=" bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 container mx-auto p-6">
      
      {auctionData.map((item) => (
        <div key={item.id} className="relative  shadow-lg  bg-white ">

         

          {/* Image and Icons */}
          <div className="relative">
            <Image src={item.imgUrl} alt="Product" className="w-full h-full object-cover" />

            {/* Icons */}
            <div className="absolute top-0 left-3 h-[30px] w-[30px] bg-[#F33E0A] shadow-2xl rounded-full flex items-center justify-center">
              <CiShare2 className="text-white text-lg" />
            </div>
            <div className="absolute top-10 left-3 h-[30px] w-[30px] bg-white shadow-xl rounded-full flex items-center justify-center">
              <CiHeart className="text-black text-lg" />
            </div>
            <div className="absolute top-20 left-3 h-[30px] w-[30px] bg-white shadow-2xl rounded-full flex items-center justify-center">
              <CiSearch className="text-black text-lg" />
            </div>
          </div>

          {/* Timer */}
          <div className="bg-white shadow-xl w-[90%] mx-auto text-center py-2 rounded -mt-[60px] relative z-1">
            <p className="text-sm font-semibold montserrat">Time left:</p>
            <div className="flex justify-center space-x-4 text-lg font-bold">
              <div className="flex flex-col items-center">
                <span>5</span>
                <span className="text-xs font-normal montserrat">Days</span>
              </div>
              <div className="flex flex-col items-center">
                <span>14</span>
                <span className="text-xs font-normal montserrat">Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <span>53</span>
                <span className="text-xs font-normal montserrat">Minutes</span>
              </div>
              <div className="flex flex-col items-center">
                <span>3</span>
                <span className="text-xs font-normal montserrat">Seconds</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-3 text-sm px-6">
            <div className="flex justify-between montserrat">
              <p><strong>Qty:</strong></p>
              <p>{item.qty}</p>
            </div>
            <div className="flex justify-between montserrat">
              <p><strong>Est Retail:</strong></p>
              <p className="text-gray-600">${item.retail}</p>
            </div>
            <div className="flex justify-between montserrat">
              <p><strong>#Bids:</strong></p>
              <p>{item.bids}</p>
            </div>
          </div>

          {/* Current Bid */}
          <div className="bg-gray-200 text-center text-sm py-2 mt-2 montserrat">
            Current Bid: <strong>${item.currentBid}</strong>
          </div>

          <p className="text-center text-gray-500 text-xs mt-2 montserrat">Lorem Ipsum is simply dummy</p>

          {/* Bid Button */}
          <div className="mt-3 flex">
            <div className="w-1/2 px-3 py-2 bg-[#EBEBEB] text-center montserrat">${item.currentBid}</div>
            <button className="w-1/2 bg-[#F33E0A] montserrat text-white py-2 hover:bg-[#d63006] flex items-center justify-center space-x-2">
              <ImHammer2 className="transform rotate-80" />
              <span>Submit BID</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
