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
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.reason ?? "Application failed.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Application Submitted</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            An EPG administrator will review your application. You will be notified once approved.
          </p>
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm">
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">EPG</Link>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Apply for Membership</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-7">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Request Access</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Full Name *</label>
                <input value={form.fullName} onChange={set("fullName")} className={inputCls} placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Job Title *</label>
                <input value={form.title} onChange={set("title")} className={inputCls} placeholder="CEO" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Company Name *</label>
              <input value={form.companyName} onChange={set("companyName")} className={inputCls} placeholder="Acme Corp" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">State *</label>
                <select value={form.state} onChange={set("state")} className={inputCls}>
                  <option value="">Select state</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Industry *</label>
                <select value={form.industry} onChange={set("industry")} className={inputCls}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@company.com" autoComplete="email" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password *</label>
              <input type="password" value={form.password} onChange={set("password")} className={inputCls} placeholder="Min. 6 characters" autoComplete="new-password" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Bio <span className="text-neutral-400">(optional)</span></label>
              <textarea value={form.bio} onChange={set("bio")} className={inputCls + " resize-none"} rows={3} placeholder="Brief professional background…" />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
          Already a member?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
