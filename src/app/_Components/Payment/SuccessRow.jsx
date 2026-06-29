import { memo } from "react";

const SuccessRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5 bg-zinc-50">
      <div className="w-6 h-6 rounded-md bg-zinc-200 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-zinc-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-[12px] font-semibold text-zinc-800">{value}</p>
      </div>
    </div>
  );
};

export default memo(SuccessRow);
