export default function Input({ className = "", error, ...props }) {
  return (
    <input
      className={`h-10 w-full rounded-xl border bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${
        error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200"
      } ${className}`}
      {...props}
    />
  );
}
