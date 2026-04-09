import { useImportLeadMutation } from "@/app/_Services/lead/page";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 24, stiffness: 260 },
  },
  exit: { opacity: 0, scale: 0.92, y: 16, transition: { duration: 0.18 } },
};

const formatKB = (bytes = 0) => (bytes / 1024).toFixed(2) + " KB";

export default function ExportLeadModal({ ...props }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [importLead, { isLoading }] = useImportLeadMutation();
  const percent = useSelector((s) => s.upload.leadImportPercent);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return toast.error("Please choose a file first");
    const payload = new FormData();
    payload.append("file", selectedFile);

    try {
      setIsImporting(true);
      const res = await importLead(payload).unwrap();
      toast.success("Excel File Uploaded Successfully");
      setSelectedFile(null);
      props.closeModal?.();
      setIsImporting(false);
      props.refetch?.();
    } catch (err) {
      console.log(err, "err");
      setIsImporting(false);
      toast.error(err?.data?.message || "Failed to import file");
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setSelectedFile(null);
      props.closeModal();
    }
  };

  return (
    <AnimatePresence>
      {props?.isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-4 md:px-8 py-3 text-white relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold">
                    Import Leads (CSV/XLSX)
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  disabled={isImporting}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 md:px-8 py-5 flex-1 min-h-0 overflow-y-auto">
              {/* Info alert */}
              <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-800 flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold">Heads up</div>
                  <p className="opacity-90">
                    Upload a <b>CSV/XLSX</b> with headers exactly like your
                    sample:
                    <i>
                      {" "}
                      Customer Name, Brand Mark, Serial Number, Phone Number,
                      Signup Date, Brand Name, Email, Paid Status, Last Action,
                      Agent, Last Comment
                    </i>
                    .
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Choose file button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="cursor-pointer w-full mb-3 px-4 py-3 border border-gray-300 rounded-2xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : "Choose CSV/XLSX File"}
              </button>

              {/* Selected file alert */}
              {selectedFile && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                  <div className="text-sm">
                    File selected:{" "}
                    <span className="font-semibold">{selectedFile.name}</span> (
                    {formatKB(selectedFile.size)})
                  </div>
                </div>
              )}

              {/* Progress */}
              {isImporting && (
                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-2">
                    Importing leads… {percent}%
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 transition-all duration-100"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 flex gap-3 border-t border-gray-100">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                disabled={isImporting}
                className="cursor-pointer flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!selectedFile || isImporting}
                className="cursor-pointer flex-1 px-6 py-3 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl font-semibold  hover:from-zinc-800 hover:to-zinc-700 hover:border-zinc-500 hover:shadow-xl hover:shadow-zinc-950/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {isImporting ? "Importing…" : "Import File"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
