import React from "react";

const AssignmentItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-zinc-400" />
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold capitalize text-zinc-100">
        {value || "N/A"}
      </p>
    </div>
  );
};

export default React.memo(AssignmentItem);
