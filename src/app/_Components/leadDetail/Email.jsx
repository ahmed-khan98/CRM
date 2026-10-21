import React from "react";
import { Eye, Clock, Users, X, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";

const Email = ({ email, index, onOpenDetails }) => {
  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="cursor-pointer rounded-2xl border border-zinc-800 bg-[#161616] p-5 transition hover:border-zinc-700 hover:bg-zinc-900/80"
      onClick={() => onOpenDetails(email)}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="truncate font-semibold capitalize text-zinc-100">
          {email.subject}
        </h4>
        {email.status === "sent" ? (
          <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
            <CheckCircle size={12} />
            Sent
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-300">
            <X size={12} />
            Failed
          </div>
        )}
      </div>
      <div className="mb-4 flex items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{formatDate(email.sentAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>{email.recipientsCount} Recipients</span>
        </div>
      </div>
      <p className="mb-4 line-clamp-3 text-sm text-zinc-400">{email.body}</p>
      <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
        <Eye size={16} />
        <span>View Email</span>
      </div>
    </motion.div>
  );
};

export default React.memo(Email);
