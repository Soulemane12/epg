"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { isValidEmail, isNonEmpty } from "@/lib/validators";
import { US_STATES, INDUSTRIES } from "@/lib/utils";

export default function ApplyPage() {
  const { applyForAccess } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", password: "", title: "",
    companyName: "", state: "", industry: "", bio: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isNonEmpty(form.fullName)) return setError("Full name is required.");
    if (!isValidEmail(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (!isNonEmpty(form.title)) return setError("Job title is required.");
    if (!isNonEmpty(form.companyName)) return setError("Company name is required.");
    if (!form.state) return setError("Please select your state.");
    if (!form.industry) return setError("Please select your industry.");

    setLoading(true);
    const result = applyForAccess(form);
    setLoading(false);
    if (result.ok) { setSubmitted(true); } else { setError(result.reason ?? "Application failed."); }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(45,138,95,0.12)", border: "1px solid rgba(45,138,95,0.18)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>Application Submitted</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>An EPG administrator will review your application. You will be notified once approved.</p>
          <div className="mt-6">
            <Link href="/login" className="btn-primary">Return to Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--sidebar-active-accent), #f0c48d)" }}>E</div>
            <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>EPG</span>
          </Link>
          <p className="mt-1 text-xs" style={{ color: "var(--text-3)" }}>Apply for Membership</p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-card)" }}>
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-base font-semibold" style={{ color: "var(--text-1)" }}>Request Access</h1>
            <Link href="/login" className="text-xs font-medium" style={{ color: "var(--primary-text)" }}>Already a member?</Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>Full Name *</label>
                <input value={form.fullName} onChange={set("fullName")} className="app-input" placeholder="Jane Smith" />
              </div>
              <div>
                <label className={lbl}>Job Title *</label>
                <input value={form.title} onChange={set("title")} className="app-input" placeholder="CEO" />
              </div>
            </div>

            <div>
              <label className={lbl}>Company Name *</label>
              <input value={form.companyName} onChange={set("companyName")} className="app-input" placeholder="Acme Corp" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>State *</label>
                <select value={form.state} onChange={set("state")} className="app-input">
                  <option value="">Select state</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Industry *</label>
                <select value={form.industry} onChange={set("industry")} className="app-input">
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>Email *</label>
                <input type="email" value={form.email} onChange={set("email")} className="app-input" placeholder="you@company.com" autoComplete="email" />
              </div>
              <div>
                <label className={lbl}>Password *</label>
                <input type="password" value={form.password} onChange={set("password")} className="app-input" placeholder="Min. 6 characters" autoComplete="new-password" />
              </div>
            </div>

            <div>
              <label className={lbl}>Bio <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span></label>
              <textarea value={form.bio} onChange={set("bio")} className="app-input resize-none" rows={3} placeholder="Brief professional background…" />
            </div>

            {error && <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                {loading ? "Submitting…" : "Submit Application"}
              </button>
              <Link href="/" className="btn-secondary">Back</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const lbl = "mb-1.5 block text-xs font-medium" as const;
