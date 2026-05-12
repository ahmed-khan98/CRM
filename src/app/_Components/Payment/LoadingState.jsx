import React from 'react'
import { motion } from "framer-motion";

const LoadingState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full mb-4"
    />
    <p className="text-zinc-500 font-medium animate-pulse">
      Initializing Secure Checkout...
    </p>
  </div>
);

export default LoadingState
