import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastIcons = {
  success: <CheckCircle size={20} className="text-green-500" />,
  error: <AlertCircle size={20} className="text-red-500" />,
  warning: <AlertTriangle size={20} className="text-yellow-500" />,
  info: <Info size={20} className="text-blue-500" />
};

const toastStyles = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200'
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="fixed top-20 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-[400px] ${toastStyles[toast.type]}`}
            >
              {toastIcons[toast.type]}
              <p className="flex-1 text-sm text-gray-700">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </ToastContext.Provider>
  );
};

// Separate component to handle individual toast
const ToastItem = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`fixed top-20 right-4 flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-[400px] ${toastStyles[type]}`}
    >
      {toastIcons[type]}
      <p className="flex-1 text-sm text-gray-700">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Global toast state
let toastFn = null;

export const toast = {
  success: (message) => toastFn?.(message, 'success'),
  error: (message) => toastFn?.(message, 'error'),
  warning: (message) => toastFn?.(message, 'warning'),
  info: (message) => toastFn?.(message, 'info')
};

// Simple toast implementation
const SimpleToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastFn = (message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };
    return () => { toastFn = null; };
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-[400px] ${toastStyles[t.type]}`}
          >
            {toastIcons[t.type]}
            <p className="flex-1 text-sm text-gray-700">{t.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SimpleToast;

