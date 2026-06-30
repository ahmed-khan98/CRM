"use client";
import { Link, SendHorizontal } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import FormikSelect from "@/app/_Components/Modal/formikSelect";
import { createPaymentSchema } from "@/app/schema/paymentLink";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useGetLeadByIdQuery } from "@/app/_Services/lead/page";
import { useCreatePaymentLinkMutation } from "@/app/_Services/paymentLink/page";
import {
  currencyOptions,
  merchantOptions,
  sale_Options,
  serviceOptions,
} from "@/app/utilities/paymentLink";
import InputField from "@/app/_Components/Form/InputField";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

function LeadPayment() {
  const searchParams = useSearchParams();
  const id = searchParams.get("leadId");
  const router = useRouter();

  // 1. Logged In User & Lead Data Fetching
  const { data: loggedUser, isLoading: isLoggedLoading } =
    useGetLoggedUserQuery();
  const { data, error, isLoading } = useGetLeadByIdQuery({ id });
  const [createPaymentLink] = useCreatePaymentLinkMutation();

  // Role aur Safe access settings
  const userRole =
    loggedUser?.data?.role?.toUpperCase() || loggedUser?.role?.toUpperCase();
  const isAdminOrSubAdmin = userRole === "ADMIN" || userRole === "SUBADMIN";

  const userDepartmentId =
    loggedUser?.data?.departmentId?._id ||
    loggedUser?.data?.departmentId ||
    loggedUser?.departmentId ||
    "";
  const currentUserId = loggedUser?.data?._id || loggedUser?._id || "";

  // 2. All Departments Query (Sirf Admin/SubAdmin ke liye chalegi)
  const { data: departData } = useAllDepartmentsQuery(undefined, {
    skip: !isAdminOrSubAdmin,
  });

  // Local state for tracking current active department context
  const [activeDeptId, setActiveDeptId] = useState("");

  // Sync state with lead data or logged user on mount/load
  useEffect(() => {
    if (data?.data?.departmentId?._id || data?.data?.departmentId) {
      setActiveDeptId(
        data?.data?.departmentId?._id || data?.data?.departmentId,
      );
    } else if (!isAdminOrSubAdmin && userDepartmentId) {
      setActiveDeptId(userDepartmentId);
    }
  }, [data, isAdminOrSubAdmin, userDepartmentId]);

  // 3. Dynamic Queries (Depends completely on active department context)
  const { data: departEmployee, isLoading: isEmployeeLoading } =
    useGetdepartmentsEmployeeQuery(activeDeptId, {
      skip: !activeDeptId,
    });

  const { data: departBrand, isLoading: isBrandLoading } =
    useGetDepartmentBrandQuery(activeDeptId, {
      skip: !activeDeptId,
    });

  // 4. Memoized Select Options Configuration
  const departOptions = useMemo(
    () =>
      departData?.data?.map((b) => ({ value: b?._id, label: b?.name })) ?? [],
    [departData],
  );

  const brandOptions = useMemo(
    () =>
      departBrand?.data?.map((b) => ({ value: b?._id, label: b?.name })) ?? [],
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

  // 5. Smart Initial Values
  const initialValues = useMemo(() => {
    const leadDept = data?.data?.departmentId?._id || data?.data?.departmentId;
    return {
      leadId: id,
      departmentId: leadDept || (isAdminOrSubAdmin ? "" : userDepartmentId),
      brandId: data?.data?.brandId?._id || data?.data?.brandId || "",
      agent: "",
      // isAdminOrSubAdmin ? "" : currentUserId, // Other roles par automatic logged user ki ID secure hojayegi
      name: data?.data?.name || "",
      email: data?.data?.email || "",
      companyName: data?.data?.companyName || data?.data?.brandMark || "",
      phoneNo: data?.data?.phoneNo || "",
      merchantType: "",
      service: "",
      amount: "",
      currency: "",
      type: "",
      fronter: "",
      description: "",
    };
  }, [data, id, isAdminOrSubAdmin, userDepartmentId, currentUserId]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createPaymentLink({ ...values }).unwrap();
      if (response.success) {
        toast.success("Payment link created successfully!");
        router.push("/dashboard/paymentLink");
        resetForm();
      } else {
        toast.error(response.message || "Failed to process payment link");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.data?.message || "Failed to create payment link");
    } finally {
      setSubmitting(false);
    }
  };

  // Safe check loading states
  if (isLoading || isLoggedLoading)
    return (
      <PageLoader
        title="Loading lead"
        subtitle="Preparing the payment link form..."
      />
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Error fetching data.
      </div>
    );

  if (!data)
    return (
      <div className="p-10 text-center text-gray-600 font-semibold">
        No Lead Found.
      </div>
    );

  return (
    <div className="min-h-screen py-6 md:py-2 px-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-3xl shadow-md p-6 mt-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 flex items-center">
                <Link className="mr-2 h-6 w-6 text-gray-800" />
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
                const handleDepartChange = (newDeptId) => {
                  setFieldValue("departmentId", newDeptId);
                  setFieldValue("brandId", "");
                  setFieldValue("agent", "");
                  setFieldValue("fronter", "");
                  setActiveDeptId(newDeptId); // Trigger dynamic APIs recalculation
                };

                return (
                  <Form className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <InputField
                        label="Customer Name"
                        type="text"
                        name="name"
                        readOnly={!!data?.data?.name}
                        errors={errors.name}
                        touched={touched.name}
                      />

                      <InputField
                        label="Customer Email"
                        type="email"
                        name="email"
                        readOnly={!!data?.data?.email}
                        errors={errors.email}
                        touched={touched.email}
                      />

                      <InputField
                        label="Customer Phone number"
                        type="text"
                        name="phoneNo"
                        readOnly={!!data?.data?.phoneNo}
                        errors={errors.phoneNo}
                        touched={touched.phoneNo}
                      />

                      <InputField
                        label="Business Name / Brand Name"
                        type="text"
                        name="companyName"
                        readOnly={
                          !!(data?.data?.companyName || data?.data?.brandMark)
                        }
                        errors={errors.companyName}
                        touched={touched.companyName}
                      />

                      {/* 🔄 Dynamic Department Selection (Sirf Admin/SubAdmin ko dikhega) */}
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

                      {/* 🎯 Brand Select (Auto dynamic data filtering based on department context) */}
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
                        onChangeExtra={(value) =>
                          setFieldValue("brandId", value)
                        }
                      />

                      <FormikSelect
                        name="service"
                        label="Select Services"
                        options={serviceOptions}
                        value={values.service}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.service}
                        touched={touched.service}
                        isMulti={true}
                        placeholder="Select Service"
                        onChangeExtra={(val) => setFieldValue("service", val)}
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
                        onChangeExtra={(val) =>
                          setFieldValue("merchantType", val)
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
                        onChangeExtra={(val) => setFieldValue("currency", val)}
                      />

                      {/* 👥 Sales Agent Dropdown Control */}
                      {isAdminOrSubAdmin ? (
                        <FormikSelect
                          name="agent"
                          label="Select sale agent"
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
                        onChangeExtra={(value) => setFieldValue("type", value)}
                      />

                      {values?.type === "FRESH" && (
                        <FormikSelect
                          name="fronter"
                          label="Select Sale Fronter"
                          options={empOptions}
                          value={values.fronter}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.fronter}
                          touched={touched.fronter}
                          placeholder="Select fronter"
                          isLoading={isEmployeeLoading}
                          isDisabled={!values.departmentId}
                          onChangeExtra={(value) =>
                            setFieldValue("fronter", value)
                          }
                        />
                      )}
                    </div>

                    <InputField
                      name="description"
                      label="Payment Description"
                      as="textarea"
                      errors={errors.description}
                      touched={touched.description}
                    />

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 cursor-pointer bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
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
    <Suspense
      fallback={
        <PageLoader
          title="Loading lead"
          subtitle="Preparing the payment link form..."
        />
      }
    >
      <LeadPayment />
    </Suspense>
  );
}
