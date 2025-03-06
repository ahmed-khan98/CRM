import React from "react";

const page = () => {
  const watchlistData = [
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
    {
      img: "IMG",
      inv: "#789035",
      title: "#780359189403010600",
      price: "Single Family Residence",
      status:"Listed",
      payout:"Pending"
    },
  ];

  return (
    <div className="w-2/2 px-3">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-[#E9EFF4]">
          <thead className="text-xs">
            <tr className="text-center text-[#878790]">
              <th className="p-3 border border-[#E9EFF4]">IMG</th>
              <th className="p-3 border border-[#E9EFF4]">INV# ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Title ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Price ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Status ⬍</th>
              <th className="p-3 border border-[#E9EFF4]">Payout Status ⬍</th>
            </tr>
          </thead>
          <tbody>
            {watchlistData.map((item, index) => (
              <tr key={index} className="text-center border text-[#3A3A49] ">
                <td className="p-3  border border-[#E9EFF4]  cursor-pointer">
                  {item.img}
                </td>
                <td className="p-3 border border-[#E9EFF4]">{item.inv}</td>

                <td className="p-3 border border-[#E9EFF4] text-[#DD9A19]">{item.title}</td>
                <td className="p-3 border border-[#E9EFF4]">{item.price}</td>
                <td className="p-3 border border-[#E9EFF4]">{item.status}</td>
                <td className="p-3 border border-[#E9EFF4] text-[red]">{item.payout}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
