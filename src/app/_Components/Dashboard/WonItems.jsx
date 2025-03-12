"use client"
import { useWonItemsQuery } from '@/app/_Services/products/page';
import Image from 'next/image';
import React from 'react'

const WonItems = () => {

    // const auctionData = [
    //     {
    //       title: "#780359189403010600",
    //       price: "$5400",
    //       buyerPremium: "Buyer Premium",
    //       totalCosts: "Total Costs",
    //       dimension: "Dimension",
    //       localDelivery: "N/A",
    //       requestShipping: "N/A",
    //       shippingLabel: "N/A",
    //     },
    //     {
    //       title: "#780359189403010600",
    //       price: "$2423",
    //       buyerPremium: "Buyer Premium",
    //       totalCosts: "Total Costs",
    //       dimension: "Dimension",
    //       localDelivery: "$12500",
    //       requestShipping: "$12500",
    //       shippingLabel: "$12500",
    //     },
    //     {
    //       title: "#780359189403010600",
    //       price: "$5400",
    //       buyerPremium: "Buyer Premium",
    //       totalCosts: "Total Costs",
    //       dimension: "Dimension",
    //       localDelivery: "N/A",
    //       requestShipping: "N/A",
    //       shippingLabel: "N/A",
    //     },
    //     {
    //       title: "#780359189403010600",
    //       price: "$2423",
    //       buyerPremium: "Buyer Premium",
    //       totalCosts: "Total Costs",
    //       dimension: "Dimension",
    //       localDelivery: "$3500",
    //       requestShipping: "$3500",
    //       shippingLabel: "$3500",
    //     },
    //   ];

    const { data, error: isError, isLoading } = useWonItemsQuery();
    console.log(data,"data1");
       
   
  return (
    <>
    
    
    <div className="w-2/2 px-3">
     <div>
    
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-[#E9EFF4]">
          <thead className="text-xs">
            <tr className="text-left  text-[#878790]">
              <th className="p-3 border border-[#E9EFF4]">IMG</th>
              <th className="p-3 border border-[#E9EFF4]"> Product Title </th>
              <th className="p-3 border border-[#E9EFF4]">Price ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Quantity ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Higest Bids</th>
              <th className="p-3 border border-[#E9EFF4]">Start Date</th>
              <th className="p-3 border border-[#E9EFF4]">End Date</th>
              {/* <th className="p-3 border border-[#E9EFF4]">Total Costs ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Dimension ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Request Local Delivery⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Request Shipping </th>
              <th className="p-3 border border-[#E9EFF4]">Upload Shipping Label PDF ⬍</th> */}
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((item, index) => (
              <tr key={index} className="text-center text-sm text-[#3A3A49]">
                <td className="p-3 border flex justify-center border-[#E9EFF4]  ">
                    <img src={item?.product?.images?.[0]} width="50px" height="50px"/>
                </td>
                <td className="p-3 border border-[#E9EFF4] text-[#DD9A19]">{item?.product?.name}</td>
                <td className="p-3 border border-[#E9EFF4] ">$ {item?.product?.price}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item?.product?.quantity}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item?.product?.highestBid}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item?.createdAt}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item?.endedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </div></>
  )
}

export default WonItems