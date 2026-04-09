import React from 'react'

const AssignmentItem = ({ icon: Icon, label, value }) => {
  return (
  <div>
    <div className="flex items-center space-x-2 text-gray-500 uppercase tracking-wider">
      <Icon className="w-4 h-4" />
      <p className="text-sm ">{label}</p>
    </div>
    <p className="font-medium capitalize text-[14px] mt-1">
      {value || "N/A"}
    </p>
  </div>
  )
}

export default React.memo(AssignmentItem)
