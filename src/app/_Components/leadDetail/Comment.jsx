import { formatDate } from "@/app/utilities/date";
import React from "react";

const Comment = ({ id, lastComment, username, lastAction, createdAt }) => {
  return (
    <div key={id} className="relative pl-4">
      <div className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full border-2 border-[#161616] bg-zinc-500" />

      <div className="mb-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
        <p className="mb-2 text-xs leading-snug text-zinc-300">
          {lastComment || "No comment text"}
        </p>

        <div className="space-y-1 border-t border-zinc-800 pt-2">
          <p className="text-[10px] font-semibold capitalize text-zinc-200">
            {lastAction || "N/A"}
          </p>
          <p className="text-[10px] font-medium capitalize text-zinc-500">
            {username}
          </p>
          <p className="text-[10px] text-zinc-600">{formatDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Comment);
