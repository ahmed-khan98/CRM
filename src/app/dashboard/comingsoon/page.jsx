"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Bell, Mail, ArrowRight, Gavel, Calendar, Package } from "lucide-react"

const ComingSoonPage = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Set launch date to 30 days from now
  useEffect(() => {
    const launchDate = new Date()
    launchDate.setDate(launchDate.getDate() + 30)

    const timer = setInterval(() => {
      const now = new Date()
      const difference = launchDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log("Notification email:", email)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setEmail("")
  }

  const features = [
    {
      icon: <Gavel className="h-6 w-6 text-[#F33E0A]" />,
      title: "Live Auctions",
      description: "Bid in real-time on exclusive items",
    },
    {
      icon: <Bell className="h-6 w-6 text-[#F33E0A]" />,
      title: "Instant Notifications",
      description: "Never miss an auction or outbid",
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#F33E0A]" />,
      title: "Auction Calendar",
      description: "Plan ahead for upcoming events",
    },
    {
      icon: <Package className="h-6 w-6 text-[#F33E0A]" />,
      title: "Secure Transactions",
      description: "Safe bidding and payment processing",
    },
  ]

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mbg-[#5f2781]">
            <Clock className="h-6 w-6 text-[#F33E0A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mbg-[#5f2781]">
            Our New <span className="text-[#F33E0A]">Auction Features</span> Are Coming Soon
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're working on exciting new features to enhance your bidding experience. Stay tuned for a revolutionary
            way to participate in auctions.
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex justify-center flex-wrap gap-4">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map((item, index) => (
              <div
                key={item.label}
                className="w-24 h-24 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center"
              >
                <span className="text-3xl font-bold text-[#F33E0A]">{item.value}</span>
                <span className="text-sm text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 rounded-lg">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

    
      </div>
    </div>
  )
}

export default ComingSoonPage
