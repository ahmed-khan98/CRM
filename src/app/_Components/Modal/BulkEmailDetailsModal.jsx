// components/common/BulkEmailDetailsModal.jsx
"use client";

import { motion } from "framer-motion";
import { X, Mail, FileText, User, Users, Clock, List } from "lucide-react";
import { formatDate } from "@/app/utilities/date";

const BulkEmailDetailsModal = ({ isOpen, onClose, email }) => {
  if (!isOpen || !email) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Mail size={24} />
          <span>Campaign Details</span>
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-gray-600">
            <User size={20} className="text-gray-800" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">From:</span>
              <span className="font-medium text-gray-800">{`${email.from} ${email?.brandId?.name ? `(${email?.brandId?.name})` :''}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <User size={20} className="text-gray-800" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Send By:</span>
              <span className="font-medium text-gray-800 capitalize">
                {email.senderId?.fullName}{" "}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <Users size={20} className="text-gray-800" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Recipients:</span>
              {email?.recipient ? (
                <span className="font-medium text-gray-800">
                  {email.recipient}
                </span>
              ) : (
                <span className="font-medium text-gray-800">
                  {email.recipientsCount} users
                </span>
              )}
            </div>
          </div>
          {email?.listId && (
            <div className="flex items-center gap-4 text-gray-600">
              <List size={20} className="text-gray-800" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">list Name:</span>
                <span className="font-medium text-gray-800">
                  {email.listId?.listName}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-gray-600">
            <Clock size={20} className="text-gray-800" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Sent On:</span>
              <span className="font-medium text-gray-800">
                {formatDate(email.sentAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-200">
          <div className="flex items-center gap-3 text-gray-800 font-semibold mb-4">
            <FileText size={24} />
            <p className="text-md">Subject: {email.subject}</p>
          </div>
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BulkEmailDetailsModal;
