const SIGNUP_TYPE_STYLES = {
  cold:      "bg-sky-50 text-sky-700 border-sky-200",
  PPC:       "bg-violet-50 text-violet-700 border-violet-200",
  chat:      "bg-teal-50 text-teal-700 border-teal-200",
  email:     "bg-blue-50 text-blue-700 border-blue-200",
  google:    "bg-red-50 text-red-600 border-red-200",
  facebook:  "bg-indigo-50 text-indigo-700 border-indigo-200",
  USPTO:     "bg-amber-50 text-amber-700 border-amber-200",
  meta:      "bg-purple-50 text-purple-700 border-purple-200",
  instagram: "bg-pink-50 text-pink-700 border-pink-200",
  linkedin:  "bg-cyan-50 text-cyan-700 border-cyan-200",
  twitter:   "bg-sky-50 text-sky-600 border-sky-200",
  other:     "bg-zinc-100 text-zinc-500 border-zinc-200",
};

const SIGNUP_TYPE_DOTS = {
  cold:      "bg-sky-400",
  PPC:       "bg-violet-400",
  chat:      "bg-teal-400",
  email:     "bg-blue-400",
  google:    "bg-red-400",
  facebook:  "bg-indigo-400",
  USPTO:     "bg-amber-400",
  meta:      "bg-purple-400",
  instagram: "bg-pink-400",
  linkedin:  "bg-cyan-400",
  twitter:   "bg-sky-400",
  other:     "bg-zinc-400",
};

export default function SignupTypeBadge({ type }) {
  if (!type) {
    return (
      <td className="border-b border-zinc-100 px-4 py-2.5 whitespace-nowrap">
        <span className="text-[11px] text-zinc-400">—</span>
      </td>
    );
  }

  const badgeStyle = SIGNUP_TYPE_STYLES[type] ?? SIGNUP_TYPE_STYLES.other;
  const dotStyle   = SIGNUP_TYPE_DOTS[type]   ?? SIGNUP_TYPE_DOTS.other;

  return (
    <td className="px-4 py-2.5 whitespace-nowrap">
      <span
        className={`inline-flex capitalize items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeStyle}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
        {type}
      </span>
    </td>
  );
}