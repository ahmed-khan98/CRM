"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, User, BadgeDollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateSaleMutation,
  useUpdateSaleMutation,
} from "@/app/_Services/sale/page";
import { useDepartmentsCLientQuery } from "@/app/_Services/Client/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { saleSchema } from "@/app/schema/sale";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import FormikSelect from "./formikSelect";

const SaleModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createSale] = useCreateSaleMutation();
  const [updateSale] = useUpdateSaleMutation();

  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, "Sale");
    try {
      const response = await (data
        ? updateSale({ ...values, id: data?._id }).unwrap()
        : createSale({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data ? "Sale updated successfully!" : "Sale created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process Sale");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to create department");
    } finally {
      setSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  };

  const currencyType = [
    { id: "USD", name: "USD" },
    { id: "PKR", name: "PKR" },
  ];
  const saleType = [
    { id: "FRESH", name: "FRESH" },
    { id: "UP SELL", name: "UP SELL" },
  ];

  const initialValues = {
    departmentId: data?.departmentId?._id || "",
    agent: data?.agent?._id || "",
    fronter: data?.fronter?._id || "",
    name: data?.name || "",
    email: data?.email || "",
    phoneNo: data?.phoneNo || "",
    serialNo: data?.serialNo || "",
    brandMark: data?.brandMark || "",
    brandName: data?.brandName || "",
    amount: data?.amount || "",
    currency: data?.currency || "",
    type: data?.type || "",
  };

  const handleDepartmentChange = (newDeptId) => {
    setFieldValue("departmentId", newDeptId);
  };
  const handleAgentChange = (newDeptId) => {
    setFieldValue("agent", newDeptId);
  };
  const handleFronterChange = (newDeptId) => {
    setFieldValue("fronter", newDeptId);
  };

  const handleCurrencyChange = (ser) => {
    setFieldValue("currency", ser);
  };
  const handleTypeChange = (ser) => {
    setFieldValue("type", ser);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[99vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-2 md:px-8 py-2 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <BadgeDollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-bold">
                      {data ? "Edit Sale" : "Add Sale"}
                    </h2>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 md:px-8 py-4 max-h-[84vh] overflow-y-auto">
              <Formik
                initialValues={initialValues}
                validationSchema={saleSchema}
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
                  console.log(errors, "errors---->>>>");
                  // if (values.type !== selectedMethod) {
                  //     setSelectedMethod(values.type)
                  // }
                  const {
                    data: departEmployee,
                    error,
                    isLoading: isEmployeeLoading,
                  } = useGetdepartmentsEmployeeQuery(values.departmentId, {
                    skip: !values.departmentId,
                  });

                  const deptOptions =
                    departments?.data?.map((d) => ({
                      value: d?._id,
                      label: d?.name,
                    })) ?? [];

                  const empOptions =
                    departEmployee?.data?.map((d) => ({
                      value: d?._id,
                      label: d?.fullName,
                    })) ?? [];

                  const currencyOptions =
                    currencyType?.map((b) => ({
                      value: b?.id,
                      label: b?.name,
                    })) ?? [];

                  const saleOptions =
                    saleType?.map((b) => ({
                      value: b?.id,
                      label: b?.name,
                    })) ?? [];

                  return (
                    <Form className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Client Name
                          </label>
                          <Field
                            type="text"
                            name="name"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.name && touched.name
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
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
                            Client Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.email && touched.email
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
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
                            Client Phone No.
                          </label>
                          <Field
                            type="text"
                            name="phoneNo"
                            // placeholder="0300-1234567"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.phoneNo && touched.phoneNo
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="phoneNo"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Serial No
                          </label>
                          <Field
                            type="text"
                            name="serialNo"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.serialNo && touched.serialNo
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="serialNo"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Brand Name
                          </label>
                          <Field
                            type="text"
                            name="brandName"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.brandName && touched.brandName
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="brandName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Brand Mark
                          </label>
                          <Field
                            type="text"
                            name="brandMark"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.brandMark && touched.brandMark
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="brandMark"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Amount
                          </label>
                          <Field
                            type="number"
                            name="amount"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.amount && touched.amount
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormikSelect
                          name="departmentId"
                          label="Select Department"
                          options={deptOptions}
                          value={values.departmentId}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.departmentId}
                          touched={touched.departmentId}
                          placeholder="Select Department"
                          onChangeExtra={handleDepartmentChange}
                        />
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
                          onChangeExtra={handleAgentChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <FormikSelect
                          name="type"
                          label="Select Sale Type"
                          options={saleOptions}
                          value={values.type}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.type}
                          touched={touched.type}
                          placeholder="select type"
                          onChangeExtra={handleTypeChange}
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
                          onChangeExtra={handleFronterChange}
                        />
                        )}
                      </div>

                      <div className="flex gap-2 md:gap-4 pt-2">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={closeModal}
                          className="flex-1 px-3 md:px-6 py-4 border-1 cursor-pointer border-gray-300 text-gray-800 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-3 md:px-6 py-4 cursor-pointer bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl font-semibold hover:from-zinc-800 hover:to-zinc-700  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-zinc-900/50"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-1 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing...
                            </div>
                          ) : (
                            "Continue"
                          )}
                        </motion.button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaleModal;
