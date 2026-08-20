import * as Yup from "yup";

export const empSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  joiningDate: Yup.date().required("Joining date is required"),
  designation: Yup.string().required("designation is required"),
  fullName: Yup.string().required("full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
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
  address: Yup.string().max(500, "address must be less than 500 characters"),
  image: Yup.mixed()
    .nullable()
    .test("required-on-create", "Employee image is required", (v, ctx) => {
      if (ctx?.parent?.isEdit) return true;
      return !!v;
    })
    .test("fileType", "Only JPG/PNG files are allowed", (v) => {
      if (!v || typeof v === "string") return true;
      return ["image/jpeg", "image/png"].includes(v.type);
    })
    .test("fileSize", "File size must be less than 2MB", (v) => {
      if (!v || typeof v === "string") return true;
      return v.size <= 2 * 1024 * 1024;
    }),
  password: Yup.string().when("isEdit", {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
  }),
  // HRMS optional fields
  dateOfBirth: Yup.date().nullable().notRequired(),
  gender: Yup.string().notRequired(),
  maritalStatus: Yup.string().notRequired(),
  bloodGroup: Yup.string().notRequired(),
  employmentType: Yup.string().notRequired(),
  currentSalary: Yup.number().min(0).nullable().notRequired(),
  bankName: Yup.string().notRequired(),
  accountTitle: Yup.string().notRequired(),
  accountNumber: Yup.string().notRequired(),
  iban: Yup.string().notRequired(),
  ntn: Yup.string().notRequired(),
  shiftStart: Yup.string().notRequired(),
  shiftEnd: Yup.string().notRequired(),
  emergencyContact: Yup.object({
    name: Yup.string().notRequired(),
    phone: Yup.string().notRequired(),
    relationship: Yup.string().notRequired(),
    address: Yup.string().notRequired(),
  }).notRequired(),
});

export const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export const MARITAL_OPTIONS = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
];

export const BLOOD_OPTIONS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
].map((v) => ({ value: v, label: v }));

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "Permanent", label: "Permanent" },
  { value: "Probation", label: "Probation" },
];

export const DOCUMENT_TYPE_OPTIONS = [
  { value: "PROFILE_PICTURE", label: "Profile Picture" },
  { value: "CV", label: "CV" },
  { value: "EXPERIENCE_CERTIFICATE", label: "Experience Certificate" },
  { value: "CNIC_PASSPORT", label: "CNIC / Passport" },
  { value: "EDUCATIONAL_DOCUMENTS", label: "Educational Documents" },
  { value: "SALARY_SLIPS", label: "Salary Slips" },
  { value: "SKILL_CERTIFICATES", label: "Skill Certificates" },
  { value: "OTHER", label: "Other" },
];

export const ALLOWANCE_TYPE_OPTIONS = [
  "Car Allowance",
  "Fuel Allowance",
  "Medical Allowance",
  "Mobile Allowance",
  "Internet Allowance",
  "House Rent",
  "Meal Allowance",
  "Other",
].map((v) => ({ value: v, label: v }));
