"use client"

import { useReferralLinkQuery } from "@/app/_Services/authentication/page"
import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Share2, Users, DollarSign, Hash, ExternalLink, Sparkles, TrendingUp, Gift, Zap,Mail } from "lucide-react"
import { formatDate } from "@/app/utilities/date"

const WhatsAppIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
)

// Facebook Icon Component
const FacebookIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// Instagram Icon Component
const InstagramIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const ReferralDashboard = () => {
  const { data: referralData, error, isLoading } = useReferralLinkQuery()
  const [copySuccess, setCopySuccess] = useState("")
  const [hoveredCard, setHoveredCard] = useState(null)

  console.log(referralData)

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess("Copied! 🎉")
      setTimeout(() => setCopySuccess(""), 3000)
    } catch (err) {
      setCopySuccess("Failed to copy 😢")
    }
  }

  const shareOnPlatform = (platform, text, url) => {
    const message = `🔥 Join me on this amazing auction platform! Use my referral code: ${referralData?.data?.referralCode} 💰`

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message + " " + url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "instagram":
        copyToClipboard(message + " " + url)
        alert("Link copied! You can paste it in your Instagram story or post. 📸✨")
        break
      case "email":
        window.open(`mailto:?subject=🔥 Join me on Auction Platform&body=${encodeURIComponent(message + " " + url)}`)
        break
      default:
        break
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#F33E0A] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#F33E0A] font-semibold">Loading your referral empire... 🚀</span>
      </div>
    )
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 md:py-12 px-4">
<div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-4">
            {/* <Clock className="h-6 w-6 text-[#F33E0A]" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Referral <span className="text-[#F33E0A]">Empire </span> 
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Turn your network into your net worth! Share, earn, and dominate! 
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Referrals */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard("referrals")}
            onHoverEnd={() => setHoveredCard(null)}
            className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg border border-red-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-[#F33E0A] opacity-5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-2xl">
                  <Users className="w-8 h-8 text-[#F33E0A]" />
                </div>
                <motion.div
                  animate={hoveredCard === "referrals" ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="w-6 h-6 text-red-400" />
                </motion.div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Total Squad</h3>
              <motion.p
                className="text-4xl font-black text-[#F33E0A]"
                animate={hoveredCard === "referrals" ? { scale: 1 } : { scale: 1 }}
              >
                {referralData?.data?.totalReferrals || 0}
              </motion.p>
              <p className="text-sm text-gray-500 mt-2">Friends joined 🤝</p>
            </div>
          </motion.div>

          {/* Total Earnings */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard("earnings")}
            onHoverEnd={() => setHoveredCard(null)}
            className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-xl border border-red-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <motion.div
                  animate={hoveredCard === "earnings" ? { y: [-2, 2, -2] } : {}}
                  transition={{ duration: 0.5, repeat: hoveredCard === "earnings" ? Number.POSITIVE_INFINITY : 0 }}
                >
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </motion.div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Total Bag</h3>
              <motion.p
                className="text-4xl font-black text-green-600"
                animate={hoveredCard === "earnings" ? { scale: 1 } : { scale: 1 }}
              >
                ${referralData?.data?.totalEarnings || 0}
              </motion.p>
              <p className="text-sm text-gray-500 mt-2">Money earned 💰</p>
            </div>
          </motion.div>

          {/* Referral Code */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard("code")}
            onHoverEnd={() => setHoveredCard(null)}
            className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-xl border border-red-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Hash className="w-8 h-8 text-purple-600" />
                </div>
                <motion.div animate={hoveredCard === "code" ? { rotate: 360 } : {}} transition={{ duration: 0.8 }}>
                  <Zap className="w-6 h-6 text-purple-400" />
                </motion.div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Your Referral Code</h3>
              <motion.p
                className="text-2xl font-black text-purple-600 break-all"
                animate={hoveredCard === "code" ? { scale: 1 } : { scale: 1 }}
              >
                {referralData?.data?.referralCode || "LOADING..."}
              </motion.p>
              <p className="text-sm text-gray-500 mt-2">Unique ID 🎯</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Referral Link Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-lg border border-red-100 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-2xl">
              <Share2 className="w-6 h-6 text-[#F33E0A]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Your Magic Link ✨</h3>
          </div>

          <div className="relative">
            <input
              type="text"
              value={referralData?.data?.referralLink || ""}
              readOnly
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-700 font-medium focus:outline-none focus:border-red-300 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(referralData?.data?.referralLink)}
              className="cursor-pointer absolute right-2 top-2 px-6 py-2 bg-[#F33E0A] text-white rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </motion.button>
          </div>

          {copySuccess && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 font-semibold mt-3 flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              {copySuccess}
            </motion.p>
          )}
        </motion.div>

        {/* Share Buttons */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-xl border border-red-100 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-2xl">
              <ExternalLink className="w-6 h-6 text-red-600" />
            </div>
            Spread the Word 📢
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* WhatsApp */}
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 * 0.1 }}
              onClick={() => shareOnPlatform("whatsapp", "", referralData?.data?.referralLink)}
              className="cursor-pointer bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white rounded-3xl p-6 font-bold transition-all duration-300 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl group"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                <WhatsAppIcon />
              </div>
              <span className="text-sm">WhatsApp</span>
            </motion.button>

            {/* Facebook */}
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 * 0.1 }}
              onClick={() => shareOnPlatform("facebook", "", referralData?.data?.referralLink)}
              className="cursor-pointer bg-gradient-to-br from-[#1877F2] to-[#166FE5] hover:from-[#166FE5] hover:to-[#1464D8] text-white rounded-3xl p-6 font-bold transition-all duration-300 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl group"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                <FacebookIcon />
              </div>
              <span className="text-sm">Facebook</span>
            </motion.button>

            {/* Instagram */}
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 * 0.1 }}
              onClick={() => shareOnPlatform("instagram", "", referralData?.data?.referralLink)}
              className="cursor-pointer bg-gradient-to-br from-[#E4405F] via-[#F56040] to-[#FFDC80] hover:from-[#D73447] hover:via-[#E4405F] hover:to-[#F56040] text-white rounded-3xl p-6 font-bold transition-all duration-300 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl group"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                <InstagramIcon />
              </div>
              <span className="text-sm">Instagram</span>
            </motion.button>

            {/* Email */}
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 * 0.1 }}
              onClick={() => shareOnPlatform("email", "", referralData?.data?.referralLink)}
              className="cursor-pointer bg-gradient-to-br from-[#EA4335] to-[#D33B2C] hover:from-[#D33B2C] hover:to-[#B52D20] text-white rounded-3xl p-6 font-bold transition-all duration-300 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl group"
            >
              <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-sm">Email</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Referrals List */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl mx-1 md:mx-0 p-4 md:p-8 shadow-xl border border-red-100">
          <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-2xl">
              <Users className="w-6 h-6 text-[#F33E0A]" />
            </div>
            Your Squad Members 👥
          </h3>

          {referralData?.data?.hasReferrals ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-orange-50 rounded-2xl"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Ready to Launch? 🌟</h4>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                Your referral empire starts here! Share your link and watch the magic happen ✨
              </p>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-green-500">💰</span>
                  Earn $5 for each friend who joins
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-500">🔗</span>
                  Share via social media or direct link
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-purple-500">📊</span>
                  Track all earnings in real-time
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Squad Member
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-red-800 uppercase tracking-wider">
                        Reward
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referralData?.data?.referrals?.map((referral, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-red-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-[#F33E0A] font-bold ">
                                {referral?.referred?.firstName?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 capitalize">
                              {referral.referred.firstName} {referral.referred.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{referral.referred.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(referral.referred.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            💰 $5.00
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      {/* </motion.div> */}
    </div>
    </div>
  )
}

export default ReferralDashboard
