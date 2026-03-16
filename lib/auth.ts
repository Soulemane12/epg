// Pure functions — no state mutation. useAppStore performs all mutations.
import { AppStore, User } from "@/types";

export function validateCredentials(
  store: AppStore,
  email: string,
  password: string
): User | null {
  return (
    store.users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    ) ?? null
  );
}

export type AccessResult =
  | { allowed: true }
  | { allowed: false; reason: "not_found" | "pending" | "rejected" };

export function canAccess(user: User | null): AccessResult {
  if (!user) return { allowed: false, reason: "not_found" };
  if (user.approvalStatus === "pending") return { allowed: false, reason: "pending" };
  if (user.approvalStatus === "rejected") return { allowed: false, reason: "rejected" };
  return { allowed: true };
}

export function getCurrentUser(store: AppStore): User | null {
  if (!store.sessionUserId) return null;
  return store.users.find((u) => u.id === store.sessionUserId) ?? null;
}
