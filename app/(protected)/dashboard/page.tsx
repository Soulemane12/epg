"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { formatDate, getInitials, truncate } from "@/lib/utils";

export default function DashboardPage() {
  const { store, currentUser } = useApp();
  if (!currentUser) return null;

  const profile = store.profiles.find((p) => p.userId === currentUser.id);
  const now = new Date();

  const upcomingEvents = store.events
    .filter((e) => new Date(e.start) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  const latestAnnouncements = [...store.announcements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const matchedReferrals = store.referrals
    .filter(
      (r) =>
        r.status === "open" &&
        r.userId !== currentUser.id &&
        (r.state === profile?.state || r.industry === profile?.industry)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const recentMembers = store.users
    .filter((u) => u.approvalStatus === "approved" && u.id !== currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const myReferrals = store.referrals.filter((r) => r.userId === currentUser.id).length;
  const myRsvps = store.events.filter((e) => e.attendees.includes(currentUser.id)).length;
  const myDownloads = store.resourceDownloads.filter((d) => d.userId === currentUser.id).length;
  const totalMembers = store.users.filter((u) => u.approvalStatus === "approved").length;
  const firstName = currentUser.fullName.split(" ")[0];

  const card = "rounded-2xl border p-5" as const;
  const cardStyle = { background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" };

  return (
    <div className="space-y-5">
      {/* Welcome + stats */}
      <div className={card} style={cardStyle}>
        <div className="mb-4">
          <p className="page-kicker">Overview</p>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: "var(--text-1)" }}>
            Welcome back, {firstName}
          </h2>
          {profile?.state && profile?.industry && (
            <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
              Showing referrals for {profile.state} · {profile.industry}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Members", value: totalMembers, accent: "rgba(215,154,82,0.15)", textAccent: "var(--primary-text)" },
            { label: "My Referrals", value: myReferrals, accent: "rgba(45,138,95,0.12)", textAccent: "var(--success)" },
            { label: "Events RSVP'd", value: myRsvps, accent: "rgba(43,106,95,0.12)", textAccent: "var(--secondary)" },
            { label: "Downloads", value: myDownloads, accent: "rgba(178,118,39,0.12)", textAccent: "var(--warning)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: s.accent }}>
              <p className="text-2xl font-bold" style={{ color: s.textAccent }}>{s.value}</p>
              <p className="mt-0.5 text-xs font-medium" style={{ color: "var(--text-2)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3-col grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Upcoming Events */}
        <div className={card} style={cardStyle}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Upcoming Events</h3>
            <Link href="/events" className="text-xs font-medium" style={{ color: "var(--primary-text)" }}>See all</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-3)" }}>No upcoming events.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-xl text-center" style={{ background: "rgba(215,154,82,0.12)" }}>
                    <span className="text-[10px] font-semibold uppercase leading-none" style={{ color: "var(--primary-text)" }}>
                      {new Date(ev.start).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-base font-bold leading-none" style={{ color: "var(--primary-text)" }}>
                      {new Date(ev.start).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--text-1)" }}>{ev.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>{ev.chapter} · {ev.attendees.length} attending</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className={card} style={cardStyle}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Announcements</h3>
            <Link href="/leadership" className="text-xs font-medium" style={{ color: "var(--primary-text)" }}>See all</Link>
          </div>
          {latestAnnouncements.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-3)" }}>No announcements.</p>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {latestAnnouncements.map((a) => (
                <div key={a.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{a.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{truncate(a.body, 100)}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-3)" }}>{formatDate(a.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referral Matches */}
        <div className={card} style={cardStyle}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Referral Matches</h3>
            <Link href="/referrals" className="text-xs font-medium" style={{ color: "var(--primary-text)" }}>See all</Link>
          </div>
          {matchedReferrals.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-3)" }}>No matches in your region yet.</p>
          ) : (
            <div className="space-y-3">
              {matchedReferrals.map((r) => {
                const poster = store.users.find((u) => u.id === r.userId);
                return (
                  <div key={r.id} className="rounded-xl p-3" style={{ background: "rgba(215,154,82,0.07)", border: "1px solid rgba(215,154,82,0.14)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{truncate(r.title, 55)}</p>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--text-3)" }}>{poster?.fullName} · {r.state} · {r.industry}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recently Joined */}
      <div className={card} style={cardStyle}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Recently Joined</h3>
          <Link href="/directory" className="text-xs font-medium" style={{ color: "var(--primary-text)" }}>View directory</Link>
        </div>
        {recentMembers.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-3)" }}>No members yet.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recentMembers.map((u) => {
              const p = store.profiles.find((pr) => pr.userId === u.id);
              return (
                <Link
                  key={u.id}
                  href={`/directory/${u.id}`}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors"
                  style={{ border: "1px solid var(--border)", background: "rgba(255,248,239,0.5)" }}
                >
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--secondary), #4f9a8d)" }}
                  >
                    {getInitials(u.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--text-1)" }}>{u.fullName}</p>
                    <p className="truncate text-xs" style={{ color: "var(--text-3)" }}>{p?.title}{p?.state ? ` · ${p.state}` : ""}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
