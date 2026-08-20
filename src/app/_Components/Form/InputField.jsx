import { Field, ErrorMessage } from "formik";
import { fleet } from "../fleet/fleetTheme";

const InputField = ({
  label,
  name,
  type = "text",
  errors,
  as = "input",
  touched,
  icon: Icon,
  readOnly = false,
  variant = "light",
  required = false,
  placeholder,
  rows,
}) => {
  const hasError = errors && touched;
  const isDark = variant === "dark";

  const lightClass = hasError
    ? "border-[1px] border-solid border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-[1px] border-solid border-zinc-200 bg-white focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100";

  const darkClass = hasError
    ? "border-red-400/60 bg-[#161b22] text-white focus:border-red-400"
    : fleet.modalInput;

  return (
    <div>
      {label ? (
        <label
          className={
            isDark
              ? fleet.modalLabel
              : "block text-[12px] font-medium text-gray-800 mb-1"
          }
        >
          {Icon && <Icon className="inline w-3 h-3 mr-1" />}
          {label}
          {required && isDark && <span className="text-white"> *</span>}
        </label>
      ) : null}

      <Field
        as={as}
        type={type}
        name={name}
        readOnly={readOnly}
        placeholder={placeholder}
        rows={as === "textarea" ? rows || 3 : undefined}
        className={`${isDark ? "" : "crm-field "}text-[13px] w-full px-3.5 py-2.5 rounded-xl focus:outline-none transition-colors ${
          as === "textarea" ? "resize-y min-h-[88px]" : "min-h-[42px]"
        } ${isDark ? darkClass : lightClass}`}
      />

      <ErrorMessage
        name={name}
        component="div"
        className={`text-[11px] mt-1 ${isDark ? "text-red-400" : "text-red-500"}`}
      />
    </div>
  );
};

export default InputField;
