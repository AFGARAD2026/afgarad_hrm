import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  isDestructive = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/60"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isDestructive
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                    }`}
                  >
                    <AlertTriangle size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg shrink-0 cursor-pointer transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Message */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
                {message}
              </p>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-3 py-2 text-xs font-bold rounded-xl text-white cursor-pointer transition-all ${
                    isDestructive
                      ? "bg-rose-600 hover:bg-rose-500"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
