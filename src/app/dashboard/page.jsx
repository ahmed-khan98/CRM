"use client";
import React, { useState } from "react";

const page = () => {
  const [activeTab, setActiveTab] = useState("pickup");

  const tabs = [
    { id: "pickup", label: "Pickup Items I Bought Myself" },
    { id: "forsale", label: "Pickup Items I Have For Sale From My House" },
    { id: "deliver", label: "Deliver Items I Bought To My House" },
    { id: "upcoming", label: "UPCOMING APPOINTMENT (0)", },
  ];

  const data = [
    { id: "#78263019430010600", location: "address of dummy", date: "23-03-2022", time: "07:32 PM" },
    { id: "#78263019430010860", location: "address of dummy", date: "31-03-2022", time: "07:32 PM" },
    { id: "#78263019430010600", location: "address of dummy", date: "23-03-2022", time: "07:32 PM" },
    { id: "#78263019430010860", location: "address of dummy", date: "31-03-2022", time: "07:32 PM" },
    { id: "#78263019430010600", location: "address of dummy", date: "23-03-2022", time: "07:32 PM" },
  ];

  return (
    <div className="w-2/2 ">

        <div className="px-5 ">
      {/* Tabs */}
      <div className="flex gap-1 ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm   
            ${tab.disabled ? "bg-gray-300 text-gray-500 cursor-pointer" : 
            activeTab === tab.id ? "bg-[#F33E0A] text-white" : "bg-[#D9D9D975] text-[#A9A9A9] "}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white mt-4 border border-[#E9EFF4]">
        <table className="w-full  border-collapse ">
          <thead className="text-xs">
            <tr className="bg-gray-100 text-[#878790] text-left">
              <th className="p-3 border border-[#E9EFF4]">List Of Items ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Location</th>
              <th className="p-3 border border-[#E9EFF4]">Date ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Time</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((item, index) => (
              <tr key={index} className="border-b text-[#3A3A49] border-[#E9EFF4] ">
                <td className="p-3 border border-[#E9EFF4] text-[#DD9A19]">{item.id}</td>
                <td className="p-3 border border-[#E9EFF4] text-[#3A3A49">{item.location}</td>
                <td className="p-3 border border-[#E9EFF4] text-[#3A3A49">{item.date}</td>
                <td className="p-3 border border-[#E9EFF4] text-[#3A3A49">{item.time}</td>
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
