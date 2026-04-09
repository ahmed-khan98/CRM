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

  const { data, error, isLoading, refetch } = useLeadbyEmailQuery({
    id,
    page,
    limit,
  });

  const meta = data?.data?.meta;

  // Data mapping based on your API response structure
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
        // Sirf woh data jise aapko card mein chahiye
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
    <div className="min-h-screen py-4 md:py-2 px-2 md:px-4 font-sans antialiased">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-gray-200 pb-1 md:pb-3">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-zinc-200 p-3 rounded-full">
              <Mails className="h-7 w-7 text-gray-800" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold ">
                All Email
              </h1>
            </div>
          </div>
        </header>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bulkEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-12 text-center">
            <Mails className="h-16 w-16 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Email found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {bulkEmails?.map((email, index) => (
                <Email
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

      {/* Modals */}
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
