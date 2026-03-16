"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { canonicalThreadId, formatDate, getInitials } from "@/lib/utils";

export default function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { store, currentUser, createMeetingRequest } = useApp();
  const router = useRouter();

  const user = store.users.find((u) => u.id === id);
  const profile = store.profiles.find((p) => p.userId === id);

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Member not found.</p>
      </div>
    );
  }

  const handleMessage = () => {
    router.push(`/messages?thread=${canonicalThreadId(currentUser!.id, id)}`);
  };

  const handleMeeting = () => {
    router.push(`/meetings?request=${id}`);
  };

  const referralCount = store.referrals.filter((r) => r.userId === id).length;
  const eventCount = store.events.filter((e) => e.attendees.includes(id)).length;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/directory" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">← Back to Directory</Link>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-5">
        <div className="flex items-start gap-5 mb-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {getInitials(user.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{user.fullName}</h2>
            <p className="text-neutral-500">{profile.title} · {profile.companyName}</p>
            <p className="text-sm text-neutral-400 mt-0.5">📍 {profile.state} · {profile.industry}</p>
          </div>
          {currentUser?.id !== id && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Message
              </button>
              <button
                onClick={handleMeeting}
                className="border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Request Meeting
              </button>
            </div>
          )}
        </div>

        {profile.bio && (
          <p className="text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">{profile.bio}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{referralCount}</div>
            <div className="text-xs text-neutral-500">Referrals</div>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{eventCount}</div>
            <div className="text-xs text-neutral-500">Events Attended</div>
          </div>
          {profile.phone && (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
              <div className="text-xs text-neutral-500 mb-0.5">Phone</div>
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{profile.phone}</div>
            </div>
          )}
          {profile.website && (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
              <div className="text-xs text-neutral-500 mb-0.5">Website</div>
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block">{profile.website.replace(/^https?:\/\//, "")}</a>
            </div>
          )}
        </div>

        {profile.expertise.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Expertise</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.expertise.map((e) => (
                <span key={e} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-medium">{e}</span>
              ))}
            </div>
          </div>
        )}

        {profile.specialties.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.specialties.map((s) => (
                <span key={s} className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-neutral-400 mt-5">Member since {formatDate(user.createdAt)}</p>
      </div>
    </div>
  );
}
