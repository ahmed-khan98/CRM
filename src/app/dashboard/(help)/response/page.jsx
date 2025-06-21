"use client"

import { useState } from "react"
import { useResponseQuery } from "@/app/_Services/contactform/page"
import HelpTabs from "@/app/_Components/Tab/HelpTabs"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MessageCircle, AlertCircle, CheckCircle, Search } from "lucide-react"
import { formatDate } from "@/app/utilities/date"
import Tab from "@/app/_Components/Tab/page"
import { helpTabs } from "@/app/utilities/tabs/page"


const ResponsesPage = () => {
  const { data, error: isError, isLoading } = useResponseQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)

  const filteredData = data?.data?.filter(
    (item) =>
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.response?.reply && item.response.reply.toLowerCase().includes(searchTerm.toLowerCase())),
  )



  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-orange-50 to-white py-4">
      <div className="max-w-5xl mx-auto px-4 pt-4">
      <Tab tabs={helpTabs}/>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#F33E0A]">Your Support Conversations</h1>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F33E0A]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-[#F33E0A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No conversations yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm
                  ? "No results match your search. Try different keywords."
                  : "When you submit a query, your conversations will appear here."}
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredData?.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 ${selectedItem === item._id ? "ring-2 ring-[#F33E0A]" : "hover:shadow-md"}`}
                    onClick={() => setSelectedItem(selectedItem === item._id ? null : item._id)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{item.subject}</h3>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            item.response?.reply ? "bg-green-100 text-green-700" : "bg-orange-100 text-[#F33E0A]"
                          }`}
                        >
                          {item.response?.reply ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Answered
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3" />
                              Pending
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.message}</p>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {item.createdAt ? formatDate(item.createdAt) : "Date unavailable"}
                        </div>

                        <button className="text-[#F33E0A] font-medium">
                          {selectedItem === item._id ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedItem === item._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-6 bg-gray-50">
                            <h4 className="font-medium text-gray-800 mb-2">Your Message:</h4>
                            <p className="text-gray-600 mb-6 whitespace-pre-line">{item.message}</p>

                            <h4 className="font-medium text-gray-800 mb-2">Response:</h4>
                            {item.response?.reply ? (
                              <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <p className="text-gray-600 whitespace-pre-line">{item.response.reply}</p>
                                {item.response.createdAt && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    Replied on {formatDate(item.response.createdAt)}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <p className="text-[#F33E0A]">
                                  Our team is reviewing your message and will respond soon.
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ResponsesPage
