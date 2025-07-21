"use client"
import { useState, useEffect } from "react"

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
import { useProductSocket } from "@/app/hooks/useSocket"
import { useProductDetailQuery } from "@/app/_Services/products/page"

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const ProductDetail = ({ id }) => {
  const { data, error: isError, isLoading: isDetailLoading } = useProductDetailQuery(id)
  const { socket, isConnected, error } = useProductSocket(id)

  const [addWishlist] = useAddWishlistMutation()
  const [deleteWishlist] = useDeleteWishlistMutation()
  const [loading, setLoading] = useState(false)
  const [realTimeData, setRealTimeData] = useState(null)
  // Use real-time data if available, otherwise use RTK Query data
  const productData = data

  // useEffect(() => {
  //   if (socket && isConnected) {
  //     // Listen for real-time updates

  //     socket.emit(`product-auction-start-${id}`)
  //     socket.emit(`product-auction-end-${id}`)
  //     socket.emit(`product-bid-${id}`)
  //     socket.emit(`product-sold-${id}`)

  //     socket.on(`product-auction-start-${id}`, (updatedProduct) => {
  //       console.log(updatedProduct, 'product-start-end')

  //       setRealTimeData((prev) => ({
  //         ...prev,
  //         data: updatedProduct,
  //       }))
  //     })
  //     socket.on(`product-auction-end-${id}`, (updatedProduct) => {
  //       console.log(updatedProduct, 'product-auction-end')
  //       setRealTimeData((prev) => ({
  //         ...prev,
  //         data: updatedProduct,
  //       }))
  //     })
  //     socket.on(`product-bid-${id}`, (updatedProduct) => {
  //       console.log(updatedProduct, 'product-bid')

  //       setRealTimeData((prev) => ({
  //         ...prev,
  //         data: updatedProduct,
  //       }))
  //     })
  //     socket.on(`product-sold-${id}`, (updatedProduct) => {
  //       console.log(updatedProduct, 'product-sold')
  //       setRealTimeData((prev) => ({
  //         ...prev,
  //         data: updatedProduct,
  //       }))
  //     })

  //     return () => {
  //       socket.off(`product_${id}_updated`)
  //       socket.off(`product_${id}_bid_placed`)
  //       socket.off(`product_${id}_auction_status`)
  //       socket.off(`product_${id}_watch_updated`)
  //     }
  //   }
  // }, [socket, id])

  const toggleWishlist = async (productId, isWishlisted) => {
    setLoading(true)
    try {
      if (isWishlisted) {
        const response = await deleteWishlist(productId).unwrap()
        toast.success(response.message)
      } else {
        const response = await addWishlist(productId).unwrap()
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
          title: productData?.data?.name,
          text: `Check out this auction item: ${productData?.data?.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
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
          {/* Real-time connection indicator */}
          {/* {socket && (
            <div className="fixed top-4 right-4 z-50">
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Updates
              </div>
            </div>
          )} */}

          {/* Header Section */}
          <div className="pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <span>Home</span>
                <span>/</span>
                <span>Auctions</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{productData?.data?.name}</span>
              </nav>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column - Images */}
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => toggleWishlist(productData?.data?._id, productData?.data?.isWishlisted)}
                      className="group relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      {loading ? (
                        <Loader />
                      ) : productData?.data?.isWishlisted ? (
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
                    <ImageSection
                      images={[
                        ...(data?.data?.mainImage ? [data.data.mainImage] : []),
                        ...(Array.isArray(data?.data?.images) ? data.data.images : [])
                      ]}
                    />                  </div>

                  {/* Tabs Section */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <DetailPageTab data={productData?.data} />
                  </div>
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <ProductInfo
                      name={productData?.data?.name}
                      rating={productData?.data?.rating}
                      tag={productData?.data?.tag}
                      retail={productData?.data?.retail}
                      price={productData?.data?.price}
                      buyerPremium={productData?.data?.buyerPremium}
                      shortDescription={productData?.data?.shortDescription}
                      remainingAuctionTime={productData?.data?.remainingAuctionTime}
                      isSold={productData?.data?.isSold}
                      id={productData?.data?._id}
                      highestBid={productData?.data?.highestBid}
                      isAuctionActive={productData?.data?.isAuctionActive}
                      auctionEndTime={productData?.data?.auctionEndTime}
                    />
                  </div>

                  {/* Bidding History */}
                  {productData?.data?.biddingHistory?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <BiddingHistory history={productData?.data?.biddingHistory} isSold={productData?.data?.isSold} isExtended={productData?.data?.isExtended}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetail
