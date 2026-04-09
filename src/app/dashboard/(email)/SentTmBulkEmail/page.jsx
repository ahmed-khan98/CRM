"use client";
import { Mails, Send } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import FormikSelect from "@/app/_Components/Modal/formikSelect";
import { useAllEmailTemplatesQuery } from "@/app/_Services/emailTemplate/page";
import { useGetBrandEmailByBrandIdQuery } from "@/app/_Services/domain/page";
import TinyEditor from "@/app/_Components/TinyEditor";
import { bulkEmailSchema } from "@/app/schema/bulkEmail";
import { useSentTmBulkEmailMutation } from "@/app/_Services/sentTmBulkEmail/page";
import { useAllTmEmailListsQuery } from "@/app/_Services/TmEmailList/page";
import { useAllBrandsQuery } from "@/app/_Services/brand/page";

export default function page() {
  const [sentBulkEmail] = useSentTmBulkEmailMutation();
  const { data: Brand, error, isLoading: isBrandLoading } = useAllBrandsQuery();

  const {
    data: templates,
    error: isTemplateError,
    isLoading: isTemplateLoading,
  } = useAllEmailTemplatesQuery();

  const {
    data: lists,
    error: isListError,
    isLoading: isListLoading,
  } = useAllTmEmailListsQuery();

  const initialValues = {
    compaignName: "",
    brandId: "",
    fromemail: "",
    domainId: "",
    listId: "",
    templateId: "",
    subject: "Hi ",
    body: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await sentBulkEmail({ ...values }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success(response?.message);
      } else {
        toast.error(response.message || "Failed to process sending email");
      }
      resetForm();
    } catch (error) {
      console.log(error, "error");
      toast.error(error.data?.message || "Failed to sending email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  py-6 md:py-2 px-2">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-3xl shadow-md p-6 mt-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-700 flex items-center">
                <Mails className="mr-2 h-6 w-6 text-gray-800" />
                New Compaign Bulk Email
              </h2>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={bulkEmailSchema}
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

                console.log(values,'values')
                const {
                  data: brandEmail,
                  error,
                  isLoading: isBrandEmailLoading,
                } = useGetBrandEmailByBrandIdQuery(values.brandId, {
                  skip: !values.brandId,
                });

                const brandOptions =
                  Brand?.data?.map((b) => ({
                    value: b?._id,
                    label: b?.name,
                  })) ?? [];

                const brandEmailOptions =
                  brandEmail?.data?.map((d) => ({
                    value: d?._id,
                    label: d?.name,
                  })) ?? [];

                const templatesOptions =
                  templates?.data?.map((b) => ({
                    value: b?._id,
                    label: b?.name,
                  })) ?? [];

                const listsOptions =
                  lists?.data?.map((b) => ({
                    value: b?._id,
                    label: b?.listName,
                  })) ?? [];

                const handleBrandChange = (newDeptId) => {
                  setFieldValue("brandId", newDeptId);
                  setFieldValue(
                    "fromemail",
                  ''
                  );
                  setFieldValue(
                    "domainId",
                   ''
                  );
                };

                const handleDomainChange = (newDeptId) => {
                  setFieldValue("domainId", newDeptId);

                  setFieldValue(
                    "fromemail",
                    brandEmail?.data?.find((option) => option._id === newDeptId)
                      ?.email ||''
                  );
                  // setFieldValue(
                  //   "domainId",
                  //   brandEmail?.data?.find((option) => option._id === newDeptId)
                  //     ?.name || ''
                  // );
                };

                const handleTemplateChange = (newTempId) => {
                  setFieldValue("templateId", newTempId || "");

                  if (!newTempId) {
                    setFieldValue("subject", "Hi");
                    setFieldValue("body", "");
                    return;
                  }

                  const temp = templates?.data?.find(
                    (t) => t._id === newTempId
                  );
                  setFieldValue("subject", temp?.subject || "");
                  setFieldValue("body", temp?.content || "");
                };

                return (
                  <Form className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Compaign Name
                        </label>
                        <Field
                          type="text"
                          name="compaignName"
                          //   readOnly={values?.compaignName ? true : false}
                          className={`w-full px-4 py-2 text-sm border-1 ${
                            errors.compaignName && touched.compaignName
                              ? "border-zinc-500 focus:border-zinc-500"
                              : "border-gray-200 focus:border-zinc-800"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="compaignName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <FormikSelect
                        name="brandId"
                        label="Select Brand"
                        options={brandOptions}
                        value={values?.brandId}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.brandId}
                        touched={touched.brandId}
                        placeholder="Select Brand"
                        onChangeExtra={handleBrandChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Sender Email ID
                        </label>
                        <Field
                          type="email"
                          name="fromemail"
                          //   readOnly={values?.fromemail ? true : false}
                          className={`w-full px-4 py-2 text-sm border-1 ${
                            errors.fromemail && touched.fromemail
                              ? "border-zinc-500 focus:border-zinc-500"
                              : "border-gray-200 focus:border-zinc-800"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="fromemail"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <FormikSelect
                        name="domainId"
                        label="Sending Domain"
                        options={brandEmailOptions}
                        value={values?.domainId}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.domainId}
                        touched={touched.domainId}
                        placeholder="Select Domain"
                        onChangeExtra={handleDomainChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormikSelect
                        name="templateId"
                        label="Select Email Template"
                        options={templatesOptions}
                        value={values?.templateId}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.templateId}
                        touched={touched.templateId}
                        placeholder="Select Template"
                        onChangeExtra={handleTemplateChange}
                      />
                      <FormikSelect
                        name="listId"
                        label="Select Email List"
                        options={listsOptions}
                        value={values?.listId}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        error={errors.listId}
                        touched={touched.listId}
                        placeholder="Select Email List"
                      />
                    </div>
                    <div className="gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Subject:
                        </label>
                        <Field
                          type="text"
                          name="subject"
                          className={`w-full px-4 py-2 border-1 text-sm ${
                            errors.subject && touched.subject
                              ? "border-zinc-500 focus:border-zinc-500"
                              : "border-gray-200 focus:border-zinc-800"
                          } rounded-xl focus:outline-none transition-colors`}
                        ></Field>
                        <ErrorMessage
                          name="subject"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Body
                      </label>
                      <TinyEditor
                        value={values?.body}
                        onChange={(html) => setFieldValue("body", html)}
                      />
                      <ErrorMessage
                        name="body"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                      {/* <div className="text-xs text-gray-500 mt-2">
                                            You can use merge tags like <code>{"{{firstName}}"}</code>,{" "}
                                            <code>{"{{lastName}}"}</code>, <code>{"{{email}}"}</code>.
                                          </div> */}
                    </div>

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-2 md:px-4 py-2 cursor-pointer bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-xl text-sm font-semibold  hover:from-[#4f1f6d] hover:to-[#5f2781] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-1 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Send className="h-4 w-4" /> Submit
                          </>
                        )}
                      </motion.button>
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
}
