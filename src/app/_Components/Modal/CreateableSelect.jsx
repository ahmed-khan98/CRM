import CreatableSelect from "react-select/creatable";
import { crmDarkSelectStyles } from "@/app/_Components/ui/CrmSelect";

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

  const styles = {
    ...crmDarkSelectStyles,
    control: (base, state) => ({
      ...crmDarkSelectStyles.control(base, state),
      borderRadius: "0.75rem",
      minHeight: "2.625rem",
      textTransform: "capitalize",
      fontSize: "13px",
      borderColor: hasError
        ? "rgba(248,113,113,0.7)"
        : state.isFocused
          ? "#a3a3a3"
          : "#27272a",
    }),
    option: (base, state) => ({
      ...crmDarkSelectStyles.option(base, state),
      textTransform: "capitalize",
      fontSize: "13px",
    }),
  };

  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1.5 block text-[12px] font-medium text-zinc-300"
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
        styles={styles}
      />
      {hasError ? (
        <div className="mt-1 text-[11px] text-rose-400">{error}</div>
      ) : null}
    </div>
  );
}

export default FormikCreateableSelect;