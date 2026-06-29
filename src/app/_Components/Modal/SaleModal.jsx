"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from "formik";
import { TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useCreateSaleMutation,
  useUpdateSaleMutation,
} from "@/app/_Services/sale/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { saleSchema } from "@/app/schema/sale";
import FormikSelect from "./formikSelect";
import { modalVariants } from "../Form/DropDownOptions";
import { useMemo, useState, useEffect } from "react";
import InputField from "../Form/InputField";
import {
  currencyOptions,
  sale_Options,
  merchantTypeOptions,
} from "@/app/utilities/paymentLink";
import ModalHeader from "./ModalHeader/page";
import { useAllClientsQuery } from "@/app/_Services/Client/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page"; // Added safe brand context path

const SaleModal = ({ isOpen, closeModal, data, refetch }) => {
  const [createSale] = useCreateSaleMutation();
  const [updateSale] = useUpdateSaleMutation();
  const isEdit = !!data;

  // Fetch logged in user dynamic contextual role identities
  const { data: loggedUser, isLoading: isLoggedLoading } =
    useGetLoggedUserQuery(undefined, { skip: !isOpen });

  // Role management contexts
  const userRole =
    loggedUser?.data?.role?.toUpperCase() || loggedUser?.role?.toUpperCase();
  const isAdminOrSubAdmin = userRole === "ADMIN" || userRole === "SUBADMIN";

  const userDepartmentId =
    loggedUser?.data?.departmentId?._id ||
    loggedUser?.data?.departmentId ||
    loggedUser?.departmentId ||
    "";

  // 1. Dynamic Department State management hook
  const [departmentId, setDepartmentId] = useState(
    data?.departmentId?._id || "",
  );

  // Sync state setting for non-admin on mount & data updates
  useEffect(() => {
    if (!isAdminOrSubAdmin && userDepartmentId) {
      setDepartmentId(userDepartmentId);
    } else if (data?.departmentId?._id) {
      setDepartmentId(data.departmentId._id);
    }
  }, [isAdminOrSubAdmin, userDepartmentId, data]);

  // Queries
  const { data: departments, isLoading: isDeptLoading } =
    useAllDepartmentsQuery(undefined, { skip: !isOpen || !isAdminOrSubAdmin });

  const { data: Clients, isLoading: isClientLoading } = useAllClientsQuery(
    undefined,
    { skip: !isOpen },
  );

  const { data: departEmployee } = useGetdepartmentsEmployeeQuery(
    departmentId,
    {
      skip: !isOpen || !departmentId,
    },
  );

  // Fetch brands dynamically mapped with active selected department tracking
  const { data: departBrand, isLoading: isBrandLoading } =
    useGetDepartmentBrandQuery(departmentId, {
      skip: !isOpen || !departmentId,
    });

  // UI Dropdowns Option Builders
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

  const clientOptions =
    Clients?.data?.map((c) => ({
      value: c?._id,
      label: `${c?.name} - (${c?.email})`,
    })) ?? [];

  const brandOptions =
    departBrand?.data?.map((b) => ({
      value: b?._id,
      label: b?.name,
    })) ?? [];

  const initialValues = useMemo(
    () => ({
      departmentId: isAdminOrSubAdmin
        ? data?.departmentId?._id || ""
        : userDepartmentId,
      brandId: data?.brandId?._id || data?.brandId || "",
      clientId:
        data?.clientId?._id || data?.clientId || data?.client?._id || "",
      agent: data?.agent?._id || "",
      seller: data?.seller?._id || "",
      merchantType: data?.merchantType || "",
      amount: data?.amount || "",
      currency: data?.currency || "",
      type: data?.type || "",
      saleDate: data?.saleDate
        ? new Date(data.saleDate).toISOString().split("T")[0]
        : "",
    }),
    [data, isAdminOrSubAdmin, userDepartmentId],
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const finalValues = {
        ...values,
        departmentId: isAdminOrSubAdmin
          ? values.departmentId
          : userDepartmentId,
      };

      const payload = data ? { ...finalValues, id: data._id } : finalValues;

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

  if (isLoggedLoading) return null;

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
            className=" rounded-3xl shadow-2xl w-full max-w-3xl max-h-[99vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <ModalHeader
              icon={TrendingUp}
              closeModal={closeModal}
              isEdit={isEdit}
              name={"Sale"}
            />

            {/* Form */}
            <div className="px-6 md:px-8 py-2 max-h-[84vh] overflow-y-auto bg-white">
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
                    <Form className="py-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 space-y-1">
                        {/* 🛠️ Admin / SubAdmin Check: Department select filter */}
                        {isAdminOrSubAdmin && (
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
                              // Reset dependants lists fields value contexts safely
                              setFieldValue("brandId", "");
                              setFieldValue("agent", "");
                              setFieldValue("seller", "");
                            }}
                          />
                        )}

                        {/* Brand Dropdown Integration */}
                        <FormikSelect
                          name="brandId"
                          label="Select Brand"
                          options={brandOptions}
                          value={values.brandId}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.brandId}
                          touched={touched.brandId}
                          placeholder="Select associated brand"
                          onChangeExtra={(value) =>
                            setFieldValue("brandId", value)
                          }
                        />
                        <FormikSelect
                          name="clientId"
                          label="Select Client"
                          options={clientOptions}
                          value={values.clientId}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.clientId}
                          touched={touched.clientId}
                          placeholder="Select client account"
                          onChangeExtra={(value) =>
                            setFieldValue("clientId", value)
                          }
                        />

                      

                        <FormikSelect
                          name="type"
                          label="Select Sale Type"
                          options={sale_Options}
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

                        <FormikSelect
                          name="seller"
                          label="Select Seller"
                          options={empOptions}
                          value={values.seller}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.seller}
                          touched={touched.seller}
                          placeholder="Select seller"
                          onChangeExtra={(value) =>
                            setFieldValue("seller", value)
                          }
                        />

                        {values?.type === "FRESH" && (
                          <FormikSelect
                            name="agent"
                            label="Select Sale agent"
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
                        )}

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
                          options={currencyOptions}
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
                          name="merchantType"
                          label="Select Merchant Type"
                          options={merchantTypeOptions}
                          value={values.merchantType}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.merchantType}
                          touched={touched.merchantType}
                          placeholder="select merchantType"
                          onChangeExtra={(value) =>
                            setFieldValue("merchantType", value)
                          }
                        />

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
                          className="flex-1 px-3 md:px-6 py-2 border-1 cursor-pointer border-gray-300 text-gray-800 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-3 md:px-6 py-2 cursor-pointer bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl font-semibold hover:from-zinc-800 hover:to-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-zinc-900/50"
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
