"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {  RefreshCw } from "lucide-react"
import Link from "next/link";
import Main from "../../../../app/Assets/Main.png";
import Image from "next/image";

export default function GenZVerificationStep({
  onSubmit,
  isLoading,
  email,
  onResendCode,
  isResending,
}) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(3600)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    // Update the code array
    const newCode = [...code]
    newCode[index] = value.slice(0, 1) // Only take the first character

    setCode(newCode)

    // If a digit was entered and there's a next input, focus it
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // If all digits are entered, submit the code
    if (newCode.every((digit) => digit) && newCode.join("").length === 6) {
      onSubmit(newCode.join(""))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setCode(digits)

      // Focus the last input
      inputRefs.current[5]?.focus()

      // Submit the code
      onSubmit(pastedData)
    }
  }

  const handleResend = () => {
    onResendCode()
    setTimeLeft(600) 
  }

  return (
    <div className="p-6 pt-4">
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-30 h-30 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center"
        >
  <Link href="/" className="mx-auto">
            <Image src={Main} alt="Logo"  />
          </Link>        </motion.div>
        <h2 className="text-2xl font-bold mb-1 text-[#FB3B11]">Verify your email</h2>
        <p className="text-gray-500 mb-1">We sent a 6-digit code to</p>
        <p className="font-medium text-gray-700">{email}</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all focus:outline-none ${
                  digit
                    ? "border-[#FB3B11] bg-orange-50 text-[#FB3B11]"
                    : "border-gray-200 focus:border-[#FB3B11] focus:ring-2 focus:ring-orange-100"
                }`}
                autoComplete="one-time-code"
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onSubmit(code.join(""))}
          disabled={isLoading || code.some((digit) => !digit)}
          className="w-full bg-[#FB3B11] hover:bg-[#e03610] text-white py-3.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-70 transition-all cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Verifying...
            </div>
          ) : (
            "Verify Code"
          )}
        </motion.button>

        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in <span className="font-medium text-gray-700">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-[#FB3B11] text-sm font-medium flex items-center justify-center mx-auto hover:underline disabled:opacity-70"
            >
              {isResending ? (
                <>
                  <div className="h-3 w-3 border-2 border-[#FB3B11] border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Resend Code
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
