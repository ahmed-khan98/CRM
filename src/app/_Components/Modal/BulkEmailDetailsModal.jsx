// components/common/BulkEmailDetailsModal.jsx
"use client";

import { Mail, FileText, User, Users, Clock, List } from "lucide-react";
import { formatDate } from "@/app/utilities/date";
import ModalShell from "./ModalShell";

const BulkEmailDetailsModal = ({ isOpen, onClose, email }) => {
  if (!email) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Campaign Details"
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-zinc-300">
          <User size={20} className="text-zinc-500" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">From:</span>
            <span className="font-medium text-white">{`${email.from} ${email?.brandId?.name ? `(${email?.brandId?.name})` : ""}`}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <User size={20} className="text-zinc-500" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">Send By:</span>
            <span className="font-medium text-white capitalize">
              {email.senderId?.fullName}{" "}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <Users size={20} className="text-zinc-500" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">Recipients:</span>
            {email?.recipient ? (
              <span className="font-medium text-white">{email.recipient}</span>
            ) : (
              <span className="font-medium text-white">
                {email.recipientsCount} users
              </span>
            )}
          </div>
        </div>
        {email?.listId && (
          <div className="flex items-center gap-4 text-zinc-300">
            <List size={20} className="text-zinc-500" />
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500">list Name:</span>
              <span className="font-medium text-white">
                {email.listId?.listName}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-zinc-300">
          <Clock size={20} className="text-zinc-500" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">Sent On:</span>
            <span className="font-medium text-white">
              {formatDate(email.sentAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 border border-white/[0.08] bg-[#161b22]">
        <div className="flex items-center gap-3 text-white font-semibold mb-4">
          <FileText size={24} />
          <p className="text-md">Subject: {email.subject}</p>
        </div>
        <div
          className="prose prose-sm prose-invert max-w-none text-zinc-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>
    </ModalShell>
  );
};

export default BulkEmailDetailsModal;
