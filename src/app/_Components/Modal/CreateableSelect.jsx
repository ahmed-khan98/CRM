import Select from "react-select";
import CreatableSelect from "react-select/creatable";

// Reusable Formik-aware Select
function FormikCreateableSelect({
  name,
  label,
  options = [], // Default empty array taake error na aaye
  value, // Ye Formik ki current value hai (e.g., ["service1", "newtag"])
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
  
  // 👈 FIX 1: 'selected' logic update kiya taake naye tags bhi nazar aayein
  const selected = isMulti
    ? Array.isArray(value)
      ? value.map((val) => {
          const option = options.find((o) => o.value === val);
          // Agar list mein hai to wahi lo, warna naya object bana do display ke liye
          return option ? option : { label: val, value: val };
        })
      : []
    : options.find((o) => o.value === value) || (value ? { label: value, value: value } : null);

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

      <CreatableSelect
        inputId={name}
        className="react-select-container crm-select"
        classNamePrefix="rs"
        options={options}
        value={selected}
        isClearable
        isMulti={isMulti}
        isSearchable
        isLoading={isLoading}
        isDisabled={isDisabled}
        placeholder={placeholder}
        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
        
        // 👈 FIX 2: onCreateOption ko value prop use karne ke liye sahi kiya
        onCreateOption={(inputValue) => {
          const newTag = inputValue.trim();
          if (isMulti) {
            const currentValues = Array.isArray(value) ? value : [];
            if (!currentValues.includes(newTag)) {
              const updatedValues = [...currentValues, newTag];
              setFieldValue(name, updatedValues);
              onChangeExtra(updatedValues);
            }
          } else {
            setFieldValue(name, newTag);
            onChangeExtra(newTag);
          }
        }}

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
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "white",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: state.isFocused
              ? "#a1a1aa"
              : hasError
              ? "#ef4444"
              : "#e4e4e7",
            boxShadow: state.isFocused ? "0 0 0 3px rgba(24, 24, 27, 0.06)" : "none",
            ":hover": { borderColor: "#d4d4d8" },
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
        }}
      />
      {hasError ? (
        <div className="text-red-500 text-[11px] mt-1">{error}</div>
      ) : null}
    </div>
  );
}

export default FormikCreateableSelect;