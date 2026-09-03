"use client";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  loading = false,
  disabled,
  ...props
}) {
  const variants = {
    primary:
      "bg-slate-950 text-white border-slate-950 hover:bg-slate-800",
    secondary:
      "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 border-transparent hover:bg-slate-100",
    danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
