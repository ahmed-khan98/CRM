import * as Yup from "yup";

export const vendorSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  vendorName: Yup.string().required("Vendor name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[\d+\-\s()]{7,20}$/, "Enter a valid phone number"),
  emergencyPhone: Yup.string()
    .nullable()
    .test("phone", "Enter a valid emergency phone", (v) => {
      if (!v) return true;
      return /^[\d+\-\s()]{7,20}$/.test(v);
    }),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  postalCode: Yup.string().required("Postal code is required"),
  taxNumber: Yup.string().nullable(),
  registrationNumber: Yup.string().nullable(),
  status: Yup.string().oneOf(["active", "inactive"]).required(),
  notes: Yup.string().nullable(),
  profilePicture: Yup.mixed()
    .nullable()
    .test("fileType", "Only JPG/PNG/WEBP allowed", (v) => {
      if (!v || typeof v === "string" || v?.url) return true;
      return ["image/jpeg", "image/png", "image/webp"].includes(v.type);
    }),
});
