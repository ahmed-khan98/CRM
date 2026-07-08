"use client";

import { memo } from "react";
import { User2 } from "lucide-react";
import Image from "next/image";

const SIZE_MAP = { 5: "h-5 w-5", 6: "h-6 w-6", 7: "h-7 w-7", 8: "h-8 w-8" };

function Avatar({ user, size = 8, className = "" }) {
  const cls = SIZE_MAP[size] || SIZE_MAP[8];
  return (
    <div className={`relative ${cls} shrink-0 rounded-full overflow-hidden bg-zinc-200 ring-2 ring-white flex items-center justify-center ${className}`}>
      {user?.image
        ? <Image src={user.image} alt={user.fullName || ""} fill className="object-cover" />
        : <User2 className="h-3.5 w-3.5 text-zinc-400" />
      }
    </div>
  );
}

export default memo(Avatar);
