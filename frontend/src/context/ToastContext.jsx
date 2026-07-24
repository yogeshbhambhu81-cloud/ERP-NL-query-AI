import React, { createContext, useContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoInformationCircle, IoWarning, IoCloseCircle, IoClose } from 'react-icons/io5';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container overlay */}
      <div className="wfx-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`wfx-toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && <IoCheckmarkCircle />}
              {toast.type === 'info' && <IoInformationCircle />}
              {toast.type === 'warning' && <IoWarning />}
              {toast.type === 'error' && <IoCloseCircle />}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <IoClose />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
