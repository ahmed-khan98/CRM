import Select from "react-select";
import { crmDarkSelectStyles } from "@/app/_Components/ui/CrmSelect";

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
  variant = "dark",
  required = false,
}) {
  const selected = isMulti
    ? Array.isArray(value)
      ? options?.filter((o) => value.includes(o.value)) ?? []
      : []
    : options?.find((o) => o.value === value) ?? null;
  const hasError = Boolean(error && touched);

  const styles = {
    ...crmDarkSelectStyles,
    control: (base, state) => ({
      ...crmDarkSelectStyles.control(base, state),
      minHeight: "2.625rem",
      borderRadius: "0.75rem",
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
      fontSize: "14px",
    }),
    singleValue: (base) => ({
      ...crmDarkSelectStyles.singleValue(base),
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
          {required ? <span className="text-zinc-100"> *</span> : null}
        </label>
      ) : null}

      <Select
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

export default FormikSelect;
