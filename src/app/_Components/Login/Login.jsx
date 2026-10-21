"use client";

import { useEffect, useState } from "react";
import { useLoginMutation } from "@/app/_Services/authentication/page";
import { useFormik } from "formik";
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
import BrandLogo from "../brand/BrandLogo";
import {
  hasValidSession,
  setAuthCookies,
} from "@/app/_utils/authCookies";

export default function GenZLoginForm() {
  const navigation = useRouter();
  const [loginForm, { isLoading: isSubmitting }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();

  // Already logged in → dashboard (mobile Chrome reopen / bookmark)
  useEffect(() => {
    if (hasValidSession()) {
      navigation.replace("/dashboard/statistics");
    }
  }, [navigation]);

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
          const { accessToken, refreshToken } = response?.data || {};
          const user = response?.data?.user;
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

          setAuthCookies({ accessToken, refreshToken, user });
          toast.success(response.message);
          navigation.replace("/dashboard/statistics");
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
   <div className="min-h-screen bg-[#08090b] text-white">
  <Toaster position="top-center" />

  <div className="grid min-h-screen lg:grid-cols-2">

    {/* =====================================================
        LEFT — BRAND / PRODUCT SECTION
    ====================================================== */}
    <div className="relative hidden overflow-hidden border-r border-white/[0.08] lg:flex">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Orange glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-bg-[# DCDFE0]/[0.04] blur-[100px]" />

      <div className="relative z-10 flex w-full flex-col justify-between px-12 py-12 xl:px-20 xl:py-14">

        {/* Brand */}
        <div>
          <Link href="/login" className="inline-flex items-center">
            <BrandLogo
              href={null}
              width={190}
              height={48}
              priority
            />
          </Link>

          <div className="mt-4 inline-flex items-center gap-2 border border-white/[0.10] bg-white/[0.03] px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-bg-[#  DCDFE0]" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Customer operations, simplified
            </span>
          </div>
        </div>

        {/* Main copy */}
        <div className="my-auto max-w-[650px] py-4">

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-[54px] font-semibold leading-[1.02] tracking-[-0.04em] text-zinc-100 xl:text-[68px]">
              Your customers.
              <br />

              <span className="text-[#  DCDFE0]">
                One clear view.
              </span>
            </h1>

            <p className="mt-8 max-w-[560px] text-[17px] leading-8 text-zinc-500">
              Keep conversations, deals, and next steps together—
              so your team can focus on relationships that move the
              business forward.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 grid max-w-[620px] grid-cols-3 border-t border-white/[0.10] pt-7"
          >
            <div>
              <p className="text-[25px] font-semibold tracking-tight text-zinc-100">
                360°
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Customer context
              </p>
            </div>

            <div>
              <p className="text-[25px] font-semibold tracking-tight text-zinc-100">
                24/7
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Workspace access
              </p>
            </div>

            <div>
              <p className="text-[25px] font-semibold tracking-tight text-zinc-100">
                1 place
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                For every deal
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Zyro CRM. Built for focused teams.
        </p>
      </div>
    </div>


    {/* =====================================================
        RIGHT — LOGIN SECTION
    ====================================================== */}
    <div className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-20">

      {/* Mobile background glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-bg-[#  DCDFE0]/[0.04] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[460px]"
      >

        {/* Mobile logo */}
        <div className="mb-10 flex justify-center lg:hidden">
          <Link href="/login">
            <BrandLogo
              href={null}
              width={190}
              height={48}
              priority
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-9">
          <p className="mb-3 text-sm font-semibold text-bg-[# DCDFE0]">
            Welcome back
          </p>

          <h2 className="text-[38px] font-semibold leading-[1.05] tracking-[-0.035em] text-zinc-100 sm:text-[44px]">
            Sign in to Zyro
          </h2>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Enter your work email and password to continue.
          </p>
        </div>


        {/* =================================================
            FORM
        ================================================== */}
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6"
        >

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2.5 block text-sm font-semibold text-zinc-300"
            >
              Work email
            </label>

            <div className="relative">

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <AtSign
                  className={`h-[18px] w-[18px] transition-colors ${
                    focusedField === "email"
                      ? "text-bg-[# DCDFE0]"
                      : "text-zinc-500"
                  }`}
                />
              </div>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setFocusedField(null);
                }}
                onFocus={() => setFocusedField("email")}
                className={`
                  h-[52px]
                  w-full
                  border
                  bg-[#101216]
                  pl-11
                  pr-4
                  text-sm
                  text-zinc-100
                  outline-none
                  transition-all
                  placeholder:text-zinc-600
                  ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500/70 focus:ring-2 focus:ring-red-500/10"
                      : focusedField === "email"
                        ? "border-bg-[# DCDFE0]/70 ring-2 ring-bg-[# DCDFE0]/10"
                        : "border-white/[0.14] hover:border-white/[0.22]"
                  }
                `}
              />
            </div>

            {formik.touched.email && formik.errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs font-medium text-red-400"
              >
                {formik.errors.email}
              </motion.p>
            )}
          </div>


          {/* PASSWORD */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">

              <label
                htmlFor="password"
                className="text-sm font-semibold text-zinc-300"
              >
                Password
              </label>

              <button
                type="button"
                className="cursor-pointer text-xs font-semibold text-bg-[#  DCDFE0] transition-colors hover:bg-[#fc8550]"
                onClick={() => {
                  // Keep your existing forgot password logic here
                }}
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock
                  className={`h-[18px] w-[18px] transition-colors ${
                    focusedField === "password"
                      ? "text-bg-[# DCDFE0]"
                      : "text-zinc-500"
                  }`}
                />
              </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setFocusedField(null);
                }}
                onFocus={() => setFocusedField("password")}
                className={`
                  h-[52px]
                  w-full
                  border
                  bg-[#101216]
                  pl-11
                  pr-12
                  text-sm
                  text-zinc-100
                  outline-none
                  transition-all
                  placeholder:text-zinc-600
                  ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500/70 focus:ring-2 focus:ring-red-500/10"
                      : focusedField === "password"
                        ? "border-bg-[# DCDFE0]/70 ring-2 ring-bg-[# DCDFE0]/10"
                        : "border-white/[0.14] hover:border-white/[0.22]"
                  }
                `}
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>

            {formik.touched.password && formik.errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs font-medium text-red-400"
              >
                {formik.errors.password}
              </motion.p>
            )}
          </div>




          {/* LOGIN BUTTON */}
          <motion.button
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="
              flex
              h-[52px]
              w-full
              cursor-pointer
              items-center
              justify-center
              gap-2
              bg-[#DCDFE0]
              text-sm
              font-semibold
              text-black
              shadow-[0_12px_30px_-10px_rgba(255,255,255,0.12)]
              transition-all
              duration-200
              hover:bg-[#DCDFE0]/[0.90]
              hover:shadow-[0_16px_35px_-10px_rgba(220,223,224,0.28)]
              disabled:cursor-not-allowed
        
              disabled:opacity-60
            "
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <span className="text-lg leading-none">→</span>
              </>
            )}
          </motion.button>
        </form>


        {/* SECURITY */}
        <div className="mt-12 border-t border-white/[0.10] pt-7">
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <span className="text-bg-[# DCDFE0]">♢</span>
            <span>
              Protected with enterprise-grade security
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  </div>
</div>
  );
}
