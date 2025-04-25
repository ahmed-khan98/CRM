import React from 'react'
import { FaGavel } from 'react-icons/fa6'

const SubHeading = ({heading}) => {
  return (
    <>
   <div className={`my-4`}>
   <h1 className={`text-center text-[20px] font-bold pt-6 uppercase text-[#242424]`}> {heading}</h1>
     <div className="flex items-center justify-center gap-2 w-full my-3">
      
      <div className="w-1/9 h-[1px] bg-gray-300"></div>
      <h2 className="text-lg font-bold text-black flex items-center gap-1">
        <FaGavel className="text-[#F33E0A]" />
      </h2>
      <div className="w-1/9 h-[1px] bg-gray-300"></div>
    </div>
   </div>
    </>
  )
}

export default SubHeading