import React, { memo, useMemo } from "react";

const COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-orange-100 text-orange-700",
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
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black ${color}`}>
      {initials}
    </div>
  );
});