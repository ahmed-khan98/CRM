import * as Yup from "yup";

export const bulkEmailSchema = Yup.object().shape({
  compaignName: Yup.string().required("compaign name is required"),
  fromemail: Yup.string().required("please enter a email"),
  listId: Yup.string().required("please select a email list"),
  subject: Yup.string().required("subject is required"),
  body: Yup.string().required("body is required"),
});
