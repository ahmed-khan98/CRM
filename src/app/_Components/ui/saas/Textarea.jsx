export default function Textarea({ className = "", error, id, ...props }) {
  return (
    <textarea
      id={id}
      aria-invalid={error ? true : undefined}
      className={`input-control min-h-24 py-2 ${error ? "input-control-error" : ""} ${className}`}
      {...props}
    />
  );
}
