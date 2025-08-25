"use client"
import { timeAgo } from "@/app/utilities/date"
import TimeCounter from "../CardComponent/TimeCounter"
import ProductRowBidding from "../CardComponent/ProductRowBidding"
import Link from "next/link"
import Image from 'next/image';
import TimeCounterRow from "../CardComponent/TimeCounterRow"

const ProductRowCard = ({ item, index,handleRefetch }) => {

    // const truncatedName = item?.name?.length > 20 ? `${item?.name.slice(0, 20)}...` : item?.name;

    const truncateWords = (str, limit = 8) => {
        if (!str) return "";
        const words = str.split(" ");
        return words.length > limit
            ? words.slice(0, limit).join(" ") + "..."
            : str;
    };

    const truncatedName = truncateWords(item?.name, 8);


    return (
        <div className="bg-white border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3 mb-4 border-2 hover:border-[#F33E0A]">
            {/* mobile */}
            <div className="flex flex-col space-y-4 md:hidden">
                {/* Product Info */}

                    <div
                        className=" w-full h-full cursor-pointer"
                        onClick={() => router.push(`/detailproduct/${item._id}`)}
                    >
                         <img
                            src={item?.mainImage || item?.images?.[0]}
                            alt="Product"
                            fill
                            className="object-contain  h-[280px] w-full"
                        />
                    </div>
                    <div className="flex-1 min-w-0 py-2">
                        <Link href={`/detailproduct/${item?._id}`} className="block">
                            <h3 className="text-base font-semibold text-[#0578ff] truncate capitalize hover:underline">
                                {truncatedName || "Unnamed Product"}
                            </h3>
                        </Link>
                    </div>

                {/* Highest Bid */}
                <div className="text-center py-2">
                    <p className="text-xs text-gray-600 font-medium uppercase">Highest Bid</p>
                    <p className="text-lg font-bold text-green-600">${item?.highestBid || "0"}</p>
                </div>

                {/* Time Counter */}
                <div className="w-full">
                    <TimeCounterRow
                    handleRefetch={handleRefetch}
                        highestBid={item?.highestBid}
                        isAuctionActive={item?.isAuctionActive}
                        remainingAuctionTime={item?.remainingAuctionTime}
                        auctionStartTime={item?.auctionStartTime}
                        isSold={item?.isSold}
                        auctionEndTime={item?.auctionEndTime}
                        SoldDate={item?.SoldDate}
                    />
                </div>

                {/* Bidding Controls */}
                <div className="w-full">
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
            {/* desktop */}
            <div className="hidden md:flex items-center justify-between space-x-4">

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
                        >      <p className="line-clamp-2 overflow-hidden text-ellipsis underline capitalize">
                                {truncatedName || "Unnamed Product"}
                            </p>
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
