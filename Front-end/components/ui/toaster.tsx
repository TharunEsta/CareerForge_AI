"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToasterContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function useToaster() {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error("useToaster must be used within a ToasterProvider");
  return ctx;
}

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in text-white text-sm font-medium
              ${toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-700" : "bg-gray-900"}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  );
}
