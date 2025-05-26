'use client';

import { useGetServiceQuery } from '@/app/_Services/services/page';
import Link from 'next/link';

const ServicesSection = () => {
  const { data,isLoading,error } = useGetServiceQuery();

  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse bg-gray-100 p-6 pt-5 rounded-lg shadow-lg h-40"
      >
        <div className="h-6 w-1/2 bg-gray-300 mx-auto mb-4 rounded"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        </div>
    ));
  };

  return (
    <div className="text-center py-10 px-4 md:px-10">
      <h2 className="text-3xl md:text-5xl font-bold text-[#F33E0A]">
        Services We Offer
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
        {isLoading && renderSkeletons()}

        {error && (
          <div className="col-span-full text-red-600 font-semibold">
            Failed to load services. Please try again.
          </div>
        )}

        {!isLoading && !error && data?.data?.length === 0 && (
          <div className="col-span-full text-xl text-gray-500 font-medium">
            No service found.
          </div>
        )}

        {!isLoading &&
          !error &&
          data?.data?.map((e) => (
            <div
              key={e._id}
              className=" bg-white p-5 pt-5 my-2 rounded-lg shadow-lg flex justify-between flex-col"
            >
              <h3 className=" text-red-800 font-bold text-lg py-2 px-4">
                {e?.title}
              </h3>
              <p className="text-gray-700 mt-2 text-sm">
                <div dangerouslySetInnerHTML={{ __html: e?.description }} />
              </p>
              {e?.linkUrl &&
              <Link href={e?.linkUrl} className="cursor-pointer pt-8 text-sm font-semibold">
               {e?.linkTitle}
              </Link>}
            </div>
          ))}
      </div>

      <div className="mt-12">
        <Link href="/auction-product">
          <button  
          className="cursor-pointer md:w-[35%] shadow text-white text-lg font-bold py-3 px-6 rounded-full transition-all bg-[#FB3B11] hover:bg-[#e03610] disabled:opacity-70">
            BROWSE AUCTION 
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ServicesSection;
