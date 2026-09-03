"use client";

import CrmSelect from "@/app/_Components/ui/CrmSelect";

/**
 * SaaS Select — thin wrapper around shared CrmSelect (react-select).
 * Prefer importing CrmSelect directly for new code.
 */
export default function Select({
  className = "",
  error,
  children,
  options,
  value,
  onChange,
  ...props
}) {
  // Backward-compat: if callers still pass <option> children, fall back is not supported —
  // pass `options` [{ value, label }] instead.
  const resolvedOptions = options || [];

  return (
    <CrmSelect
      className={className}
      options={resolvedOptions}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
