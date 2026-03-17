"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { US_STATES, INDUSTRIES } from "@/lib/utils";
import { Profile } from "@/types";

type ProfileForm = Omit<Profile, "userId">;

const BLANK: ProfileForm = {
  bio: "", expertise: [], companyName: "", title: "", phone: "",
  website: "", state: "", industry: "", specialties: [], photoUrl: "", videoUrl: "",
};

function completeness(form: ProfileForm): number {
  let filled = 0;
  if (form.bio.trim()) filled++;
  if (form.title.trim()) filled++;
  if (form.companyName.trim()) filled++;
  if (form.state) filled++;
  if (form.industry) filled++;
  if (form.phone.trim()) filled++;
  if (form.website.trim()) filled++;
  if (form.photoUrl.trim()) filled++;
  if (form.expertise.length > 0) filled++;
  if (form.specialties.length > 0) filled++;
  return Math.round((filled / 10) * 100);
}

export default function ProfilePage() {
  const { store, currentUser, updateProfile } = useApp();
  const existing = store.profiles.find((p) => p.userId === currentUser?.id);
  const [form, setForm] = useState<ProfileForm>(() => (existing ? { ...existing } : { ...BLANK }));
  const [expertiseInput, setExpertiseInput] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");

  useEffect(() => {
    if (!existing) return;
    const next = { ...existing };
    queueMicrotask(() => setForm(next));
  }, [existing]);

  const set = (k: keyof ProfileForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const addTag = (field: "expertise" | "specialties", value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(trimmed) ? p[field] : [...p[field], trimmed],
    }));
    if (field === "expertise") setExpertiseInput("");
    else setSpecialtyInput("");
  };

  const removeTag = (field: "expertise" | "specialties", tag: string) => {
    setForm((p) => ({ ...p, [field]: p[field].filter((t) => t !== tag) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(currentUser!.id, form);
  };

  const pct = completeness(form);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Profile Completeness</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{pct}%</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct < 100 && (
          <p className="text-xs text-neutral-500 mt-2">Complete your profile to be more discoverable in the directory.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Edit Profile</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Job Title</label>
            <input value={form.title} onChange={set("title")} className={inputCls} placeholder="CEO" />
          </div>
          <div>
            <label className={lbl}>Company Name</label>
            <input value={form.companyName} onChange={set("companyName")} className={inputCls} placeholder="Acme Corp" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>State</label>
            <select value={form.state} onChange={set("state")} className={inputCls}>
              <option value="">Select state</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Industry</label>
            <select value={form.industry} onChange={set("industry")} className={inputCls}>
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={lbl}>Bio</label>
          <textarea value={form.bio} onChange={set("bio")} className={inputCls + " resize-none"} rows={4} placeholder="Brief professional background…" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Phone</label>
            <input value={form.phone} onChange={set("phone")} className={inputCls} placeholder="555-0100" />
          </div>
          <div>
            <label className={lbl}>Website</label>
            <input value={form.website} onChange={set("website")} className={inputCls} placeholder="https://yoursite.com" />
          </div>
        </div>

        <div>
          <label className={lbl}>Photo URL</label>
          <input value={form.photoUrl} onChange={set("photoUrl")} className={inputCls} placeholder="/avatars/photo.jpg" />
          <p className="text-xs text-neutral-400 mt-1">Place your photo in /public/avatars/ and reference it as /avatars/filename.jpg</p>
        </div>

        <div>
          <label className={lbl}>Intro Video URL</label>
          <input value={form.videoUrl} onChange={set("videoUrl")} className={inputCls} placeholder="https://youtube.com/..." />
        </div>

        {/* Tags */}
        <div>
          <label className={lbl}>Areas of Expertise</label>
          <div className="flex gap-2">
            <input
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("expertise", expertiseInput))}
              className={inputCls}
              placeholder="e.g. Venture Capital"
            />
            <button type="button" onClick={() => addTag("expertise", expertiseInput)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.expertise.map((t) => (
              <span key={t} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                {t}
                <button type="button" onClick={() => removeTag("expertise", t)} className="hover:text-red-600 ml-1">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className={lbl}>Specialties</label>
          <div className="flex gap-2">
            <input
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("specialties", specialtyInput))}
              className={inputCls}
              placeholder="e.g. M&A"
            />
            <button type="button" onClick={() => addTag("specialties", specialtyInput)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.specialties.map((t) => (
              <span key={t} className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                {t}
                <button type="button" onClick={() => removeTag("specialties", t)} className="hover:text-red-600 ml-1">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}

const lbl = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5";
const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
