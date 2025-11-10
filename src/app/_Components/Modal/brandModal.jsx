"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, Home, Upload, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/app/_Services/brand/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import FormikSelect from "./formikSelect";
import { brandSchema } from "@/app/schema/brand";
import { useEffect, useRef } from "react";

const BrandModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();
  const isEdit = !!data;

  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values,'values')
    try {
      const payload = new FormData();
      payload.append("id", data?._id);
      payload.append("image", values?.image);
      payload.append("name", values?.name);
      payload.append("departmentId", values?.departmentId);

      const response = await (isEdit
        ? updateBrand(
            typeof values?.image === "string"
              ? {
                  body: {
                    name: values?.name,
                    departmentId: values?.departmentId,
                  },
                  id: data?._id,
                }
              : {
                  id: data?._id,
                  body: payload,
                }
          ).unwrap()
        : createBrand(payload).unwrap());

      // const response = await (data
      //   ? updateBrand({ id: data?._id, ...values }).unwrap()
      //   : createBrand({ ...values }).unwrap());

      if (response.success) {
        toast.success(
          data ? "Brand updated successfully!" : "Brand created successfully!"
        );
      } else {
        toast.error(response.message || "Failed to process Brand");
      }
      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to create Brand");
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
    departmentId: data?.departmentId?._id || "",
    image: data?.image || "",
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] px-2 md:px-8 py-3 text-white relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg mdtext-2xl font-bold">
                      {data ? "Edit Brand" : "Add New Brand"}
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

            <div className="px-6 md:px-8 py-4 flex-1 min-h-0 overflow-y-auto">
              <Formik
                initialValues={initialValues}
                validationSchema={brandSchema}
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
                  const deptOptions =
                    departments?.data?.map((d) => ({
                      value: d?._id,
                      label: d?.name,
                    })) ?? [];

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

                      <div className="grid grid-cols-1 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand Name
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
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 mb-2">
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
                          ) : values?.type === "pickup" ? (
                            "Submit Pickup"
                          ) : values?.type === "drop off" ? (
                            "Schedule Drop Off"
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

export default BrandModal;
