import { AppStore, DEFAULT_STORE } from "@/types";

const STORAGE_KEY = "epg_app_store";
const CURRENT_VERSION = 1;

export function loadStore(): AppStore {
  if (typeof window === "undefined") return { ...DEFAULT_STORE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STORE };
    const parsed = JSON.parse(raw) as AppStore;
    // Version check: stale schema → reset
    if (parsed.version !== CURRENT_VERSION) {
      window.localStorage.removeItem(STORAGE_KEY);
      return { ...DEFAULT_STORE };
    }
    return parsed;
  } catch {
    return { ...DEFAULT_STORE };
  }
}

export function saveStore(data: AppStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded — fail silently in demo
  }
}

export function clearStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
