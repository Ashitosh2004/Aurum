'use client';

import { useCafeStore } from '@/store/cafe-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';

const toastConfig = {
  success: {
    borderColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-500',
    icon: Check,
  },
  error: {
    borderColor: 'border-l-red-500',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-500',
    icon: X,
  },
  info: {
    borderColor: 'border-l-blue-500',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-500',
    icon: Info,
  },
};

export default function ToastContainer() {
  const toasts = useCafeStore((state) => state.toasts);
  const removeToast = useCafeStore((state) => state.removeToast);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const IconComponent = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto min-w-[300px] max-w-[400px] glass rounded-xl shadow-premium border-l-4 p-4 flex items-start gap-3 ${config.borderColor}`}
            >
              {/* Icon */}
              <div
                className={`w-7 h-7 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${config.iconColor}`} />
              </div>

              {/* Message */}
              <p className="flex-1 text-sm text-espresso font-medium leading-snug">
                {toast.message}
              </p>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-coffee-400 hover:text-espresso hover:bg-white/50 transition-colors duration-200"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
