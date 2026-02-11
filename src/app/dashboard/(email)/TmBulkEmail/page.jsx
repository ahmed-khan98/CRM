"use client";

import { memo, useState, useCallback, useMemo } from "react";
import { Mails, Send, Eye, Clock, Users, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import { useAllTmBulkEmailsQuery } from "@/app/_Services/sentTmBulkEmail/page";
import BulkEmailSendModal from "@/app/_Components/Modal/BulkEmailDetailsModal";
import { useRouter } from "next/navigation";
import Pagination from "@/app/_Components/PaginationComponent/Pagination";
import EmailCard from "./EmailCard";

const MemoPagination = memo(Pagination);

const BulkEmailsPage = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const limit = 6;

  const onPageChange = useCallback((p) => setPage(p), []);

  const { data, error, isLoading, refetch } = useAllTmBulkEmailsQuery({
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
        recipientsCount: email.recipients?.length,
        sentAt: email.sentAt,
        status: email.status,
        listId: email?.listId,
        senderId: email.senderId,
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
    <div className="min-h-screen py-2 px-2 font-sans antialiased">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto"
      >
        {/* Header bm */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-purple-100 p-3 rounded-full">
              <Mails className="h-7 w-7 text-[#5f2781]" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
               Trademark Bulk Email Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your sent email campaigns with ease.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push("/dashboard/SentTmBulkEmail")}
            className="flex items-center gap-2 cursor-pointer bg-[#5f2781] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#4f1f6d] transition-colors shadow-lg"
          >
            <Send className="h-4 w-4" />
           New Campaign
          </motion.button>
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
              No Campaigns Found
            </h3>
            <p className="text-gray-500 max-w-sm">
              You haven't sent any bulk email campaigns yet. Get started by
              clicking the button above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {bulkEmails?.map((email, index) => (
                <EmailCard
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

export default BulkEmailsPage;
