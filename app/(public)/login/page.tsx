"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";

export default function LoginPage() {
  const { login, seedDemoData, store, currentUser } = useApp();
  const router = useRouter();
  const params = useSearchParams();

  const enterDemo = () => {
    if (store.users.length === 0) seedDemoData();
    setTimeout(() => {
      login("admin@epg.com", "admin123");
      router.push("/dashboard");
    }, 50);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const statusMsg = params.get("status");

  useEffect(() => {
    if (currentUser?.approvalStatus === "approved") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.reason ?? "Sign in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">EPG</Link>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Executive Partners Group</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-7">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Sign In</h2>

          {statusMsg === "pending" && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 text-sm text-yellow-800 dark:text-yellow-200">
              Your application is pending admin approval.
            </div>
          )}
          {statusMsg === "rejected" && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-sm text-red-800 dark:text-red-200">
              Your application was not approved. Contact EPG for more information.
            </div>
          )}

          <button
            type="button"
            onClick={enterDemo}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors mb-4"
          >
            ⚡ Enter Demo — No Sign Up
          </button>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200 dark:border-neutral-700" /></div>
            <div className="relative flex justify-center text-xs text-neutral-400"><span className="bg-white dark:bg-neutral-900 px-2">or sign in with credentials</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
          Not a member?{" "}
          <Link href="/apply" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Apply for access
          </Link>
        </p>
        <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-2">
          <Link href="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
