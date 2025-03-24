import React from 'react'

const DetailLoader = () => {
  return (
    <div className='container mx-auto p-4 animate-pulse'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto'>
        {/* Image Gallery Placeholder */}
        <div className='space-y-4'>
          <div className='h-[400px] w-full bg-gray-200 rounded-lg'></div>
          <div className='grid grid-cols-4 gap-2'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-20 bg-gray-200 rounded-md'></div>
            ))}
          </div>
        </div>

        {/* Product Details Placeholder */}
        <div className='space-y-6'>
          {/* Title */}
          <div className='h-8 bg-gray-200 rounded w-3/4'></div>
          <div className='h-6 bg-gray-200 rounded w-full'></div>
          <div className='h-6 bg-gray-200 rounded w-1/2'></div>

          {/* Price Section */}
          <div className='space-y-2 pt-4'>
            <div className='h-8 bg-gray-200 rounded w-32'></div>
            <div className='h-4 bg-gray-200 rounded w-24'></div>
            <div className='h-4 bg-gray-200 rounded w-40'></div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 pt-6'>
            <div className='h-12 bg-gray-200 rounded w-32'></div>
            <div className='h-12 bg-gray-200 rounded w-32'></div>
          </div>

          {/* Features List */}
          <div className='pt-6 space-y-3'>
            <div className='h-5 bg-gray-200 rounded w-24'></div>
            <div className='space-y-2'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center gap-2'>
                  <div className='h-4 w-4 bg-gray-200 rounded-full'></div>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className='pt-6'>
            <div className='h-5 bg-gray-200 rounded w-36 mb-3'></div>
            <div className='grid grid-cols-2 gap-4'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='space-y-1'>
                  <div className='h-4 bg-gray-200 rounded w-24'></div>
                  <div className='h-4 bg-gray-200 rounded w-32'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailLoader