import * as Yup from "yup";

export const empSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  joiningDate: Yup.date().required("Joining date is required"),
  designation: Yup.string().required("designation is required"),
  fullName: Yup.string().required("full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  // lastName: Yup.string().required("last name time is required"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\d{4}-\d{7}$/,
      "Phone number must be in the format 0300-1234567"
    ),
  CNIC: Yup.string()
    .required("CNIC is required")
    .matches(
      /^\d{5}-\d{7}-\d{1}$/,
      "CNIC must be in the format 40000-1234567-8"
    ),
  image: Yup.mixed()
    .nullable()
    // Required only on create
    .test("required-on-create", "Employee image is required", (v, ctx) => {
      const isEdit = !!ctx?.options?.context?.isEdit;
      if (isEdit) return true;
      return !!v; // must provide something on create
    })
    // Allow string (existing URL) in edit; otherwise must be a File of allowed type
    .test("fileType", "Only JPG/PNG files are allowed", (v) => {
      if (!v || typeof v === "string") return true; // URL allowed; empty handled above
      return ["image/jpeg", "image/png"].includes(v.type);
    })
    .test("fileSize", "File size must be less than 2MB", (v) => {
      if (!v || typeof v === "string") return true;
      return v.size <= 2 * 1024 * 1024;
    }),
  address: Yup.string().max(500, "address must be less than 500 characters"),
  password: Yup.string().when("$isEdit", {
    is: true, // edit mode
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
  }),
});
