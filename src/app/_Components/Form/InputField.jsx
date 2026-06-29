import { Field, ErrorMessage } from "formik";

const InputField = ({
  label,
  name,
  type = "text",
  errors,
  as = "input",
  touched,
  icon: Icon,
  readOnly = false,
}) => {
  const hasError = errors && touched;

  return (
    <div>
      <label className="block text-[12px] font-medium text-gray-800 mb-1">
        {Icon && <Icon className="inline w-3 h-3 mr-1" />}
        {label}
      </label>

      <Field
      as={as}
        type={type}
        name={name}
        readOnly={readOnly}
        className={`text-[13px] w-full px-4 py-1.5 border rounded-xl focus:outline-none transition-colors ${
          hasError
            ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
        }`}
      />

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-[11px] "
      />
    </div>
  );
};

export default InputField;