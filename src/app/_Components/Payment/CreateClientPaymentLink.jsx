"use client";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  FileText,
  Link as LinkIcon,
  SendHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import FormikSelect from "@/app/_Components/Modal/formikSelect";
import { createPaymentSchema } from "@/app/schema/paymentLink";
import { useRouter } from "next/navigation";
import { useCreatePaymentLinkMutation } from "@/app/_Services/paymentLink/page";
import {
  currencyOptions,
  merchantOptions,
  sale_Options,
  serviceOptions,
} from "@/app/utilities/paymentLink";
import InputField from "@/app/_Components/Form/InputField";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import { useGetdepartmentsEmployeeQuery } from "@/app/_Services/employee/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import { useGetDepartmentBrandQuery } from "@/app/_Services/brand/page";
import { useGetClientQuery } from "@/app/_Services/Client/page";
import FormikCreateableSelect from "../Modal/CreateableSelect";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

const CreateClientPaymentLink = ({ id }) => {
  const router = useRouter();

  const { data: loggedUser, isLoading: isLoggedLoading } =
    useGetLoggedUserQuery();
  const { data, error, isLoading } = useGetClientQuery(id);
  const [createPaymentLink] = useCreatePaymentLinkMutation();

  // Role aur Safe access settings
  const userRole =
    loggedUser?.data?.role?.toUpperCase() || loggedUser?.role?.toUpperCase();
  const isAdminOrSubAdmin = userRole === "ADMIN" || userRole === "SUBADMIN";

  const userDepartmentId =
    loggedUser?.data?.departmentId?._id ||
    loggedUser?.data?.departmentId ||
    loggedUser?.departmentId ||
    "";
  const currentUserId = loggedUser?.data?._id || loggedUser?._id || "";

  // 2. All Departments Query (Sirf Admin/SubAdmin ke liye chalegi)
  const { data: departData } = useAllDepartmentsQuery(undefined, {
    skip: !isAdminOrSubAdmin,
  });

  // Local state for tracking current active department context
  const [activeDeptId, setActiveDeptId] = useState("");

  // Sync state with lead data or logged user on mount/load
  useEffect(() => {
    if (data?.data?.departmentId?._id || data?.data?.departmentId) {
      setActiveDeptId(
        data?.data?.departmentId?._id || data?.data?.departmentId,
      );
    } else if (!isAdminOrSubAdmin && userDepartmentId) {
      setActiveDeptId(userDepartmentId);
    }
  }, [data, isAdminOrSubAdmin, userDepartmentId]);

  // 3. Dynamic Queries (Depends completely on active department context)
  const { data: departEmployee, isLoading: isEmployeeLoading } =
    useGetdepartmentsEmployeeQuery(activeDeptId, {
      skip: !activeDeptId,
    });

  const { data: departBrand, isLoading: isBrandLoading } =
    useGetDepartmentBrandQuery(activeDeptId, {
      skip: !activeDeptId,
    });

  // 4. Memoized Select Options Configuration
  const departOptions = useMemo(
    () =>
      departData?.data?.map((b) => ({ value: b?._id, label: b?.name })) ?? [],
    [departData],
  );

  const brandOptions = useMemo(
    () => [
      {
        value: "",
        label: "None",
      },
      ...(departBrand?.data?.map((b) => ({
        value: b?._id,
        label: b?.name,
      })) ?? []),
    ],
    [departBrand],
  );

  const empOptions = useMemo(
    () =>
      departEmployee?.data?.map((d) => ({
        value: d?._id,
        label: d?.fullName,
      })) ?? [],
    [departEmployee],
  );

  // 5. Smart Initial Values
  const initialValues = useMemo(() => {
    const leadDept = data?.data?.departmentId?._id || data?.data?.departmentId;
    return {
      clientId: id,
      departmentId: leadDept || (isAdminOrSubAdmin ? "" : userDepartmentId),
      brandId: data?.data?.brandId?._id || data?.data?.brandId || "",
      agent: isAdminOrSubAdmin ? "" : currentUserId,
      name: data?.data?.name || "",
      email: data?.data?.email || "",
      companyName: data?.data?.companyName || data?.data?.brandMark || "",
      phoneNo: data?.data?.phoneNo || "",
      merchantType: "",
      service: "",
      amount: "",
      currency: "",
      type: "",
      seller: "",
      description: "",
    };
  }, [data, id, isAdminOrSubAdmin, userDepartmentId, currentUserId]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createPaymentLink({ ...values }).unwrap();
      if (response.success) {
        toast.success("Payment link created successfully!");
        router.push("/dashboard/paymentLink");
        resetForm();
      } else {
        toast.error(response.message || "Failed to process payment link");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.data?.message || "Failed to create payment link");
    } finally {
      setSubmitting(false);
    }
  };

  // Safe check loading states
  if (isLoading || isLoggedLoading)
    return (
      <PageLoader
        title="Loading client"
        subtitle="Preparing the payment link form..."
      />
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Error fetching data.
      </div>
    );

  if (!data)
    return (
      <div className="p-10 text-center text-gray-600 font-semibold">
        No Lead Found.
      </div>
    );

  return (
    <div className="min-h-screen px-2 py-3">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/70"
        >
          <div className="relative overflow-hidden border-b border-zinc-200 bg-zinc-950 px-5 py-5 text-white md:px-7">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-24 h-20 w-20 rounded-full bg-emerald-500/20 blur-2xl" />

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg">
                  <LinkIcon className="h-6 w-6 text-emerald-300" />
                </div>
                <div>
                  <h6 className="text-lg font-black tracking-tight md:text-xl">
                    Create Payment Link
                  </h6>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
                    Review the client information, assign the sale team, and
                    generate a secure payment request.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/dashboard/paymentLink")}
                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-zinc-200 transition hover:bg-white/15"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Payment Links
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={createPaymentSchema}
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
                const handleDepartChange = (newDeptId) => {
                  setFieldValue("departmentId", newDeptId);
                  setFieldValue("brandId", "");
                  setFieldValue("agent", "");
                  setFieldValue("seller", "");
                  setActiveDeptId(newDeptId); // Trigger dynamic APIs recalculation
                };

                return (
                  <Form className="space-y-5">
                    <FormSection
                      icon={UserRound}
                      title="Client Details"
                      description="Client information is prefilled from the CRM profile and locked when already available."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                          label="Customer Name"
                          type="text"
                          name="name"
                          readOnly={!!data?.data?.name}
                          errors={errors.name}
                          touched={touched.name}
                        />

                        <InputField
                          label="Customer Email"
                          type="email"
                          name="email"
                          readOnly={!!data?.data?.email}
                          errors={errors.email}
                          touched={touched.email}
                        />

                        <InputField
                          label="Customer Phone Number"
                          type="text"
                          name="phoneNo"
                          readOnly={!!data?.data?.phoneNo}
                          errors={errors.phoneNo}
                          touched={touched.phoneNo}
                        />

                        <InputField
                          label="Business Name / Brand Name"
                          type="text"
                          name="companyName"
                          readOnly={
                            !!(data?.data?.companyName || data?.data?.brandMark)
                          }
                          errors={errors.companyName}
                          touched={touched.companyName}
                        />
                      </div>
                    </FormSection>

                    <FormSection
                      icon={Building2}
                      title="Department & Team"
                      description="Choose the department context first, then assign brand, seller, and agent."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {isAdminOrSubAdmin ? (
                          <FormikSelect
                            name="departmentId"
                            label="Select Department"
                            options={departOptions}
                            value={values.departmentId}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.departmentId}
                            touched={touched.departmentId}
                            placeholder="Select Department"
                            onChangeExtra={handleDepartChange}
                          />
                        ) : (
                          <Field type="hidden" name="departmentId" />
                        )}

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
                          onChangeExtra={(value) =>
                            setFieldValue("brandId", value)
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
                          isLoading={isEmployeeLoading}
                          isDisabled={!values.departmentId}
                          onChangeExtra={(value) =>
                            setFieldValue("seller", value)
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

                        {isAdminOrSubAdmin && values?.type === "FRESH" ? (
                          <FormikSelect
                            name="agent"
                            label="Select Agent"
                            options={empOptions}
                            value={values.agent}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            error={errors.agent}
                            touched={touched.agent}
                            placeholder="Select agent"
                            isLoading={isEmployeeLoading}
                            isDisabled={!values.departmentId}
                            onChangeExtra={(value) =>
                              setFieldValue("agent", value)
                            }
                          />
                        ) : (
                          <Field type="hidden" name="agent" />
                        )}
                      </div>
                    </FormSection>

                    <FormSection
                      icon={CreditCard}
                      title="Payment Setup"
                      description="Select the services, merchant, amount, currency, and sale type for this client payment."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormikCreateableSelect
                          name="service"
                          label="Select Services"
                          options={serviceOptions}
                          value={values.service}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.service}
                          isMulti={true}
                          touched={touched.service}
                          placeholder="Select Service"
                          onChangeExtra={(ser) => setFieldValue("service", ser)}
                        />

                        <FormikSelect
                          name="merchantType"
                          label="Select Merchant Type"
                          options={merchantOptions}
                          value={values.merchantType}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          error={errors.merchantType}
                          touched={touched.merchantType}
                          placeholder="Merchant"
                          onChangeExtra={(val) =>
                            setFieldValue("merchantType", val)
                          }
                        />

                        <InputField
                          label="Amount"
                          name="amount"
                          type="number"
                          errors={errors.amount}
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
                          onChangeExtra={(val) =>
                            setFieldValue("currency", val)
                          }
                        />
                      </div>
                    </FormSection>

                    <FormSection
                      icon={FileText}
                      title="Payment Note"
                      description="Add a short description for internal context and customer clarity."
                    >
                      <InputField
                        name="description"
                        label="Payment Description"
                        as="textarea"
                        errors={errors.description}
                        touched={touched.description}
                      />
                    </FormSection>

                    <div className="sticky bottom-3 z-10 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl shadow-zinc-200/80 backdrop-blur">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Sparkles className="h-4 w-4 text-emerald-500" />
                          This link will be created for the selected client
                          profile.
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              router.push("/dashboard/paymentLink")
                            }
                            className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                          >
                            Cancel
                          </button>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-zinc-300 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="h-5 w-5 animate-spin rounded-full border border-white/30 border-t-white" />
                                Creating...
                              </div>
                            ) : (
                              <>
                                Create Payment Link
                                <SendHorizontal className="h-4 w-4" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function InfoPill({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-zinc-900">{title}</p>
          <p className="truncate text-xs text-zinc-500">{text}</p>
        </div>
      </div>
    </div>
  );
}

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-start gap-3 border-b border-zinc-100 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-zinc-900">{title}</h2>
          <p className="mt-0.5 text-xs leading-5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default CreateClientPaymentLink;
