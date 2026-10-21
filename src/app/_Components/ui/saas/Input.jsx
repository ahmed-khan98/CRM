export default function Input({
  className = "",
  error,
  id,
  ...props
}) {
  return (
    <input
      id={id}
      aria-invalid={error ? true : undefined}
      className={`input-control ${error ? "input-control-error" : ""} ${className}`}
      {...props}
    />
  );
}
