"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, User, Upload, Trash2, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/app/_Services/employee/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { useEffect, useRef } from "react";
import { empSchema } from "@/app/schema/employee";
import FormikSelect from "./formikSelect";

const EmployeeModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();
  const isEdit = !!data;

  console.log(data, "data");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values, "employee");
    try {
      const payload = new FormData();
      payload.append("id", data?._id);
      payload.append("image", values?.image);
      payload.append("fullName", values?.fullName);
      payload.append("password", values?.password);
      payload.append("email", values?.email);
      payload.append("joiningDate", values?.joiningDate);
      payload.append("address", values?.address);
      payload.append("departmentId", values?.departmentId);
      payload.append("CNIC", values?.CNIC);
      payload.append("phoneNo", values?.phoneNo);
      payload.append("designation", values?.designation);

      const response = await (isEdit
        ? updateEmployee(
            typeof values?.image === "string"
              ? {
                  body: {
                    fullName: values?.fullName,
                    // lastName: values?.lastName,
                    email: values?.email,
                    joiningDate: values?.joiningDate,
                    address: values?.address,
                    departmentId: values?.departmentId,
                    CNIC: values?.CNIC,
                    phoneNo: values?.phoneNo,
                    designation: values?.designation,
                  },
                  id: data?._id,
                }
              : {
                  id: data?._id,
                  body: payload,
                }
          ).unwrap()
        : createEmployee(payload).unwrap());
      console.log(response, "response");
      if (response.success) {
        toast.success(
          isEdit
            ? "Employee updated successfully!"
            : "Employee created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process Employee");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to create employee");
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
    joiningDate: data?.joiningDate.split("T")[0] || "",
    fullName: data?.fullName || "",
    // lastName: data?.lastName || "",
    designation: data?.designation || "",
    email: data?.email || "",
    CNIC: data?.CNIC || "",
    phoneNo: data?.phoneNo || "",
    address: data?.address || "",
    image: data?.image || "",
      isEdit: !!data, 
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[99vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] px-2 md:px-8 py-2 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-bold">
                      {data ? "Edit Employee" : "Add New Employee"}
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
            <div className="px-6 md:px-8 py-4 max-h-[84vh] overflow-y-auto ">
              <Formik
                initialValues={initialValues}
                validationSchema={empSchema}
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
                  console.log(errors,'emplyeeerrors')
                  const deptOptions =
                    departments?.data?.map((d) => ({
                      value: d?._id,
                      label: d?.name,
                    })) ?? [];
                  console.log(errors.password, "errors---->>>>");
                  // if (values.type !== selectedMethod) {
                  //     setSelectedMethod(values.type)
                  // }
                  const fileInputRef1 = useRef(null);

                  const handleMainImageUpload = (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFieldValue("image", file);
                  };

                  const handleDeleteMainImage = () => {
                    setFieldValue("image", "");
                  };

                  const previewSrc =
                    values.image instanceof File
                      ? URL.createObjectURL(values.image)
                      : values.image || null;

                  useEffect(() => {
                    return () => {
                      if (values?.image instanceof File && previewSrc) {
                        URL.revokeObjectURL(previewSrc);
                      }
                    };
                  }, [previewSrc, values?.image]);

                  return (
                    <Form className="space-y-3">
                      <input
                        type="file"
                        ref={fileInputRef1}
                        onChange={handleMainImageUpload}
                        className="hidden"
                        accept="image/*"
                      />

                      <div className="flex justify-center items-center my-3">
                        <div className="relative w-28 h-28">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInputRef1.current?.click()}
                            className={`w-28 h-28 rounded-full border 
        ${
          previewSrc
            ? "overflow-hidden"
            : "border-dashed border-gray-400 bg-gray-50 cursor-pointer flex flex-col items-center justify-center text-center p-2"
        }
      `}
                          >
                            {previewSrc ? (
                              <img
                                src={previewSrc}
                                alt="Employee"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-gray-500 mb-1" />
                                <span className="text-[11px] text-gray-600 leading-tight">
                                  Upload Employee Image
                                </span>
                              </>
                            )}
                          </div>
                          <ErrorMessage
                            name="image"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                          {previewSrc && (
                            <button
                              type="button"
                              onClick={handleDeleteMainImage}
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
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
                            //   onChangeExtra={handleDepartmentChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Joining Date
                          </label>
                          <Field
                            type="date"
                            name="joiningDate"
                            className={`w-full px-4 py-2 border-1 ${
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
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <Field
                            type="text"
                            name="fullName"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.fullName && touched.fullName
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="fullName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            className={`w-full px-4 py-2 border-1 ${
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
                        </div> */}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Designation
                          </label>
                          <Field
                            type="text"
                            name="designation"
                            className={`w-full px-4 py-2 border-1 ${
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CNIC
                          </label>
                          <Field
                            type="text"
                            name="CNIC"
                            placeholder="40000-1234567-8"
                            className={`w-full px-4 py-2 border-1 ${
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone No.
                          </label>
                          <Field
                            type="text"
                            name="phoneNo"
                            placeholder="0300-1234567"
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
                      {!isEdit &&
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <Field
                            type="text"
                            name="password"
                            placeholder="********"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.password && touched.password
                                ? "border-[#5f2781] focus:border-[#5f2781]"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                     
                      </div>}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <Field
                          as="textarea"
                          name="address"
                          rows="3"
                          placeholder="address..."
                          className="w-full px-4 py-2 border-1 border-gray-200 focus:border-blue-500 rounded-xl focus:outline-none transition-colors resize-none"
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

export default EmployeeModal;
