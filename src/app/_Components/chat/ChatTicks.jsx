"use client";

import { memo } from "react";
import { Check, CheckCheck } from "lucide-react";

function ChatTicks({ status, soft = false }) {
  if (!status) return null;
  const muted = soft ? "text-zinc-500/80" : "text-zinc-400";
  if (status === "seen")
    return <CheckCheck className="h-3.5 w-3.5 text-sky-500 inline shrink-0" />;
  if (status === "delivered")
    return <CheckCheck className={`h-3.5 w-3.5 ${muted} inline shrink-0`} />;
  return <Check className={`h-3.5 w-3.5 ${muted} inline shrink-0`} />;
}

const Ticks = memo(ChatTicks);
export { Ticks };
export default Ticks;
