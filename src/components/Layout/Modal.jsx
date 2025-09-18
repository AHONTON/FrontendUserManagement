import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl"
      >
        <button
          onClick={onClose}
          className="absolute text-gray-600 top-4 right-4 dark:text-gray-300 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
        {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
