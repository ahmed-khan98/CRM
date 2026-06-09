import * as Yup from "yup";

export const saleSchema = Yup.object().shape({
  name: Yup.string().required("client name is required"),
  email: Yup.string().required("client email is required"),
  phoneNo: Yup.string().required("client phone no. is required"),
    saleDate: Yup.string().required("Sale date is required"),
  
  // serialNo: Yup.string().required("serial number is required"),
  // brandMark: Yup.string().required("brand mark is required"),
  // brandName: Yup.string().required("brand name is required"),
  departmentId: Yup.string().required("Please select a department"),
  agent: Yup.string().required("Please select a sale agent"),
  amount: Yup.number(0, "amount should be greater than 0").required(
    "amount is required"
  ),
  currency: Yup.string().required("currency is required"),
  type: Yup.string().required("sale type is required"),
});
