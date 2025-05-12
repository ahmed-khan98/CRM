import { useAddBidMutation } from '@/app/_Services/products/page';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Rating } from 'react-simple-star-rating';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


const ProductInfo = ({ name, rating, tag, retail, price, buyerPremium, shortDescription, isSold, id, highestBid }) => {

    const [showFull, setShowFull] = useState(false);
    const maxLength = 300;
    const isLong = shortDescription?.length > maxLength;
    const displayedText = showFull ? shortDescription : shortDescription?.slice(0, maxLength);
    const [addBid, { isLoading: isSubmitting }] = useAddBidMutation();
    const [bidValue, setBidValue] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setBidValue(highestBid + 1)
    }, [])

    const handleBidChange = (id, value) => {
        setBidValue(Number(value));
    };

    const submitBid = async () => {
        if (bidValue <= highestBid) {
            toast.error("Bid amount must be greater than the highest bid!");
            return;
        }
        try {
            const response = await addBid({ id: id, bidAmount: bidValue }).unwrap();
            toast.success(response?.message);
            setBidValue(bidValue + 1)
            // router.replace(router.asPath);
        } catch (error) {
            toast.error(error.data?.message || "Failed to place bid");
        }
    };

    const token = Cookies.get("token");

    return (
        <>
            <h1 className="  mt-6 p-4  sm:px-0 text-left text-2xl capitalize font-bold text-title-md sm:text-title-lg">
                {name}
            </h1>
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
                                initialValue={rating ?? 0}
                            />
                        </div>
                    </div>
                    {tag?.length > 0 && (
                        <div className="flex items-center justify-start gap-2 flex-wrap">
                            {tag.map((tag, index) => (
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

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="flex-1 bg-[#a6a6a6] p-3 flex items-center justify-between">
                            <p className="uppercase font-semibold roboto text-sm">Estimated Retail</p>
                        </div>
                        <div className="flex-1 bg-[#d9d9d9]  p-3 flex items-center justify-between">
                            <p className="font-semibold ">${retail}</p>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex gap-2">
                        <div className="flex-1 bg-[#a6a6a6] p-3 flex items-center justify-between">
                            <p className="uppercase font-semibold roboto text-sm">Current Price</p>
                        </div>
                        <div className="flex-1 bg-[#d9d9d9]  p-3 flex items-center justify-between">
                            <p className="font-semibold ">${price}</p>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="flex gap-2">
                        <div className="flex-1 bg-[#a6a6a6] p-3 flex items-center justify-between">
                            <p className="uppercase font-semibold roboto text-sm">Buyers Premium</p>
                        </div>
                        <div className="flex-1 bg-[#d9d9d9]  p-3 flex items-center justify-between">
                            <p className="font-semibold ">
                                {`${buyerPremium}${buyerPremium?.includes('%') ? '' : '%'}`}
                            </p>
                        </div>
                    </div>
                </div>


            </div>
            {isSold ? (
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
                        onChange={(e) => handleBidChange(id, e.target.value)}
                        value={bidValue}
                    />
                    <button
                        disabled={bidValue <= highestBid || isSubmitting}
                        onClick={() => submitBid(id)}
                        className={`w-1/2 cursor-pointer  text-white py-2 flex items-center justify-center space-x-2
                   ${Number(bidValue) > Number(highestBid) ? 'bg-[#F33E0A] hover:bg-[#d63006]' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {/* <ImHammer2 className="transform rotate-80" /> */}
                        <span>{isSubmitting ? "Submitting..." : "Submit BID"}</span>
                    </button>
                </div>
            ) : (
                <button onClick={() => router.push("/login")} className="bg-[#f44b0a]  cursor-pointer w-full text-white px-4 py-2 rounded hover:bg-[#f44b0a]  flex items-center justify-center">
                    Login to Bid
                </button>
            )}
        </>)
}

export default ProductInfo