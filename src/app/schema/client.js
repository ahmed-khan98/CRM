import * as Yup from "yup";

export const clientSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  brandId: Yup.string().required("Please select a brand"),
  handleBy: Yup.string().required("Please select a agent"),
  name: Yup.string().required("name is required"),
  signupType: Yup.string().required("signup type is required"),
   email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    // .matches(
    //   /^\d{4}-\d{7}$/,
    //   "Phone number must be in the format 0300-1234567"
    // )
    ,

  image: Yup.mixed()
    .nullable()
    // Required only on create
    .test("required-on-create", "client image is required", (v, ctx) => {
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
});