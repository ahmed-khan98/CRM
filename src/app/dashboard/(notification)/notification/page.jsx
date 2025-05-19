"use client"

import { useState } from "react"
import Cookies from "js-cookie"
import { useMarkAsReadMutation, useUserNotificationsQuery } from "@/app/_Services/notification/page"
import { Bell, X, Eye, Clock, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const NotificationsPage = () => {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  const userData = Cookies.get("currentuser")
  const user = userData ? JSON.parse(userData) : null

  const [markAsRead] = useMarkAsReadMutation()

  const {
    data,
    error: isError,
    isLoading,
    refetch,
  } = useUserNotificationsQuery({
    userId: user?._id,
    role: user?.role,
  })

  // Mark notification as read
  const handleMarkAsRead = async (notificationId, message, title, isRead) => {
    try {
      if (!isRead) {
        await markAsRead(notificationId).unwrap()
        refetch()
      }
      setSelectedMessage(message)
      setSelectedTitle(title)
      setShowModal(true)
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const filteredNotifications = () => {
    if (!data?.data) return []

    if (activeFilter === "unread") {
      return data.data.filter((item) => !item?.hasRead)
    } else if (activeFilter === "read") {
      return data.data.filter((item) => item?.hasRead)
    }
    return data.data
  }

  const unreadCount = data?.data?.filter((item) => !item?.hasRead)?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-6">
      <div className="max-w-5xl mx-auto p-5 flex flex-col space-y-6">
        <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-3">
            <Bell className="h-7 w-7 text-red-600" />
            <h3 className="text-[#242424] text-[24px] font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex bg-white rounded-full shadow-sm p-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                activeFilter === "all" ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("unread")}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                activeFilter === "unread" ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveFilter("read")}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                activeFilter === "read" ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications().length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
            <Bell className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No notifications</h3>
            <p className="text-gray-500 mt-2">
              {activeFilter === "all"
                ? "You don't have any notifications yet."
                : activeFilter === "unread"
                  ? "You don't have any unread notifications."
                  : "You don't have any read notifications."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredNotifications().map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`relative overflow-hidden rounded-xl shadow-sm ${
                    !item?.hasRead ? "bg-red-50 border-l-4 border-red-600" : "bg-white"
                  }`}
                >
                  {!item?.hasRead && (
                    <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-red-600 animate-pulse"></div>
                  )}
                  <div className="p-5">
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">{item?.title}</h4>
                    <p className="text-gray-600 line-clamp-2 text-sm mb-4">
                      {item?.message?.substring(0, 120)}
                      {item?.message?.length > 120 ? "..." : ""}
                    </p>
                    <div className="flex flex-col items-start gap-4 justify-between md:items-center md:flex-row">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {new Date(item?.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${
                          !item?.hasRead
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => handleMarkAsRead(item._id, item.message, item.title, item?.hasRead)}
                      >
                        {!item?.hasRead ? (
                          <>
                            <Eye className="h-4 w-4" />
                            View
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Read
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b">
                <h4 className="text-xl font-bold">{selectedTitle}</h4>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-line">{selectedMessage}</p>
              </div>
              <div className="p-5 border-t flex justify-end">
                <button
                  className="px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationsPage
