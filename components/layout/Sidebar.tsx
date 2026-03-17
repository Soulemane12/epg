"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { can } from "@/lib/permissions";
import { getInitials } from "@/lib/utils";

function IconGrid() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/></svg>;
}
function IconUsers() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 10c1.5.3 3 1.2 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconCalendar() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 1.5v2M11 1.5v2M1.5 6.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconArrow() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconFolder() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1.5 4.5A1.5 1.5 0 013 3h3.379a1.5 1.5 0 011.06.44l.622.621A1.5 1.5 0 009.12 4.5H13a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0113 13.5H3A1.5 1.5 0 011.5 12V4.5z" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
function IconStar() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.854 3.756 4.146.602-3 2.925.708 4.131L8 10.77 4.292 12.914l.708-4.131-3-2.925 4.146-.602L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
function IconRss() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 11.5h1M5 8.5c2.209 0 4 1.567 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M5 5.5c3.866 0 7 2.91 7 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconChat() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M13.5 9A1.5 1.5 0 0112 10.5H5l-3 3V3.5A1.5 1.5 0 013.5 2H12a1.5 1.5 0 011.5 1.5V9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
function IconClock() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconUser() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 13c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconShield() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l5.5 2v5C13.5 11.5 11 14 8 14.5 5 14 2.5 11.5 2.5 8.5v-5L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
function IconLogout() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10.5 8H2.5M2.5 8l3-3M2.5 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 4.5V3a1 1 0 011-1H13a1 1 0 011 1v10a1 1 0 01-1 1H7.5a1 1 0 01-1-1v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: IconGrid },
  { href: "/directory", label: "Directory", Icon: IconUsers },
  { href: "/events", label: "Events", Icon: IconCalendar },
  { href: "/referrals", label: "Referrals", Icon: IconArrow },
  { href: "/resources", label: "Resources", Icon: IconFolder },
  { href: "/leadership", label: "Leadership", Icon: IconStar },
  { href: "/feed", label: "Feed", Icon: IconRss },
  { href: "/messages", label: "Messages", Icon: IconChat },
  { href: "/meetings", label: "Meetings", Icon: IconClock },
  { href: "/profile", label: "My Profile", Icon: IconUser },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  executive: "Executive",
  chapter_leader: "Chapter Leader",
  member: "Member",
  guest: "Guest",
};

const ROLE_PILL: Record<string, { background: string; color: string }> = {
  admin: { background: "rgba(180, 84, 74, 0.2)", color: "#ffcabd" },
  executive: { background: "rgba(215, 154, 82, 0.2)", color: "#ffe0bb" },
  chapter_leader: { background: "rgba(88, 156, 143, 0.2)", color: "#c8ede4" },
  member: { background: "rgba(45, 138, 95, 0.2)", color: "#bff0d6" },
  guest: { background: "rgba(255,255,255,0.08)", color: "rgba(255,247,238,0.6)" },
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
    <aside
      className="flex w-56 flex-shrink-0 flex-col"
      style={{
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        minHeight: "100vh",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, var(--sidebar-active-accent), #f0c48d)" }}
        >
          E
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-white">EPG</p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--sidebar-text)" }}>Executive Partners</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,247,238,0.35)" }}>
          Menu
        </p>
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm"
                  style={{
                    color: active ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                    background: active ? "var(--sidebar-active-bg)" : "transparent",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <span style={{ color: active ? "var(--sidebar-active-accent)" : "var(--sidebar-text)", flexShrink: 0 }}>
                    <Icon />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}

          {currentUser && can(currentUser, "viewAdmin") && (
            <>
              <li className="pt-3">
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,247,238,0.35)" }}>
                  Admin
                </p>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm"
                  style={{
                    color: pathname === "/admin" ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                    background: pathname === "/admin" ? "var(--sidebar-active-bg)" : "transparent",
                    fontWeight: pathname === "/admin" ? 600 : 400,
                  }}
                >
                  <span style={{ color: pathname === "/admin" ? "#f7beb6" : "var(--sidebar-text)", flexShrink: 0 }}>
                    <IconShield />
                  </span>
                  Admin Panel
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* User footer */}
      {currentUser && (
        <div className="px-3 py-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--sidebar-active-accent), #f0c48d)" }}
            >
              {getInitials(currentUser.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{currentUser.fullName}</p>
              <span
                className="mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={ROLE_PILL[currentUser.role] ?? ROLE_PILL.guest}
              >
                {ROLE_LABELS[currentUser.role]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 rounded-lg p-1.5"
              style={{ color: "var(--sidebar-text)" }}
              title="Sign out"
            >
              <IconLogout />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
