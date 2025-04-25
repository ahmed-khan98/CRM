"use client";

import ContactTab from "@/app/_Components/Tab/ContactTab";
import { useResponseQuery } from "@/app/_Services/contactform/page";


const page = () => {
    const { data, error: isError, isLoading } = useResponseQuery();

    const skeletonRows = 8;

console.log(data,'data')
    return (
        <div className="w-full min-h-screen bg-[#FFFFFF] py-6">
            <ContactTab/>

        <div className="max-w-7xl mx-auto p-5 flex flex-col space-y-6">
          <h3 className="text-[#242424] text-[24px] font-bold">All Responses</h3>
  
          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-[#E9EFF4]">
              <thead className="text-xs">
                <tr className="text-center text-[#5d5d62]">
                  <th className="p-3 border border-[#E9EFF4]">Subject</th>
                  <th className="p-3 border border-[#E9EFF4]">Message</th>
                  <th className="p-3 border border-[#E9EFF4]">Response</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(skeletonRows)].map((_, index) => (
                    <tr key={index} className="text-sm">
                      <td className="p-3 border border-[#E9EFF4]">
                        <div className="w-30 h-7 bg-gray-200 animate-pulse mx-auto rounded" />
                      </td>
                      <td className="p-3 border border-[#E9EFF4]">
                        <div className="w-50 h-7 bg-gray-200 animate-pulse mx-auto rounded" />
                      </td>
                      <td className="p-3 border border-[#E9EFF4]">
                        <div className="w-50 h-7 bg-gray-200 animate-pulse mx-auto rounded" />
                      </td>
                    </tr>
                  ))
                ) : data?.data?.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-gray-500 text-lg">
                      No Response Found
                    </td>
                  </tr>
                ) : (
                  data?.data?.map((item, index) => (
                    <tr key={index} className="text-sm text-[#3A3A49]">
                      <td className="p-3 border border-[#E9EFF4]">{item?.subject}</td>
                      <td className="p-3 border border-[#E9EFF4]">{item?.message}</td>
                      <td className="p-3 border border-[#E9EFF4]">
                        {item?.response?.reply ? (
                          item?.response?.reply
                        ) : (
                          <span className="text-[#DD9A19]">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  

export default page;