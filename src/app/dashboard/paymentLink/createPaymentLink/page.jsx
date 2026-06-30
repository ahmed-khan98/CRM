// "use client";
// import { DollarSign, SendHorizontal } from "lucide-react";
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import toast from "react-hot-toast";
// import FormikSelect from "@/app/_Components/Modal/formikSelect";
// import { useAllBrandsQuery } from "@/app/_Services/brand/page";
// import { createPaymentSchema } from "@/app/schema/paymentLink";
// import { useRouter } from "next/navigation";
// import { useCreatePaymentLinkMutation } from "@/app/_Services/paymentLink/page";
// import FormikCreateableSelect from "@/app/_Components/Modal/CreateableSelect";
// import { currencyOptions, merchantOptions, serviceOptions } from "@/app/utilities/paymentLink";

// export default function page() {
//   const router = useRouter();
//   const [createPaymentLink] = useCreatePaymentLinkMutation();
//   const { data: Brand, error, isLoading } = useAllBrandsQuery();

//   const initialValues = {
//     leadId: "",
//     brandId: "",
//     name: "",
//     email: "",
//     companyName: "",
//     phoneNo: "",
//     merchantType: "",
//     service: "",
//     amount: "",
//     description: "",
//     currency: "",
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const response = await createPaymentLink({ ...values }).unwrap();
//       console.log(response, "response");
//       if (response.success) {
//         toast.success(response?.message);
//         router.push("/dashboard/paymentLink");
//       } else {
//         toast.error(response.message || "Failed to process payment link");
//       }
//       resetForm();
//     } catch (error) {
//       console.log(error, "error");
//       toast.error(error.data?.message || "Failed to sending email");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen  py-4 md:py-2 px-2">
//       <div className=" mx-auto max-full">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <div className="bg-white rounded-3xl shadow-md p-6 mt-3">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-700 flex items-center">
//                 <DollarSign className="mr-2 h-6 w-6 text-gray-800" />
//                 Create Payment Link
//               </h2>
//             </div>
//             <Formik
//               initialValues={initialValues}
//               validationSchema={createPaymentSchema}
//               onSubmit={handleSubmit}
//               enableReinitialize
//             >
//               {({
//                 errors,
//                 touched,
//                 isSubmitting,
//                 values,
//                 formik,
//                 setFieldValue,
//                 setFieldTouched,
//               }) => {
//                 console.log(values, "values---->>>>");
//                 console.log(errors, "errors---->>>>");

// const brandOptions = [
//   {
//     value: '',
//     label: 'None',
//   },
//   ...(Brand?.data?.map((b) => ({
//     value: b?._id,
//     label: b?.name,
//   })) ?? []),
// ];

//                 const handleBrandChange = (newDeptId) => {
//                   setFieldValue("brandId", newDeptId);
//                 };

//                 const handleServiceChange = (ser) => {
//                   setFieldValue("service", ser);
//                 };
//                 const handleMerchantChange = (ser) => {
//                   setFieldValue("merchantType", ser);
//                 };

//                 const handleCurrencyChange = (ser) => {
//                   setFieldValue("currency", ser);
//                 };

//                 return (
//                   <Form className="space-y-3">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-800 mb-1">
//                           Customer Name
//                         </label>
//                         <Field
//                           type="text"
//                           name="name"
//                           className={`w-full px-4 py-2 text-sm border-1 capitalize ${
//                             errors.name && touched.name
//                               ? "border-zinc-500 focus:border-zinc-500"
//                               : "border-gray-200 focus:border-zinc-800"
//                           } rounded-xl focus:outline-none transition-colors`}
//                         ></Field>
//                         <ErrorMessage
//                           name="name"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-800 mb-1">
//                           Customer Email
//                         </label>
//                         <Field
//                           type="email"
//                           name="email"
//                           className={`w-full px-4 py-2 text-sm border-1 ${
//                             errors.email && touched.email
//                               ? "border-zinc-500 focus:border-zinc-500"
//                               : "border-gray-200 focus:border-zinc-800"
//                           } rounded-xl focus:outline-none transition-colors`}
//                         ></Field>
//                         <ErrorMessage
//                           name="email"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-800 mb-1">
//                           Customer Phone number
//                         </label>
//                         <Field
//                           type="text"
//                           name="phoneNo"
//                           className={`w-full px-4 py-2 text-sm border-1 ${
//                             errors.phoneNo && touched.phoneNo
//                               ? "border-zinc-500 focus:border-zinc-500"
//                               : "border-gray-200 focus:border-zinc-800"
//                           } rounded-xl focus:outline-none transition-colors`}
//                         ></Field>
//                         <ErrorMessage
//                           name="phoneNo"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                       <FormikSelect
//                         name="brandId"
//                         label="Select Brand"
//                         options={brandOptions}
//                         value={values.brandId}
//                         setFieldValue={setFieldValue}
//                         setFieldTouched={setFieldTouched}
//                         error={errors.brandId}
//                         touched={touched.brandId}
//                         placeholder="Select Brand"
//                         onChangeExtra={handleBrandChange}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <FormikCreateableSelect
//                         name="service"
//                         label="Select Services"
//                         options={serviceOptions}
//                         value={values.service}
//                         setFieldValue={setFieldValue}
//                         setFieldTouched={setFieldTouched}
//                         error={errors.service}
//                         isMulti={true}
//                         touched={touched.service}
//                         placeholder="Select Service"
//                         onChangeExtra={handleServiceChange}
//                       />
//                       <FormikSelect
//                         name="merchantType"
//                         label="Select Merchant Type"
//                         options={merchantOptions}
//                         value={values.merchantType}
//                         setFieldValue={setFieldValue}
//                         setFieldTouched={setFieldTouched}
//                         error={errors.merchantType}
//                         touched={touched.merchantType}
//                         placeholder="Merchant"
//                         onChangeExtra={handleMerchantChange}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-800 mb-1">
//                           Amount
//                         </label>
//                         <Field
//                           type="number"
//                           name="amount"
//                           className={`w-full px-4 py-2 text-sm border-1 ${
//                             errors.amount && touched.amount
//                               ? "border-zinc-500 focus:border-zinc-500"
//                               : "border-gray-200 focus:border-zinc-800"
//                           } rounded-xl focus:outline-none transition-colors`}
//                         ></Field>
//                         <ErrorMessage
//                           name="amount"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                       <FormikSelect
//                         name="currency"
//                         label="Select Currency Type"
//                         options={currencyOptions}
//                         value={values.currency}
//                         setFieldValue={setFieldValue}
//                         setFieldTouched={setFieldTouched}
//                         error={errors.currency}
//                         touched={touched.currency}
//                         placeholder="currency"
//                         onChangeExtra={handleCurrencyChange}
//                       />
//                     </div>
//                     <div className="grid grid-cols-1 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-800 mb-1">
//                           Payment Description
//                         </label>
//                         <Field
//                           as="textarea"
//                           name="description"
//                           rows="3"
//                           placeholder="description..."
//                           className={`w-full px-4 py-2 text-sm border-1 ${
//                             errors.description && touched.description
//                               ? "border-zinc-500 focus:border-zinc-500"
//                               : "border-gray-200 focus:border-zinc-800"
//                           } rounded-xl focus:outline-none transition-colors`}
//                         />
//                         <ErrorMessage
//                           name="description"
//                           component="div"
//                           className="text-red-500 text-sm mt-1"
//                         />
//                       </div>
//                     </div>

//                     <div className="pt-2">
//                       <motion.button
//                         type="submit"
//                         disabled={isSubmitting}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         className="flex items-center gap-2 px-2 md:px-4 py-2 cursor-pointer bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-xl text-sm font-semibold  hover:from-[#4f1f6d] hover:to-[#5f2781] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
//                       >
//                         {isSubmitting ? (
//                           <div className="flex items-center justify-center gap-2">
//                             <div className="w-5 h-5 border-1 border-white/30 border-t-white rounded-full animate-spin"></div>
//                             Processing...
//                           </div>
//                         ) : (
//                           <>
//                             Submit <SendHorizontal className="h-3 w-3" />
//                           </>
//                         )}
//                       </motion.button>
//                     </div>
//                   </Form>
//                 );
//               }}
//             </Formik>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

"use client";
import {
  ArrowLeft,
  BadgeDollarSign,
  Building2,
  CreditCard,
  FileText,
  SendHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import FormikSelect from "@/app/_Components/Modal/formikSelect";
import { createPaymentSchema } from "@/app/schema/paymentLink";
import { useRouter } from "next/navigation";
import { useCreatePaymentLinkMutation } from "@/app/_Services/paymentLink/page";
import FormikCreateableSelect from "@/app/_Components/Modal/CreateableSelect";
import {
  currencyOptions,
  merchantOptions,
  sale_Options,
  serviceOptions,
} from "@/app/utilities/paymentLink";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page";
import InputField from "@/app/_Components/Form/InputField";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";

export default function Page() {
  const router = useRouter();
  const [createPaymentLink] = useCreatePaymentLinkMutation();

  // 1. Logged In User Verification Info
  const { data: loggedUser, isLoading: isLoggedLoading } =
    useGetLoggedUserQuery();

  // Role management contexts
  const userRole =
    loggedUser?.data?.role?.toUpperCase() || loggedUser?.role?.toUpperCase();
  const isAdminOrSubAdmin = userRole === "ADMIN" || userRole === "SUBADMIN";

  const userDepartmentId =
    loggedUser?.data?.departmentId?._id ||
    loggedUser?.data?.departmentId ||
    loggedUser?.departmentId ||
    "";
  const currentUserId = loggedUser?.data?._id || loggedUser?._id || "";

  // 2. Active Department state management hook
  const [activeDeptId, setActiveDeptId] = useState("");

  // Sync state setting for non-admin on mount
  useEffect(() => {
    if (!isAdminOrSubAdmin && userDepartmentId) {
      setActiveDeptId(userDepartmentId);
    }
  }, [isAdminOrSubAdmin, userDepartmentId]);

  const { data: departEmployee, isLoading: isEmployeeLoading } =
    useGetdepartmentsEmployeeQuery(activeDeptId, {
      skip: !activeDeptId,
    });

  // 3. Conditional Queries base filtering
  const { data: departData } = useAllDepartmentsQuery(undefined, {
    skip: !isAdminOrSubAdmin,
  });

  const { data: departBrand, isLoading: isBrandLoading } =
    useGetDepartmentBrandQuery(activeDeptId, {
      skip: !activeDeptId,
    });

  // 4. Memoized Select Option mapping engines
  const departOptions = useMemo(
    () =>
      departData?.data?.map((b) => ({ value: b?._id, label: b?.name })) ?? [],
    [departData],
  );

  const brandOptions = useMemo(
    () => [
      { value: "", label: "None" },
      ...(departBrand?.data?.map((b) => ({ value: b?._id, label: b?.name })) ??
        []),
    ],
    [departBrand],
  );

  const empOptions = useMemo(
    () =>
      departEmployee?.data?.map((d) => ({
        value: d?._id,
        label: d?.fullName,
      })) ?? [],
    [departEmployee],
  );

  // 5. Initial form data properties state configuration
  const initialValues = useMemo(
    () => ({
      clientId: "", // Empty rakha hy taake controller isko fresh client samjhe
      departmentId: isAdminOrSubAdmin ? "" : userDepartmentId,
      brandId: "",
      agent: "",
      // isAdminOrSubAdmin ? "" : currentUserId,
      name: "",
      email: "",
      companyName: "",
      phoneNo: "",
      merchantType: "",
      service: "",
      type: "",
      amount: "",
      description: "",
      currency: "",
      seller: "",
    }),
    [isAdminOrSubAdmin, userDepartmentId, currentUserId],
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createPaymentLink({ ...values }).unwrap();
      if (response.success) {
        toast.success(response?.message || "Payment link created successfully");
        router.push("/dashboard/paymentLink");
        resetForm();
      } else {
        toast.error(response.message || "Failed to process payment link");
      }
    } catch (error) {
      console.error(error, "Submission tracking payload context crash");
      toast.error(error.data?.message || "Failed to submit processing request");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoggedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 font-medium text-gray-700">
          Loading configurations...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-1 py-3">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/70"
        >
          <div className="relative overflow-hidden border-b border-zinc-200 bg-zinc-950 px-5 py-4 text-white md:px-7">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-24 h-20 w-20 rounded-full bg-indigo-500/20 blur-2xl" />

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg">
                  <BadgeDollarSign className="h-6 w-6 text-emerald-300" />
                </div>
                <div>
                 
                  <h6 className="text-lg font-black tracking-tight md:text-xl">
                    Create Payment Link
                  </h6>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
                    Generate a clean payment request with customer, brand,
                    service, merchant, and team assignment details.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/dashboard/paymentLink")}
                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-zinc-200 transition hover:bg-white/15"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Payment Links
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
          
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
                const handleDepartChange = (newDeptId) => {
                  setFieldValue("departmentId", newDeptId);
                  setFieldValue("brandId", "");
                  setActiveDeptId(newDeptId); // Re-trigger brand query hook mapping context
                };

                return (
                  <Form className="space-y-5">
                    <FormSection
                      icon={UserRound}
                      title="Customer Details"
                      description="Add the client information that will appear on the payment request."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                          label="Customer Name"
                          type="text"
                          name="name"
                          errors={errors.name}
                          touched={touched.name}
                        />

                        <InputField
                          label="Customer Email"
                          type="email"
                          name="email"
                          errors={errors.email}
                          touched={touched.email}
                        />

                        <InputField
                          label="Customer Phone Number"
                          type="text"
                          name="phoneNo"
                          errors={errors.phoneNo}
                          touched={touched.phoneNo}
                        />

                        <InputField
                          label="Business Name / Brand Name"
                          type="text"
                          name="companyName"
                          errors={errors.companyName}
                          touched={touched.companyName}
                        />
                      </div>
                    </FormSection>

                    <FormSection
                      icon={Building2}
                      title="Department & Team"
                      description="Choose the department context before selecting brand, seller, or agent."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {isAdminOrSubAdmin ? (
                          <FormikSelect
                            name="departmentId"
                            label="Select Department"
                            options={departOptions}
                            value={values.departmentId}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.departmentId}
                            touched={touched.departmentId}
                            placeholder="Select Department"
                            onChangeExtra={handleDepartChange}
                          />
                        ) : (
                          <Field type="hidden" name="departmentId" />
                        )}

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
                          isLoading={isBrandLoading}
                          isDisabled={!values.departmentId}
                          onChangeExtra={(val) => setFieldValue("brandId", val)}
                        />

                        <FormikSelect
                          name="seller"
                          label="Select Seller"
                          options={empOptions}
                          value={values.seller}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.seller}
                          touched={touched.seller}
                          placeholder="Select seller"
                          isLoading={isEmployeeLoading}
                          isDisabled={!values.departmentId}
                          onChangeExtra={(value) =>
                            setFieldValue("seller", value)
                          }
                        />
 <FormikSelect
                          name="type"
                          label="Select Sale Type"
                          options={sale_Options}
                          value={values.type}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.type}
                          touched={touched.type}
                          placeholder="select type"
                          onChangeExtra={(value) =>
                            setFieldValue("type", value)
                          }
                        />
                        {values?.type === "FRESH" ? (
                          <FormikSelect
                            name="agent"
                            label="Select Agent"
                            options={empOptions}
                            value={values.agent}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.agent}
                            touched={touched.agent}
                            placeholder="Select agent"
                            isLoading={isEmployeeLoading}
                            isDisabled={!values.departmentId}
                            onChangeExtra={(value) =>
                              setFieldValue("agent", value)
                            }
                          />
                        ) : (
                          <Field type="hidden" name="agent" />
                        )}
                      </div>
                    </FormSection>

                    <FormSection
                      icon={CreditCard}
                      title="Payment Setup"
                      description="Define what the customer is paying for and how the transaction should be processed."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormikCreateableSelect
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
                          onChangeExtra={(ser) => setFieldValue("service", ser)}
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
                          onChangeExtra={(ser) =>
                            setFieldValue("merchantType", ser)
                          }
                        />

                        <InputField
                          label="Amount"
                          name="amount"
                          type="number"
                          errors={errors.amount}
                          touched={touched.amount}
                        />

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
                          onChangeExtra={(ser) =>
                            setFieldValue("currency", ser)
                          }
                        />

                       
                      </div>
                    </FormSection>

                    <FormSection
                      icon={FileText}
                      title="Payment Note"
                      description="Keep a clear internal and customer-facing description for this payment link."
                    >
                      <InputField
                        name="description"
                        label="Payment Description"
                        as="textarea"
                        errors={errors.description}
                        touched={touched.description}
                      />
                    </FormSection>

                    <div className="sticky bottom-3 z-10 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl shadow-zinc-200/80 backdrop-blur">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Sparkles className="h-4 w-4 text-emerald-500" />
                          Link will be created and sent using the selected
                          merchant settings.
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => router.push("/dashboard/paymentLink")}
                            className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                          >
                            Cancel
                          </button>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-zinc-300 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="h-5 w-5 animate-spin rounded-full border border-white/30 border-t-white" />
                                Creating...
                              </div>
                            ) : (
                              <>
                                Create Payment Link
                                <SendHorizontal className="h-4 w-4" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
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

function InfoPill({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black text-zinc-900">{title}</p>
          <p className="text-xs text-zinc-500">{text}</p>
        </div>
      </div>
    </div>
  );
}

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-start gap-3 border-b border-zinc-100 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-zinc-900">{title}</h2>
          <p className="mt-0.5 text-xs leading-5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
