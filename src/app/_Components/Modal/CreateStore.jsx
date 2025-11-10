"use client"
import { useState } from "react"
import { X, Store, DollarSign, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"


const phoneRegExp = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/;


const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name must be less than 50 characters")
    .required("Store name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  ein: Yup.string().required("EIN is required"),
  ownerName: Yup.string().required("Owner name is required"),
  businessPhone: Yup.string()
    .matches(phoneRegExp, "Business phone must be a valid US phone number")
    .required("Business phone is required"),
  ownerPhone: Yup.string()
    .matches(phoneRegExp, "Owner phone must be a valid US phone number")
    .required("Owner phone is required"),
  storeStreet: Yup.string().required("Store street address is required"),
  storeCity: Yup.string().required("Store city is required"),
  storeState: Yup.string().required("Store state is required"),
  storeZipCode: Yup.string().required("Store ZIP code is required"),
  storeCountry: Yup.string().required("Store country is required"),
  ownerStreet: Yup.string().required("Owner street address is required"),
  ownerCity: Yup.string().required("Owner city is required"),
  ownerState: Yup.string().required("Owner state is required"),
  ownerZipCode: Yup.string().required("Owner ZIP code is required"),
  ownerCountry: Yup.string().required("Owner country is required"),
})


const initialValues = {
  name: "",
  description: "",
  ein: "",
  ownerName: "",
  businessPhone: "",
  ownerPhone: "",
  storeStreet: "",
  storeCity: "",
  storeState: "",
  storeZipCode: "",
  storeCountry: "",
  ownerStreet: "",
  ownerCity: "",
  ownerState: "",
  ownerZipCode: "",
  ownerCountry: "",
  sellerPremium: '20%',
  listingFee: '$0.35',
  advertisingFee: '$5',
  JunkItemFee: '$5',
  packagingFee: '$5',
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
                  <X className="h-5 w-5 text-white hover:text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 mb-6 border border-red-200">
                <div className="flex items-center justify-center gap-2 mb-1">
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
                      <label htmlFor="name" className="block text-sm text-gray-800 mb-2">
                        Store Name *
                      </label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your store name (e.g., John's Electronics)"
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.name && touched.name
                          ? "border-red-300 b-[#5f2781]"
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
                      <label htmlFor="description" className="block text-sm text-gray-800 mb-2">
                        Store Description *
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="Describe your store, what you sell, and what makes you unique..."
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none ${errors.description && touched.description
                          ? "border-red-300 b-[#5f2781]"
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
                    {/* EIN Field */}
                    <div>
                      <label htmlFor="ein" className="block text-sm text-gray-800 mb-2">
                        EIN *
                      </label>
                      <Field
                        type="text"
                        id="ein"
                        name="ein"
                        placeholder="Employer Identification Number"
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ein && touched.ein ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                          }`}
                      />
                      <ErrorMessage name="ein" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label htmlFor="ownerName" className="block text-sm text-gray-800 mb-2">
                        Owner Name *
                      </label>
                      <Field
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        placeholder="Enter owner's full name"
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ownerName && touched.ownerName ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                          }`}
                      />
                      <ErrorMessage name="ownerName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>


                    {/* Store Address Section */}
                    <hr className="my-2 border-t border-gray-200" />
                    <h3 className="text-md text-gray-800 mb-2">Store Address</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="storeStreet" className="block text-sm text-gray-800 mb-2">Street *</label>
                        <Field
                          name="storeStreet"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.storeStreet && touched.storeStreet ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="storeStreet" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div>
                        <label htmlFor="storeCity" className="block text-sm text-gray-800 mb-2">City *</label>
                        <Field
                          name="storeCity"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.storeCity && touched.storeCity ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="storeCity" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div>
                        <label htmlFor="storeState" className="block text-sm text-gray-800 mb-2">State *</label>
                        <Field
                          name="storeState"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.storeState && touched.storeState ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="storeState" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div>
                        <label htmlFor="storeZipCode" className="block text-sm text-gray-800 mb-2">ZIP Code *</label>
                        <Field
                          name="storeZipCode"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.storeZipCode && touched.storeZipCode ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="storeZipCode" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="storeCountry" className="block text-sm text-gray-800 mb-2">Country *</label>
                        <Field
                          name="storeCountry"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.storeCountry && touched.storeCountry ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="storeCountry" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>
                    </div>

                    {/* Owner Address Section */}
                    <hr className="my-2 border-t border-gray-200" />
                    <h3 className="text-md  text-gray-800 mb-2"> Owner Address</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ownerStreet" className="block text-sm text-gray-800 mb-2">Street *</label>
                        <Field
                          name="ownerStreet"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ownerStreet && touched.ownerStreet ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="ownerStreet" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div>
                        <label htmlFor="ownerCity" className="block text-sm text-gray-800 mb-2">City *</label>
                        <Field
                          name="ownerCity"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ownerCity && touched.ownerCity ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="ownerCity" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div>
                        <label htmlFor="ownerState" className="block text-sm text-gray-800 mb-2">State *</label>
                        <Field
                          name="ownerState"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ownerState && touched.ownerState ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="ownerState" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div>
                        <label htmlFor="ownerZipCode" className="block text-sm text-gray-800 mb-2">ZIP Code *</label>
                        <Field
                          name="ownerZipCode"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ownerZipCode && touched.ownerZipCode ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="ownerZipCode" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="ownerCountry" className="block text-sm text-gray-800 mb-2">Country *</label>
                        <Field
                          name="ownerCountry"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ownerCountry && touched.ownerCountry ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                        <ErrorMessage name="ownerCountry" component="div" className="text-[120px] text-red-600 mt-1" />
                      </div>
                    </div>
                    <hr className="my-2 border-t border-gray-200" />

                    {/* Business Phone */}
                    <div>
                      <label htmlFor="businessPhone" className="block text-sm text-gray-800 mb-2">
                        Business Phone *
                      </label>
                      <Field
                        type="text"
                        id="businessPhone"
                        name="businessPhone"
                        placeholder="(123) 456-7890"
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.businessPhone && touched.businessPhone ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                          }`}
                      />
                      <ErrorMessage name="businessPhone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {/* Owner Phone */}
                    <div>
                      <label htmlFor="ownerPhone" className="block text-sm text-gray-800 mb-2">
                        Owner Phone *
                      </label>
                      <Field
                        type="text"
                        id="ownerPhone"
                        name="ownerPhone"
                        placeholder="(123) 456-7890"
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.ownerPhone && touched.ownerPhone ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                          }`}
                      />
                      <ErrorMessage name="ownerPhone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    <hr className="my-2 border-t border-gray-200" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label htmlFor="sellerPremium" className="block text-sm text-gray-800 mb-2">Seller Premium </label>
                        <Field
                          name="sellerPremium"
                          disabled
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.sellerPremium && touched.sellerPremium ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                      </div>

                      <div>
                        <label htmlFor="listingFee" className="block text-sm text-gray-800 mb-2">Listing Fee </label>
                        <Field
                          disabled
                          name="listingFee"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.listingFee && touched.listingFee ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                      </div>

                      <div>
                        <label htmlFor="advertisingFee" className="block text-sm text-gray-800 mb-2">Advertising Fee </label>
                        <Field
                          disabled
                          name="advertisingFee"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.advertisingFee && touched.advertisingFee ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                      </div>

                      <div>
                        <label htmlFor="JunkItemFee" className="block text-sm text-gray-800 mb-2">Junk Item Fee</label>
                        <Field
                          disabled
                          name="JunkItemFee"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.JunkItemFee && touched.JunkItemFee ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="packagingFee" className="block text-sm text-gray-800 mb-2">Packaging Fee</label>
                        <Field
                          disabled
                          name="packagingFee"
                          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.packagingFee && touched.packagingFee ? "border-red-300 b-[#5f2781]" : "border-gray-300 bg-white"
                            }`}
                        />
                      </div>
                    </div>


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
                        className={`flex-1 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all ${isValid && !isSubmitting
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