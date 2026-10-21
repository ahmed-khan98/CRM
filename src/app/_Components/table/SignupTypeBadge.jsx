import { BADGE_BASE } from "@/app/_Components/ui/saas/Badge";

const SIGNUP_TYPE_STYLES = {
  cold:      "bg-sky-500/15 text-sky-300 border-sky-500/30",
  PPC:       "bg-zinc-800 text-zinc-200 border-zinc-600",
  chat:      "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  email:     "bg-sky-500/15 text-sky-300 border-sky-500/30",
  google:    "bg-rose-500/15 text-rose-300 border-rose-500/30",
  facebook:  "bg-zinc-800 text-zinc-200 border-zinc-600",
  USPTO:     "bg-amber-500/15 text-amber-300 border-amber-500/30",
  meta:      "bg-zinc-800 text-zinc-200 border-zinc-600",
  instagram: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  linkedin:  "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  twitter:   "bg-sky-500/15 text-sky-300 border-sky-500/30",
  other:     "bg-zinc-800 text-zinc-300 border-zinc-600",
};

const SIGNUP_TYPE_DOTS = {
  cold:      "bg-sky-400",
  PPC:       "bg-zinc-400",
  chat:      "bg-emerald-400",
  email:     "bg-sky-400",
  google:    "bg-rose-400",
  facebook:  "bg-zinc-400",
  USPTO:     "bg-amber-400",
  meta:      "bg-zinc-400",
  instagram: "bg-pink-400",
  linkedin:  "bg-cyan-400",
  twitter:   "bg-sky-400",
  other:     "bg-zinc-500",
};

export default function SignupTypeBadge({ type }) {
  if (!type) {
    return <span className="text-[11px] text-zinc-500">—</span>;
  }

  const badgeStyle = SIGNUP_TYPE_STYLES[type] ?? SIGNUP_TYPE_STYLES.other;
  const dotStyle   = SIGNUP_TYPE_DOTS[type]   ?? SIGNUP_TYPE_DOTS.other;

  return (
    <span className={`${BADGE_BASE} capitalize ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      {type}
    </span>
  );
}
