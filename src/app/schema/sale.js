import * as Yup from "yup";

export const saleSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  agent: Yup.string().required("Please select a sale agent"),
  title: Yup.string().required("sale title is required"),
  amount: Yup.number(0, "amount should be greater than 0").required("amount is required"),
  currency: Yup.string().required("currency is required"),
  type: Yup.string().required("sale type is required"),
});
