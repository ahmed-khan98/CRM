import * as Yup from "yup";

export const brandSchema = Yup.object().shape({
  name: Yup.string().required("brand name is required"),
  departmentId: Yup.string().required("department is required"),
    image: Yup.mixed()
      .nullable()
      .test("required-on-create", "brand logo is required", (v, ctx) => {
        const isEdit = !!ctx?.options?.context?.isEdit;
        if (isEdit) return true;
        return !!v; // must provide something on create
      })
      .test("fileType", "Only JPG/PNG files are allowed", (v) => {
        if (!v || typeof v === "string") return true; // URL allowed; empty handled above
        return ["image/jpeg", "image/png"].includes(v.type);
      })
      .test("fileSize", "File size must be less than 2MB", (v) => {
        if (!v || typeof v === "string") return true;
        return v.size <= 2 * 1024 * 1024;
      }),
});