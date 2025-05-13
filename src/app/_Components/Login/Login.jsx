"use client"

import { useState } from "react"
import { useLoginMutation } from "@/app/_Services/authentication/page"
import { useFormik } from "formik"
import Cookies from "js-cookie"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "react-hot-toast"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { AtSign, Lock, Eye, EyeOff } from "lucide-react"
import Main from "../../../app/Assets/Main.png";

export default function GenZLoginForm() {
  const navigation = useRouter()
  const [loginForm, { isLoading: isSubmitting }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const loginInitialValue = {
    email: "",
    password: "",
  }

  const formik = useFormik({
    initialValues: loginInitialValue,
    enableReinitialize: true,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginForm(values).unwrap()
        console.log("Form submitted successfully:", response)

        if (response.statusCode === 200) {
          const { accessToken } = response?.data
          const user = response?.data?.user
          Cookies.set("token", accessToken, { expires: 7, secure: true })
          Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true })
          toast.success(response.message)
          navigation.push("/auction-product")
        }
      } catch (error) {
        console.log(error, "verify-error")
        if (error?.data.statusCode === 403 && error?.data?.data?.email) {
          navigation.push(`/register`)
        }
        toast.error(error.data.message)
      }
    },
  })

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
                  <Image src={Main} alt="Logo" width={120} height={50} />
                </Link>              </motion.div>
              <h2 className="text-2xl font-bold mb-1 text-[#FB3B11]">Welcome back</h2>
              <p className="text-gray-500">Sign in to your account</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <div
                  className={`relative border-2 rounded-xl transition-all duration-300 ${focusedField === "email"
                      ? "border-[#FB3B11] shadow-sm shadow-orange-100"
                      : formik.touched.email && formik.errors.email
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                >
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl focus:outline-none text-gray-700"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e)
                      setFocusedField(null)
                    }}
                    onFocus={() => setFocusedField("email")}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm ml-2"
                  >
                    {formik.errors.email}
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
                    placeholder="Password"
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
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
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

              <div className="text-right">
                <Link href="/forget" className="text-sm text-[#FB3B11] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FB3B11] hover:bg-[#e03610] text-white py-3.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-70 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "LOG IN"
                )}
              </motion.button>

              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#FB3B11] font-medium hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
