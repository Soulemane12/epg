"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { formatDateTime, getInitials } from "@/lib/utils";
import { MeetingStatus, MeetingType } from "@/types";

type Tab = "received" | "sent" | "accepted" | "declined" | "completed";

export default function MeetingsPage() {
  const { store, currentUser, createMeetingRequest, updateMeetingRequestStatus } = useApp();
  const searchParams = useSearchParams();
  const requestUserId = searchParams.get("request");

  const [tab, setTab] = useState<Tab>("received");
  const [showForm, setShowForm] = useState(!!requestUserId);
  const [preselectedUserId, setPreselectedUserId] = useState(requestUserId ?? "");

  const myId = currentUser!.id;

  const received = store.meetingRequests.filter((r) => r.toUserId === myId && r.status === "pending");
  const sent = store.meetingRequests.filter((r) => r.fromUserId === myId && r.status === "pending");
  const accepted = store.meetingRequests.filter(
    (r) => (r.fromUserId === myId || r.toUserId === myId) && r.status === "accepted"
  );
  const declined = store.meetingRequests.filter(
    (r) => (r.fromUserId === myId || r.toUserId === myId) && r.status === "declined"
  );
  const completed = store.meetingRequests.filter(
    (r) => (r.fromUserId === myId || r.toUserId === myId) && r.status === "completed"
  );

  const tabCounts: Record<Tab, number> = { received: received.length, sent: sent.length, accepted: accepted.length, declined: declined.length, completed: completed.length };

  const tabItems: Record<Tab, typeof received> = { received, sent, accepted, declined, completed };
  const currentItems = tabItems[tab];

  return (
    <div className="max-w-3xl mx-auto">
      {/* New meeting request form */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? "Cancel" : "+ Request Meeting"}
        </button>
      </div>

      {showForm && (
        <MeetingRequestForm
          preselectedUserId={preselectedUserId}
          onSave={(data) => {
            createMeetingRequest(data, myId);
            setShowForm(false);
            setPreselectedUserId("");
            setTab("sent");
          }}
          onCancel={() => { setShowForm(false); setPreselectedUserId(""); }}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["received", "sent", "accepted", "declined", "completed"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            {t} {tabCounts[t] > 0 ? `(${tabCounts[t]})` : ""}
          </button>
        ))}
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">No {tab} meeting requests.</div>
      ) : (
        <div className="space-y-4">
          {currentItems.map((mr) => {
            const isReceived = mr.toUserId === myId;
            const otherId = isReceived ? mr.fromUserId : mr.toUserId;
            const other = store.users.find((u) => u.id === otherId);

            return (
              <div key={mr.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {getInitials(other?.fullName ?? "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{other?.fullName}</p>
                    <p className="text-sm text-neutral-500">
                      {isReceived ? "Wants to meet with you" : "You requested a meeting"}
                    </p>
                  </div>
                  <MeetingStatusBadge status={mr.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">Proposed Time</p>
                    <p className="text-neutral-900 dark:text-neutral-100">{formatDateTime(mr.proposedTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">Meeting Type</p>
                    <p className="text-neutral-900 dark:text-neutral-100 capitalize">{mr.meetingType.replace("_", " ")}</p>
                  </div>
                </div>

                {mr.notes && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">{mr.notes}</p>
                )}

                {(mr.zoomUrl || mr.meetUrl) && mr.status === "accepted" && (
                  <div className="mb-3">
                    {mr.zoomUrl && (
                      <a href={mr.zoomUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        🎥 Join Zoom Meeting
                      </a>
                    )}
                    {mr.meetUrl && (
                      <a href={mr.meetUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        🎥 Join Google Meet
                      </a>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {isReceived && mr.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateMeetingRequestStatus(mr.id, "accepted")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateMeetingRequestStatus(mr.id, "declined")}
                        className="bg-red-100 dark:bg-red-950 hover:bg-red-200 text-red-700 dark:text-red-300 px-4 py-1.5 rounded-lg text-sm font-medium"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {!isReceived && mr.status === "accepted" && (
                    <button
                      onClick={() => updateMeetingRequestStatus(mr.id, "completed")}
                      className="bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-lg text-sm font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MeetingStatusBadge({ status }: { status: MeetingStatus }) {
  const colors: Record<MeetingStatus, string> = {
    pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    accepted: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    declined: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
    completed: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${colors[status]}`}>{status}</span>
  );
}

function MeetingRequestForm({ preselectedUserId, onSave, onCancel }: {
  preselectedUserId: string;
  onSave: (data: { toUserId: string; proposedTime: string; meetingType: MeetingType; notes: string; zoomUrl?: string; meetUrl?: string }) => void;
  onCancel: () => void;
}) {
  const { store, currentUser } = useApp();
  const [form, setForm] = useState({
    toUserId: preselectedUserId,
    proposedTime: "",
    meetingType: "zoom" as MeetingType,
    notes: "",
    zoomUrl: "",
    meetUrl: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const members = store.users.filter((u) => u.id !== currentUser!.id && u.approvalStatus === "approved");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.toUserId || !form.proposedTime) return;
    onSave({
      toUserId: form.toUserId,
      proposedTime: new Date(form.proposedTime).toISOString(),
      meetingType: form.meetingType,
      notes: form.notes,
      zoomUrl: form.zoomUrl || undefined,
      meetUrl: form.meetUrl || undefined,
    });
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6 space-y-3">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">New Meeting Request</h3>
      <select value={form.toUserId} onChange={set("toUserId")} className={inputCls}>
        <option value="">Select member *</option>
        {members.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-500 mb-1 block">Proposed Date/Time *</label>
          <input type="datetime-local" value={form.proposedTime} onChange={set("proposedTime")} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-neutral-500 mb-1 block">Meeting Type</label>
          <select value={form.meetingType} onChange={set("meetingType")} className={inputCls}>
            <option value="zoom">Zoom</option>
            <option value="google_meet">Google Meet</option>
            <option value="phone">Phone</option>
            <option value="in_person">In Person</option>
          </select>
        </div>
      </div>
      <textarea value={form.notes} onChange={set("notes")} placeholder="Notes / agenda (optional)" className={inputCls + " resize-none"} rows={2} />
      {form.meetingType === "zoom" && (
        <input value={form.zoomUrl} onChange={set("zoomUrl")} placeholder="Zoom URL (optional)" className={inputCls} />
      )}
      {form.meetingType === "google_meet" && (
        <input value={form.meetUrl} onChange={set("meetUrl")} placeholder="Google Meet URL (optional)" className={inputCls} />
      )}
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Send Request</button>
        <button type="button" onClick={onCancel} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-5 py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
