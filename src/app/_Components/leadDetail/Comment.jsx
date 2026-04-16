import { formatDate } from "@/app/utilities/date";
import React from "react";

const Comment = ({ id, lastComment, username, lastAction, createdAt }) => {
  return (
    <div key={id} className="relative pl-4">
      {/* Timeline Dot */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full -left-[6px] top-3 ring-2"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", ringColor: "rgba(99,102,241,0.3)" }}
      />

      {/* Comment Card */}
      <div
        className="rounded-xl p-3 mb-1"
        style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.12)",
        }}
      >
        <p className="text-xs text-white/60 leading-snug mb-2">
          {lastComment || "No comment text"}
        </p>

        <div className="pt-2 border-t space-y-1" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] font-semibold capitalize" style={{ color: "#a78bfa" }}>
            {lastAction || "N/A"}
          </p>
          <p className="text-[10px] font-medium text-white/50 capitalize">{username}</p>
          <p className="text-[10px] text-white/30">{formatDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Comment);
