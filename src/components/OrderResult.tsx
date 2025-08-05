import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiX, FiClipboard, FiLoader } from "react-icons/fi";

interface OrderResultProps {
  open: boolean;
  value: string;
  loading: boolean;
  onChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  orderDetails?: {
    patientName?: string;
    orderType?: string;
    orderId?: string;
  };
}

export function OrderResult({
  open,
  value,
  loading,
  onChange,
  onClose,
  onSubmit,
  orderDetails = {},
}: OrderResultProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle focus management and escape key
  useEffect(() => {
    if (open) {
      // Focus the textarea when modal opens
      setTimeout(() => textareaRef.current?.focus(), 100);

      // Handle escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !loading) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onClose, loading]);

  // Handle clicks outside the modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target as Node) &&
      !loading
    ) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-results-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <h3
                className="text-lg font-semibold flex items-center gap-2"
                id="order-results-title"
              >
                <FiClipboard className="h-5 w-5" />
                Enter Order Results
              </h3>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full p-1 transition-all"
                aria-label="Close dialog"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Order details if available */}
            {(orderDetails.patientName || orderDetails.orderType) && (
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {orderDetails.patientName && (
                    <div>
                      <p className="text-slate-500 text-xs">Patient</p>
                      <p className="font-medium text-slate-700">
                        {orderDetails.patientName}
                      </p>
                    </div>
                  )}
                  {orderDetails.orderType && (
                    <div>
                      <p className="text-slate-500 text-xs">Order Type</p>
                      <p className="font-medium text-slate-700">
                        {orderDetails.orderType}
                      </p>
                    </div>
                  )}
                  {orderDetails.orderId && (
                    <div className="col-span-2 mt-1">
                      <p className="text-slate-500 text-xs">Order ID</p>
                      <p className="font-mono text-xs text-slate-700">
                        {orderDetails.orderId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form content */}
            <form onSubmit={onSubmit} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="orderResults"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Results
                </label>
                <textarea
                  ref={textareaRef}
                  id="orderResults"
                  name="orderResults"
                  className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 resize-none shadow-sm transition-all"
                  placeholder="Enter detailed results for this order..."
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={loading}
                  required
                ></textarea>
                <p className="mt-1 text-xs text-slate-500">
                  {value.length} characters |{" "}
                  {value.trim()
                    ? value.trim().split(/\s+/).length
                    : 0}{" "}
                  words
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all flex items-center gap-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400"
                  onClick={onClose}
                  disabled={loading}
                >
                  <FiX className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" />
                      Save Results
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}