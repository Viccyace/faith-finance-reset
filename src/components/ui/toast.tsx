"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 rounded-xl p-4 shadow-lg text-sm animate-fade-in",
              t.type === "success" && "bg-primary text-white",
              t.type === "error" && "bg-error text-white",
              t.type === "info" && "bg-text-primary text-white"
            )}
          >
            {t.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
            {t.type === "error" && <XCircle className="h-4 w-4 shrink-0" />}
            {t.type === "info" && <AlertCircle className="h-4 w-4 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
