"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, ChartBar, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateLeadMutation } from "@/app/_Services/lead/page";
import { leadActionSchema } from "@/app/schema/Lead";
import FormikSelect from "./formikSelect";
import { formatDate } from "@/app/utilities/date";

const LeadActionModal = ({ isOpen, data, closeModal, refetch }) => {
  const [updateLead] = useUpdateLeadMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await updateLead({ id: data?._id, ...values }).unwrap();
      if (response.success) {
        toast.success("Lead Action Update successfully!");
      } else {
        toast.error(response.message || "Failed to process Lead Action");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to Lead Action Update");
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
    lastComment: "",
    lastAction: "",
    scheduleDate: "",
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl  overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] px-2 md:px-8 py-2 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ChartBar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-medium">
                      Lead Action
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
            <div className="overflow-hidden rounded-2xl border border-gray-200 m-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#F7F7F7] border-b-1 border-gray-200">
                    <tr>
                      <th className="px-2 py-3 text-start text-sm font-medium text-gray-800 capitalize ">
                        Last Action Date{" "}
                      </th>
                      <th className="px-2 py-3 text-start text-sm font-medium text-gray-800 capitalize ">
                        Action{" "}
                      </th>
                      <th className="px-2 py-3 text-start text-sm font-medium text-gray-800 capitalize ">
                        Agent{" "}
                      </th>
                      <th className="px-2 py-3 text-st  art text-sm font-medium text-gray-800 capitalize ">
                        Comment{" "}
                      </th>
                      {data?.lastAction === "schedule" && (
                        <th className="px-2 py-3 text-st  art text-sm font-medium text-gray-800 capitalize ">
                          Schedule Date{" "}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <motion.tr
                      key={data?._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 * 0.1 }}
                      className=" transition-colors"
                    >
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          {data?.lastActionCreateAt ? (
                            <span className="text-[12px] text-gray-600">
                              {formatDate(data.lastActionCreateAt)}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </td>

                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-[12px] text-gray-600 capitalize">
                            {data?.lastAction ? data?.lastAction : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap capitalize">
                        {data?.userId ? (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium `}
                          >
                            {data?.userId}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-2 w-[340px] min-w-[280px]">
                        <div className="flex items-center gap-1">
                          <span className="text-[12px]  text-gray-600 capitalize">
                            {data?.lastComment ? data?.lastComment : "-"}
                          </span>
                        </div>
                      </td>
                      {data?.lastAction === "schedule" && (
                        <td className="px-2 py-3 whitespace-nowrap">
                          <div className="flex flex-col items-start gap-1">
                            {data?.scheduleDate ? (
                              <span className="text-[12px] text-gray-600">
                                {formatDate(data.scheduleDate)}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form */}
            <div className="px-4 md:px-6 py-2 h-98  overflow-y-auto">
              <Formik
                initialValues={initialValues}
                validationSchema={leadActionSchema}
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
                  const actionOptions =
                    [
                      "no action",
                      "no answer",
                      "interested",
                      "not interested",
                      "in loop",
                      "invalid",
                      "schedule",
                      "general",
                    ]?.map((b) => ({
                      value: b,
                      label: b,
                    })) ?? [];

                  console.log(errors, "errors---->>>>");
                  return (
                    <Form className="space-y-1">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <FormikSelect
                          name="lastAction"
                          label="Select Action"
                          options={actionOptions}
                          value={values.lastAction}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.lastAction}
                          touched={touched.lastAction}
                          placeholder="Select Action"
                        />
                      </div>
                      {values?.lastAction === "schedule" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Schedule Date
                          </label>
                          <Field
                            type="date"
                            name="scheduleDate"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.scheduleDate && touched.scheduleDate
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          />
                          <ErrorMessage
                            name="scheduleDate"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Comment
                        </label>
                        <Field
                          as="textarea"
                          name="lastComment"
                          rows="4"
                          placeholder="leave your comment..."
                          className="w-full px-4 py-2 border-1 border-gray-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors resize-none"
                        />
                        <ErrorMessage
                          name="lastComment"
                          component="div"
                          className="text-red-500 text-sm mt-1"
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

export default LeadActionModal;
