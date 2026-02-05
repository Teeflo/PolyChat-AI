import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const { type, title, message, duration = 5000 } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    error: 'text-red-400 bg-red-500/10 border-red-500/30',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  const iconColors = {
    success: 'text-emerald-400',
    error: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
  };

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3
        min-w-[300px] max-w-md
        px-4 py-3
        bg-neutral-900/95 backdrop-blur-xl
        border rounded-xl
        shadow-lg shadow-black/20
        animate-slide-right
        ${colors[type]}
      `}
      role="alert"
    >
      <span className={`flex-shrink-0 ${iconColors[type]}`}>{icons[type]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm">{title}</p>
        {message && <p className="text-neutral-400 text-xs mt-0.5">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-neutral-500 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Helper function for quick toasts
export const toast = {
  success: (title: string, message?: string) => {
    // This requires the context, so we'll use an event-based system
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', title, message } }));
  },
  error: (title: string, message?: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', title, message } }));
  },
  warning: (title: string, message?: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'warning', title, message } }));
  },
  info: (title: string, message?: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', title, message } }));
  },
};

export default ToastProvider;
