import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Trash2, Plus, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'delete' | 'add' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev.slice(-4), { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col space-y-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start justify-between space-x-3 text-white animate-in slide-in-from-bottom-5 duration-300 ${
              toast.type === 'success'
                ? 'bg-[#121E17]/95 border-emerald-500/50 shadow-emerald-950/50'
                : toast.type === 'delete'
                ? 'bg-[#211213]/95 border-red-500/50 shadow-red-950/50'
                : toast.type === 'add'
                ? 'bg-[#1D1B13]/95 border-[#C5A059]/60 shadow-[#C5A059]/20'
                : toast.type === 'error'
                ? 'bg-[#2A1415]/95 border-red-600/60 shadow-red-950/60'
                : 'bg-[#171615]/95 border-white/20'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'delete' && <Trash2 className="w-5 h-5 text-red-400" />}
                {toast.type === 'add' && <Plus className="w-5 h-5 text-[#F5D07F]" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-[#C5A059]" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold font-serif uppercase tracking-wider text-white">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-xs text-[#D8C8B8] font-light leading-snug">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
