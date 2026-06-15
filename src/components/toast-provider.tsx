"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "info" | "error";

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (title: string, options?: { type?: ToastType; description?: string }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((title: string, options?: { type?: ToastType; description?: string }) => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current.slice(-3), { id, title, type: options?.type || "success", description: options?.description }]);
    window.setTimeout(() => remove(id), 3200);
  }, [remove]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-6 top-20 z-[100] flex w-[360px] flex-col gap-3" aria-live="polite">
        {items.map((item) => {
          const Icon = item.type === "success" ? CheckCircle2 : item.type === "error" ? TriangleAlert : Info;
          return (
            <div key={item.id} className={cn("flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl", item.type === "success" && "border-emerald-200", item.type === "error" && "border-rose-200", item.type === "info" && "border-blue-200")}>
              <Icon size={19} className={cn("mt-0.5 shrink-0", item.type === "success" && "text-emerald-600", item.type === "error" && "text-rose-600", item.type === "info" && "text-blue-600")} />
              <div className="min-w-0 flex-1"><p className="text-sm font-bold">{item.title}</p>{item.description && <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>}</div>
              <button onClick={() => remove(item.id)} className="text-muted hover:text-ink" aria-label="关闭提示"><X size={15} /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
