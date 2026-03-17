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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Show full-screen loader until hydrated — prevents auth flash
  if (!mounted || !store.isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="surface-panel-strong flex flex-col items-center gap-4 px-10 py-10 text-center">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
            style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
          />
          <div>
            <p className="page-kicker">EPG</p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
              Loading the member network...
            </p>
          </div>
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

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const colors: Record<string, { background: string; color: string; borderColor: string }> = {
    success: {
      background: "rgba(45, 138, 95, 0.96)",
      color: "#f4fff8",
      borderColor: "rgba(215, 255, 236, 0.2)",
    },
    error: {
      background: "rgba(180, 84, 74, 0.96)",
      color: "#fff6f4",
      borderColor: "rgba(255, 220, 216, 0.22)",
    },
    info: {
      background: "rgba(23, 61, 56, 0.96)",
      color: "#fff8ee",
      borderColor: "rgba(255, 227, 194, 0.16)",
    },
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 rounded-[1.2rem] px-4 py-3 text-sm shadow-lg transition-all duration-300"
      style={{
        ...(colors[toast.type] ?? colors.info),
        borderWidth: "1px",
        boxShadow: "0 18px 40px rgba(23, 36, 31, 0.18)",
      }}
    >
      {toast.message}
    </div>
  );
}
