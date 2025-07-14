"use client"
import { useState } from "react"
import { X, Store, DollarSign, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name must be less than 50 characters")
    .required("Store name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
})

const initialValues = {
  name: "",
  description: "",
}



export default function CreateStoreModal({ isOpen, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error("Error creating store:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700  px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create Your Store</h2>
                    <p className="text-sm text-gray-200">Set up your marketplace presence</p>
                  </div>
                </div>
                <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                  <X className="h-5 w-5 text-white hover:text-red-600"/>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Payment Info Banner */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 mb-6 border border-red-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">One-Time Setup Fee: $50</span>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  This covers store verification, lifetime access, and premium features
                </p>
              </div>

              {/* Form */}
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, errors, touched, isValid }) => (
                  <Form className="space-y-6">
                    {/* Store Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Name *
                      </label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your store name (e.g., John's Electronics)"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          errors.name && touched.name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                      />
                      {values.name && !errors.name && (
                        <div className="mt-1 text-sm text-green-600 flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Looks good!
                        </div>
                      )}
                    </div>

                    {/* Description Field */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Description *
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe your store, what you sell, and what makes you unique..."
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none ${
                          errors.description && touched.description
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <ErrorMessage name="description" component="div" className="text-sm text-red-600" />
                        <span
                          className={`text-sm ${values.description.length > 500 ? "text-red-500" : "text-gray-500"}`}
                        >
                          {values.description.length}/500
                        </span>
                      </div>
                      {values.description && !errors.description && (
                        <div className="mt-1 text-sm text-green-600 flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Great description!
                        </div>
                      )}
                    </div>

                 

                    {/* Features Preview 
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">What you'll get:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500" />
                          Unlimited product listings
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500" />
                          Professional store page
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500" />
                          Sales analytics dashboard
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500" />
                          Customer messaging system
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500" />
                          Secure payment processing
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500" />
                          24/7 customer support
                        </div>
                      </div>
                    </div>*/}

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="cursor-pointer flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`flex-1 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all ${
                          isValid && !isSubmitting
                            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Create Store - $50
                          </div>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
