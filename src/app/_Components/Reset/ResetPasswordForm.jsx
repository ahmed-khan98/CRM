"use client"

import { useState } from "react"
import { useResetMutation } from "@/app/_Services/authentication/page"
import { useFormik } from "formik"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "react-hot-toast"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { KeyRound, Eye, EyeOff, Lock, ArrowLeft, Hash } from "lucide-react"
import Main from "../../../app/Assets/Main.png";


export default function GenZResetPasswordForm() {
  const navigation = useRouter()
  const [resetPassword, { isLoading: isSubmitting }] = useResetMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const resetSchema = Yup.object({
    code: Yup.string().required("Reset code is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  })

  const initialValues = {
    code: "",
    password: "",
    confirmPassword: "",
  }

  const formik = useFormik({
    initialValues,
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      try {
        const response = await resetPassword(values).unwrap()
        toast.success(response?.message || "Password reset successful")
        navigation.push("/login")
      } catch (error) {
        toast.error(error?.data?.message || "Failed to reset password")
      }
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6">


            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-30 h-30 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center"
              >
                <Link href="/" className="mx-auto">
                  <Image src={Main} alt="Logo" />
                </Link>              </motion.div>
              <h2 className="text-2xl font-bold mb-1 text-[#FB3B11]">Reset Password</h2>
              <p className="text-gray-500">Create a new password for your account</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <div
                  className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "code"
                      ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                      : formik.touched.code && formik.errors.code
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                >
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="code"
                    placeholder="Reset code"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl focus:outline-none text-gray-700"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e)
                      setFocusedField(null)
                    }}
                    onFocus={() => setFocusedField("code")}
                  />
                </div>
                {formik.touched.code && formik.errors.code && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm ml-2"
                  >
                    {formik.errors.code}
                  </motion.p>
                )}
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
                    placeholder="New password"
                    className="w-full pl-10 pr-10 py-3.5 rounded-xl focus:outline-none text-gray-700"
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
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {formik.values.password && (
                  <div className="mt-2 mb-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex space-x-1 w-full max-w-[200px]">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`h-1 rounded-full flex-1 ${i < passwordStrength ? getStrengthColor() : "bg-gray-200"
                              }`}
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
                    className="text-red-500 text-sm ml-2"
                  >
                    {formik.errors.password}
                  </motion.p>
                )}
              </div>

              <div className="space-y-1">
                <div
                  className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "confirmPassword"
                      ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                      : formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                >
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-10 py-3.5 rounded-xl focus:outline-none text-gray-700"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e)
                      setFocusedField(null)
                    }}
                    onFocus={() => setFocusedField("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm ml-2"
                  >
                    {formik.errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FB3B11] cursor-pointer hover:bg-[#e03610] text-white py-3.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-70 transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Resetting...
                  </div>
                ) : (
                  "RESET PASSWORD"
                )}
              </motion.button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-[#FB3B11] text-sm font-medium flex items-center justify-center mx-auto hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
