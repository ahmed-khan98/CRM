"use client";
import React from "react";

const page = () => {
  const auctionData = [
    {
      title: "#780359189403010600",
      price: "$5400",
      buyerPremium: "Buyer Premium",
      totalCosts: "Total Costs",
      dimension: "Dimension",
      localDelivery: "N/A",
      requestShipping: "N/A",
      shippingLabel: "N/A",
    },
    {
      title: "#780359189403010600",
      price: "$2423",
      buyerPremium: "Buyer Premium",
      totalCosts: "Total Costs",
      dimension: "Dimension",
      localDelivery: "$12500",
      requestShipping: "$12500",
      shippingLabel: "$12500",
    },
    {
      title: "#780359189403010600",
      price: "$5400",
      buyerPremium: "Buyer Premium",
      totalCosts: "Total Costs",
      dimension: "Dimension",
      localDelivery: "N/A",
      requestShipping: "N/A",
      shippingLabel: "N/A",
    },
    {
      title: "#780359189403010600",
      price: "$2423",
      buyerPremium: "Buyer Premium",
      totalCosts: "Total Costs",
      dimension: "Dimension",
      localDelivery: "$3500",
      requestShipping: "$3500",
      shippingLabel: "$3500",
    },
  ];

  return (
   <div className="w-2/2 px-3">
     <div>
    
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-[#E9EFF4]">
          <thead className="text-xs">
            <tr className="text-left  text-[#878790]">
              <th className="p-3 border border-[#E9EFF4]">IMG</th>
              <th className="p-3 border border-[#E9EFF4]">Title </th>
              <th className="p-3 border border-[#E9EFF4]">Price</th>
              <th className="p-3 border border-[#E9EFF4]">Buyer Premium</th>
              <th className="p-3 border border-[#E9EFF4]">Total Costs ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Dimension ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Request Local Delivery⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Request Shipping </th>
              <th className="p-3 border border-[#E9EFF4]">Upload Shipping Label PDF ⬍</th>
            </tr>
          </thead>
          <tbody>
            {auctionData.map((item, index) => (
              <tr key={index} className="text-center text-sm text-[#3A3A49]">
                <td className="p-3 border border-[#E9EFF4]  cursor-pointer">Image link</td>
                <td className="p-3 border border-[#E9EFF4] text-[#DD9A19]">{item.title}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item.price}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item.buyerPremium}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item.totalCosts}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item.dimension}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item.localDelivery}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item.requestShipping}</td>
                <td className="p-3 border border-[#E9EFF4] ">{item.shippingLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </div>
  );
};

export default page;
