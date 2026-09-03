import { memo } from "react";

const Header = ({ icon: Icon, length, name }) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md shadow-slate-900/15">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          {name}
        </h1>
        {length != null && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {Number(length).toLocaleString()} records
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(Header);
