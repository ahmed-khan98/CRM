const variants = {
  default: "border-zinc-200 bg-white shadow-sm",
  stat: "border-zinc-200 bg-white shadow-sm",
  info: "border-sky-200 bg-sky-50/40 shadow-sm",
  warning: "border-amber-200 bg-amber-50/40 shadow-sm",
  success: "border-emerald-200 bg-emerald-50/40 shadow-sm",
  interactive:
    "border-zinc-200 bg-white shadow-sm transition hover:bg-zinc-50 cursor-pointer",
};

export default function Card({
  children,
  variant = "default",
  className = "",
  onClick,
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`rounded-3xl border p-5 text-left ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
