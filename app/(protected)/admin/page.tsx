"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { can } from "@/lib/permissions";
import { formatDate, getInitials, INDUSTRIES } from "@/lib/utils";
import { Role, User, Resource, Referral, Event, Announcement } from "@/types";

const TABS = ["Applications", "Members", "Events", "Referrals", "Resources", "Announcements", "Leadership", "Feed", "Seed / Reset"] as const;
type Tab = typeof TABS[number];

export default function AdminPage() {
  const { currentUser } = useApp();
  const [tab, setTab] = useState<Tab>("Applications");

  if (!currentUser || !can(currentUser, "viewAdmin")) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Applications" && <ApplicationsTab />}
      {tab === "Members" && <MembersTab />}
      {tab === "Events" && <EventsAdminTab />}
      {tab === "Referrals" && <ReferralsAdminTab />}
      {tab === "Resources" && <ResourcesAdminTab />}
      {tab === "Announcements" && <AnnouncementsAdminTab />}
      {tab === "Leadership" && <LeadershipAdminTab />}
      {tab === "Feed" && <FeedModerationTab />}
      {tab === "Seed / Reset" && <SeedResetTab />}
    </div>
  );
}

function ApplicationsTab() {
  const { store, approveUser, rejectUser } = useApp();
  const pending = store.users.filter((u) => u.approvalStatus === "pending");

  if (pending.length === 0) {
    return <EmptyState message="No pending applications." />;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
        {pending.length} Pending Application{pending.length !== 1 ? "s" : ""}
      </h3>
      {pending.map((user) => {
        const profile = store.profiles.find((p) => p.userId === user.id);
        return (
          <div key={user.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {getInitials(user.fullName)}
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{user.fullName}</p>
                <p className="text-sm text-neutral-500">{user.email}</p>
                {profile && (
                  <p className="text-sm text-neutral-500 mt-0.5">{profile.title} @ {profile.companyName} · {profile.state} · {profile.industry}</p>
                )}
                {profile?.bio && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-lg">{profile.bio}</p>
                )}
                <p className="text-xs text-neutral-400 mt-1">Applied {formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => approveUser(user.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => rejectUser(user.id)}
                className="bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-900 text-red-700 dark:text-red-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ROLE_OPTIONS: Role[] = ["member", "chapter_leader", "executive", "admin"];

function MembersTab() {
  const { store, promoteUser, deleteUser, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const approved = store.users.filter((u) => u.approvalStatus === "approved");
  const filtered = approved.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search members…"
        className={inputCls + " max-w-sm"}
      />
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Member</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">{u.fullName}</div>
                  <div className="text-xs text-neutral-500">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => promoteUser(u.id, e.target.value as Role)}
                    disabled={u.id === currentUser?.id}
                    className="text-xs border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
                  >
                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-neutral-500 text-xs">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  {u.id !== currentUser?.id && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventsAdminTab() {
  const { store, deleteEvent } = useApp();
  if (store.events.length === 0) return <EmptyState message="No events." />;
  return (
    <div className="space-y-2">
      {store.events.map((ev) => (
        <div key={ev.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex justify-between items-start gap-4">
          <div>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{ev.title}</p>
            <p className="text-sm text-neutral-500">{ev.chapter} · {formatDate(ev.start)}</p>
          </div>
          <button onClick={() => deleteEvent(ev.id)} className="text-xs text-red-600 hover:underline flex-shrink-0">Delete</button>
        </div>
      ))}
    </div>
  );
}

function ReferralsAdminTab() {
  const { store, deleteReferral } = useApp();
  if (store.referrals.length === 0) return <EmptyState message="No referrals." />;
  return (
    <div className="space-y-2">
      {store.referrals.map((r) => {
        const user = store.users.find((u) => u.id === r.userId);
        return (
          <div key={r.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex justify-between items-start gap-4">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{r.title}</p>
              <p className="text-sm text-neutral-500">by {user?.fullName ?? "Unknown"} · {r.status}</p>
            </div>
            <button onClick={() => deleteReferral(r.id)} className="text-xs text-red-600 hover:underline flex-shrink-0">Delete</button>
          </div>
        );
      })}
    </div>
  );
}

function ResourcesAdminTab() {
  const { store, deleteResource, createResource, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "guidelines" as Resource["category"], fileUrl: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.fileUrl.trim()) return;
    createResource(form, currentUser!.id);
    setForm({ title: "", description: "", category: "guidelines", fileUrl: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setShowForm((v) => !v)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
        {showForm ? "Cancel" : "+ Add Resource"}
      </button>
      {showForm && (
        <form onSubmit={submit} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
          <input value={form.title} onChange={set("title")} placeholder="Title *" className={inputCls} />
          <textarea value={form.description} onChange={set("description")} placeholder="Description" className={inputCls + " resize-none"} rows={2} />
          <select value={form.category} onChange={set("category")} className={inputCls}>
            {(["guidelines","forms","compliance","training","chapter_docs"] as const).map((c) => (
              <option key={c} value={c}>{c.replace("_", " ")}</option>
            ))}
          </select>
          <input value={form.fileUrl} onChange={set("fileUrl")} placeholder="/resources/file.pdf *" className={inputCls} />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
        </form>
      )}
      <div className="space-y-2">
        {store.resources.map((r) => (
          <div key={r.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex justify-between items-start gap-4">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{r.title}</p>
              <p className="text-sm text-neutral-500">{r.category} · {r.fileUrl}</p>
            </div>
            <button onClick={() => deleteResource(r.id)} className="text-xs text-red-600 hover:underline flex-shrink-0">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsAdminTab() {
  const { store, createAnnouncement, deleteAnnouncement, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", mediaUrl: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    createAnnouncement({ title: form.title, body: form.body, mediaUrl: form.mediaUrl || undefined }, currentUser!.id);
    setForm({ title: "", body: "", mediaUrl: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setShowForm((v) => !v)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
        {showForm ? "Cancel" : "+ New Announcement"}
      </button>
      {showForm && (
        <form onSubmit={submit} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3">
          <input value={form.title} onChange={set("title")} placeholder="Title *" className={inputCls} />
          <textarea value={form.body} onChange={set("body")} placeholder="Body *" className={inputCls + " resize-none"} rows={4} />
          <input value={form.mediaUrl} onChange={set("mediaUrl")} placeholder="Media URL (optional)" className={inputCls} />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Post</button>
        </form>
      )}
      <div className="space-y-2">
        {store.announcements.map((a) => (
          <div key={a.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex justify-between items-start gap-4">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{a.title}</p>
              <p className="text-sm text-neutral-500 line-clamp-1">{a.body}</p>
            </div>
            <button onClick={() => deleteAnnouncement(a.id)} className="text-xs text-red-600 hover:underline flex-shrink-0">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadershipAdminTab() {
  const { store, updateLeadershipMember } = useApp();
  const sorted = [...store.leadership].sort((a, b) => a.order - b.order);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "", photoUrl: "" });

  const startEdit = (l: typeof sorted[0]) => {
    setEditing(l.id);
    setForm({ name: l.name, role: l.role, bio: l.bio, photoUrl: l.photoUrl });
  };

  const save = (id: string) => {
    updateLeadershipMember(id, form);
    setEditing(null);
  };

  return (
    <div className="space-y-3">
      {sorted.map((l) => editing === l.id ? (
        <div key={l.id} className="bg-white dark:bg-neutral-900 border border-blue-300 dark:border-blue-700 rounded-xl p-5 space-y-3">
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className={inputCls} />
          <input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Title/Role" className={inputCls} />
          <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Bio" className={inputCls + " resize-none"} rows={3} />
          <input value={form.photoUrl} onChange={(e) => setForm((p) => ({ ...p, photoUrl: e.target.value }))} placeholder="/avatars/photo.jpg" className={inputCls} />
          <div className="flex gap-2">
            <button onClick={() => save(l.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => setEditing(null)} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <div key={l.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex justify-between items-start gap-4">
          <div>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{l.name}</p>
            <p className="text-sm text-neutral-500">{l.role}</p>
          </div>
          <button onClick={() => startEdit(l)} className="text-xs text-blue-600 hover:underline flex-shrink-0">Edit</button>
        </div>
      ))}
    </div>
  );
}

function FeedModerationTab() {
  const { store, unhidePost, currentUser } = useApp();
  const allPosts = store.feedPosts;
  const hidden = allPosts.filter((p) => p.hidden);
  const visible = allPosts.filter((p) => !p.hidden);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Hidden Posts ({hidden.length})</h3>
        {hidden.length === 0 ? <EmptyState message="No hidden posts." /> : hidden.map((p) => {
          const author = store.users.find((u) => u.id === p.authorId);
          return (
            <div key={p.id} className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 flex justify-between items-start gap-4 mb-2">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">{p.body}</p>
                <p className="text-xs text-neutral-500 mt-0.5">by {author?.fullName} · Hidden by {store.users.find((u) => u.id === p.hiddenBy)?.fullName ?? "admin"}</p>
                {p.hiddenReason && <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">Reason: {p.hiddenReason}</p>}
              </div>
              <button onClick={() => unhidePost(p.id)} className="text-xs text-blue-600 hover:underline flex-shrink-0">Restore</button>
            </div>
          );
        })}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Visible Posts ({visible.length})</h3>
        {visible.map((p) => {
          const author = store.users.find((u) => u.id === p.authorId);
          return (
            <div key={p.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex justify-between items-start gap-4 mb-2">
              <div>
                <p className="text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1">{p.body}</p>
                <p className="text-xs text-neutral-500 mt-0.5">by {author?.fullName}</p>
              </div>
              <HidePostButton postId={p.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HidePostButton({ postId }: { postId: string }) {
  const { hidePost, currentUser } = useApp();
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  return open ? (
    <div className="flex items-center gap-2 flex-shrink-0">
      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" className="text-xs border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 bg-white dark:bg-neutral-800 w-36" />
      <button onClick={() => { hidePost(postId, currentUser!.id, reason); setOpen(false); }} className="text-xs bg-red-600 text-white px-2 py-1 rounded">Hide</button>
      <button onClick={() => setOpen(false)} className="text-xs text-neutral-400 hover:underline">Cancel</button>
    </div>
  ) : (
    <button onClick={() => setOpen(true)} className="text-xs text-red-600 hover:underline flex-shrink-0">Hide</button>
  );
}

function SeedResetTab() {
  const { seedDemoData, resetStore } = useApp();
  return (
    <div className="max-w-md space-y-6">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Load Demo Data</h3>
        <p className="text-sm text-neutral-500 mb-4">Populates the app with 23 members, 6 events, 10 referrals, 8 resources, and more. Will not overwrite existing data.</p>
        <button onClick={seedDemoData} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm">Load Demo Data</button>
      </div>
      <div className="bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900 rounded-xl p-5">
        <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Reset App</h3>
        <p className="text-sm text-neutral-500 mb-4">Clears all data including your session. You will be signed out.</p>
        <button onClick={resetStore} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm">Reset App</button>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-neutral-400 text-sm">{message}</div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
