"use client";
import { Link, SendHorizontal } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import FormikSelect from "@/app/_Components/Modal/formikSelect";
import { createPaymentSchema } from "@/app/schema/paymentLink";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useAllBrandsQuery } from "@/app/_Services/brand/page";
import { useGetLeadByIdQuery } from "@/app/_Services/lead/page";
import { useCreatePaymentLinkMutation } from "@/app/_Services/paymentLink/page";

function LeadPayment() {
  const searchParams = useSearchParams();
  // const email = searchParams.get("email");
  // const phoneNo = searchParams.get("phoneNo");
  // const companyName = searchParams.get("companyName");
  // const name = searchParams.get("name");
  // const brand = searchParams.get("brand");
  const id = searchParams.get("leadId");

  const { data, error, isLoading } = useGetLeadByIdQuery({ id });

  const {
    data: BrandData,
    error: isBrandError,
    isLoading: isBrandLoading,
  } = useAllBrandsQuery();

  const router = useRouter();
  const [createPaymentLink] = useCreatePaymentLinkMutation();

  const initialValues = {
    leadId: id,
    brandId: data?.data?.brandId._id || "",
    name: data?.data?.name || "",
    email: data?.data?.email || "",
    // companyName: data?.data?.companyName || "",
    phoneNo: data?.data?.phoneNo || "",
    merchantType: "",
    service: "",
    amount: "",
    currency: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createPaymentLink({ ...values }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success("Payment link created successfully!");
        router.push("/dashboard/paymentLink");
      } else {
        toast.error(response.message || "Failed to process payment link");
      }
      resetForm();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to creating payment link");
    } finally {
      setSubmitting(false);
    }
  };

  const merchant = [
    { id: "paypal1", name: "Paypal 1" },
    { id: "paypal2", name: "Paypal 2" },
  ];
  const currencyType = [
    { id: "USD", name: "USD" },
    { id: "PKR", name: "PKR" },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#5f2781] font-semibold">
          Loading ... 🚀
        </span>
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-600">Error fetching data.</div>
    );
  if (!data)
    return <div className="p-10 text-center text-gray-600">No Lead Found.</div>;

  return (
    <div className="min-h-screen  py-6 md:py-2 px-2">
      <div className="max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-3xl shadow-md p-6 mt-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 flex items-center">
                <Link className="mr-2 h-6 w-6 text-[#5f2781]" />
                Create Lead Payment Link
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
                setFieldValue,
                setFieldTouched,
              }) => {
                console.log(values, "values---->>>>");
                console.log(errors, "errors---->>>>");

                const brandOptions =
                  BrandData?.data?.map((b) => ({
                    value: b?._id,
                    label: b?.name,
                  })) ?? [];

                const merchantOptions =
                  merchant?.map((b) => ({
                    value: b?.id,
                    label: b?.name,
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
                          readOnly={data?.data?.name ? true : false}
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
                          readOnly={data?.data?.email ? true : false}
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
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Company Name
                        </label>
                        <Field
                          type="text"
                          name="companyName"
                          readOnly={data?.data?.companyName ? true : false}
                          className={`w-full px-4 py-2 text-sm border-1 capitalize ${
                            errors.companyName && touched.companyName
                              ? "border-[#5f2781] focus:border-[#5f2781]"
                              : "border-gray-200 focus:border-[#5f2781]"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="companyName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                         Customer Phone number
                        </label>
                        <Field
                          type="text"
                          name="phoneNo"
                          readOnly={data?.data?.phoneNo ? true : false}
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
                        isDisabled={true}
                        touched={touched.brandId}
                        placeholder="Select Brand"
                        onChangeExtra={handleBrandChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormikSelect
                        name="service"
                        label="Select Services"
                        options={merchantOptions}
                        value={values.service}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.service}
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
                          // readOnly={values?.amount ? true : false}
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

export default function CreateLeadPayment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadPayment />
    </Suspense>
  );
}
