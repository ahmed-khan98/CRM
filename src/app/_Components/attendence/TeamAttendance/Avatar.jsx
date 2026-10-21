import React, { memo, useMemo } from "react";

const COLORS = [
  "bg-violet-500/20 text-violet-300",
  "bg-rose-500/20 text-rose-300",
  "bg-amber-500/20 text-amber-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-sky-500/20 text-sky-300",
  "bg-orange-500/20 text-orange-300",
];

export const Avatar = memo(({ name }) => {
  const { initials, color } = useMemo(() => {
    const safeName = name || "U";
    const initials = safeName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const color = COLORS[safeName.charCodeAt(0) % COLORS.length];

    return { initials, color };
  }, [name]);

  return (
    <div
      className={`flex size-8 min-h-8 min-w-8 max-h-8 max-w-8 shrink-0 grow-0 self-center items-center justify-center overflow-hidden rounded-full text-xs font-medium leading-none ${color}`}
      style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
    >
      {initials}
    </div>
  );
});
