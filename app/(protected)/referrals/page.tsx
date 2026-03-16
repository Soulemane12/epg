"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { formatDate, getInitials, INDUSTRIES, US_STATES } from "@/lib/utils";
import { Referral } from "@/types";

type Tab = "open" | "fulfilled";

export default function ReferralsPage() {
  const { store, currentUser, createReferral, respondToReferral, markReferralFulfilled, deleteReferral } = useApp();
  const [tab, setTab] = useState<Tab>("open");
  const [showForm, setShowForm] = useState(false);
  const [filterState, setFilterState] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return store.referrals
      .filter((r) => r.status === tab)
      .filter((r) => (!filterState || r.state === filterState) && (!filterIndustry || r.industry === filterIndustry))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [store.referrals, tab, filterState, filterIndustry]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs + controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <button onClick={() => setTab("open")} className={`px-4 py-2 text-sm font-medium ${tab === "open" ? "bg-blue-600 text-white" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
            Open ({store.referrals.filter((r) => r.status === "open").length})
          </button>
          <button onClick={() => setTab("fulfilled")} className={`px-4 py-2 text-sm font-medium ${tab === "fulfilled" ? "bg-blue-600 text-white" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
            Fulfilled ({store.referrals.filter((r) => r.status === "fulfilled").length})
          </button>
        </div>
        <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className={inputCls + " w-36"}>
          <option value="">All States</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className={inputCls + " w-44"}>
          <option value="">All Industries</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? "Cancel" : "+ Post Referral"}
        </button>
      </div>

      {/* New Referral Form */}
      {showForm && (
        <ReferralForm
          onSave={(data) => {
            createReferral(data, currentUser!.id);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">No {tab} referrals found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <ReferralCard
              key={r.id}
              referral={r}
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
              onRespond={(msg) => respondToReferral(r.id, currentUser!.id, msg)}
              onFulfill={() => markReferralFulfilled(r.id)}
              onDelete={() => deleteReferral(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReferralCard({ referral, expanded, onToggle, onRespond, onFulfill, onDelete }: {
  referral: Referral;
  expanded: boolean;
  onToggle: () => void;
  onRespond: (msg: string) => void;
  onFulfill: () => void;
  onDelete: () => void;
}) {
  const { store, currentUser } = useApp();
  const poster = store.users.find((u) => u.id === referral.userId);
  const isOwner = currentUser?.id === referral.userId;
  const [response, setResponse] = useState("");
  const [showResponseForm, setShowResponseForm] = useState(false);

  const submitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    onRespond(response);
    setResponse("");
    setShowResponseForm(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{referral.title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{referral.industry}</span>
              <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full">{referral.state}</span>
              {referral.status === "fulfilled" && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">✓ Fulfilled</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isOwner && referral.status === "open" && (
              <button
                onClick={() => setShowResponseForm((v) => !v)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                I can help
              </button>
            )}
            {isOwner && referral.status === "open" && (
              <button onClick={onFulfill} className="text-xs text-green-600 hover:underline">Mark Fulfilled</button>
            )}
            {isOwner && (
              <button onClick={onDelete} className="text-xs text-red-500 hover:underline">Delete</button>
            )}
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{referral.description}</p>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {getInitials(poster?.fullName ?? "?")}
            </span>
            <span>{poster?.fullName}</span>
            <span>·</span>
            <span>{formatDate(referral.createdAt)}</span>
          </div>
          <button onClick={onToggle} className="text-blue-600 dark:text-blue-400 hover:underline">
            {referral.responses.length} response{referral.responses.length !== 1 ? "s" : ""} {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Response form */}
      {showResponseForm && (
        <form onSubmit={submitResponse} className="border-t border-neutral-100 dark:border-neutral-800 p-4 flex gap-2">
          <input
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="How can you help?"
            className={inputCls + " flex-1"}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Send</button>
        </form>
      )}

      {/* Responses */}
      {expanded && referral.responses.length > 0 && (
        <div className="border-t border-neutral-100 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
          {referral.responses.map((res) => {
            const responder = store.users.find((u) => u.id === res.userId);
            return (
              <div key={res.id} className="p-4 flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {getInitials(responder?.fullName ?? "?")}
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{responder?.fullName}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{res.message}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{formatDate(res.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReferralForm({ onSave, onCancel }: {
  onSave: (data: { title: string; description: string; industry: string; state: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ title: "", description: "", industry: "", state: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.industry || !form.state) return;
    onSave(form);
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6 space-y-3">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Post a Referral</h3>
      <input value={form.title} onChange={set("title")} placeholder="What do you need? *" className={inputCls} />
      <textarea value={form.description} onChange={set("description")} placeholder="Describe the opportunity or need *" className={inputCls + " resize-none"} rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <select value={form.state} onChange={set("state")} className={inputCls}>
          <option value="">State *</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={form.industry} onChange={set("industry")} className={inputCls}>
          <option value="">Industry *</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Post</button>
        <button type="button" onClick={onCancel} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-5 py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
