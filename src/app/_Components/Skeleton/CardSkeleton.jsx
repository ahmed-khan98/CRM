// "use client"
export default function AuctionCardSkeleton() {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg p-4 shadow-md">
        {/* Image Skeleton */}
        <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
  
        {/* Watcher Badge */}
        <div className="absolute top-2 right-2 w-16 h-6 bg-gray-400 rounded"></div>
  
        {/* Timer Skeleton */}
        <div className=" p-3 rounded-md shadow-md text-center mb-2">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        </div>
  
        {/* Details Section */}
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
  
        {/* Current Bid Section */}
        <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
  
        {/* Bid Button & Input */}
        <div className="flex justify-between items-center">
          <div className="h-10 w-10 bg-gray-300 rounded-md"></div>
          <div className="h-10 bg-gray-300 rounded-md flex-1"></div>
        </div>
      </div>
    );
  }
  