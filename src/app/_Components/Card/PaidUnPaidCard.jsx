



'use client'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ProductHeader from '../CardComponent/ProductHeader';
import ProductImageSection from '../CardComponent/ProductImageSection';
import TimeCounter from '../CardComponent/TimeCounter';
import ProductInfo from '../CardComponent/ProductInfo';
import { useAddPaymentMutation } from '@/app/_Services/payment/page';
import toast from 'react-hot-toast';
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate } from '@/app/utilities/date';
import PickupScheduleModal from '../Modal/PickupScheduleModal';

const PaidUnPaidCard = ({ item, status, paymentDeadline, deliveryMethod, deliveryStatus }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [daysSinceEnded, setDaysSinceEnded] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});

    useEffect(() => {
        if (item?.product?.biddingEndTime) {
            const now = new Date();
            const endTime = new Date(item.product.biddingEndTime);

            const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
            const endUTC = Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());

            const diffInMs = nowUTC - endUTC;
            const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            setDaysSinceEnded(daysPassed);
        }
    }, [item?.product?.biddingEndTime]);

    const [addPayment] = useAddPaymentMutation();


    const addPayments = async (auction_id,id) => {
        try {
            setLoadingStates((prev) => ({ ...prev, [id]: true }));
            const response = await addPayment({ "productId": id,'auctionWonId': auction_id,'type':'auction_payment'}).unwrap();
            console.log(response, 'sadaf');
            if (response?.data?.url) {
                window.location.href = response?.data?.url;
            }
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [id]: false }));
        }
    };

    const getDeliveryStatusColor = (status) => {
        switch (status) {
            case "not_selected":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "scheduled":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "completed":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <>
            <div className="relative bg-gradient-to-b from-orange-50 to-white border-1 border-gray-300 rounded-3xl my-4 shadow-lg flex flex-col mx-1 md:mx-3">

                <ProductHeader name={item?.product?.name} id={item?.product?._id} />
                <ProductImageSection item={item?.product} />
                <TimeCounter
                type='days' title='Ended' price={item?.product?.price}
                    isSold={item?.product?.isSold}
                    SoldDate={item?.product?.SoldDate}
                />
                {(status === 'pending' || status === 'penalized') &&
                    <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-1">
                            <span
                                className='px-1 py-1 text-xs font-medium text-gray-500'
                            >
                                Payment Due Date
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-1 py-2">
                            <div className="flex items-center gap-2 px-3  py-1text-xs font-medium">

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    {/* <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status === 'pending' ? 'text-green-600 bg-green-100':'text-red-600 bg-red-100'}`}>{formatDate(paymentDeadline)}</span> */}
                                </div>



                            </div>
                        </div>

                    </div>}


                {(status === "paid" || status === "paid_with_penalty") && (
                    <div className="flex items-center justify-between px-3 ">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span
                                className={`px-3 py-2 rounded-full text-xs font-medium border ${getDeliveryStatusColor(deliveryStatus)}`}
                            >
                                {deliveryStatus === "not_selected"
                                    ? "Select Delivery Method"
                                    : deliveryStatus === "scheduled"
                                        ? "Delivery Scheduled"
                                        : "Deliveorange"}
                            </span>
                        </div>

                        {deliveryStatus === "not_selected" && (
                            // <div className="flex items-center justify-between px-1 py-1">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 my-2 text-xs cursor-pointer  font-medium bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-md"
                                >
                                    Choose Delivery
                                </motion.button>
                            // </div>
                        )}

                        {deliveryMethod && (
                            // <div className="flex items-center justify-between px-1 py-2">
                                <div className="flex items-center gap-2 px-2  py-2 text-xs font-medium">
                                    {deliveryMethod === "pickup" ? (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className='px-3 py-2 rounded-full text-xs font-medium border  text-gray-600 bg-gray-100  border-gray-200 '>Pickup Scheduled</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className='px-3 py-2 rounded-full text-xs font-medium border  text-gray-600 bg-gray-100  border-gray-200 '>Shipping Requested</span>
                                        </div>

                                    )}
                                </div>
                            // </div>
                        )}
                    </div>
                )}

                {/* Show delivery method if selected */}

                <ProductInfo quantity={item?.product?.quantity}
                    retail={item?.product?.retail ? item?.product?.retail : 0}
                    highestBid={item?.product?.highestBid}
                    title='Winning Bid :'
                    biddingCount={item?.product?.biddingCount}
                />
                <div className="flex flex-row">
                    {
                        (status == 'paid' || status == 'paid_with_penalty') ?
                            <button
                                className="rounded-br-3xl rounded-bl-3xl w-full font-bold  text-white bg-[#0578ff] py-3 flex items-center justify-center ">
                                Paid
                            </button> : <button onClick={() => addPayments(item?._id,item?.product?._id)}
                                disabled={loadingStates[item?.product?._id]}
                                className="rounded-br-3xl rounded-bl-3xl w-full font-bold cursor-pointer  text-white bg-gradient-to-r from-blue-500 to-blue-400  hover:from-blue-400 hover:to-blue-500 py-3 flex items-center justify-center ">
                                {loadingStates[item?.product?._id] ? (
                                    "Loading..."
                                ) : (
                                    "Un Paid"
                                )}                </button>}
                </div>
            </div>
            <PickupScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                auctionWin={item}
            // onSubmit={handleDeliverySubmit}
            />
        </>
    );
}

export default PaidUnPaidCard;



