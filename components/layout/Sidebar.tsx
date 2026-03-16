"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { can } from "@/lib/permissions";
import { getInitials } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/directory", label: "Directory", icon: "👥" },
  { href: "/events", label: "Events", icon: "📅" },
  { href: "/referrals", label: "Referrals", icon: "🤝" },
  { href: "/resources", label: "Resources", icon: "📁" },
  { href: "/leadership", label: "Leadership", icon: "⭐" },
  { href: "/feed", label: "Feed", icon: "📰" },
  { href: "/messages", label: "Messages", icon: "💬" },
  { href: "/meetings", label: "Meetings", icon: "📆" },
  { href: "/profile", label: "My Profile", icon: "👤" },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  executive: "Executive",
  chapter_leader: "Chapter Leader",
  member: "Member",
  guest: "Guest",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  executive: "bg-purple-100 text-purple-700",
  chapter_leader: "bg-blue-100 text-blue-700",
  member: "bg-green-100 text-green-700",
  guest: "bg-neutral-100 text-neutral-600",
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">EPG</span>
        <p className="text-xs text-neutral-500 mt-0.5">Executive Partners Group</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-3">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
          {currentUser && can(currentUser, "viewAdmin") && (
            <li>
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  pathname === "/admin"
                    ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 font-medium"
                    : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                }`}
              >
                <span className="text-base">🛡</span>
                Admin Panel
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* User footer */}
      {currentUser && (
        <div className="px-4 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {getInitials(currentUser.fullName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{currentUser.fullName}</p>
              <span className={`inline-block text-xs px-1.5 py-0.5 rounded font-medium ${ROLE_COLORS[currentUser.role] ?? ""}`}>
                {ROLE_LABELS[currentUser.role]}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-neutral-500 hover:text-red-600 transition-colors px-1"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
