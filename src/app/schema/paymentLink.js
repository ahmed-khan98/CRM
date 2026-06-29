import * as Yup from "yup";

export const createPaymentSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  email: Yup.string().required("email is required"),
  name: Yup.string().required("name is required"),
  phoneNo: Yup.string().required("phone No. is required"),
  type: Yup.string().required("sale type is required"),
  companyName: Yup.string().required("busniess / brand name is required"),
  seller: Yup.string().required("seller is required"),
  merchantType: Yup.string().required("merchant type is required"),
  service: Yup.array()
    .min(1, "Please select at least 1 service")
    .required("servcices is required"),
  amount: Yup.number(0, "Amount should be greater than 0").required(
    "Amount is required"
  ),
});
