"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X, Calendar, Clock, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { getAvailableTimeSlots } from "@/app/utilities/timeSlot";
import { formatPhoneNumber } from "@/app/utilities/phoneFormat";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/app/_Services/employee/page";
import { useAllFilterBoxProductQuery } from "@/app/_Services/Box/page";

// Validation schemas
const pickupSchema = Yup.object().shape({
  departmentId: Yup.string().required("Please select a department"),
  joiningDate: Yup.date().required("Joining date is required"),
  designation: Yup.string().required("designation is required"),
  firstName: Yup.string().required("first name time is required"),
  lastName: Yup.string().required("last name time is required"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\d{4}-\d{7}$/,
      "Phone number must be in the format 0300-1234567"
    ),
  CNIC: Yup.string()
    .required("CNIC is required")
    .matches(
      /^\d{5}-\d{7}-\d{1}$/,
      "CNIC must be in the format 40000-1234567-8"
    ),
  address: Yup.string().max(500, "address must be less than 500 characters"),
});

const PickupDropOffModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const {
    data: boxes,
    error: isError,
    isLoading,
  } = useAllFilterBoxProductQuery();

  console.log(data, "data");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, "employee");
    try {
      const response = await (data
        ? updateEmployee({ ...values, id: data?._id }).unwrap()
        : createEmployee({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data
            ? "Appointment updated successfully!"
            : "Appointment created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process appointment");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to submit delivery method");
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
    departmentId: data?.departmentId || "",
    joiningDate: data?.joiningDate.split("T")[0] || "",
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    designation: data?.designation || "",
    email: data?.email || "",
    CNIC: data?.CNIC || "",
    phoneNo: data?.phoneNo || "",
    address: data?.address || "",
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[99vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] px-2 md:px-8 py-3 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-bold">
                      Employee Info
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
                validationSchema={pickupSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => {
                  console.log(values, "values");
                  console.log(errors, "errors");
                  // if (values.type !== selectedMethod) {
                  //     setSelectedMethod(values.type)
                  // }

                  return (
                    <Form className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Department Type{" "}
                          </label>
                          <Field
                            as="select"
                            name="departmentId"
                            className={`w-full px-4 py-3 border-2 ${
                              errors.departmentId && touched.departmentId
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-[#5f2781]"
                            } rounded-2xl focus:outline-none transition-colors bg-white text-gray-900`}
                          >
                            <option value="">Select Department </option>
                            <option value="pickup">Pickup</option>
                            <option value="dropoff">Drop Off</option>
                          </Field>
                          <ErrorMessage
                            name="departmentId"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Joining Date
                          </label>
                          <Field
                            type="date"
                            name="joiningDate"
                            className={`w-full px-4 py-3 border-2 ${
                              errors.joiningDate && touched.joiningDate
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          />
                          <ErrorMessage
                            name="joiningDate"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            className={`w-full px-4 py-3 border-2 ${
                              errors.firstName && touched.firstName
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            className={`w-full px-4 py-3 border-2 ${
                              errors.lastName && touched.lastName
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className={`w-full px-4 py-3 border-2 ${
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Designation
                          </label>
                          <Field
                            type="text"
                            name="designation"
                            className={`w-full px-4 py-3 border-2 ${
                              errors.designation && touched.designation
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="designation"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CNIC
                          </label>
                          <Field
                            type="text"
                            name="CNIC"
                            placeholder='40000-1234567-8'
                            className={`w-full px-4 py-3 border-2 ${
                              errors.CNIC && touched.CNIC
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="CNIC"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone No.
                          </label>
                          <Field
                            type="text"
                            name="phoneNo"
                        placeholder='0300-1234567'
                            className={`w-full px-4 py-3 border-2 ${
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <Field
                          as="textarea"
                          name="address"
                          rows="3"
                          placeholder="Any special instructions or address..."
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors resize-none"
                        />
                        <ErrorMessage
                          name="address"
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
                          className="flex-1 px-3 md:px-6 py-4 border-2 cursor-pointer border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
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
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing...
                            </div>
                          ) : values?.type === "pickup" ? (
                            "Submit Pickup"
                          ) : values?.type === "drop off" ? (
                            "Schedule  Drop Off"
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

export default PickupDropOffModal;
