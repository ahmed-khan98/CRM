"use client";

import { useState } from "react";
import { useLoginMutation } from "@/app/_Services/authentication/page";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import Main from "../../../app/Assets/zytronlogo.png";
import { useDispatch } from "react-redux";
import { setActivity } from "@/redux/filterSlice";

export default function GenZLoginForm() {
  const navigation = useRouter();
  const [loginForm, { isLoading: isSubmitting }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

//   fetch('http://185.199.52.245:8000/api/v1/user/userLogin', {
//   method: 'POST',
//   headers: {'Content-Type': 'application/json'},
//   body: JSON.stringify({email: 'ahmedkhn015@gmail.com', password: '11223344'})
// }).then(r => r.text()).then(console.log)

  const loginInitialValue = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: loginInitialValue,
    enableReinitialize: true,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginForm(values).unwrap();
        if (response.statusCode === 200) {
          const { accessToken } = response?.data;
          const user = response?.data?.user;
          console.log("Login successful:", response?.data);
          if (window.chrome) {
            window.postMessage(
              {
                type: "LOGIN_SUCCESS",
                userId: user._id,
                token: accessToken,
              },
              "*", 
            );
          }

          dispatch(
            setActivity({
              activityStatus: user?.activityStatus,
              breakInTime: user?.lastBreakInTime,
            }),
          );

          Cookies.set("token", accessToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          });
          Cookies.set("currentuser", JSON.stringify(user), {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          });
          toast.success(response.message);
          navigation.push("/dashboard/statictics");
        }
      } catch (error) {
        console.log("Login error:", error);
        if (error?.data.statusCode === 403 && error?.data?.data?.email) {
          navigation.push(`/login`);
        }
        toast.error(error.data.message);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40">
          <div className="p-7">
            <div className="mb-7 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-3 flex items-center justify-center"
              >
                <Link href="/login" className="mx-auto">
                  <Image src={Main} alt="Logo" width={270} height={60} />
                </Link>
              </motion.div>
              <p className="text-sm font-medium text-zinc-400">
                Sign in to Zytron World CRM
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="">
                <div
                  className={`relative border-1 rounded-xl transition-all duration-300 ${
                    focusedField === "email"
                      ? "border-zinc-800"
                      : formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-zinc-800"
                  }`}
                >
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <AtSign className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full rounded-xl bg-zinc-950/60 py-3 pl-9 pr-2 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-inner outline-none focus:ring-2 focus:ring-white/10"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField("email")}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[11px] ml-2"
                  >
                    {formik.errors.email}
                  </motion.p>
                )}
              </div>

              <div className="">
                <div
                  className={`relative border-1 rounded-xl transition-all duration-300 ${
                    focusedField === "password"
                      ? "border-zinc-800 "
                      : formik.touched.password && formik.errors.password
                        ? "border-red-500"
                        : "border-zinc-800"
                  }`}
                >
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full rounded-xl bg-zinc-950/60 py-3 pl-10 pr-10 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-inner outline-none focus:ring-2 focus:ring-white/10"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-zinc-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-zinc-400" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[11px] ml-2"
                  >
                    {formik.errors.password}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-white py-3.5 text-sm font-semibold text-zinc-950 shadow-lg transition hover:bg-zinc-100 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  "Log in"
                )}
              </motion.button>

              {/* <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/register" className="text-gray-800 font-medium hover:underline">
                  Register
                </Link>
              </div> */}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
