import * as Yup from "yup";

const TYPE = ["MEAL", "REST ROOM", "SMOKING","TEA","PRAYER", "OFFICIAL"];

export const BreakSchema = Yup.object({
  type: Yup.string()
    .oneOf(TYPE, "Invalid type action")
    .required("break type is required"),

    reason: Yup.string()
  .trim()
  .when("type", {
    is: "OFFICIAL",
    then: (schema) =>
      schema.required("reason is required").min(3, "Too short"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
