import { formatDate } from "@/app/utilities/date";
import React from "react";

const Comment = ({ id, lastComment, username, lastAction, createdAt }) => {
  return (
    <div key={id} className="relative pl-3">
      {/* Timeline Dot (Accent) */}
      <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-2 -left-[7px] border-4 border-white"></div>

      {/* Comment Card */}
      <div className="bg-[#f5f4f5] p-2 rounded-lg shadow-sm">
        {/* Last Comment Text */}
        <p className="text-xs font-normal text-gray-600 leading-snug">
          {lastComment || "No comment text"}
        </p>

        {/* Details: Agent, Action, Date */}
        <div className="mt-1 space-y-1 pt-1 border-t border-gray-300">
          <p className="text-xs font-medium text-gray-700 capitalize">
            Action: {lastAction || "N/A"}
          </p>
          <p className="text-xs text-gray-800 font-medium capitalize ">
            By: {username}
          </p>
          <p className="text-xs text-gray-600">Date: {formatDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Comment);
