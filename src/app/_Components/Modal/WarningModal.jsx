import { AlertCircle, Delete, Trash2 } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const WarningModal = ({
  isDeleting,
  setConfirmDelete,
  handleDelete,
  message,
}) => {
  return (
    <div className="fixed inset-0  bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-sm p-6 text-center">
        <Trash2 className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Delete Confirmation
        </h3>
        <p className="text-gray-600 mb-4  text-sm">
          {`Are you sure you want to remove ${message} you selected.`}{" "}
        </p>
        <div className="flex justify-center space-x-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmDelete(null)}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded text-gray-700 text-sm font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete()}
            disabled={isDeleting}
            className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded text-sm font-medium flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                Deleting...
              </>
            ) : (
              <>Yes, Delete</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
