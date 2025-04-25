



'use client'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ProductHeader from '../CardChildComponent/ProductHeader';
import ProductImageSection from '../CardChildComponent/ProductImageSection';
import TimeCounter from '../CardChildComponent/TimeCounter';
import ProductInfo from '../CardChildComponent/ProductInfo';
import { useAddPaymentMutation } from '@/app/_Services/payment/page';
import toast from 'react-hot-toast';

const PaidUnPaidCard = ({ item, status }) => {

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


    const addPayments = async (id) => {
        try {
            setLoadingStates((prev) => ({ ...prev, [id]: true }));
            const response = await addPayment({ "productId": id }).unwrap();
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

    return (
        <div className="relative bg-gray-200 border-1 border-gray-300 rounded-3xl my-3 shadow-lg">
            <ProductHeader name={item?.product?.name} id={item?.product?._id} />
            <ProductImageSection item={item?.product} />
            <TimeCounter timeLeft={daysSinceEnded} type='days' title='Ended' price={item?.product?.price} />
            <ProductInfo quantity={item?.product?.quantity}
                retail={item?.product?.retail ? item?.product?.retail : 0}
                highestBid={item?.product?.highestBid}
                title='Winning Bid :'
                biddingCount={item?.product?.biddingCount}
            />
            <div className="flex flex-row">
                {
                    status === 'paid' ?
                        <button
                            className="rounded-br-3xl rounded-bl-3xl w-full font-bold  text-white bg-gradient-to-r from-blue-300 to-blue-400 py-3 flex items-center justify-center ">
                            Paid
                        </button> : <button onClick={() => addPayments(item?.product?._id)}
                            disabled={loadingStates[item?.product?._id]}
                            className="rounded-br-3xl rounded-bl-3xl w-full font-bold cursor-pointer  text-white bg-gradient-to-r from-blue-500 to-blue-400  hover:from-blue-400 hover:to-blue-500 py-3 flex items-center justify-center ">
                            {loadingStates[item?.product?._id] ? (
                                "Loading..."
                            ) : (
                                "Un Paid"
                            )}                </button>}
            </div>
        </div>
    );
}

export default PaidUnPaidCard;



