"use client";

const variants = {
  primary:
    "bg-ink text-white border-zinc-800 hover:bg-zinc-800 active:bg-ink",
  secondary:
    "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50 active:bg-zinc-50",
  outline:
    "bg-transparent text-zinc-900 border-zinc-200 hover:bg-zinc-50",
  ghost: "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-50",
  destructive:
    "bg-rose-500 text-white border-rose-400 hover:bg-red-600 active:bg-red-700",
  danger:
    "bg-rose-500 text-white border-rose-400 hover:bg-red-600 active:bg-red-700",
  link: "bg-transparent border-transparent text-zinc-900 underline-offset-4 hover:underline px-0 h-auto",
  icon: "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50 px-0",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-10 px-4 text-sm",
  icon: "h-10 w-10 p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  loading = false,
  disabled,
  ...props
}) {
  const resolvedSize = variant === "icon" ? "icon" : size;
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
        variants[variant] || variants.primary
      } ${sizes[resolvedSize] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}
