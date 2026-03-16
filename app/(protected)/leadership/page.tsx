"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { can } from "@/lib/permissions";
import { formatDate, getInitials } from "@/lib/utils";

export default function LeadershipPage() {
  const { store, currentUser, updateLeadershipMember, createAnnouncement } = useApp();
  const canManage = can(currentUser, "manageLeadership");
  const [editingId, setEditingId] = useState<string | null>(null);

  const sorted = [...store.leadership].sort((a, b) => a.order - b.order);
  const latestAnnouncements = [...store.announcements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Executive Team */}
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Executive Team</h2>
        {sorted.length === 0 ? (
          <p className="text-neutral-400 text-sm">No leadership data.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((l) => (
              editingId === l.id ? (
                <LeaderEditForm
                  key={l.id}
                  member={l}
                  onSave={(data) => { updateLeadershipMember(l.id, data); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div key={l.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                  <div className="flex items-start gap-4 mb-3">
                    {l.photoUrl ? (
                      <img src={l.photoUrl} alt={l.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-neutral-100" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {getInitials(l.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-neutral-900 dark:text-neutral-100">{l.name}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{l.role}</p>
                    </div>
                    {canManage && (
                      <button onClick={() => setEditingId(l.id)} className="text-xs text-neutral-400 hover:text-blue-600 hover:underline">Edit</button>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{l.bio}</p>
                </div>
              )
            ))}
          </div>
        )}
      </section>

      {/* Official Announcements */}
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Official Announcements</h2>
        {latestAnnouncements.length === 0 ? (
          <p className="text-neutral-400 text-sm">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {latestAnnouncements.map((a) => {
              const author = store.users.find((u) => u.id === a.createdBy);
              return (
                <div key={a.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{a.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">{a.body}</p>
                  <p className="text-xs text-neutral-400">Posted by {author?.fullName ?? "EPG"} · {formatDate(a.createdAt)}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function LeaderEditForm({ member, onSave, onCancel }: {
  member: { id: string; name: string; role: string; bio: string; photoUrl: string; order: number };
  onSave: (data: Partial<typeof member>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ name: member.name, role: member.role, bio: member.bio, photoUrl: member.photoUrl });
  return (
    <div className="bg-white dark:bg-neutral-900 border border-blue-300 dark:border-blue-700 rounded-2xl p-5 space-y-3">
      <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className={inputCls} />
      <input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Title" className={inputCls} />
      <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Bio" className={inputCls + " resize-none"} rows={3} />
      <input value={form.photoUrl} onChange={(e) => setForm((p) => ({ ...p, photoUrl: e.target.value }))} placeholder="/avatars/photo.jpg" className={inputCls} />
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
        <button onClick={onCancel} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
