export default function Checkbox({
  label,
  className = "",
  id,
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2 text-sm text-slate-700 ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        {...props}
      />
      {label}
    </label>
  );
}
