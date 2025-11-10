"use client";

import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, Building } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/app/_Services/department/page";

const departSchema = Yup.object().shape({
  name: Yup.string().required("department name is required"),
});

const DepartmentModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createDeaprtment] = useCreateDepartmentMutation();
  const [updateDeaprtment] = useUpdateDepartmentMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await (data
        ? updateDeaprtment({ id: data?._id, ...values }).unwrap()
        : createDeaprtment({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data
            ? "Department updated successfully!"
            : "Department created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process department");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        "Failed to create department";
      toast.error(msg);
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
    name: data?.name || "",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // ⬇️ Make the modal a flex column and allow tall content
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (fixed) */}
            <div className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] px-2 md:px-8 py-3 text-white relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-bold">
                      {data ? "Edit Department" : "Add New Department"}
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

            {/* Body (scrollable) */}
            {/* ⬇️ flex-1 + min-h-0 is critical for scroll inside flex parent */}
            <div className="px-6 md:px-8 py-4 flex-1 min-h-0 overflow-y-auto">
              <Formik
                initialValues={initialValues}
                validationSchema={departSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting, values }) => (
                  <Form className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className={`w-full px-4 py-2 ${
                            // ⬇️ tailwind: 'border' not 'border-1'
                            errors.name && touched.name
                              ? "border border-[#5f2781] focus:border-[#5f2781]"
                              : "border border-gray-200 focus:border-blue-500"
                          } rounded-xl focus:outline-none transition-colors`}
                        />
                        {/* ⬇️ Corrected to match the Field's name */}
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    {/* Footer (sticks below body, outside scroll if you prefer) */}
                    <div className="flex gap-2 md:gap-4 pt-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={closeModal}
                        className="flex-1 px-3 md:px-6 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
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
                            {/* ⬇️ border not border-1 */}
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) :  (
                          "Submit"
                        )}
                      </motion.button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepartmentModal;
