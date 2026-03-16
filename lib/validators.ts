import { AppStore } from "@/types";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidUrl(url: string): boolean {
  if (!url) return true; // optional fields
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function hasDuplicateEmail(store: AppStore, email: string): boolean {
  return store.users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
}
