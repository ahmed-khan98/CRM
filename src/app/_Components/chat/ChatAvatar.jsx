"use client";

import { memo } from "react";

function ChatAvatar({ src, name, online, size = "md" }) {
  const sz =
    size === "xs"
      ? "h-5 w-5 text-[9px]"
      : size === "sm"
        ? "h-9 w-9 text-xs"
        : size === "lg"
          ? "h-14 w-14 text-lg"
          : "h-11 w-11 text-sm";
  const dot =
    size === "xs"
      ? "h-1.5 w-1.5 border"
      : "h-3 w-3 border-2";
  return (
    <div className="relative shrink-0">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={`${sz} rounded-full object-cover`} />
      ) : (
        <div
          className={`${sz} flex items-center justify-center rounded-full bg-zinc-900 font-semibold text-white`}
        >
          {(name || "?").charAt(0).toUpperCase()}
        </div>
      )}
      {online && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-white bg-emerald-500 ${dot}`}
        />
      )}
    </div>
  );
}

const Avatar = memo(ChatAvatar);
export { Avatar };
export default Avatar;
