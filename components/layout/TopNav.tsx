"use client";

import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { getInitials } from "@/lib/utils";

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

  const title = Object.entries(PAGE_TITLES).find(
    ([key]) => pathname === key || pathname.startsWith(key + "/")
  )?.[1] ?? "EPG";

  const unreadNotifs = store.notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length;

  return (
    <header
      className="flex h-14 flex-shrink-0 items-center gap-4 px-5"
      style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <h1 className="flex-1 text-sm font-semibold" style={{ color: "var(--text-1)" }}>
        {title}
      </h1>

      <div className="flex items-center gap-2.5">
        {unreadNotifs > 0 && (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: "var(--danger)" }}
          >
            {unreadNotifs}
          </span>
        )}
        {currentUser && (
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--sidebar-active-accent), #f0c48d)" }}
            >
              {getInitials(currentUser.fullName)}
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
              {currentUser.fullName.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
