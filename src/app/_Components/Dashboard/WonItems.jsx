"use client"
import { useWonItemsQuery } from '@/app/_Services/wonProduct/page';
import React from 'react'

const WonItems = () => {

   
    const { data, error: isError, isLoading } = useWonItemsQuery();
    console.log(data,"data1");
       
   
  return (
    <>
    
    
    <div className="w-2/2 px-3 pb-4">
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