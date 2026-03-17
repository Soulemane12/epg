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
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.ok) { router.push("/dashboard"); } else { setError(result.reason ?? "Sign in failed."); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--sidebar-active-accent), #f0c48d)" }}
            >
              E
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>EPG</span>
          </Link>
          <p className="mt-1 text-xs" style={{ color: "var(--text-3)" }}>Executive Partners Group</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-card)" }}>
          <h1 className="mb-5 text-base font-semibold" style={{ color: "var(--text-1)" }}>Sign In</h1>

          {statusMsg === "pending" && (
            <div className="mb-4 rounded-xl px-3 py-2.5 text-xs font-medium" style={{ background: "rgba(178,118,39,0.1)", border: "1px solid rgba(178,118,39,0.18)", color: "#94611e" }}>
              Your application is pending admin approval.
            </div>
          )}
          {statusMsg === "rejected" && (
            <div className="mb-4 rounded-xl px-3 py-2.5 text-xs font-medium" style={{ background: "rgba(180,84,74,0.08)", border: "1px solid rgba(180,84,74,0.14)", color: "var(--danger)" }}>
              Your application was not approved. Contact EPG for more information.
            </div>
          )}

          {/* Demo credentials hint */}
          <div className="mb-4 rounded-xl p-3 text-xs" style={{ background: "rgba(215,154,82,0.08)", border: "1px solid rgba(215,154,82,0.14)" }}>
            <p className="font-semibold mb-1" style={{ color: "var(--primary-text)" }}>Demo credentials</p>
            <p style={{ color: "var(--text-2)" }}>
              <span className="font-mono">admin@epg.com</span> / <span className="font-mono">admin123</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-2)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="app-input"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-2)" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="app-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</p>}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                {loading ? "Signing in…" : "Sign In"}
              </button>
              <button type="button" onClick={enterDemo} className="btn-secondary flex-1">
                Enter Demo
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--text-3)" }}>
          Not a member?{" "}
          <Link href="/apply" className="font-medium" style={{ color: "var(--primary-text)" }}>Apply for access</Link>
        </p>
        <p className="mt-2 text-center text-xs">
          <Link href="/" style={{ color: "var(--text-3)" }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
