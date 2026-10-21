"use client";

import React, { memo, useState, useCallback, useMemo } from "react";
import { Mails } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLeadbyEmailQuery } from "@/app/_Services/sentEmail/page";
import BulkEmailSendModal from "@/app/_Components/Modal/BulkEmailDetailsModal";
import Pagination from "@/app/_Components/PaginationComponent/Pagination";
import Email from "../leadDetail/Email";

const MemoPagination = memo(Pagination);

const LeadSentEmail = ({ id }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 6;
  const onPageChange = useCallback((p) => setPage(p), []);

  const { data, isLoading } = useLeadbyEmailQuery({
    id,
    page,
    limit,
  });

  const meta = data?.data?.meta;

  const bulkEmails = useMemo(() => {
    return (
      data?.data?.items?.map((email) => ({
        id: email._id,
        from: email.from,
        subject: email.subject,
        body: email.body,
        recipient: email.recipients[0],
        sentAt: email.sentAt,
        status: email.status,
        listId: email?.listId,
        senderId: email.senderId,
        brandId: email?.brandId,
      })) || []
    );
  }, [data?.data?.items]);

  const handleOpenDetails = useCallback((emailData) => {
    setSelectedEmail(emailData);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedEmail(null);
  }, []);

  return (
    <div className="px-0 py-6 font-sans antialiased">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl"
      >
        <header className="mb-6 flex flex-col items-start justify-between border-b border-zinc-800 pb-4 md:flex-row md:items-center">
          <div className="mb-4 flex items-center gap-3 md:mb-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800">
              <Mails className="h-4 w-4 text-zinc-300" />
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                Emails
              </p>
              <h1 className="text-base font-semibold text-white">All Email</h1>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-zinc-800 bg-[#161616] p-5"
              >
                <div className="mb-4 h-5 w-3/4 rounded bg-zinc-800" />
                <div className="mb-4 h-3 w-1/2 rounded bg-zinc-800" />
                <div className="h-3 w-full rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : bulkEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-[#161616] p-12 text-center">
            <Mails className="mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="text-lg font-semibold text-zinc-200">
              No Email found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {bulkEmails?.map((email, index) => (
                <Email
                  key={email.id}
                  email={email}
                  index={index}
                  onOpenDetails={handleOpenDetails}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        <MemoPagination meta={meta} onPageChange={onPageChange} />
      </motion.div>

      <AnimatePresence>
        {isDetailsModalOpen && selectedEmail && (
          <BulkEmailSendModal
            isOpen={isDetailsModalOpen}
            onClose={handleCloseDetails}
            email={selectedEmail}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(LeadSentEmail);
