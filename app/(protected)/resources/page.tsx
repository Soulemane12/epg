"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { can } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { Resource } from "@/types";

type Category = Resource["category"] | "all";
const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "guidelines", label: "Guidelines" },
  { value: "forms", label: "Forms" },
  { value: "compliance", label: "Compliance" },
  { value: "training", label: "Training" },
  { value: "chapter_docs", label: "Chapter Docs" },
];

export default function ResourcesPage() {
  const { store, currentUser, deleteResource, createResource, trackDownload } = useApp();
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const canUpload = can(currentUser, "uploadResource");
  const canDelete = can(currentUser, "deleteAnyResource");

  const filtered = useMemo(() => {
    return store.resources.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [store.resources, category, search]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === c.value
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources…"
          className={inputCls + " flex-1 max-w-sm"}
        />
        {canUpload && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? "Cancel" : "+ Add Resource"}
          </button>
        )}
      </div>

      {showForm && canUpload && (
        <ResourceForm
          onSave={(data) => {
            createResource(data, currentUser!.id);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">No resources found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const downloadCount = store.resourceDownloads.filter((d) => d.resourceId === r.id).length;
            return (
              <div key={r.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                  {categoryIcon(r.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{r.title}</p>
                  {r.description && (
                    <p className="text-sm text-neutral-500 mt-0.5 line-clamp-2">{r.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackDownload(currentUser!.id, r.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-block"
                    >
                      Open / Download
                    </a>
                    <span className="text-xs text-neutral-400">{downloadCount} download{downloadCount !== 1 ? "s" : ""}</span>
                    <span className="text-xs text-neutral-400">{formatDate(r.createdAt)}</span>
                    {canDelete && (
                      <button onClick={() => deleteResource(r.id)} className="text-xs text-red-500 hover:underline ml-auto">Delete</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function categoryIcon(cat: Resource["category"]): string {
  const map: Record<Resource["category"], string> = {
    guidelines: "📋",
    forms: "📝",
    compliance: "⚖️",
    training: "🎓",
    chapter_docs: "📂",
  };
  return map[cat] ?? "📄";
}

function ResourceForm({ onSave, onCancel }: {
  onSave: (data: { title: string; description: string; category: Resource["category"]; fileUrl: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ title: "", description: "", category: "guidelines" as Resource["category"], fileUrl: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.fileUrl.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6 space-y-3">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Add Resource</h3>
      <input value={form.title} onChange={set("title")} placeholder="Title *" className={inputCls} />
      <textarea value={form.description} onChange={set("description")} placeholder="Description" className={inputCls + " resize-none"} rows={2} />
      <select value={form.category} onChange={set("category")} className={inputCls}>
        {(["guidelines","forms","compliance","training","chapter_docs"] as Resource["category"][]).map((c) => (
          <option key={c} value={c}>{c.replace("_", " ")}</option>
        ))}
      </select>
      <input value={form.fileUrl} onChange={set("fileUrl")} placeholder="/resources/filename.pdf *" className={inputCls} />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Save</button>
        <button type="button" onClick={onCancel} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-5 py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
