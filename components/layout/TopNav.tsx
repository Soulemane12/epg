"use client";

import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/directory": "Member Directory",
  "/events": "Events",
  "/referrals": "Referral Exchange",
  "/resources": "Resources",
  "/leadership": "Leadership",
  "/feed": "Feed",
  "/messages": "Messages",
  "/meetings": "Meetings",
  "/profile": "My Profile",
  "/admin": "Admin Panel",
};

export function TopNav() {
  const pathname = usePathname();
  const { store, currentUser } = useApp();

  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname === key || pathname.startsWith(key + "/"))?.[1] ?? "EPG";

  const unreadNotifs = store.notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length;

  return (
    <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6 gap-4">
      <h1 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex-1">{title}</h1>
      {unreadNotifs > 0 && (
        <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
          {unreadNotifs}
        </span>
      )}
    </header>
  );
}
