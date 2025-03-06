import Image from "next/image";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FaGavel } from "react-icons/fa";
import AuctionImg1 from '../../Assets/auctionimg4.png';
import AuctionImg4 from '../../Assets/auctionimg6.png';

import AuctionImg2 from '../../Assets/auctionimg3.png';
import AuctionImg3 from '../../Assets/auctionimg5.png';



// Dummy Data
const auctions = [
  { id: 1, title: "Auction Vintage Car", status: "Auction Ended", image: AuctionImg2 , price: null },
  { id: 2, title: "BMW M1 1965", status: "Starting Bid: $600.00", price: null, image: AuctionImg3  },
  { id: 3, title: "El Camino 1974", status: "Current Bid: $3,256.00",price: null, image: AuctionImg3  },
  { id: 4, title: "Vintage Gearbox", status: "Current Bid: $9,000.00",price: null, image: AuctionImg2  },
];

const auctions2 = [
  { id: 1, title: "Auction Vintage Car", status: "Auction Ended", image: AuctionImg2 , price: null },
  { id: 2, title: "BMW M1 1965", status: "Starting Bid: $600.00", price: null, image: AuctionImg3  },
  { id: 3, title: "El Camino 1974", status: "Current Bid: $3,256.00",price: null, image: AuctionImg3  },
  { id: 4, title: "Vintage Gearbox", status: "Current Bid: $9,000.00",price: null, image: AuctionImg2  },
];

export default function AuctionSection() {
  return (
  <>
   <div className="container  mx-auto flex justify-center p-6  gap-6">
      {/* Left Sidebar */}
      <div 
        className="relative w-1/7 text-white p-6 flex flex-col justify-between rounded-lg shadow-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${AuctionImg1.src})` }} >  
      </div>

      {/* Right Side Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/4">
        {auctions.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg flex space-x-4 hover:shadow-2xl transition">
            {/* Image Box */}
            <div className="w-28 h-full relative ">
              <Image src={item.image} alt={item.title} width={100} height={100} className="rounded-md h-full w-full object-cover" />
            </div>
            
            {/* Details */}
            <div className="flex flex-col justify-between">
              <h3 className="text-lg font-bold montserrat">{item.title}</h3>
              <p className="text-gray-600 text-sm montserrat">{item.status}</p>
              {item.price && <p className="text-red-600 font-semibold montserrat">{item.price}</p>}
              <div className="flex items-center space-x-2 mt-2">
              <button className="bg-[#F33E0A] p-2 rounded-full text-white"><FaGavel /></button>
              <button className="bg-gray-200 p-2 rounded-full"><CiSearch /></button>
              <button className="bg-gray-200 p-2 rounded-full"><CiHeart /></button>
            </div>
            </div>

            {/* Icons */}
            
          </div>
        ))}
      </div>
    </div>

    <div className="container mx-auto flex justify-center p-6  gap-6">
      {/* Left Sidebar */}
      <div 
        className="relative w-1/7 text-white p-6 flex flex-col justify-between rounded-lg shadow-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${AuctionImg4.src})` }} >  
      </div>

      {/* Right Side Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-3/4">
        {auctions.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg flex space-x-4 hover:shadow-2xl transition">
            {/* Image Box */}
            <div className="w-28 h-full relative ">
              <Image src={item.image} alt={item.title} width={100} height={100} className="rounded-md h-full w-full object-cover" />
            </div>
            
            {/* Details */}
            <div className="flex flex-col justify-between">
              <h3 className="text-lg font-bold montserrat">{item.title}</h3>
              <p className="text-gray-600 text-sm montserrat">{item.status}</p>
              {item.price && <p className="text-red-600 font-semibold montserrat">{item.price}</p>}
              <div className="flex items-center space-x-2 mt-2">
              <button className="bg-[#F33E0A] p-2 rounded-full text-white"><FaGavel /></button>
              <button className="bg-gray-200 p-2 rounded-full"><CiSearch /></button>
              <button className="bg-gray-200 p-2 rounded-full"><CiHeart /></button>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </> 
  );
}
