"use client";
import { DollarSign, SendHorizontal } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import FormikSelect from "@/app/_Components/Modal/formikSelect";
import { useAllBrandsQuery } from "@/app/_Services/brand/page";
import { createPaymentSchema } from "@/app/schema/paymentLink";
import { useRouter } from "next/navigation";
import { useCreatePaymentLinkMutation } from "@/app/_Services/paymentLink/page";

export default function page() {
  const router = useRouter();
  const [createPaymentLink] = useCreatePaymentLinkMutation();
  const { data: Brand, error, isLoading } = useAllBrandsQuery();

  const initialValues = {
    leadId: "",
    brandId: "",
    name: "",
    email: "",
    companyName: "",
    phoneNo: "",
    merchantType: "",
    service: "",
    amount: "",
    description: "",
    currency: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createPaymentLink({ ...values }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success(response?.message);
        router.push("/dashboard/paymentLink");
      } else {
        toast.error(response.message || "Failed to process payment link");
      }
      resetForm();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to sending email");
    } finally {
      setSubmitting(false);
    }
  };

  const merchant = [
    { id: "paypal1", name: "Paypal 1" },
    { id: "paypal penta prime", name: "Paypal Penta Prime" },
  ];

  const currencyType = [
    { id: "USD", name: "USD" },
    { id: "PKR", name: "PKR" },
  ];

    const services = [
  "Seo Services",
  "Logo Design",
  "Website Design",
  "Stationery Design",
  "Brochure Design",
  "Website Development",
  "Project Status",
  "Content Writing",
  "Social Media Design",
  "Copy Right Design",
  "Video Production",
  "Client Questionnaire",
  "Email Marketing Questionnaire",
  "SEO Questionnaire",
  "Academic Writing Questionnaire",
  "Illustrations",
  "Other",
  "No Package"
];

  return (
    <div className="min-h-screen  py-6 md:py-2 px-2">
      <div className=" mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-3xl shadow-md p-6 mt-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 flex items-center">
                <DollarSign className="mr-2 h-6 w-6 text-[#5f2781]" />
                Create Payment Link
              </h2>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={createPaymentSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                errors,
                touched,
                isSubmitting,
                values,
                formik,
                setFieldValue,
                setFieldTouched,
              }) => {
                console.log(values, "values---->>>>");
                console.log(errors, "errors---->>>>");

                const brandOptions =
                  Brand?.data?.map((b) => ({
                    value: b?._id,
                    label: b?.name,
                  })) ?? [];

                const merchantOptions =
                  merchant?.map((b) => ({
                    value: b?.id,
                    label: b?.name,
                  })) ?? [];

                  const serviceOptions =
                  services?.map((b) => ({
                    value: b,
                    label: b,
                  })) ?? [];

                const currencyOptions =
                  currencyType?.map((b) => ({
                    value: b?.id,
                    label: b?.name,
                  })) ?? [];

                const handleBrandChange = (newDeptId) => {
                  setFieldValue("brandId", newDeptId);
                };

                const handleServiceChange = (ser) => {
                  setFieldValue("service", ser);
                };
                const handleMerchantChange = (ser) => {
                  setFieldValue("merchantType", ser);
                };

                const handleCurrencyChange = (ser) => {
                  setFieldValue("currency", ser);
                };

                return (
                  <Form className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Customer Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className={`w-full px-4 py-2 text-sm border-1 capitalize ${
                            errors.name && touched.name
                              ? "border-[#5f2781] focus:border-[#5f2781]"
                              : "border-gray-200 focus:border-[#5f2781]"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Customer Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className={`w-full px-4 py-2 text-sm border-1 ${
                            errors.email && touched.email
                              ? "border-[#5f2781] focus:border-[#5f2781]"
                              : "border-gray-200 focus:border-[#5f2781]"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Customer Phone number
                        </label>
                        <Field
                          type="text"
                          name="phoneNo"
                          className={`w-full px-4 py-2 text-sm border-1 ${
                            errors.phoneNo && touched.phoneNo
                              ? "border-[#5f2781] focus:border-[#5f2781]"
                              : "border-gray-200 focus:border-[#5f2781]"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="phoneNo"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <FormikSelect
                        name="brandId"
                        label="Select Brand"
                        options={brandOptions}
                        value={values.brandId}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.brandId}
                        touched={touched.brandId}
                        placeholder="Select Brand"
                        onChangeExtra={handleBrandChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormikSelect
                        name="service"
                        label="Select Services"
                        options={serviceOptions}
                        value={values.service}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.service}
                        isMulti={true}
                        touched={touched.service}
                        placeholder="Select Service"
                        onChangeExtra={handleServiceChange}
                      />
                      <FormikSelect
                        name="merchantType"
                        label="Select Merchant Type"
                        options={merchantOptions}
                        value={values.merchantType}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.merchantType}
                        touched={touched.merchantType}
                        placeholder="Merchant"
                        onChangeExtra={handleMerchantChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Amount
                        </label>
                        <Field
                          type="number"
                          name="amount"
                          className={`w-full px-4 py-2 text-sm border-1 ${
                            errors.amount && touched.amount
                              ? "border-[#5f2781] focus:border-[#5f2781]"
                              : "border-gray-200 focus:border-[#5f2781]"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="amount"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <FormikSelect
                        name="currency"
                        label="Select Currency Type"
                        options={currencyOptions}
                        value={values.currency}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.currency}
                        touched={touched.currency}
                        placeholder="currency"
                        onChangeExtra={handleCurrencyChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Payment Description
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          rows="3"
                          placeholder="description..."
                          className={`w-full px-4 py-2 text-sm border-1 ${
                            errors.description && touched.description
                              ? "border-[#5f2781] focus:border-[#5f2781]"
                              : "border-gray-200 focus:border-[#5f2781]"
                          } rounded-xl focus:outline-none transition-colors`}
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-2 md:px-4 py-2 cursor-pointer bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] text-white rounded-xl text-sm font-semibold  hover:from-[#4f1f6d] hover:to-[#5f2781] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-1 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            Submit <SendHorizontal className="h-3 w-3" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
