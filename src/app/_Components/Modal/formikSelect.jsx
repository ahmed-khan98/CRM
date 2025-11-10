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
          className="block text-sm font-medium text-gray-800 mb-1"
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
        // onChange={(opt) => {
        //   const val = opt ? opt.value : "";
        //   setFieldValue(name, val);
        //   onChangeExtra(val);
        // }}
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
            borderRadius: 16, // ~rounded-2xl
            minHeight: "2.5rem",
            textTransform: "capitalize",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "white",
            borderColor: state.isFocused
              ? "#5f2781"
              : hasError
              ? "#ef4444" // red-500
              : "#e5e7eb", // gray-200
            boxShadow: state.isFocused ? "0 0 0 1px #5f2781" : "none",
            ":hover": { borderColor: "#5f2781" },
          }),

          option: (base, state) => ({
            ...base,
            textTransform: "capitalize",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "500",
            backgroundColor: state.isFocused
              ? "#dac1f2"
              : state.isSelected
              ? "#dac1f2"
              : "white",
            "&:hover": {
              backgroundColor: "#5f2781",
              color: "white",
            },
            color: state.isFocused ? "#5f2781" : "inherit",
          }),

          valueContainer: (b) => ({ ...b, padding: "0 0.75rem" }),
          placeholder: (b) => ({ ...b, color: "#6b7280" }), // gray-500
          singleValue: (b) => ({ ...b, color: "#111827" }), // gray-900
          menu: (b) => ({ ...b, zIndex: 50 }),
        }}
      />
      {hasError ? (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      ) : null}
    </div>
  );
}
export default FormikSelect;
