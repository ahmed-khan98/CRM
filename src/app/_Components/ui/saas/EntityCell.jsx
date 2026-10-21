"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const COLORS = [
  "bg-violet-50 text-zinc-900",
  "bg-rose-50 text-rose-600",
  "bg-amber-50 text-amber-700",
  "bg-emerald-50 text-emerald-700",
  "bg-sky-50 text-sky-700",
  "bg-orange-100 text-amber-700",
];

function initialsFrom(name) {
  const safe = String(name || "U").trim();
  return safe
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EntityCell({
  image,
  avatar,
  name,
  subtitle,
  href,
  onClick,
}) {
  const src = image || avatar || "/dummy.png";
  const [broken, setBroken] = useState(false);
  const initials = useMemo(() => initialsFrom(name), [name]);
  const color = COLORS[String(name || "U").charCodeAt(0) % COLORS.length];

  const titleClass =
    "text-sm font-semibold leading-none text-zinc-900 capitalize truncate";

  const title = href ? (
    <Link href={href} className={`${titleClass} hover:text-zinc-900`}>
      {name || "—"}
    </Link>
  ) : onClick ? (
    <button type="button" onClick={onClick} className={`${titleClass} text-left`}>
      {name || "—"}
    </button>
  ) : (
    <span className={titleClass}>{name || "—"}</span>
  );

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {src && !broken ? (
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-purple-100">
          <Image
            src={src}
            alt=""
            fill
            sizes="36px"
            className="object-cover"
            onError={() => setBroken(true)}
          />
        </div>
      ) : (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${color}`}
        >
          {initials}
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        {title}
        {subtitle != null && subtitle !== "" && (
          <span className="mt-1 truncate text-xs text-zinc-500">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
