"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, BadgeDollarSign, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateSaleMutation,
  useUpdateSaleMutation,
} from "@/app/_Services/sale/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { saleSchema } from "@/app/schema/sale";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import FormikSelect from "./formikSelect";
import { modalVariants, SALE_OPTIONS,CURRENCY_OPTIONS } from "../Form/DropDownOptions";
import { useMemo, useState } from "react";
import InputField from "../Form/InputField";

const SaleModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createSale] = useCreateSaleMutation();
  const [updateSale] = useUpdateSaleMutation();

  const {
    data: departments,
    error: isError,
    isLoading,
  } = useAllDepartmentsQuery();

    const [departmentId, setDepartmentId] = useState(
    data?.departmentId?._id || "",
  );

  const { data: departEmployee } = useGetdepartmentsEmployeeQuery(
    departmentId,
    {
      skip: !departmentId,
    },
  );
  
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

  const initialValues = useMemo(
    () => ({
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
      saleDate: data?.saleDate
        ? new Date(data.saleDate).toISOString().split("T")[0]
        : "",
    }),
    [data],
  );

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = data ? { ...values, id: data._id } : values;

      const response = await (
        data ? updateSale(payload) : createSale(payload)
      ).unwrap();

      toast.success(
        data ? "Sale updated successfully!" : "Sale created successfully!",
      );

      resetForm();
      closeModal();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to process sale");
    } finally {
      setSubmitting(false);
    }
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

                  return (
                    <Form className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <InputField
                            name="name"
                            label="Client Name"
                            error={errors.name}
                            touched={touched.name}
                          />
                     
                          <InputField
                            type="email"
                            name="email" 
                            label="Client Email"
                            error={errors.email}
                            touched={touched.email}
                          />
                     <InputField
                            name="phoneNo" 
                            label="Client Phone No."
                            error={errors.phoneNo}
                            touched={touched.phoneNo}
                          /> 
                          <InputField
                            name="serialNo" 
                            label="Serial No"
                            error={errors.serialNo}
                            touched={touched.serialNo}
                          />
                        <InputField
                            name="brandName"
                            label="Brand Name"
                            error={errors.brandName}
                            touched={touched.brandName}
                          />
                          <InputField
                            name="brandMark"
                            label="Brand Mark"
                            error={errors.brandMark}
                            touched={touched.brandMark}
                          />
                   
                       <InputField
                            type="number"
                            name="amount"
                            label="Amount"
                            error={errors.amount}
                            touched={touched.amount}
                          />
                      
                        <FormikSelect
                          name="currency"
                          label="Select Currency Type"
                          options={CURRENCY_OPTIONS}
                          value={values.currency}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.currency}
                          touched={touched.currency}
                          placeholder="currency"
                          onChangeExtra={(value) =>
                            setFieldValue("currency", value)
                          }
                        />
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
                          onChangeExtra={(value) => {
                            setDepartmentId(value);
                            setFieldValue("departmentId", value);
                          }}
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
                          onChangeExtra={(value) =>
                            setFieldValue("agent", value)
                          }
                        />
                      <FormikSelect
                          name="type"
                          label="Select Sale Type"
                          options={SALE_OPTIONS}
                          value={values.type}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.type}
                          touched={touched.type}
                          placeholder="select type"
                          onChangeExtra={(value) =>
                            setFieldValue("type", value)
                          }
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
                            onChangeExtra={(value) =>
                              setFieldValue("fronter", value)
                            }
                          />
                        )}

                     <InputField
                            type="date" 
                            name="saleDate"
                            label="Sale Date"
                            error={errors.saleDate}
                            touched={touched.saleDate}
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

export default SaleModal;
