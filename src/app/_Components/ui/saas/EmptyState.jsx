const tones = {
  default: "border-zinc-200 text-zinc-500",
  search: "border-zinc-200 text-zinc-500",
  error: "border-rose-200 text-rose-600",
  permission: "border-amber-200 text-amber-700",
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed bg-white px-6 py-16 text-center shadow-sm ${
        tones[tone] || tones.default
      }`}
    >
      {Icon && (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 text-zinc-500">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      )}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
