import React from 'react'
import { getAvailableTimeSlots } from "@/app/utilities/timeSlot"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { BoxIcon, Edit, X } from "lucide-react"
import { toast } from "react-hot-toast"
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion"
import { useAllFilterBoxProductQuery, useAllStoreProductQuery } from '@/app/_Services/StoreProduct/page'
import { useAddBoxProductMutation, useUpdateProductBoxMutation } from '@/app/_Services/Box/page'


const appointmentSchema = Yup.object().shape({
    //   appointmentDate: Yup.date().required("Date is required"),
    //   appointmentTime: Yup.string().required("Time is required"),
    notes: Yup.string().required('Notes is Required'),
})

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
}

const BoxModal = ({ isModalOpen, editingBox, closeModal, refetch }) => {
    const [updateProductBox, { isLoading: updateLoading }] = useUpdateProductBoxMutation()
    const [addBoxProduct, { isLoading: addLoading }] = useAddBoxProductMutation()
    const { data, error: isError, isLoading } = useAllFilterBoxProductQuery()


    const handleSubmit = async (values, { resetForm }) => {
        console.log(values,'values')
        try {
            let response;

            if (editingBox) {
                // Update case
                response = await updateProductBox({
                    id: editingBox._id,
                    // ...values,
                    notes: values?.notes,
                    products: values?.products?.map(e => e?.value)
                }).unwrap();
            } else {
                // Create case
                response = await addBoxProduct({ notes: values?.notes, products: values?.products?.map(e => e?.value) }).unwrap();
            }

            if (response.success) {
                toast.success(editingBox ? "Product Box updated successfully!" : "Product Box created successfully!");
                resetForm();
                closeModal();
                refetch();
            } else {
                toast.error(response.message || "Failed to process request");
            }
        } catch (error) {
            toast.error(error.data?.message || "An error occurred");
        }
    };


    console.log(data, 'useAllFilterBoxProductQuery  ')

    const productsOptions = data?.data?.map(tag => ({
        label: `${tag?.sku} | ${tag?.name} `,
        value: tag?._id
    }));

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[100vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <BoxIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{`${editingBox ? "Edit Box" : 'Create Box'} `}</h2>
                                        <p className="text-red-100 mt-1">Product Box Details</p>
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

                        <div className="p-6">
                            <Formik
                                initialValues={{
                                    products: editingBox?.products
                                        ? editingBox.products.map(e => ({
                                            label: `${e?.sku} | ${e?.name}`,
                                            value: e?._id,
                                        }))
                                        : [],
                                    notes: editingBox?.notes || "",
                                }}
                                validationSchema={appointmentSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ errors, touched, values, setFieldValue }) => (
                                    <Form className="space-y-6" onKeyDown={(e) => {
                                        if (e.key === "Enter") e.preventDefault();
                                    }}>


                                        <div>
                                            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                                             Please describe box content
                                            </label>
                                            <Field
                                                as="textarea"
                                                id="notes"
                                                name="notes"
                                                rows="4"
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-500 rounded-xl focus:outline-none transition-colors resize-none"
                                                placeholder="Any additional notes for the appointment..."
                                            />
                                            <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-start text-gray-800 mb-3">
                                                Products
                                            </label>

                                            <Select
                                                options={productsOptions}
                                                isMulti
                                                menuPortalTarget={document.body}
                                                placeholder="Select or type to add..."
                                                // value={productsOptions?.filter(opt => values?.products?.includes(opt.value))}
                                                // onChange={(selected) => {
                                                //     const ids = selected?.map(s => s.value);
                                                //     setFieldValue("products", ids);
                                                // }}
                                                value={values.products}   // ✅ keep objects
                                                onChange={(selected) => {
                                                    setFieldValue("products", selected || []); // ✅ keep objects
                                                }}
                                                className="text-sm text-start capitalize"
                                                classNamePrefix="react-select"
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    control: (base) => ({
                                                        ...base,
                                                        borderRadius: "0.75rem",
                                                        padding: "0.25rem",
                                                        borderColor: "red",
                                                        textTransform: "capitalize"

                                                    })
                                                }}
                                            />

                                            {/* <div className="flex flex-wrap gap-2 mt-3">
                                                {values?.products?.map((id) => {
                                                    const product = productsOptions?.find(opt => opt.value === id);
                                                    return (
                                                        <span
                                                            key={id}
                                                            className="inline-flex items-center bg-green-300 text-green-800 text-sm px-3 py-1 rounded-full text-start"
                                                        >
                                                            {product?.label || id}
                                                            <button
                                                                type="button" // prevent form submit
                                                                onClick={() =>
                                                                    setFieldValue("products", values?.products?.filter(p => p !== id))
                                                                }
                                                                className="ml-2 text-white/80 hover:text-white"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div> */}
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {values?.products?.map((p) => (
                                                    <span
                                                        key={p.value}
                                                        className="inline-flex items-center bg-green-300 text-green-800 text-sm px-3 py-1 rounded-full text-start"
                                                    >
                                                        {p.label}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setFieldValue("products", values.products.filter(prod => prod.value !== p.value))
                                                            }
                                                            className="ml-2 text-white/80 hover:text-white"
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>


                                        <div className="flex gap-4 pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={editingBox ? updateLoading : addLoading}
                                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 transition-all"
                                            >
                                                {editingBox
                                                    ? (updateLoading ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Updating...
                                                        </div>
                                                    ) : "Update Box")
                                                    : (addLoading ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Creating...
                                                        </div>
                                                    ) : "Create Box")}
                                            </motion.button>


                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="button"
                                                onClick={closeModal}
                                                className="px-3 py-3 border-2 cursor-pointer border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
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
    )
}

export default BoxModal