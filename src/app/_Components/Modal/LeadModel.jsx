"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, ChartBar, } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateLeadMutation } from "@/app/_Services/lead/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { leadSchema } from "@/app/schema/Lead";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page";
import FormikSelect from "./formikSelect";

const LeadModal = ({ isOpen, closeModal,  refetch }) => {
  const [createLead] = useCreateLeadMutation();

  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createLead({ ...values }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success("Client created successfully!");
      } else {
        toast.error(response.message || "Failed to process Client");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to create Client");
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

  const initialValues = {
    departmentId: "",
    brandId: "",
    brandMark: "",
    name: "",
    email: "",
    phoneNo: "",
    serialNo: "",
  };

  const handleDepartmentChange = (newDeptId) => {
    setFieldValue("departmentId", newDeptId);
    setFieldValue("brandId", "");
    setFieldValue("agent", "");
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
            <div className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] px-2 md:px-8 py-3 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ChartBar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-medium">
                      Add Lead
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
                validationSchema={leadSchema}
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

                  const {
                    data: departEmployee,
                    error: isEmployeeError,
                    isLoading: isEmployeeLoading,
                  } = useGetdepartmentsEmployeeQuery(values.departmentId, {
                    skip: !values.departmentId,
                  });

                  const {
                    data: departBrand,
                    error,
                    isLoading: isBrandLoading,
                  } = useGetDepartmentBrandQuery(values.departmentId, {
                    skip: !values.departmentId,
                  });

                  const deptOptions =
                    departments?.data?.map((d) => ({
                      value: d?._id,
                      label: d?.name,
                    })) ?? [];

                  const brandOptions =
                    departBrand?.data?.map((b) => ({
                      value: b?._id,
                      label: b?.name,
                    })) ?? [];

                  return (
                    <Form className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Name
                          </label>
                          <Field
                            type="text"
                            name="name"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.name && touched.name
                                ? "border-[#5f2781] focus:border-[#5f2781]"
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
                            Serial No
                          </label>
                          <Field
                            type="text"
                            name="serialNo"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.serialNo && touched.serialNo
                                ? "border-[#5f2781] focus:border-[#5f2781]"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.email && touched.email
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Phone No.
                          </label>
                          <Field
                            type="text"
                            name="phoneNo"
                            // placeholder="0300-1234567"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.phoneNo && touched.phoneNo
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="phoneNo"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1  gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Brand Mark
                          </label>
                          <Field
                            type="text"
                            name="brandMark"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.brandMark && touched.brandMark
                                ? "border-[#5f2781] focus:border-[#5f2781]"
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

                        {/* Brand (depends on department) */}
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
                        />
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
                          className="flex-1 px-3 md:px-6 py-4 cursor-pointer bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] text-white rounded-2xl font-semibold hover:from-[#4f1f6d] hover:to-[#5f2781] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-1 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing...
                            </div>
                          ) : (
                            "Submit"
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

export default LeadModal;
