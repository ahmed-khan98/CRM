"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useUpdateProfileMutation } from "@/app/_Services/authentication/page"
import toast, { Toaster } from "react-hot-toast"
import { User, Mail, Phone, MapPin, Edit2, Save, CheckCircle, Loader2, } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Tab from "@/app/_Components/Tab/page"
import { myAccountTabs } from "@/app/utilities/tabs/page"
import { US_STATES } from "@/app/utilities/state"
import { formatPhoneNumber } from "@/app/utilities/phoneFormat"

const ProfilePage = () => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [isEditable, setIsEditable] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
  })

  useEffect(() => {
    const data = Cookies.get("currentuser")
    if (data) {
      const user = JSON.parse(data)
      console.log(user, 'user')
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await updateProfile(formData).unwrap()
      if (res.success) {
        const user = res?.data
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        setIsEditable(false)
        Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true })
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed")
    }
  }

  return (
    <div className="min-h-screen  py-4 px-4">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto pt-4">

        <Tab tabs={myAccountTabs} />
        <div className="my-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="relative overflow-hidden">
            {/* Decorative header */}
            <div className="h-24 bg-gradient-to-r from-[#5f2781] to-[#a945fc]"></div>

            {/* Profile header with edit button */}
            <div className="relative px-1 md:px-8  pb-6 -mt-14">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex items-end gap-4 mx-4 md:mx-0">
                  <div className="h-20 w-20 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-white">
                    <div className="h-full w-full rounded-full bg-[#5f2781] flex items-center justify-center text-white text-2xl font-bold capitalize">
                      {`${formData.firstName?.charAt(0)} ${formData.lastName?.charAt(0)}`  || <User size={30} />}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                      {formData.firstName ? `${formData.firstName} ${formData.lastName || ""}` : "Your Profile"}
                    </h2>
                    <p className="text-gray-500">{formData.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditable(!isEditable)}
                  className={`cursor-pointer flex items-center mx-4 gap-2 px-5 py-2.5 rounded-full transition-all ${isEditable
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-white text-[#5f2781] border border-[#5f2781] hover:bg-[#a945fc] hover:text-white"
                    }`}
                >
                  {isEditable ? (
                    <>Cancel Editing</>
                  ) : (
                    <>
                      <Edit2 size={18} /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 border-l-4 border-green-500 p-4 mx-8"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-green-700">Your profile has been updated successfully!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                  <User size={16} className="text-[#5f2781]" />
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`w-full p-4  border ${isEditable ? "bg-white  focus:ring-red-500" : "bg-gray-50  focus:ring-[#5f2781]"
                      } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200`}
                    placeholder="Your first name"
                  />


                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                  <User size={16} className="text-[#5f2781]" />
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`w-full p-4  border ${isEditable ? "bg-white  focus:ring-red-500" : "bg-gray-50  focus:ring-[#5f2781]"
                      } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200`}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                  <Mail size={16} className="text-[#5f2781]" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`w-full p-4  border ${isEditable ? "bg-white  focus:ring-red-500" : "bg-gray-50  focus:ring-[#5f2781]"
                      } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200`}
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                  <Phone size={16} className="text-[#5f2781]" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    // onChange={handleChange}
                    onChange={(e) => {
                      const formattedValue = formatPhoneNumber(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        'phone': formattedValue,
                      }));
                    }}
                    placeholder="+1 (555) 123-4567"
                    disabled={!isEditable}
                    className={`w-full p-4  border ${isEditable ? "bg-white  focus:ring-red-500" : "bg-gray-50  focus:ring-[#5f2781]"
                      } border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5f2781] transition-all duration-200`}
                    // placeholder="Your phone number"
                  />
                </div>
              </div>

      
            </div>

            <AnimatePresence>
              {isEditable && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 flex justify-center"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group cursor-pointer relative overflow-hidden px-8 py-4 bg-[#5f2781] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-70 min-w-[200px]"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          Save Changes
                          <Save className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
