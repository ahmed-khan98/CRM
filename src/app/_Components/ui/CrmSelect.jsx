"use client";

import { memo, useMemo } from "react";
import Select from "react-select";

/** Light CRM toolbar / form selects (matches TaskSearchBar / project selects) */
export const crmSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.25rem",
    borderRadius: "0.75rem",
    backgroundColor: "#ffffff",
    borderColor: state.isFocused ? "#18181b" : "#e4e4e7",
    boxShadow: "none",
    fontSize: "12px",
    fontWeight: 600,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.6 : 1,
    ":hover": { borderColor: state.isDisabled ? "#e4e4e7" : "#a1a1aa" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  singleValue: (base) => ({
    ...base,
    fontSize: "12px",
    fontWeight: 600,
    color: "#3f3f46",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "12px",
    fontWeight: 500,
    color: "#a1a1aa",
  }),
  input: (base) => ({ ...base, fontSize: "12px", margin: 0, padding: 0 }),
  indicatorsContainer: (base) => ({ ...base }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 8px",
    color: "#a1a1aa",
    ":hover": { color: "#52525b" },
  }),
  clearIndicator: (base) => ({ ...base, padding: "0 4px", color: "#a1a1aa" }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base) => ({
    ...base,
    borderRadius: "1rem",
    overflow: "hidden",
    zIndex: 100,
    border: "1px solid #f4f4f5",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    fontSize: "12px",
    fontWeight: state.isSelected ? 600 : 500,
    padding: "10px 14px",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#18181b"
      : state.isFocused
        ? "#f4f4f5"
        : "white",
    color: state.isSelected ? "white" : "#27272a",
    ":active": {
      backgroundColor: state.isSelected ? "#18181b" : "#e4e4e7",
    },
  }),
};

/** Compact pill (toolbar filters) */
export const crmPillSelectStyles = {
  ...crmSelectStyles,
  control: (base, state) => ({
    ...crmSelectStyles.control(base, state),
    minHeight: "2rem",
    height: "2rem",
    borderRadius: "9999px",
    fontSize: "11px",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 4px 0 10px",
    height: "2rem",
  }),
  singleValue: (base) => ({
    ...crmSelectStyles.singleValue(base),
    fontSize: "11px",
  }),
  indicatorsContainer: (base) => ({ ...base, height: "2rem" }),
};

/** Dark panels (sale filters, fleet modals) */
export const crmDarkSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.75rem",
    borderRadius: "0.75rem",
    backgroundColor: "#09090b",
    borderColor: state.isFocused ? "#6366f1" : "#27272a",
    boxShadow: "none",
    fontSize: "12px",
    fontWeight: 600,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.6 : 1,
    ":hover": { borderColor: state.isDisabled ? "#27272a" : "#3f3f46" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 12px" }),
  singleValue: (base) => ({
    ...base,
    fontSize: "12px",
    fontWeight: 600,
    color: "#e4e4e7",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#71717a",
  }),
  input: (base) => ({ ...base, color: "#fff", fontSize: "12px" }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 10px",
    color: "#71717a",
  }),
  clearIndicator: (base) => ({ ...base, color: "#71717a" }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#18181b",
    borderRadius: "1rem",
    overflow: "hidden",
    zIndex: 100,
    border: "1px solid #27272a",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    fontSize: "12px",
    fontWeight: state.isSelected ? 600 : 500,
    padding: "10px 14px",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#27272a"
      : state.isFocused
        ? "#1c1c1f"
        : "#18181b",
    color: "#fafafa",
    ":active": { backgroundColor: "#3f3f46" },
  }),
};

const STYLE_MAP = {
  light: crmSelectStyles,
  pill: crmPillSelectStyles,
  dark: crmDarkSelectStyles,
};

/**
 * Shared react-select wrapper — use instead of native &lt;select&gt;.
 *
 * @param {{ value: string, onChange: (value: string) => void, options: {value:string,label:string}[], variant?: 'light'|'pill'|'dark', isClearable?: boolean, isSearchable?: boolean, isDisabled?: boolean, placeholder?: string, className?: string, name?: string }} props
 */
function CrmSelect({
  value,
  onChange,
  options = [],
  variant = "light",
  isClearable = false,
  isSearchable = false,
  isDisabled = false,
  placeholder = "Select…",
  className = "",
  name,
  styles: stylesOverride,
  ...rest
}) {
  const selected = useMemo(() => {
    if (value === undefined || value === null) return null;
    return options.find((o) => String(o.value) === String(value)) || null;
  }, [options, value]);

  const styles = stylesOverride || STYLE_MAP[variant] || crmSelectStyles;

  return (
    <div className={className || undefined}>
      <Select
        name={name}
        options={options}
        value={selected}
        onChange={(opt) => onChange?.(opt?.value ?? "")}
        styles={styles}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        placeholder={placeholder}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
        classNamePrefix="crm-select"
        {...rest}
      />
    </div>
  );
}

export default memo(CrmSelect);
