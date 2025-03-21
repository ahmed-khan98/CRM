"use client"
import React, { useEffect, useState } from 'react';
import { Clock, Calendar, } from 'lucide-react';
import { useAddBidMutation, useAddWatchQuery, useProductDetailQuery } from '@/app/_Services/products/page';
import { ImHammer2 } from 'react-icons/im';
import toast from 'react-hot-toast';

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function App(id) {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const { data: addWatcher, error, isLoading: loding } = useAddWatchQuery(id.id);
  const { data, error: isError, isLoading } = useProductDetailQuery(id.id);
  const [addBid, { isLoading: isSubmitting }] = useAddBidMutation();
  const [bidValue, setBidValue] = useState(0);

  useEffect(() => {
    setBidValue(data?.data?.highestBid + 1)
  }, [data])

  // Handle bid input change
  const handleBidChange = (id, value) => {
    setBidValue(Number(value));
  };

  // Submit bid function
  const submitBid = async () => {
    if (bidValue <= data?.data?.highestBid) {
      toast.error("Bid amount must be greater than the highest bid!");
      return;
    }
    try {
      const response = await addBid({ id: data?.data?._id, bidAmount: bidValue }).unwrap();
      toast.success(response?.message);
      setBidValue(bidValue + 1)
      // router.replace(router.asPath);
    } catch (error) {
      toast.error(error.data?.message || "Failed to place bid");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          {/* Image Gallery */}
          {isLoading ? (
            <div className="animate-pulse flex space-x-6 p-2">
              {/* Left Side - Image Placeholder */}
              <div className="w-1/2 h-[400px] bg-gray-300 rounded-lg"></div>

              {/* Right Side - Details Placeholder */}
              <div className="w-1/2 space-y-4 pt-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded w-full"></div>
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          ) : (
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

                  <p
                    dangerouslySetInnerHTML={{ __html: data?.data?.description }}
                    className="text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300"
                  />
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
                {data?.data?.isSold ? <button
                  className={`bg-green-600 cursor-pointer w-full text-white px-4 py-2 rounded hover:bg-green-500 flex items-center justify-center `}
                >
                  Sold
                </button> :
                  <div className="mt-3 flex">
                    <input
                      type="text"
                      className="w-1/2 px-3 py-2 bg-[#EBEBEB] text-center montserrat outline-none 
                             appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                             [&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(e) => handleBidChange(data?.data?._id, e.target.value)}
                      value={bidValue}
                    />
                    <button
                      disabled={bidValue <= data?.data?.highestBid || isSubmitting}
                      onClick={() => submitBid(data?.data?._id)}
                      className={`w-1/2 cursor-pointer  montserrat text-white py-2 flex items-center justify-center space-x-2
                                      ${Number(bidValue) > Number(data?.data?.highestBid) ? 'bg-[#F33E0A] hover:bg-[#d63006]' : 'bg-gray-400 cursor-not-allowed'}
                                  `}
                    >
                      <ImHammer2 className="transform rotate-80" />
                      <span>{isSubmitting ? "Submitting..." : "Submit BID"}</span>
                    </button>
                  </div>}

              </div>
            </div>)}
        </div>
      </div>
    </div>
  );
}

export default App;