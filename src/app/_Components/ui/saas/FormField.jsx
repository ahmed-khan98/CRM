export default function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={htmlFor} className="field-label">
          {label}
          {required ? (
            <span className="ml-1 text-rose-600" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
