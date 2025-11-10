"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import {
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
  useRegisterMutation,
  useCheckUsernameMutation,
} from "@/app/_Services/authentication/page"
import EmailStep from "./steps/EmailStep"
import VerificationStep from "./steps/VerificationStep"
import UserDetailsStep from "./steps/UserDetailsStep"
import SuccessStep from "./steps/SuccessStep"
import Username from "./steps/Username"
import Store from "./steps/Store"
import PhoneNo from "./steps/PhoneNo"
import Mailing from "./steps/Mailing"
import { ChevronLeft } from "lucide-react"

function GenZRegistrationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    cpassword: "",
    mailing: {
      address: '',
      city: '',
      state: '',
    },
    store: "",
    phone: "",
  })
  console.log(formData,'formData')

  const [sendVerificationCode, { isLoading: isSendingCode }] = useSendVerificationCodeMutation()
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation()
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation()
  const [checkUsername, { isLoading: isChecking }] = useCheckUsernameMutation()

  const handleEmailSubmit = async (email) => {
    try {
      setFormData((prev) => ({ ...prev, email }))
      await sendVerificationCode({ email }).unwrap()
      toast.success("Verification code sent on email!")
      setStep(2)
    } catch (error) {
      toast.error(error.data?.message || "Oops! Couldn't send the code 😕")
    }
  }

  const handleCodeSubmit = async (code) => {
    try {
      setFormData((prev) => ({ ...prev, code }))
      await verifyCode({
        email: formData.email,
        code,
      }).unwrap()
      toast.success("Email verified! ✅")
      setStep(3)
    } catch (error) {
      toast.error(error.data?.message || "Wrong code, try again 🤔")
    }
  }

  const handleUsername = async (username) => {
    try {
      setFormData((prev) => ({ ...prev, username }))
      await checkUsername({ username }).unwrap()
      setStep(4)
    } catch (error) {
      toast.error(error.data?.message || "Username failed 😢")
    }
  }

  const handleUserdetail = async (userdetail) => {
    try {
      setFormData((prev) => ({ ...prev, userdetail }))
      setStep(5)
    } catch (error) {
      toast.error(error.data?.message || "Oops! Couldn't send the code 😕")
    }
  }

  const handleStore = async (store) => {
    try {
      setFormData((prev) => ({ ...prev, store }))
      setStep(6)
    } catch (error) {
      toast.error(error.data?.message || "Oops! Couldn't send the code 😕")
    }
  }
  const handleMailing = async (values) => {
    console.log(values, 'mailing values')
    try {

      setFormData((prev) => ({
        ...prev,
        mailing: {
          address: values?.address,
          city: values?.city,
          state: values?.state,
        }
      }))
      setStep(7)
    } catch (error) {
      toast.error(error.data?.message || "Oops! Couldn't send the code 😕")
    }
  }

  const handleUserDetailsSubmit = async (userData) => {
    try {
      const finalData = {
        firstName: formData.userdetail.firstName,
        lastName: formData.userdetail.lastName,
        password: formData.userdetail.password,
        referralBy: formData.userdetail.referralBy,
        referralSource: formData.userdetail.referralSource,
        email: formData.email,
        username: formData.username,
        storeName: formData?.store,
        phone: userData,
        mailing: formData?.mailing,
        role: "USER",
      }

      await registerUser(finalData).unwrap()
      toast.success("You're in! 🎉")
      setStep(8)
    } catch (error) {
      console.log(error,'error')
      toast.error(error.data?.message || "Registration failed 😢")
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <EmailStep onSubmit={handleEmailSubmit} isLoading={isSendingCode} initialEmail={formData.email} />
      case 2:
        return (
          <VerificationStep
            onSubmit={handleCodeSubmit}
            isLoading={isVerifying}
            email={formData.email}
            onResendCode={() => handleEmailSubmit(formData.email)}
            isResending={isSendingCode}
          />
        )
      case 3:
        return <Username onSubmit={handleUsername} isLoading={isChecking} />
      case 4:
        return <UserDetailsStep onSubmit={handleUserdetail} isLoading={isRegistering} />
      case 5:
        return <Store onSubmit={handleStore} isLoading={isRegistering} />
      case 6:
        return <Mailing onSubmit={handleMailing} isLoading={isRegistering} />
      case 7:
        return <PhoneNo onSubmit={handleUserDetailsSubmit} isLoading={isRegistering} />
      case 8:
        return <SuccessStep onLogin={() => router.push("/login")} />
      default:
        return <EmailStep onSubmit={handleEmailSubmit} isLoading={isSendingCode} initialEmail={formData.email} />
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Toaster position="top-center" />
      <div className="w-full max-w-md mx-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="relative">
              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                <motion.div
                  className="h-full bg-[#FB3B11]"
                  initial={{ width: `${((step - 1) / 7) * 100}%` }}
                  animate={{ width: `${(step / 7) * 100}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>

              <div className="pt-6 px-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {(step !== 1 && step !== 8) &&
                    <button onClick={handleBack} className="flex items-center">
                      <ChevronLeft color="#FB3B11" className="w-5 h-5 cursor-pointer" />
                    </button>}
                  <div className="flex space-x-2 items-center">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i <= step
                          ? "bg-[#FB3B11]"
                          : i === step + 1
                            ? "bg-gray-300"
                            : "bg-gray-200"
                          }`}
                        animate={{
                          scale: i === step ? [1, 1.3, 1] : 1,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: i === step ? Number.POSITIVE_INFINITY : 0,
                          repeatDelay: 1,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs font-medium text-gray-400">
                  Step {step < 8 ? step : 7} of 7
                </div>
              </div>


              {renderStep()}
            </div>

          </motion.div>
        </AnimatePresence>


      </div>
    </div>
  )
}
export default function GenZRegistration() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenZRegistrationPage />
    </Suspense>
  );
}