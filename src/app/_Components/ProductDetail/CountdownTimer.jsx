"use client"
import { motion } from "framer-motion"

const CountdownTimer = ({ endTime, isActive }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
    >
      <p className="text-gray-600 font-medium text-sm mb-3 text-center">Time Remaining</p>
      <div className="flex justify-center space-x-4">
          <div  className="text-center">
            <div className="bg-zinc-800 text-white rounded-lg p-3 min-w-[50px] shadow-sm">
              <div className="font-bold text-xl">{`${endTime} hours`}</div>
            </div>
            {/* <div className="text-gray-500 text-xs mt-1 capitalize font-medium">{unit}</div> */}
          </div>
      </div>
    </motion.div>
  )
}

export default CountdownTimer
