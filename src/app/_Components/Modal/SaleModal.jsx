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

  const initialValues = {
    departmentId: data?.departmentId?._id || "",
    agent: data?.agent?._id || "",
    clientId: data?.clientId?._id || "",
    title: data?.title || "",
    amount: data?.amount || "",
    currency: data?.currency || "",
    description: data?.description || "",
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
            <div className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] px-2 md:px-8 py-2 text-white relative overflow-hidden">
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
                {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                  console.log(errors, "errors---->>>>");
                  // if (values.type !== selectedMethod) {
                  //     setSelectedMethod(values.type)
                  // }
                  const {
                    data: departClient,
                    error: isDepartClientError,
                    isLoading: isDepartClientLoading,
                  } = useDepartmentsCLientQuery(values.departmentId, {
                    skip: !values.departmentId,
                  });
                  const {
                    data: departEmployee,
                    error,
                    isLoading: isEmployeeLoading,
                  } = useGetdepartmentsEmployeeQuery(values.departmentId, {
                    skip: !values.departmentId,
                  });

                  return (
                    <Form className="space-y-3">
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Title{" "}
                          </label>
                          <Field
                            type="text"
                            name="title"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.title && touched.title
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Description
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          rows="3"
                          placeholder="description..."
                          className="w-full px-4 py-2 border-1 border-gray-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors resize-none"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
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
                            className={`w-full px-4 py-2 border-1 ${
                              errors.amount && touched.amount
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="amount"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Currency
                          </label>
                          <Field
                            type="text"
                            name="currency"
                            // placeholder="0300-1234567"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.currency && touched.currency
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="currency"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-1">
                            Select Department{" "}
                          </label>
                          <Field
                            as="select"
                            name="departmentId"
                            className={`w-full px-4 py-2 cursor-pointer border-1 ${
                              errors.departmentId && touched.departmentId
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-[#5f2781]"
                            } capitalize rounded-2xl focus:outline-none transition-colors bg-white text-gray-900`}
                          >
                            <option value="">Select Department </option>
                            {departments?.data?.map((e) => (
                              <option
                                key={e?._id}
                                value={e?._id}
                                className="capitalize cursor-pointer"
                              >
                                {e?.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="departmentId"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-1">
                            Sale Agent{" "}
                          </label>
                          <Field
                            as="select"
                            name="agent"
                            className={`w-full px-4 py-2 cursor-pointer border-1 ${
                              errors.agent && touched.agent
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-[#5f2781]"
                            } capitalize rounded-2xl focus:outline-none transition-colors bg-white text-gray-900`}
                          >
                            <option value="">Select Agent </option>
                            {departEmployee?.data?.map((e) => (
                              <option
                                key={e?._id}
                                value={e?._id}
                                className="capitalize cursor-pointer"
                              >
                                {`${e?.fullName}`}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="agent"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-1">
                            Select Client{" "}
                          </label>
                          <Field
                            as="select"
                            name="clientId"
                            className={`w-full px-4 py-2 cursor-pointer border-1 ${
                              errors.agent && touched.agent
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-[#5f2781]"
                            } capitalize rounded-2xl focus:outline-none transition-colors bg-white text-gray-900`}
                          >
                            <option value="">Select Client </option>
                            {departClient?.data?.map((e) => (
                              <option
                                key={e?._id}
                                value={e?._id}
                                className="capitalize cursor-pointer"
                              >
                                {`${e?.firstName} ${e?.lastName}`}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="clientId"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
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
