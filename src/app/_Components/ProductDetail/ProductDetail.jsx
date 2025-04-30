"use client"
import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import { useState } from "react";
import { useAddBidMutation, useAddWatchQuery, useProductDetailQuery } from '@/app/_Services/products/page';
import { ImHammer2 } from 'react-icons/im';
import toast from 'react-hot-toast';
import DetailLoader from '../Skeleton/DetailLoader';
import { FaHeart, FaStar } from 'react-icons/fa';
import { IoIosShareAlt } from "react-icons/io";
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useAddWishlistMutation, useDeleteWishlistMutation } from '@/app/_Services/wishlist/page';
import { CiHeart } from 'react-icons/ci';
import Loader from '../Loader';
import { Check, Copy } from 'lucide-react'; // Optional: if you use icons
import { Rating } from 'react-simple-star-rating';


function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

const ProductDetail = (id) => {

  const [addBid, { isLoading: isSubmitting }] = useAddBidMutation();
  const [bidValue, setBidValue] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  const { data: addWatcher, error, isLoading: loding } = useAddWatchQuery(id.id);
  const { data, error: isError, isLoading: isDetailLoading } = useProductDetailQuery(id.id);
  const [visibleBidsHistory, setVisibleBidsHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [addWishlist] = useAddWishlistMutation();
  const [deleteWishlist] = useDeleteWishlistMutation();
  const [loading, setLoading] = useState(false);
  const maxLength = 300;
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (value, index) => {
    navigator.clipboard.writeText(value || '').then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  };

  const isLong = data?.data?.shortDescription?.length > maxLength;
  const displayedText = showFull ? data?.data?.shortDescription : data?.data?.shortDescription?.slice(0, maxLength);
  const [activeTab, setActiveTab] = useState("item_spec");

  const tabs = [
    { key: "item_spec", label: "Item Spec", color: "bg-red-500" },
    { key: "shipping", label: "Shipping", color: "bg-gray-500" },
    { key: "details", label: "More Info", color: "bg-green-500" },
  ];

  useEffect(() => {
    setBidValue(data?.data?.highestBid + 1)
  }, [data])

  // Handle bid input change
  const handleBidChange = (id, value) => {
    setBidValue(Number(value));
  };

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

  useEffect(() => {
    setVisibleBidsHistory(data?.data?.biddingHistory?.slice(0, 4))
  }, [data])

  const toggleBidHistory = () => {
    if (showAll) {
      setVisibleBidsHistory(data?.data?.biddingHistory?.slice(0, 4));
    } else {
      setVisibleBidsHistory(data?.data?.biddingHistory);
    }
    setShowAll(!showAll);
  };

  const token = Cookies.get("token");


  useEffect(() => {
    if (!data?.data?.isSold) {
      const highestBidderId = data?.data?.highestBidder;
      const biddingHistory = data?.data?.biddingHistory;

      if (highestBidderId && Array.isArray(biddingHistory)) {
        const matchedBidder = biddingHistory.find(bid => bid.bidder._id === highestBidderId);

        console.log("highestBidderId", highestBidderId);
      }
    }
  }, [data]);


  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    swiperRef.current?.slideTo(index);
  };

  const toggleWishlist = async (id, isWishlisted) => {
    setLoading(true);
    try {
      if (isWishlisted) {
        const response = await deleteWishlist(id).unwrap();
        toast.success(response.message);
      } else {
        const response = await addWishlist(id).unwrap();
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <>

      {
        isDetailLoading ? <DetailLoader /> :
          <div className="pt-[80px] grid grid-cols-1 my-4 sm:grid-cols-[minmax(0,_0.75fr)_minmax(0,_1fr)] sm:gap-6 max-w-full sm:max-w-screen-xl mx-auto">

            <div className="max-w-full my-6 px-6 sm:px-2.5 xl:px-0">
              <div className="flex justify-end gap-4">
                <div
                  onClick={() => toggleWishlist(data?.data?._id, data?.data?.isWishlisted)}
                  className="cursor-pointer h-[30px] w-[30px] bg-white shadow-xl rounded-full flex items-center justify-center"
                >
                  {loading ? (
                    <Loader />
                  ) : data?.data?.isWishlisted ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <CiHeart className="text-black text-lg" />
                  )}
                </div>
                <button className="bg-blue-500  cursor-pointer w-20 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center justify-center">
                  Share <IoIosShareAlt color="white" size={18} />
                </button>
              </div>


              <div className="h-[30vh] lg:h-[45vh] relative">

                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={20}
                  slidesPerView={1}
                  className="h-full w-full max-w-xl m-auto"
                  onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  initialSlide={currentIndex}
                >
                  {data?.data?.images?.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        alt={`Product ${i + 1}`}
                        className="object-contain w-full h-full"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="absolute bottom-4 right-4 bg-gray-800 text-white text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-lg z-10">
                  {currentIndex + 1}/{data?.data?.images?.length}
                </div>
              </div>

              <div className="flex justify-start gap-4 mt-4 flex-wrap">
                {data?.data?.images?.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-20 h-20 border-2 rounded overflow-hidden cursor-pointer ${currentIndex === index ? "border-[#F33E0A]" : "border-gray-300"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                {/* Tab Buttons */}
                <div className="flex gap-1 mb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-2 py-1 font-semibold flex w-[33%] items-center justify-center rounded-tl-lg rounded-tr-lg text-white cursor-pointer ${activeTab === tab.key
                        ? `border-1 border-black ${tab.color}`
                        : `${tab.color}`
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex flex-col gap-1">
                  {data?.data?.[activeTab]?.map((e, i) => {
                    const isASIN = e?.name === 'ASIN';
                    const displayValue = isASIN ? e?.code : e?.value;

                    return (
                      <div className="flex gap-2" key={i}>
                        <div className="w-[35%] bg-[#a6a6a6] p-3 flex items-center">
                          <p className="uppercase font-semibold roboto text-sm">{e?.name}</p>
                        </div>
                        <div className="w-[65%] bg-[#d9d9d9] p-3 flex items-center justify-between">
                          <p className="font-semibold  break-words">{displayValue}</p>

                          {isASIN && (
                            <button
                              onClick={() => handleCopy(e?.value, i)}
                              className={`ml-2 flex items-center gap-1 text-xs px-2 py-1 rounded transition-all 
                    ${copiedIndex === i ? 'bg-green-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-900'}
                  `}
                            >
                              {copiedIndex === i ? (
                                <>
                                  <Check size={14} /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={14} /> Copy
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            <div className="flex flex-col gap-y-8">
              <h1 className="  mt-6 p-4  sm:px-0 text-left text-2xl capitalize font-bold text-title-md sm:text-title-lg">
                {data?.data?.name}
              </h1>



              {/* Quality */}
              <div className="flex flex-col gap-y-6 bg-white rounded-md p-4 sm:mr-4 xl:mr-0">
                <div className='text-center'>
                  <div className='flex justify-center'>
                    <p className=" font-normal uppercase my-1  py-2 text-title-xs bg-[#f4e405] w-30 ">
                      Quality
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 my-3">
                    <div className="flex justify-center items-center">
                      
                      <Rating
                        size='25'
                        SVGstyle={{ display: 'inline-block' }}
                        initialValue={data?.data?.rating ?? 0}
                      />
                    </div>
                  </div>
                  {data?.data?.tag?.length > 0 && (
                    <div className="flex items-center justify-start gap-2 flex-wrap">
                      {data?.data?.tag.map((tag, index) => (
                        <div key={index} className="max-w-100 whitespace-nowrap flex items-center justify-center h-8 bg-[#7ed957] text-gray-800 rounded-2xl">
                          <span className="px-3  whitespace-nowrap overflow-hidden text-ellipsis">
                            {tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className=" font-semibold uppercase mt-2  py-2 text-title-xs text-center">
                    Item Description
                  </p>
                  <p className=" font-normal py-2 text-title-xs text-left bg-[#d9d9d9] p-2 ">
                    {displayedText}
                    {isLong && !showFull && "... "}
                    {isLong && (
                      <span
                        onClick={() => setShowFull(!showFull)}
                        className="text-[#F33E0A] cursor-pointer font-medium"
                      >
                        {showFull ? " See less" : " See more"}
                      </span>
                    )}
                  </p>
                </div>



                {/* {(data?.data?.address1 || data?.data?.address2) && (
                  <div>
                    <p className="text-left  font-bold uppercase mb-1 text-title-xs">
                      {data?.data?.address1}
                    </p>
                    {data?.data?.address2 && <p className="text-left ">{data?.data?.address2}</p>}
                  </div>
                )} */}


                <div className="flex flex-col gap-2">
                  {/* Row 1 */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#a6a6a6] p-3 flex items-center justify-between">
                      <p className="uppercase font-semibold roboto text-sm">Estimated Retail</p>
                    </div>
                    <div className="flex-1 bg-[#d9d9d9]  p-3 flex items-center justify-between">
                      <p className="font-semibold ">${data?.data?.retail}</p>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#a6a6a6] p-3 flex items-center justify-between">
                      <p className="uppercase font-semibold roboto text-sm">Current Price</p>
                    </div>
                    <div className="flex-1 bg-[#d9d9d9]  p-3 flex items-center justify-between">
                      <p className="font-semibold ">${data?.data?.price}</p>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#a6a6a6] p-3 flex items-center justify-between">
                      <p className="uppercase font-semibold roboto text-sm">Buyers Premium</p>
                    </div>
                    <div className="flex-1 bg-[#d9d9d9]  p-3 flex items-center justify-between">
                      <p className="font-semibold ">{data?.data?.buyerPremium.includes('%') ? data?.data?.buyerPremium : `${data?.data?.buyerPremium}%`   } </p>
                    </div>
                  </div>
                </div>
                {data?.data?.isSold ? (
                  <button className="bg-green-600  cursor-pointer w-full text-white px-4 py-2 rounded hover:bg-green-500 flex items-center justify-center">
                    Sold
                  </button>
                ) : token ? (
                  <div className="mt-1 flex">
                    <input
                      type="text"
                      className="w-1/2 px-3 py-2 bg-[#EBEBEB] text-center  outline-none 
                 appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                 [&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(e) => handleBidChange(data?.data?._id, e.target.value)}
                      value={bidValue}
                    />
                    <button
                      disabled={bidValue <= data?.data?.highestBid || isSubmitting}
                      onClick={() => submitBid(data?.data?._id)}
                      className={`w-1/2 cursor-pointer  text-white py-2 flex items-center justify-center space-x-2
                 ${Number(bidValue) > Number(data?.data?.highestBid) ? 'bg-[#F33E0A] hover:bg-[#d63006]' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      {/* <ImHammer2 className="transform rotate-80" /> */}
                      <span>{isSubmitting ? "Submitting..." : "Submit BID"}</span>
                    </button>
                  </div>
                ) : (
                  <button className="bg-[#f44b0a]  cursor-pointer w-full text-white px-4 py-2 rounded hover:bg-[#f44b0a]  flex items-center justify-center">
                    <Link href={"/login"}>Login to Bid</Link>
                  </button>
                )}
              </div>
              {data?.data?.biddingHistory?.length > 0 &&
                <div className="bg-white shadow-lg rounded-md sm:p-4 sm:mr-4 xl:mr-0">
                  <div className="flex justify-between px-4 sm:px-0 pt-4 sm:pt-0">
                    <p className="  text-left font-bold uppercase mb-1 text-title-xs">
                      Bid History
                    </p>
                  </div>
                  <div>

                    {visibleBidsHistory?.map((e, i) => (
                      <div
                        key={e._id}
                        className={`py-2 border-b border-b-gray-400 ${i == '0' && data?.data?.isSold ? 'bg-emerald-100' : ''}`}
                      >
                        <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_0.5fr)] md:grid-cols-5 justify-items-start items-center px-4 sm:px-3 py-1 rounded ">
                          <p className="text-label-md text-left ">Bidder no {data?.data?.biddingHistory?.length - i}</p>
                          <p className="text-label-md  text-left md:justify-self-center">
                            {e.bidder.username}
                          </p>
                          <p className="text-label-md  text-left col-start-1 md:col-start-3 md:justify-self-center">
                            ${e.bidAmount}
                          </p>
                          <p className="text-label-md  text-left whitespace-nowrap">
                            {new Date(e.createdAt).toLocaleString()}
                          </p>

                        </div>
                      </div>
                    ))}
                  </div>
                  {data?.data?.biddingHistory?.length > 4 &&
                    <button onClick={toggleBidHistory} className="w-full cursor-pointer flex justify-between py-2 px-4 md:px-0">
                      <p className="uppercase text-burgundy-900 font-semibold">
                        {showAll ? "View Less" : `View ${data?.data?.biddingHistory?.length - 4} more bids`}
                      </p>
                      {showAll ? (
                        <svg width="24" height="24" className="fill-burgundy-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M246.6 105.4c6.2-6.2 16.4-6.2 22.6 0l192 192c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L256 139.3 73.4 320c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l192-192z" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" className="fill-burgundy-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M267.3 395.3c-6.2 6.2-16.4 6.2-22.6 0l-192-192c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L256 361.4 436.7 180.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-192 192z" />
                        </svg>
                      )}
                    </button>}
                </div>}
            </div>
          </div>
      }
    </>
  )
}

export default ProductDetail


{/* Current Price Section */ }
{/* <div className="rounded-md bg-white shadow-lg grid grid-cols-1 xl:grid-cols-2 items-center gap-2.5 py-2.5 px-4 bid-message-slide-up">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-start gap-2">
                    <p className="uppercase font-semibold text-left ">Current Price :</p>
                    <div className="text-left ">${data?.data?.price}</div>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <p className="uppercase font-semibold text-left ">Start Time :</p>
                    <div className="text-left text-gray-900 ">{formatDate(data?.data?.biddingStartTime)}</div>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <p className="uppercase font-semibold text-left ">End Time :</p>
                    <div className="text-left ">{formatDate(data?.data?.biddingEndTime)}</div>
                  </div>
                </div>

                {data?.data?.isSold ? (
                  <button className="bg-green-600  cursor-pointer w-full text-white px-4 py-2 rounded hover:bg-green-500 flex items-center justify-center">
                    Sold
                  </button>
                ) : token ? (
                  <div className="mt-3 flex">
                    <input
                      type="text"
                      className="w-1/2 px-3 py-2 bg-[#EBEBEB] text-center  outline-none 
                 appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                 [&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(e) => handleBidChange(data?.data?._id, e.target.value)}
                      value={bidValue}
                    />
                    <button
                      disabled={bidValue <= data?.data?.highestBid || isSubmitting}
                      onClick={() => submitBid(data?.data?._id)}
                      className={`w-1/2 cursor-pointer  text-white py-2 flex items-center justify-center space-x-2
                 ${Number(bidValue) > Number(data?.data?.highestBid) ? 'bg-[#F33E0A] hover:bg-[#d63006]' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      <ImHammer2 className="transform rotate-80" />
                      <span>{isSubmitting ? "Submitting..." : "Submit BID"}</span>
                    </button>
                  </div>
                ) : (
                  <button className="bg-green-600  cursor-pointer w-full text-white px-4 py-2 rounded hover:bg-green-500 flex items-center justify-center">
                    <Link href={"/login"}>Login to Bid</Link>
                  </button>
                )}
              </div> */}


{/* wining section */ }
{/* <div className="flex  xxs:flex-row bg-neutral-200 gap-7 p-3 rounded-md w-fit mt-4 justify-self-center md:justify-self-start mx-auto sm:mx-0 mb-4 sm:mb-0">
                  <span className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      height={16}
                      width={16}
                      className="fill-gray-700"
                    >
                      <path d="M32 32a32 32 0 1 1 64 0A32 32 0 1 1 32 32zM448 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32 256a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM167 153c-9.4-9.4-9.4-24.6 0-33.9l8.3-8.3c16.7-16.7 27.2-38.6 29.8-62.1l3-27.4C209.6 8.2 221.5-1.3 234.7 .1s22.7 13.3 21.2 26.5l-3 27.4c-3.8 34.3-19.2 66.3-43.6 90.7L201 153c-9.4 9.4-24.6 9.4-33.9 0zM359 311l8.2-8.3c24.4-24.4 56.4-39.8 90.7-43.6l27.4-3c13.2-1.5 25 8 26.5 21.2s-8 25-21.2 26.5l-27.4 3c-23.5 2.6-45.4 13.1-62.1 29.8L393 345c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9zM506.3 8.5c8.6 10.1 7.3 25.3-2.8 33.8l-10 8.5c-14.8 12.5-33.7 19.1-53 18.6c-16.6-.4-30.6 12.4-31.6 29l-1.8 30c-2.5 42.5-38.3 75.3-80.8 74.2c-7.6-.2-15 2.4-20.7 7.3l-10 8.5c-10.1 8.6-25.3 7.3-33.8-2.8s-7.3-25.3 2.8-33.8l10-8.5c14.8-12.5 33.7-19.1 53-18.6c16.6 .4 30.6-12.4 31.6-29l1.8-30c2.5-42.5 38.3-75.3 80.8-74.2c7.6 .2 15-2.4 20.7-7.3l10-8.5c10.1-8.6 25.3-7.3 33.8 2.8zM150.6 201.4l160 160c7.7 7.7 11 18.8 8.6 29.4s-9.9 19.4-20 23.2l-39.7 14.9L83.1 252.5 98 212.8c3.8-10.2 12.6-17.7 23.2-20s21.7 1 29.4 8.6zM48.2 345.6l22.6-60.2L226.6 441.2l-60.2 22.6L48.2 345.6zM35.9 378.5l97.6 97.6L43.2 510c-11.7 4.4-25 1.5-33.9-7.3S-2.4 480.5 2 468.8l33.8-90.3z" />
                    </svg>
                    <p className="text-label-sm ">Winning</p>
                  </span>
                  <span className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      height={16}
                      width={16}
                      className="fill-gray-700"
                    >
                      <path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z" />
                    </svg>
                    <p className="text-label-sm ">Outbid</p>
                  </span>
                  <span className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      height={16}
                      width={16}
                      className="fill-gray-700"
                    >
                      <path d="M176 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h16V98.4C92.3 113.8 16 200 16 304c0 114.9 93.1 208 208 208s208-93.1 208-208c0-41.8-12.3-80.7-33.5-113.2l24.1-24.1c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L355.7 143c-28.1-23-62.2-38.8-99.7-44.6V64h16c17.7 0 32-14.3 32-32s-14.3-32-32-32H224 176zm72 192V320c0 13.3-10.7 24-24 24s-24-10.7-24-24V192c0-13.3 10.7-24 24-24s24 10.7 24 24z" />
                    </svg>
                    <p className="text-label-sm ">Time Extended</p>
                  </span>
                </div> */}