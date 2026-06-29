import Select from "react-select";

// Reusable Formik-aware Select
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
}) {
  const selected = isMulti
    ? Array.isArray(value)
      ? options?.filter((o) => value.includes(o.value)) ?? []
      : []
    : options?.find((o) => o.value === value) ?? null;
  const hasError = Boolean(error && touched);

  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="block text-[12px] font-medium text-gray-800 mb-1"
        >
          {label}
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
  styles={{
    control: (base, state) => ({
      ...base,
      borderRadius: 16, 
      minHeight: "2.5rem",
      textTransform: "capitalize",
      fontSize: "13px",
      cursor: "pointer",
      backgroundColor: "white", // Agar dark mode input chahiye toh isay #18181b kar dein
      borderColor: state.isFocused
        ? "#09090b" // Zinc-950 (Focus par blackish look)
        : hasError
        ? "#ef4444" 
        : "#e5e7eb", 
      boxShadow: state.isFocused ? "0 0 0 1px #09090b" : "none",
      ":hover": { borderColor: "#18181b" }, // Zinc-900 on hover
    }),

    option: (base, state) => ({
      ...base,
      textTransform: "capitalize",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: "500",
      // Focus ya Select hone par light gray background
      backgroundColor: state.isSelected
        ? "#f4f4f5" // zinc-100
        : state.isFocused
        ? "#fafafa" // zinc-50
        : "white",
      "&:hover": {
        backgroundColor: "#18181b", // Zinc-900 (Hover par dark background)
        color: "white",
      },
      // Text color logic
      color: state.isSelected ? "#09090b" : "#3f3f46", // zinc-950 vs zinc-600
    }),

    valueContainer: (b) => ({ ...b, padding: "0 0.75rem" }),
    placeholder: (b) => ({ ...b, color: "#9ca3af" }), // gray-400
    singleValue: (b) => ({ ...b, color: "#111827" }), 
    menu: (b) => ({ 
      ...b, 
      zIndex: 50,
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
    }),
              menuPortal: (b) => ({ ...b, zIndex: 9999 }),

  }}
/>
      {hasError ? (
        <div className="text-red-500  text-[11px] mt-1">{error}</div>
      ) : null}
    </div>
  );
}
export default FormikSelect;


