import Select from "react-select";

function FormikBreakSelect({
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
      {label && (
        <label
          htmlFor={name}
          className="block text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 mb-1.5"
        >
          {label}
        </label>
      )}

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
        /* ── Fix: portal to body so modal overflow doesn't clip the menu ── */
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
            borderRadius: "12px",
            minHeight: "2.5rem",
            fontSize: "13px",
            cursor: "pointer",
            textTransform: "capitalize",
            backgroundColor: "rgba(255,255,255,0.04)",
            borderColor: state.isFocused
              ? "rgba(255,255,255,0.2)"
              : hasError
              ? "#ef4444"
              : "rgba(255,255,255,0.08)",
            boxShadow: state.isFocused
              ? "0 0 0 1px rgba(255,255,255,0.2)"
              : "none",
            color: "#e4e4e7",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.16)",
            },
          }),

          option: (base, state) => ({
            ...base,
            textTransform: "capitalize",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: "500",
            backgroundColor: state.isSelected
              ? "rgba(255,255,255,0.1)"
              : state.isFocused
              ? "rgba(255,255,255,0.06)"
              : "#0d0d0f",
            color: state.isSelected ? "#f4f4f5" : "#a1a1aa",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#f4f4f5",
            },
          }),

          menu: (base) => ({
            ...base,
            zIndex: 9999,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#0d0d0f",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
          }),

          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),

          menuList: (base) => ({
            ...base,
            padding: "4px",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#0d0d0f",
          }),

          valueContainer: (base) => ({
            ...base,
            padding: "0 0.75rem",
          }),

          placeholder: (base) => ({
            ...base,
            color: "#52525b",
            fontSize: "13px",
          }),

          singleValue: (base) => ({
            ...base,
            color: "#e4e4e7",
            textTransform: "capitalize",
          }),

          multiValue: (base) => ({
            ...base,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: "6px",
          }),

          multiValueLabel: (base) => ({
            ...base,
            color: "#d4d4d8",
            fontSize: "12px",
          }),

          multiValueRemove: (base) => ({
            ...base,
            color: "#71717a",
            "&:hover": {
              backgroundColor: "rgba(239,68,68,0.15)",
              color: "#f87171",
            },
          }),

          input: (base) => ({
            ...base,
            color: "#e4e4e7",
          }),

          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: "rgba(255,255,255,0.08)",
          }),

          dropdownIndicator: (base) => ({
            ...base,
            color: "#52525b",
            "&:hover": { color: "#a1a1aa" },
          }),

          clearIndicator: (base) => ({
            ...base,
            color: "#52525b",
            "&:hover": { color: "#f87171" },
          }),

          loadingIndicator: (base) => ({
            ...base,
            color: "#52525b",
          }),
        }}
      />

      {hasError && (
        <div className="text-red-400 text-[11px] mt-1">{error}</div>
      )}
    </div>
  );
}

export default FormikBreakSelect;