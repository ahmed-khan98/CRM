import React from "react";

const page = () => {
  const watchlistData = [
    {
      img: "IMG",
      itemTiltle: "23-03-2022",
      estimatedRetail: "#780359189403010600",
      buyerPremium: "Single Family Residence",
      bids: "Purchase",
      timeLeft: "N/A",
      currentPrice: "N/A",
      maxBid: "N/A",
      status: "N/A",
    },
    {
      img: "IMG",
      itemTiltle: "23-03-2022",
      estimatedRetail: "#780359189403010600",
      buyerPremium: "Single Family Residence",
      bids: "Purchase",
      timeLeft: "N/A",
      currentPrice: "N/A",
      maxBid: "N/A",
      status: "N/A",
    },
    {
      img: "IMG",
      itemTiltle: "23-03-2022",
      estimatedRetail: "#780359189403010600",
      buyerPremium: "Single Family Residence",
      bids: "Purchase",
      timeLeft: "N/A",
      currentPrice: "N/A",
      maxBid: "N/A",
      status: "N/A",
    },
    {
      img: "IMG",
      itemTiltle: "23-03-2022",
      estimatedRetail: "#780359189403010600",
      buyerPremium: "Single Family Residence",
      bids: "Purchase",
      timeLeft: "N/A",
      currentPrice: "N/A",
      maxBid: "N/A",
      status: "N/A",
    },
    {
      img: "IMG",
      itemTiltle: "23-03-2022",
      estimatedRetail: "#780359189403010600",
      buyerPremium: "Single Family Residence",
      bids: "Purchase",
      timeLeft: "N/A",
      currentPrice: "N/A",
      maxBid: "N/A",
      status: "N/A",
    },
  ];

  return (
    <div className="w-2/2 px-3">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-[#E9EFF4]">
          <thead className="text-xs">
            <tr className="text-left text-[#878790]">
              <th className="p-3 border border-[#E9EFF4]">IMG</th>
              <th className="p-3 border border-[#E9EFF4]">Item Title Link</th>
              <th className="p-3 border border-[#E9EFF4]">Estimated Retail $</th>
              <th className="p-3 border border-[#E9EFF4]">Buyer Premium</th>
              <th className="p-3 border border-[#E9EFF4]">#Bids</th>
              <th className="p-3 border border-[#E9EFF4]">Time Left</th>
              <th className="p-3 border border-[#E9EFF4]">Current $</th>
              <th className="p-3 border border-[#E9EFF4]">Enter Max Bid $</th>
              <th className="p-3 border border-[#E9EFF4]">Status: Winning/Won/Outbid etc.</th>
            </tr>
          </thead>
          <tbody>
            {watchlistData.map((item, index) => (
              <tr key={index} className="text-center border text-[#3A3A49] ">
                <td className="p-3  border border-[#E9EFF4]  cursor-pointer">
                  {item.img}
                </td>
                <td className="p-3 border border-[#E9EFF4]">{item.itemTiltle}</td>

                <td className="p-3 border border-[#E9EFF4] text-[#DD9A19]">{item.estimatedRetail}</td>
                <td className="p-3 border border-[#E9EFF4]">{item.buyerPremium}</td>
                <td className="p-3 border border-[#E9EFF4]">{item.bids}</td>

                <td className="p-3 border border-[#E9EFF4]">{item.timeLeft}</td>
                <td className="p-3 border border-[#E9EFF4]">{item.currentPrice}</td>
                <td className="p-3 border border-[#E9EFF4]">{item.maxBid}</td>
                <td className="p-3 border border-[#E9EFF4]">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
