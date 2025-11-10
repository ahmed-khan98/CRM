import * as Yup from "yup";

export const sendEmailSchema = Yup.object().shape({
  domainId: Yup.string().required("Please select a Sending domain"),
  email: Yup.string().required("email is required"),
  name: Yup.string().required("name is required"),
  subject: Yup.string().required("subject is required"),
  body: Yup.string().required("body of the mail is required"),

});