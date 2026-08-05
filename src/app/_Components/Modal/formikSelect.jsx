import Select from "react-select";
import { modalSelectStyles } from "../fleet/fleetTheme";

function FormikSelect({
  name,
  label,
  options,
  value,
  setFieldValue,
  setFieldTouched,
  error,
  touched,
  placeholder = "Select...",
  isLoading = false,
  isDisabled = false,
  isMulti = false,
  onChangeExtra = () => {},
  variant = "light",
  required = false,
}) {
  const selected = isMulti
    ? Array.isArray(value)
      ? options?.filter((o) => value.includes(o.value)) ?? []
      : []
    : options?.find((o) => o.value === value) ?? null;
  const hasError = Boolean(error && touched);
  const isDark = variant === "dark";

  const lightStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 16,
      minHeight: "2.5rem",
      textTransform: "capitalize",
      fontSize: "13px",
      cursor: "pointer",
      backgroundColor: "white",
      borderColor: state.isFocused
        ? "#09090b"
        : hasError
          ? "#ef4444"
          : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px #09090b" : "none",
      ":hover": { borderColor: "#18181b" },
    }),
    option: (base, state) => ({
      ...base,
      textTransform: "capitalize",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: "500",
      backgroundColor: state.isSelected
        ? "#f4f4f5"
        : state.isFocused
          ? "#fafafa"
          : "white",
      "&:hover": {
        backgroundColor: "#18181b",
        color: "white",
      },
      color: state.isSelected ? "#09090b" : "#3f3f46",
    }),
    valueContainer: (b) => ({ ...b, padding: "0 0.75rem" }),
    placeholder: (b) => ({ ...b, color: "#9ca3af" }),
    singleValue: (b) => ({ ...b, color: "#111827" }),
    menu: (b) => ({
      ...b,
      zIndex: 50,
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    }),
    menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  };

  const darkStyles = {
    ...modalSelectStyles,
    control: (base, state) => ({
      ...modalSelectStyles.control(base, state),
      borderColor: hasError
        ? "rgba(248,113,113,0.7)"
        : state.isFocused
          ? "rgba(161,161,170,0.8)"
          : "rgba(255,255,255,0.1)",
    }),
  };

  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className={
            isDark
              ? "block text-[12px] font-medium text-zinc-300 mb-1.5"
              : "block text-[12px] font-medium text-gray-800 mb-1"
          }
        >
          {label}
          {required && isDark && <span className="text-white"> *</span>}
        </label>
      ) : null}

      <Select
        inputId={name}
        className="react-select-container"
        classNamePrefix="rs"
        options={options}
        value={selected}
        isClearable
        isMulti={isMulti}
        isSearchable
        isLoading={isLoading}
        isDisabled={isDisabled}
        placeholder={placeholder}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
        onChange={(opt) => {
          const val = isMulti
            ? Array.isArray(opt)
              ? opt.map((o) => o.value)
              : []
            : opt
              ? opt.value
              : "";
          setFieldValue(name, val);
          onChangeExtra(val);
        }}
        onBlur={() => setFieldTouched(name, true)}
        styles={isDark ? darkStyles : lightStyles}
      />
      {hasError ? (
        <div
          className={`text-[11px] mt-1 ${isDark ? "text-red-400" : "text-red-500"}`}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default FormikSelect;
