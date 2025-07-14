"use client"
import { useState } from "react"
import { useAddWatchQuery, useProductDetailQuery, useRelatedProductsQuery } from "@/app/_Services/products/page"
import toast from "react-hot-toast"
import DetailLoader from "../Skeleton/DetailLoader"
import { FaHeart } from "react-icons/fa"
import { IoIosShareAlt } from "react-icons/io"
import { useAddWishlistMutation, useDeleteWishlistMutation } from "@/app/_Services/wishlist/page"
import { CiHeart } from "react-icons/ci"
import Loader from "../Loader"
import BiddingHistory from "./BiddingHistory"
import DetailPageTab from "./DetailPageTab"
import ImageSection from "./ImageSection"
import ProductInfo from "./ProductInfo"
import AuctionCardSkeleton from "../Skeleton/CardSkeleton"
import ProductCard from "../Card/ProductCard"

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const ProductDetail = (id) => {
  const { data: addWatcher, error, isLoading: loding } = useAddWatchQuery(id.id)
  const { data, error: isError, isLoading: isDetailLoading } = useProductDetailQuery(id.id)
  const { data: relatedProduct, error: relatedError, isLoading: isRelatedLoading } = useRelatedProductsQuery(id.id)

  const [addWishlist] = useAddWishlistMutation()
  const [deleteWishlist] = useDeleteWishlistMutation()
  const [loading, setLoading] = useState(false)

  const toggleWishlist = async (id, isWishlisted) => {
    setLoading(true)
    try {
      if (isWishlisted) {
        const response = await deleteWishlist(id).unwrap()
        toast.success(response.message)
      } else {
        const response = await addWishlist(id).unwrap()
        toast.success(response.message)
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong")
    }
    setLoading(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.data?.name,
          text: `Check out this auction item: ${data?.data?.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <>
      {isDetailLoading ? (
        <DetailLoader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          {/* Header Section */}
          <div className="pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <span>Home</span>
                <span>/</span>
                <span>Auctions</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{data?.data?.name}</span>
              </nav>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column - Images */}
                <div className="space-y-4">
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => toggleWishlist(data?.data?._id, data?.data?.isWishlisted)}
                      className="group relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      {loading ? (
                        <Loader />
                      ) : data?.data?.isWishlisted ? (
                        <FaHeart className="text-red-500 text-xl group-hover:scale-110 transition-transform" />
                      ) : (
                        <CiHeart className="text-gray-700 text-xl group-hover:scale-110 transition-transform" />
                      )}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>

                    <button
                      onClick={handleShare}
                      className="group flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300"
                    >
                      <IoIosShareAlt className="text-lg group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>

                  {/* Image Section */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <ImageSection images={data?.data?.images} />
                  </div>

                  {/* Tabs Section */}
                  <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <DetailPageTab data={data?.data} />
                  </div>
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <ProductInfo
                      name={data?.data?.name}
                      rating={data?.data?.rating}
                      tag={data?.data?.tag}
                      retail={data?.data?.retail}
                      condition={data?.data?.condition}
                      price={data?.data?.price}
                      buyerPremium={data?.data?.buyerPremium}
                      shortDescription={data?.data?.shortDescription}
                      remainingAuctionTime={data?.data?.remainingAuctionTime}
                      isSold={data?.data?.isSold}
                      id={data?.data?._id}
                      highestBid={data?.data?.highestBid}
                      isAuctionActive={data?.data?.isAuctionActive}
                    />
                  </div>

                  {/* Bidding History */}
                  {data?.data?.biddingHistory?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <BiddingHistory history={data?.data?.biddingHistory} isSold={data?.data?.isSold} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="py-16">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Related Auctions</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover more amazing items similar to what you're viewing
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isRelatedLoading ? (
                  [...Array(4)].map((_, index) => <AuctionCardSkeleton key={index} />)
                ) : !relatedProduct?.data?.length || relatedError ? (
                  <div className="col-span-4 flex flex-col items-center justify-center py-16">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Related Products</h3>
                    <p className="text-gray-500">We couldn't find any similar items at the moment.</p>
                  </div>
                ) : (
                  relatedProduct?.data?.map((item, index) => (
                    <ProductCard key={item.id ?? `auction-${index}`} item={item} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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