import { memo } from "react";

const DetailRow = ({ label, value, className = "" }) => (
  <div className="space-y-0.5 min-w-0 overflow-visible">
    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
      {label}
    </p>
    <p
      className={`text-sm font-semibold text-zinc-900 capitalize overflow-visible ${className}`}
    >
      {value || "N/A"}
    </p>
  </div>
  );

export default memo(DetailRow)
