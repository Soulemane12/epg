"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { can } from "@/lib/permissions";
import { formatDate, formatDateTime, US_STATES } from "@/lib/utils";
import { Event } from "@/types";

type View = "list" | "grid";

export default function EventsPage() {
  const { store, currentUser, createEvent, updateEvent, deleteEvent, toggleRsvp } = useApp();
  const [view, setView] = useState<View>("list");
  const [chapterFilter, setChapterFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const chapters = useMemo(() => {
    const set = new Set(store.events.map((e) => e.chapter));
    return ["", ...Array.from(set)];
  }, [store.events]);

  const filtered = useMemo(() => {
    const evs = chapterFilter
      ? store.events.filter((e) => e.chapter === chapterFilter)
      : store.events;
    return [...evs].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [store.events, chapterFilter]);

  // Group by month for list view
  const grouped = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const ev of filtered) {
      const key = new Date(ev.start).toLocaleDateString("en-US", { year: "numeric", month: "long" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [filtered]);

  const canManage = can(currentUser, "createEvent");

  return (
    <div className="max-w-5xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} className={inputCls + " w-44"}>
          <option value="">All Chapters</option>
          {chapters.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <button onClick={() => setView("list")} className={`px-3 py-2 text-sm ${view === "list" ? "bg-blue-600 text-white" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>List</button>
          <button onClick={() => setView("grid")} className={`px-3 py-2 text-sm ${view === "grid" ? "bg-blue-600 text-white" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>Cards</button>
        </div>
        {canManage && (
          <button onClick={() => { setEditingId(null); setShowForm(true); }} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + New Event
          </button>
        )}
      </div>

      {/* Event Form */}
      {showForm && (
        <EventForm
          initial={editingId ? store.events.find((e) => e.id === editingId) : undefined}
          onSave={(data) => {
            if (editingId) {
              updateEvent(editingId, data);
            } else {
              createEvent(data, currentUser!.id);
            }
            setShowForm(false);
            setEditingId(null);
          }}
          onCancel={() => { setShowForm(false); setEditingId(null); }}
        />
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Event List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">No events found.</div>
      ) : view === "list" ? (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([month, evs]) => (
            <div key={month}>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">{month}</h3>
              <div className="space-y-3">
                {evs.map((ev) => (
                  <EventListItem
                    key={ev.id}
                    event={ev}
                    onView={() => setSelectedEvent(ev)}
                    onEdit={canManage ? () => { setEditingId(ev.id); setShowForm(true); } : undefined}
                    onDelete={canManage ? () => deleteEvent(ev.id) : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onView={() => setSelectedEvent(ev)}
              onEdit={canManage ? () => { setEditingId(ev.id); setShowForm(true); } : undefined}
              onDelete={canManage ? () => deleteEvent(ev.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventListItem({ event, onView, onEdit, onDelete }: {
  event: Event; onView: () => void;
  onEdit?: () => void; onDelete?: () => void;
}) {
  const { currentUser, toggleRsvp } = useApp();
  const attending = event.attendees.includes(currentUser!.id);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-4">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-xs text-blue-700 dark:text-blue-300 font-bold">
          {new Date(event.start).toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="text-lg text-blue-700 dark:text-blue-300 font-bold leading-none">
          {new Date(event.start).getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{event.title}</p>
        <p className="text-sm text-neutral-500 mt-0.5">📍 {event.location} · {event.chapter}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{event.attendees.length} attending</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => toggleRsvp(event.id, currentUser!.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            attending
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-600"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {attending ? "✓ Going" : "RSVP"}
        </button>
        <button onClick={onView} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Details</button>
        {onEdit && <button onClick={onEdit} className="text-xs text-neutral-400 hover:underline">Edit</button>}
        {onDelete && <button onClick={onDelete} className="text-xs text-red-500 hover:underline">Delete</button>}
      </div>
    </div>
  );
}

function EventCard({ event, onView, onEdit, onDelete }: {
  event: Event; onView: () => void;
  onEdit?: () => void; onDelete?: () => void;
}) {
  const { currentUser, toggleRsvp } = useApp();
  const attending = event.attendees.includes(currentUser!.id);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-xs text-blue-700 dark:text-blue-300 font-bold">
            {new Date(event.start).toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-sm text-blue-700 dark:text-blue-300 font-bold leading-none">
            {new Date(event.start).getDate()}
          </span>
        </div>
        <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full">{event.chapter}</span>
      </div>
      <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{event.title}</p>
      <p className="text-xs text-neutral-500 mb-1">📍 {event.location}</p>
      <p className="text-xs text-neutral-400 mb-3">{event.attendees.length} attending</p>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => toggleRsvp(event.id, currentUser!.id)}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            attending
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {attending ? "✓ Going" : "RSVP"}
        </button>
        <button onClick={onView} className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2">Info</button>
        {onEdit && <button onClick={onEdit} className="text-xs text-neutral-400 hover:underline">Edit</button>}
        {onDelete && <button onClick={onDelete} className="text-xs text-red-500 hover:underline">Del</button>}
      </div>
    </div>
  );
}

function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const { store, currentUser, toggleRsvp } = useApp();
  const attending = event.attendees.includes(currentUser!.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{event.title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none">×</button>
        </div>
        <div className="space-y-2 mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>📅 {formatDateTime(event.start)} – {formatDateTime(event.end)}</p>
          <p>📍 {event.location}</p>
          <p>🏷 Chapter: {event.chapter}</p>
          <p>👥 {event.attendees.length} attending</p>
        </div>
        {event.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{event.description}</p>
        )}
        <div className="mb-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Attendees</p>
          <div className="flex flex-wrap gap-1">
            {event.attendees.map((uid) => {
              const u = store.users.find((u) => u.id === uid);
              return u ? (
                <span key={uid} className="bg-neutral-100 dark:bg-neutral-800 text-xs px-2 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300">{u.fullName}</span>
              ) : null;
            })}
          </div>
        </div>
        <button
          onClick={() => { toggleRsvp(event.id, currentUser!.id); onClose(); }}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            attending
              ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-200"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {attending ? "Cancel RSVP" : "RSVP to this event"}
        </button>
      </div>
    </div>
  );
}

function EventForm({ initial, onSave, onCancel }: {
  initial?: Event;
  onSave: (data: Omit<Event, "id" | "attendees" | "createdBy">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    location: initial?.location ?? "",
    start: initial?.start ? initial.start.slice(0, 16) : "",
    end: initial?.end ? initial.end.slice(0, 16) : "",
    chapter: initial?.chapter ?? "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.start || !form.end || !form.chapter.trim()) return;
    onSave({ ...form, start: new Date(form.start).toISOString(), end: new Date(form.end).toISOString() });
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6 space-y-3">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{initial ? "Edit Event" : "New Event"}</h3>
      <input value={form.title} onChange={set("title")} placeholder="Event title *" className={inputCls} />
      <textarea value={form.description} onChange={set("description")} placeholder="Description" className={inputCls + " resize-none"} rows={2} />
      <div className="grid grid-cols-2 gap-3">
        <input value={form.location} onChange={set("location")} placeholder="Location *" className={inputCls} />
        <input value={form.chapter} onChange={set("chapter")} placeholder="Chapter *" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-500 mb-1 block">Start *</label>
          <input type="datetime-local" value={form.start} onChange={set("start")} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-neutral-500 mb-1 block">End *</label>
          <input type="datetime-local" value={form.end} onChange={set("end")} className={inputCls} />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Save</button>
        <button type="button" onClick={onCancel} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-5 py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
