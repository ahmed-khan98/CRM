import { memo } from "react";

function safeCount(length) {
  const n = Number(length);
  return Number.isFinite(n) ? n : 0;
}

const Header = ({ icon: Icon, length, name, metaLabel = "records" }) => {
  const showMeta = length != null && length !== "";

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {Icon ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300">
          <Icon className="h-4 w-4 text-zinc-100" />
        </div>
      ) : null}
      <div className="min-w-0 leading-tight">
        <h1 className="truncate text-sm font-bold tracking-tight text-zinc-200">
          {name}
        </h1>
        {showMeta ? (
          <p className="mt-0.5 text-xs font-normal text-zinc-400">
            {safeCount(length).toLocaleString()} {metaLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Header);