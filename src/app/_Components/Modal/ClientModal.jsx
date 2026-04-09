"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, User, Upload, Trash2, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "@/app/_Services/Client/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { useEffect, useRef } from "react"; 
import { clientSchema } from "@/app/schema/client";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page";
import FormikSelect from "./formikSelect";

const ClientModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();

  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();

  const isEdit = !!data;

  console.log(data, "data");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = new FormData();
      payload.append("id", data?._id);
      payload.append("image", values?.image);
      payload.append("companyName", values?.companyName);
      payload.append("name", values?.name);
      payload.append("email", values?.email);
      payload.append("address", values?.address);
      payload.append("departmentId", values?.departmentId);
      payload.append("handleBy", values?.handleBy);
      payload.append("signupType", values?.signupType);
      payload.append("brandId", values?.brandId);
      payload.append("phoneNo", values?.phoneNo);

      const response = await (isEdit
        ? updateClient(
            typeof values?.image === "string"
              ? {
                  body: {
                    name: values?.name,
                    companyName: values?.companyName,
                    email: values?.email,
                    address: values?.address,
                    departmentId: values?.departmentId,
                    handleBy: values?.handleBy,
                    phoneNo: values?.phoneNo,
                    brandId: values?.brandId,
                    signupType: values?.signupType,
                  },
                  id: data?._id,
                }
              : {
                  id: data?._id,
                  body: payload,
                
                }
          ).unwrap()
        : createClient(payload).unwrap());
      console.log(response, "response");
      if (response.success) {
        toast.success(
          isEdit
            ? "Client updated successfully!"
            : "Client created successfully!"
        );
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
    departmentId: data?.departmentId?._id || "",
    handleBy: data?.handleBy?._id || "",
    brandId: data?.brandId?._id || "",
    signupType: data?.signupType || "",
    companyName: data?.companyName || "",
    name: data?.name || "",
    email: data?.email || "",
    phoneNo: data?.phoneNo || "",
    address: data?.address || "",
    image: data?.image || "",
  };

  const handleDepartmentChange = (newDeptId) => {
    setFieldValue("departmentId", newDeptId);
    setFieldValue("brandId", "");
    setFieldValue("handleBy", "");
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
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-2 md:px-8 py-3 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-medium">
                      {data ? "Edit Client" : "Add New Client"}
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
                validationSchema={clientSchema}
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

                  const agentOptions =
                    departEmployee?.data?.map((e) => ({
                      value: e?._id,
                      label: `${e?.fullName}`,
                    })) ?? [];

                  const signupOptions = [
                    "cold",
                    "PPC",
                    "chat",
                    "email",
                    "facebook",
                    "other",
                  ].map((s) => ({ value: s, label: s }));

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
                                alt="Client"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-gray-500 mb-1" />
                                <span className="text-[11px] text-gray-600 leading-tight">
                                  Upload Client Image
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
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            Name
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
                            Company Name / Brand Name
                          </label>
                          <Field
                            type="text"
                            name="companyName"
                            className={`w-full px-4 py-2 border-1 ${
                              errors.companyName && touched.companyName
                                ? "border-zinc-500 focus:border-zinc-500"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-xl focus:outline-none transition-colors`}
                          ></Field>
                          <ErrorMessage
                            name="companyName"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormikSelect
                          name="handleBy"
                          label="Sale Agent"
                          options={agentOptions}
                          value={values.handleBy}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.handleBy} // make sure your schema uses 'handleBy'
                          touched={touched.handleBy}
                          placeholder="Select Agent"
                          isLoading={isEmployeeLoading}
                          isDisabled={!values.departmentId}
                        />

                        {/* Signup Type */}
                        <FormikSelect
                          name="signupType"
                          label="SignUp Type "
                          options={signupOptions}
                          value={values.signupType}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.signupType}
                          touched={touched.signupType}
                          placeholder="Select type"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
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

export default ClientModal;
