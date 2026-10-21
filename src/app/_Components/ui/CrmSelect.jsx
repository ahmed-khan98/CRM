"use client";

import { memo, useMemo } from "react";
import Select from "react-select";

/** Match theme-zyro-dark InputField: bg #121212, border #27272a, 1px, rounded-xl */
const FIELD_BG = "#121212";
const FIELD_BORDER = "#27272a";
const FIELD_BORDER_FOCUS = "#a3a3a3";

/** Canonical dark react-select styles for the whole CRM */
export const crmDarkSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.625rem",
    borderRadius: "0.75rem",
    backgroundColor: FIELD_BG,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: state.isFocused ? FIELD_BORDER_FOCUS : FIELD_BORDER,
    boxShadow: "none",
    fontSize: "13px",
    fontWeight: 500,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.6 : 1,
    ":hover": {
      borderColor: state.isDisabled ? FIELD_BORDER : "#3f3f46",
    },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  singleValue: (base) => ({
    ...base,
    fontSize: "12px",
    fontWeight: 600,
    color: "#e4e4e7",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#27272a",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#e4e4e7",
    fontSize: "11px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#a1a1aa",
    ":hover": { backgroundColor: "#3f3f46", color: "#fafafa" },
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "12px",
    fontWeight: 500,
    color: "#71717a",
  }),
  input: (base) => ({
    ...base,
    color: "#fafafa",
    fontSize: "12px",
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (base) => ({ ...base }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 8px",
    color: "#71717a",
    ":hover": { color: "#a1a1aa" },
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    color: "#71717a",
    ":hover": { color: "#f87171" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#18181b",
    borderRadius: "0.75rem",
    overflow: "hidden",
    zIndex: 100,
    border: `1px solid ${FIELD_BORDER}`,
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: "#18181b",
    padding: 4,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    fontSize: "13px",
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

/** @deprecated alias — light theme removed; all CRM selects use dark */
export const crmSelectStyles = crmDarkSelectStyles;

/** Compact pill (toolbar filters) */
export const crmPillSelectStyles = {
  ...crmDarkSelectStyles,
  control: (base, state) => ({
    ...crmDarkSelectStyles.control(base, state),
    minHeight: "2rem",
    height: "2rem",
    borderRadius: "9999px",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 4px 0 10px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
  }),
  singleValue: (base) => ({
    ...crmDarkSelectStyles.singleValue(base),
    fontSize: "11px",
    lineHeight: "1",
    margin: 0,
    position: "static",
    transform: "none",
    maxWidth: "100%",
  }),
  placeholder: (base) => ({
    ...crmDarkSelectStyles.placeholder(base),
    fontSize: "11px",
    lineHeight: "1",
    margin: 0,
    position: "static",
    transform: "none",
  }),
  input: (base) => ({
    ...crmDarkSelectStyles.input(base),
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "100%",
    display: "flex",
    alignItems: "center",
    alignSelf: "stretch",
  }),
  dropdownIndicator: (base) => ({
    ...crmDarkSelectStyles.dropdownIndicator(base),
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
    height: "100%",
  }),
};

const STYLE_MAP = {
  light: crmDarkSelectStyles,
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
  variant = "dark",
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

  const styles = stylesOverride || STYLE_MAP[variant] || crmDarkSelectStyles;

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
