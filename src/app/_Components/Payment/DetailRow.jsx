import { memo } from "react";

const DetailRow = ({ label, value, className = "" }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
      {label}
    </p>
    <p
      className={`text-sm font-semibold text-slate-700 capitalize ${className}`}
    >
      {value || "N/A"}
    </p>
  </div>
  );

export default memo(DetailRow)
