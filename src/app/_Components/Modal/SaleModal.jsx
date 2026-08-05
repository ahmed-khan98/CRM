"use client";

import { Formik, Form } from "formik";
import { toast } from "react-hot-toast";
import {
  useCreateSaleMutation,
  useUpdateSaleMutation,
} from "@/app/_Services/sale/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { saleSchema } from "@/app/schema/sale";
import FormikSelect from "./formikSelect";
import { useMemo, useState, useEffect } from "react";
import InputField from "../Form/InputField";
import {
  currencyOptions,
  sale_Options,
  merchantTypeOptions,
} from "@/app/utilities/paymentLink";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";
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
      description: data?.description || "",
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
    <ModalShell
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit Sale" : "Add Sale"}
      maxWidthClass="max-w-3xl"
    >
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
          return (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                    variant="dark"
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
                  variant="dark"
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
                  variant="dark"
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
                  variant="dark"
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
                  variant="dark"
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
                    variant="dark"
                    onChangeExtra={(value) =>
                      setFieldValue("agent", value)
                    }
                  />
                )}

                <InputField
                  type="number"
                  name="amount"
                  label="Amount"
                  errors={errors.amount}
                  touched={touched.amount}
                  variant="dark"
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
                  variant="dark"
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
                  variant="dark"
                  onChangeExtra={(value) =>
                    setFieldValue("merchantType", value)
                  }
                />

                <InputField
                  type="date"
                  name="saleDate"
                  label="Sale Date"
                  errors={errors.saleDate}
                  touched={touched.saleDate}
                  variant="dark"
                />
              </div>
              <InputField
                name="description"
                label="Payment Description"
                as="textarea"
                errors={errors.description}
                touched={touched.description}
                variant="dark"
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={closeModal}
                  className={fleet.modalCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={fleet.modalPrimaryBtn}
                >
                  {isSubmitting ? "Processing..." : "Continue"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ModalShell>
  );
};

export default SaleModal;
