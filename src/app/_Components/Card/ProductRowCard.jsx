"use client"
import { timeAgo } from "@/app/utilities/date"
import TimeCounter from "../CardComponent/TimeCounter"
import ProductRowBidding from "../CardComponent/ProductRowBidding"
import Link from "next/link"
import Image from 'next/image';
import TimeCounterRow from "../CardComponent/TimeCounterRow"

const ProductRowCard = ({ item, index }) => {

    const truncatedName = item?.name?.length > 20 ? `${item?.name.slice(0, 20)}...` : item?.name;

    return (
        <div className="bg-white border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3 mb-4 border-2 hover:border-[#F33E0A]">
            <div className="flex items-center justify-between">

                <div className="flex items-center flex-1 min-w-0 mx-2">
                    <img
                        src={item?.mainImage || "/placeholder.svg?height=64&width=64&query=product"}
                        alt={item?.name || "Product"}
                        className="w-20 h-20 object-contain rounded-md mr-4"
                    />
                    <div className="">
                        <Link
                            href={`/detailproduct/${item?._id}`}
                            className="text-[18px] font-semibold pt-3 px-3 h-16 rounded-t-3xl text-[#0578ff] cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 truncate capitalize">{truncatedName || "Unnamed Product"}</h3>
                        </Link>
                        {/* <p className="text-sm text-gray-500 truncate">{item?.description || ""}</p> */}
                    </div>
                </div>

                <div className=" text-center mx-4">
                    <p className="text-sm text-gray-600 font-medium">Highest Bid</p>
                    <p className="text-xl font-bold text-green-600">${item?.highestBid || "0"}</p>
                </div>


                <div className=" mx-4">
                    {/* <div className="text-center"> */}

                    <TimeCounterRow
                    index={index}
                        highestBid={item?.highestBid}
                        isAuctionActive={item?.isAuctionActive}
                        remainingAuctionTime={item?.remainingAuctionTime}
                        auctionStartTime={item?.auctionStartTime}
                        isSold={item?.isSold}
                        auctionEndTime={item?.auctionEndTime}
                        SoldDate={item?.SoldDate}
                    />
                    {/* </div> */}
                </div>

                <div className="">
                    <ProductRowBidding
                        id={item?._id}
                        isSold={item?.isSold}
                        highestBid={item?.highestBid}
                        isAuctionActive={item?.isAuctionActive}
                        userBid={item?.userBid}
                        biddingCount={item?.biddingCount || 0}
                        price={item?.price || 0}
                        automateBidder={item?.automateBidder}
                    />
                </div>
            </div>

        </div>
    )
}

export default ProductRowCard
