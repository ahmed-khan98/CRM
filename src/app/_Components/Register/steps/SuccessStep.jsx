"use client"

import { motion } from "framer-motion"
import { CheckCircle, LogIn } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"



export default function GenZSuccessStep({ onLogin }) {
  // Trigger confetti effect when component mounts
  useEffect(() => {
    const duration = 3 * 1000
    const end = Date.now() + duration

    const colors = ["#FB3B11", "#FF6B3D", "#FF8C66"]
    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }, [])

  return (
    <div className="p-6 pt-4">
      <div className="py-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2 text-[#FB3B11]">You're all set!</h2>
          <p className="text-gray-500 mb-8">Your account has been created successfully</p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            className="mx-auto bg-[#FB3B11] hover:bg-[#e03610] text-white py-3.5 px-8 rounded-xl font-medium flex items-center justify-center cursor-pointer"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
