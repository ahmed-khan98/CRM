export default function Switch({
  checked,
  onChange,
  label,
  disabled,
  id,
}) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-zinc-900">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative h-5 w-9 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:opacity-50 ${
          checked ? "bg-ink" : "bg-zinc-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-4" : "left-0.5"
          }`}
        />
      </button>
      {label}
    </label>
  );
}
