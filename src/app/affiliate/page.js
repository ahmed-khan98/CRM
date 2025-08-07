'use client'
import React from 'react'
import { FaGavel } from 'react-icons/fa6'
import { useGetAffiliateQuery } from '../_Services/Affiliate/page';


const page = () => {

  const { data, isLoading, error } = useGetAffiliateQuery();
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
                <div dangerouslySetInnerHTML={{ __html: about.title }}/>
                <div className="flex items-center justify-center gap-2 w-full my-3">
      
                    <div className="w-1/9 h-[1px] bg-gray-300"></div>
                    <h2 className="text-lg font-bold text-black flex items-center gap-1">
                      <FaGavel className="text-[#F33E0A]" />
                    </h2>
                    <div className="w-1/9 h-[1px] bg-gray-300"></div>
                  </div>
                </div>
      
                <div className="flex flex-wrap lg:flex-nowrap  gap-6 py-5">
                  <div className="w-full lg:w-1/2 p-4">
                    <div dangerouslySetInnerHTML={{ __html: about.description }} className="text-lg leading-8"/>
                  </div>
      
                  <div className="w-full lg:w-1/2">
                    <img
                      src={about.image}
                      alt="about-img"
                      className="object-contain h-[400px] w-full"
                    />
                  </div>
                </div>
      
                <div
                  dangerouslySetInnerHTML={{ __html: about.mainDescription }}
                  className="pt-10 px-4 text-lg"
                />
              </>
      ) : (
        <div className="w-full flex justify-center items-center h-[50vh]">
          <p className="text-gray-500 text-lg font-semibold">Affiliate Not Found</p>
        </div>
      )}

    </div>
  )
}

export default page