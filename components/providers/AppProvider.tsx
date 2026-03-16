"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAppStore, AppStoreContext } from "@/hooks/useAppStore";

const AppContext = createContext<AppStoreContext | null>(null);

export function useApp(): AppStoreContext {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Show full-screen loader until hydrated — prevents auth flash
  if (!mounted || !store.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500">Loading EPG…</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={store}>
      {children}
      <ToastDisplay />
    </AppContext.Provider>
  );
}

function ToastDisplay() {
  const { toast, setToast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setToast(null), 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const colors: Record<string, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-white text-sm shadow-lg transition-all duration-300 ${colors[toast.type] ?? "bg-neutral-800"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {toast.message}
    </div>
  );
}
