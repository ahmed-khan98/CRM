import { memo } from "react";

const SuccessRow = ({ label, value }) => {
  return (
    <div className="flex justify-between text-sm gap-4 py-1  border-b border-zinc-100">
      <span className="text-zinc-400 shrink-0 text-[12px]">{label}</span>
      <span className="text-zinc-700 font-medium text-right">{value}</span>
    </div>
  );
}

export default memo(SuccessRow)
