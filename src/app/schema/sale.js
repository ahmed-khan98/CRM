import * as Yup from "yup";

export const saleSchema = Yup.object().shape({
  saleDate: Yup.string().required("Sale date is required"),
  departmentId: Yup.string().required("Please select a department"),
  merchantType: Yup.string().required("Please select a merchant"),
  clientId: Yup.string().required("Please select a client"),
  brandId: Yup.string().required("Please select a brand"),
  seller: Yup.string().required("Please select a seller"),
  amount: Yup.number(0, "amount should be greater than 0").required(
    "amount is required",
  ),
  currency: Yup.string().required("currency is required"),
  type: Yup.string().required("sale type is required"),
});



