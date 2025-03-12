"use client"
// import { useProductDetailQuery } from '@/app/Services/products/page';
// import React from 'react'

// const ProductDetail = (id) => {
//     console.log(id?.id,'fffff')
//     const { data, error: isError, isLoading } = useProductDetailQuery(id.id);
//     console.log(data,"data");

//   return (


//     <>
//     {/* <div>{data.id}</div> */}
//     </>
//   )
// }

// export default ProductDetail


import React from 'react';
import { Clock, Calendar, ImageIcon, Heart } from 'lucide-react';
import { useAddWatchQuery, useProductDetailQuery } from '@/app/_Services/products/page';

// Mock data - replace with your actual data
const auctionData = {
  name: "Vintage Collection Artwork",
  description: "A rare collection of vintage artwork from the early 20th century. This unique piece showcases exceptional craftsmanship and historical significance.",
  startTime: "2024-03-20T10:00:00",
  endTime: "2024-03-25T18:00:00",
  images: [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=800"
  ]
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function App(id) {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isWatched, setIsWatched] = React.useState(false);

  const { data: addWatcher, error, isLoading:loding } = useAddWatchQuery(id.id);

  const { data, error: isError, isLoading } = useProductDetailQuery(id.id);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 relative group">
                <img
                  src={data?.data?.images[selectedImage]}
                  alt={`${data?.data?.name} - Image ${selectedImage + 1}`}
                  className="rounded-lg object-cover w-full h-[400px] "
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
                {data?.data?.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 transform transition-all duration-300 ${selectedImage === index
                        ? 'ring-2 ring-blue-500 scale-105'
                        : 'hover:scale-105 hover:shadow-md'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-20 w-20 object-cover rounded transition-all duration-300 hover:brightness-110"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Auction Details */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-300">
                {data?.data?.name}
              </h1>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Start Time</p>
                    <p className="text-lg">{formatDate(data?.data?.biddingStartTime)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">End Time</p>
                    <p className="text-lg">{formatDate(data?.data?.biddingEndTime)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <h2 className="text-xl font-semibold text-gray-900 4 hover:text-gray-700 transition-colors duration-300">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300">
                  {data?.data?.description}
                </p>
              </div>

              <div className="border-t border-gray-200 ">
                <h2 className="text-xl font-semibold text-gray-900  hover:text-gray-700 transition-colors duration-300">
                  Higest Bids
                </h2>
                <p className="text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300">
                  {data?.data?.highestBid}
                </p>
              </div>
              <div className="border-t border-gray-200 ">
                <h2 className="text-xl font-semibold text-gray-900 4 hover:text-gray-700 transition-colors duration-300">
                  Quantity
                </h2>
                <p className="text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300">
                  {data?.data?.quantity}
                </p>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;