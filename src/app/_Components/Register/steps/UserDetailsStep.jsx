"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFormik } from "formik"
import * as Yup from "yup"
import { User, Eye, EyeOff, Lock ,Hash} from "lucide-react"
import {  useSearchParams } from "next/navigation";
import Link from "next/link";
import Main from "../../../../app/Assets/Main.png";
import Image from "next/image";

export default function GenZUserDetailsStep({ onSubmit, isLoading }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
      const searchParams = useSearchParams();
      const ref = searchParams.get("ref");
      const referralSource = searchParams.get("referralSource");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
      cpassword: "",
      referralBy: ref|| "",
      referralSource: referralSource|| "",
    },
    validationSchema: Yup.object({
      firstName:Yup.string().required("first name is required"),
      lastName:Yup.string().required("last name is required"),
      // password: Yup.string()
      //   .min(8, "Password must be at least 8 characters")
      //   .required("Password is required"),
      // cpassword: Yup.string()
      //   .oneOf([Yup.ref("password")], "Passwords don't match")
      //   .required("Please confirm your password"),
    }),
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return 0

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return Math.min(strength, 4)
  }

  const passwordStrength = getPasswordStrength(formik.values.password)

  const getStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    return "Strong"
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="p-6 pt-4">
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-30 h-30 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center"
        >
          <Link href="/" className="mx-auto">
            <Image src={Main} alt="Logo" />
          </Link>        </motion.div>
        <h2 className="text-2xl font-bold mb-1 text-[#FB3B11]">Create your profile</h2>
        <p className="text-gray-500">Tell us a bit about yourself</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-3">

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div
              className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "firstName"
                  ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                  : formik.touched.firstName && formik.errors.firstName
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
            >
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First name"
                className="w-full px-4 py-2 rounded-xl focus:outline-none text-gray-700"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e)
                  setFocusedField(null)
                }}
                onFocus={() => setFocusedField("firstName")}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs ml-2"
              >
                {formik.errors.firstName}
              </motion.p>
            )}
          </div>

          <div className="space-y-1">
            <div
              className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "lastName"
                  ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                  : formik.touched.lastName && formik.errors.lastName
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
            >
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last name"
                className="w-full px-4 py-2 rounded-xl focus:outline-none text-gray-700"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e)
                  setFocusedField(null)
                }}
                onFocus={() => setFocusedField("lastName")}
              />
            </div>
            {formik.touched.lastName && formik.errors.lastName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs ml-2"
              >
                {formik.errors.lastName}
              </motion.p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div
            className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "password"
                ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                : formik.touched.password && formik.errors.password
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
          >
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Create password"
              className="w-full pl-10 pr-10 py-2 rounded-xl focus:outline-none text-gray-700"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e)
                setFocusedField(null)
              }}
              onFocus={() => setFocusedField("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          {formik.values.password && (
            <div className="mt-2 mb-1">
              <div className="flex justify-between items-center mb-1">
                <div className="flex space-x-1 w-full max-w-[200px]">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`h-1 rounded-full flex-1 ${i < passwordStrength ? getStrengthColor() : "bg-gray-200"}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{getStrengthText()}</span>
              </div>
            </div>
          )}

          {formik.touched.password && formik.errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs ml-2"
            >
              {formik.errors.password}
            </motion.p>
          )}
        </div>

        <div className="space-y-1">
          <div
            className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "cpassword"
                ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                : formik.touched.cpassword && formik.errors.cpassword
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
          >
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="cpassword"
              id="cpassword"
              placeholder="Confirm password"
              className="w-full pl-10 pr-10 py-2 rounded-xl focus:outline-none text-gray-700"
              value={formik.values.cpassword}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e)
                setFocusedField(null)
              }}
              onFocus={() => setFocusedField("cpassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {formik.touched.cpassword && formik.errors.cpassword && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs ml-2"
            >
              {formik.errors.cpassword}
            </motion.p>
          )}
        </div>
        <div className="space-y-1">
          <div
            className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "referralBy"
                ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                : formik.touched.referralBy && formik.errors.referralBy
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
          >
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="referralBy"
              id="referralBy"
              placeholder="Reffered Code"
              className="w-full pl-10 pr-10 py-2 rounded-xl focus:outline-none text-gray-700"
              readOnly={ref}
              value={ref || formik.values.referralBy}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e)
                setFocusedField(null)
              }}
              onFocus={() => setFocusedField("referralBy")}
            />
           
          </div>
       
        </div>
       

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-[#FB3B11] hover:bg-[#e03610] text-white py-3.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-70 transition-all cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            "Continue"
          )}
        </motion.button>
        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FB3B11] font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
