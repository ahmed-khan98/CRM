'use client'
import React from 'react'
import { FaGavel } from 'react-icons/fa6'
import { useGetContactQuery } from '../_Services/contact/page';


const page = () => {

  const { data, isLoading, error } = useGetContactQuery();
  const about = data?.data?.[0];

  return (
    <div className='container mx-auto pt-[50px] md:my-12 my-5 px-12 md:px-6'>
      {isLoading ? (
        <div className="w-full flex justify-center items-center h-[50vh]">
          <div className="animate-pulse w-full lg:w-[35%] bg-gray-200 h-[250px] mx-4 rounded-lg"></div>
          <div className="animate-pulse w-full lg:w-[60%] bg-gray-200 h-[250px] rounded-lg"></div>
        </div>
      ) : about ? (
        <>
          <div className="my-4">
            <h1 className="text-center text-[24px] font-bold uppercase text-[#242424] ">{about?.title}</h1>
            <div className="flex items-center justify-center gap-2 w-full my-3">

              <div className="w-1/9 h-[1px] bg-gray-300"></div>
              <h2 className="text-lg font-bold text-black flex items-center gap-1">
                <FaGavel className="text-[#F33E0A]" />
              </h2>
              <div className="w-1/9 h-[1px] bg-gray-300"></div>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 py-5">
            {/* Left Section (Description) */}
            <div className="w-full lg:w-1/2 p-4">
              <div dangerouslySetInnerHTML={{ __html: about.description }} />
            </div>

            {/* Right Section (Image) */}
            <div className="w-full lg:w-1/2">
              <img
                src={about.image}
                alt="about-img"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: about.mainDescription }}
            className="pt-10"
          />
        </>
      ) : (
        <div className="w-full flex justify-center items-center h-[50vh]">
          <p className="text-gray-500 text-lg font-semibold">Contact Not Found</p>
        </div>
      )}

    </div>
  )
}

export default page