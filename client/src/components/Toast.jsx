import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useAuth();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-white border-slate-200 text-slate-800 shadow-xl';
        let icon = <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-white border-emerald-200 text-slate-800 shadow-xl';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-white border-rose-200 text-slate-800 shadow-xl';
          icon = <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${bg} transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

