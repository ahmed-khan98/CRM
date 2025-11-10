import React from "react";
import { Eye, Clock, Users, X, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";

const Email = ({ email, index, onOpenDetails }) => {
  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transform transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={() => onOpenDetails(email)}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-900 truncate capitalize">
          {email.subject}
        </h4>
        {email.status === "sent" ? (
          <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={12} />
            Sent
          </div>
        ) : (
          <div className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <X size={12} />
            Failed
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 text-gray-500 text-xs mb-4">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{formatDate(email.sentAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>{email.recipientsCount} Recipients</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{email.body}</p>
      <div className="flex items-center gap-2 text-blue-500 font-semibold text-sm">
        <Eye size={16} />
        <span>View Email</span>
      </div>
    </motion.div>
  );
};

export default React.memo(Email);
