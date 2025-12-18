import * as Yup from "yup";

export const leadSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  email: Yup.string().required("email is required"),
  name: Yup.string().required("name is required"),
  phoneNo: Yup.string().required("Phone number is required"),
  serialNo: Yup.string().required("serial number is required"),
  brandMark: Yup.string().required("brand Mark is required")

});


const LAST_ACTIONS = [
  "no action",
  "no answer",
  "interested",
  "not interested",
  "in loop",
  "invalid",
  "schedule",
  "general",
];

export const leadActionSchema = Yup.object({
  lastComment: Yup.string()
    .trim()
    .required("Last comment is required"),
  lastAction: Yup.string()
    .oneOf(LAST_ACTIONS, "Invalid last action")
    .required("Last action is required"),
  scheduleDate: Yup.date()
    // "" -> null (Formik often sends empty string)
    .transform((v, orig) => (orig === "" || orig == null ? null : new Date(orig)))
    .nullable()
    .when("lastAction", (la, schema) =>
      la === "schedule"
        ? schema.required("Schedule date is required when action is 'schedule'")
        : schema.notRequired().nullable()
    ),
});

