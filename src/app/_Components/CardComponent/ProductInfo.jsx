import React from "react"
import { Package, DollarSign, BarChart2 } from "lucide-react"

const ProductInfo = ({ quantity, retail, highestBid, biddingCount, title, price }) => {
  return (
    <div className="bg-white px-4 py-3 rounded-t-2xl shadow-sm border-b border-gray-200">

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Package size={16} className="text-[#F33E0A]" />
            <span className="text-sm text-gray-700">Quantity</span>
          </div>
          <span className="text-sm font-medium">{quantity}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <DollarSign size={16} className="text-[#F33E0A]" />
            <span className="text-sm text-gray-700">Retail</span>
          </div>
          <span className="text-sm font-medium">${retail || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BarChart2 size={16} className="text-[#F33E0A]" />
            <span className="text-sm text-gray-700">Bids</span>
          </div>
          <span className="text-sm font-medium">{biddingCount || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <DollarSign size={16} className="text-[#F33E0A]" />
            <span className="text-sm text-gray-700">{title ? title : 'Highest Bid'}</span>
          </div>
          {/* <span className="text-sm font-medium">${(biddingCount ? highestBid : 0) || 0}</span> */}
          <span className="text-sm font-medium">{highestBid}</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ProductInfo)
