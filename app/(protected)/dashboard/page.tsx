"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { formatDate, getInitials, truncate } from "@/lib/utils";

export default function DashboardPage() {
  const { store, currentUser } = useApp();
  if (!currentUser) return null;

  const profile = store.profiles.find((p) => p.userId === currentUser.id);
  const now = new Date();

  // Upcoming events (next 3)
  const upcomingEvents = store.events
    .filter((e) => new Date(e.start) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  // Latest announcements (3)
  const latestAnnouncements = [...store.announcements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Open referrals matching user's state/industry (3)
  const matchedReferrals = store.referrals
    .filter(
      (r) =>
        r.status === "open" &&
        r.userId !== currentUser.id &&
        (r.state === profile?.state || r.industry === profile?.industry)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Recently joined (5 newest approved)
  const recentMembers = store.users
    .filter((u) => u.approvalStatus === "approved" && u.id !== currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Quick stats
  const myReferrals = store.referrals.filter((r) => r.userId === currentUser.id).length;
  const myRsvps = store.events.filter((e) => e.attendees.includes(currentUser.id)).length;
  const myDownloads = store.resourceDownloads.filter((d) => d.userId === currentUser.id).length;
  const totalMembers = store.users.filter((u) => u.approvalStatus === "approved").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome back, {currentUser.fullName.split(" ")[0]} 👋
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          Here's what's happening across the EPG network.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: totalMembers, icon: "👥", color: "blue" },
          { label: "My Referrals", value: myReferrals, icon: "🤝", color: "green" },
          { label: "Events RSVP'd", value: myRsvps, icon: "📅", color: "purple" },
          { label: "Resources Downloaded", value: myDownloads, icon: "📁", color: "orange" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{s.value}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Upcoming Events</h3>
            <Link href="/events" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">See all →</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-neutral-400">No upcoming events.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-blue-700 dark:text-blue-300 font-bold">
                      {new Date(ev.start).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-sm text-blue-700 dark:text-blue-300 font-bold leading-none">
                      {new Date(ev.start).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{ev.title}</p>
                    <p className="text-xs text-neutral-500">{ev.chapter} · {ev.attendees.length} attending</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Announcements */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Announcements</h3>
            <Link href="/leadership" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">See all →</Link>
          </div>
          {latestAnnouncements.length === 0 ? (
            <p className="text-sm text-neutral-400">No announcements.</p>
          ) : (
            <div className="space-y-3">
              {latestAnnouncements.map((a) => (
                <div key={a.id}>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{a.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{a.body}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{formatDate(a.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matched Referrals */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Referral Matches</h3>
            <Link href="/referrals" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">See all →</Link>
          </div>
          {matchedReferrals.length === 0 ? (
            <p className="text-sm text-neutral-400">No matches in your region/industry yet.</p>
          ) : (
            <div className="space-y-3">
              {matchedReferrals.map((r) => {
                const poster = store.users.find((u) => u.id === r.userId);
                return (
                  <div key={r.id}>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{truncate(r.title, 55)}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{poster?.fullName} · {r.state} · {r.industry}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recently Joined */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Recently Joined</h3>
          <Link href="/directory" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View directory →</Link>
        </div>
        {recentMembers.length === 0 ? (
          <p className="text-sm text-neutral-400">No members yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {recentMembers.map((u) => {
              const p = store.profiles.find((pr) => pr.userId === u.id);
              return (
                <Link key={u.id} href={`/directory/${u.id}`} className="flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg px-3 py-2 transition-colors min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {getInitials(u.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{u.fullName}</p>
                    <p className="text-xs text-neutral-500 truncate">{p?.title} · {p?.state}</p>
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
