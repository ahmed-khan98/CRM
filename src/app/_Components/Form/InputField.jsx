import { Field, ErrorMessage } from "formik";

const InputField = ({
  label,
  name,
  type = "text",
  errors,
  touched,
  icon: Icon,
}) => {
  const hasError = errors && touched;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {Icon && <Icon className="inline w-3 h-3 mr-1" />}
        {label}
      </label>

      <Field
        type={type}
        name={name}
        className={`w-full px-4 py-2 border rounded-xl focus:outline-none transition-colors ${
          hasError
            ? "border-zinc-500 focus:border-zinc-500"
            : "border-gray-200 focus:border-blue-500"
        }`}
      />

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-[11px] mt-1 "
      />
    </div>
  );
};

export default InputField;