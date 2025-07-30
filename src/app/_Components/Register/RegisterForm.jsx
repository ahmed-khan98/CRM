"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import {
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
  useRegisterMutation,
} from "@/app/_Services/authentication/page"
import EmailStep from "./steps/EmailStep"
import VerificationStep from "./steps/VerificationStep"
import UserDetailsStep from "./steps/UserDetailsStep"
import SuccessStep from "./steps/SuccessStep"
import Username from "./steps/Username"
import Store from "./steps/Store"
import PhoneNo from "./steps/PhoneNo"

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
    store: "",
    phone: "",
  })

  const [sendVerificationCode, { isLoading: isSendingCode }] = useSendVerificationCodeMutation()
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation()
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation()

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
      setStep(4)
    } catch (error) {
      toast.error(error.data?.message || "Oops! Couldn't send the code 😕")
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

  const handleUserDetailsSubmit = async (userData) => {
    console.log(userData,'userData')
    console.log(formData,'formData')
    try {
      const finalData = {
        ...userData,
        firstName:formData.userdetail.firstName,
        lastName:formData.userdetail.lastName,
        password:formData.userdetail.password,
        referralBy:formData.userdetail.referralBy,
        email: formData.email,
        username: formData.username?.username,
        store: formData.store?.store,
        phone: formData.phone?.phone,
        role: "USER",
      }

      await registerUser(finalData).unwrap()
      toast.success("You're in! 🎉")
      setStep(7)
    } catch (error) {
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
        return <Username onSubmit={handleUsername} isLoading={isRegistering} />
      case 4:
        return <UserDetailsStep onSubmit={handleUserdetail} isLoading={isRegistering} />
      case 5:
        return <Store onSubmit={handleStore} isLoading={isRegistering} />
      case 6:
        return <PhoneNo onSubmit={handleUserDetailsSubmit} isLoading={isRegistering} />
      case 7:
        return <SuccessStep onLogin={() => router.push("/login")} />
      default:
        return <EmailStep onSubmit={handleEmailSubmit} isLoading={isSendingCode} initialEmail={formData.email} />
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
                  initial={{ width: `${((step - 1) / 3) * 100}%` }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>

              {/* Step indicator */}
              <div className="pt-6 px-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  {[1, 2, 3,4,5,6].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= step ? "bg-[#FB3B11]" : i === step + 1 ? "bg-gray-300" : "bg-gray-200"
                      }`}
                      animate={{
                        scale: i === step ? [1, 1.3, 1] : 1,
                      }}
                      transition={{ duration: 0.5, repeat: i === step ? Number.POSITIVE_INFINITY : 0, repeatDelay: 1 }}
                    />
                  ))}
                </div>
                <div className="text-xs font-medium text-gray-400">Step {step < 7 ? step : 6} of 6</div>
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