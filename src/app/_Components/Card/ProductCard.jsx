'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProductHeader from '../CardChildComponent/ProductHeader';
import ProductImageSection from '../CardChildComponent/ProductImageSection';
import TimeCounter from '../CardChildComponent/TimeCounter';
import ProductInfo from '../CardChildComponent/ProductInfo';
import ProductBidding from '../CardChildComponent/ProductBidding';
import ProductButton from '../CardChildComponent/ProductButton';


const ProductCard = React.memo(({ item }) => {
    const [timeLeft, setTimeLeft] = useState({});

    const timerRef = useRef(null);

    const calculateTimeLeft = useCallback(() => {
        const endTime = new Date(item?.biddingEndTime).getTime();
        const now = Date.now();
        const diff = endTime - now;

        if (diff > 0) {
            setTimeLeft({
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            });
        } else {
            clearInterval(timerRef.current);
            setTimeLeft({ hours: 0 });
        }
    }, [item?.biddingEndTime]);

    useEffect(() => {
        calculateTimeLeft();
        timerRef.current = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timerRef.current);
    }, [calculateTimeLeft]);



    console.log('Render Product')

    return (
        <div className="relative bg-gray-200 border-1 border-gray-300 rounded-3xl my-3 shadow-lg">
            <ProductHeader name={item.name} id={item._id}/>
            {/* <ProductButton  item={item}/> */}
            <ProductImageSection item={item} />
            <TimeCounter timeLeft={timeLeft?.hours} type='hours' title='Time Left' price={item.price} />
            <ProductInfo quantity={item.quantity}
             retail={item?.retail ? item?.retail : 0}
             highestBid={item.highestBid}
             biddingCount={item?.biddingCount}
            />
            <div className="flex">
                <ProductBidding
                    id={item._id}
                    isSold={item.isSold}
                    highestBid={item.highestBid}
                />
            </div>
        </div>
    );
});

export default ProductCard;
