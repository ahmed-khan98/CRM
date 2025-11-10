import { formatDate } from '@/app/utilities/date'
import React from 'react'

const Comment = ({id,lastComment,username,lastAction,createdAt}) => {
  return (
   <div key={id} className="relative pl-4">
                  {/* Timeline Dot (Accent) */}
                  <div className="absolute w-3 h-3 bg-[#5f2781] rounded-full mt-2 -left-[7px] border-4 border-white"></div>

                  {/* Comment Card */}
                  <div className="bg-[#f7f7f7] p-4 rounded-lg shadow-sm">
                    {/* Last Comment Text */}
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {lastComment || "No comment text"}
                    </p>

                    {/* Details: Agent, Action, Date */}
                    <div className="mt-2 space-y-1 pt-2 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 capitalize">
                        Action: {lastAction || "N/A"}
                      </p>
                      <p className="text-xs text-[#5f2781] font-semibold capitalize ">
                        By: {username}
                      </p>
                      <p className="text-xs text-gray-400">
                        Date:{" "}
                        {formatDate(createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
  )
}

export default React.memo(Comment)
