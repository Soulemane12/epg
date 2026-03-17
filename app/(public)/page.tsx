"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

const FEATURES = [
  { label: "Member Directory", desc: "Search the national network by role, state, company, or expertise." },
  { label: "Referral Exchange", desc: "Turn warm introductions into active deal flow across chapters." },
  { label: "Events Hub", desc: "Track summits, chapter gatherings, and executive roundtables." },
  { label: "Direct Messaging", desc: "Move from discovery to conversation without leaving the platform." },
  { label: "1-on-1 Meetings", desc: "Request meetings with context, timing, and follow-through." },
  { label: "Resource Center", desc: "Keep chapter materials, forms, and training in one archive." },
];

export default function LandingPage() {
  const { seedDemoData, resetStore, login, currentUser, store } = useApp();
  const router = useRouter();

  const enterDemo = () => {
    if (store.users.length === 0) seedDemoData();
    setTimeout(() => { login("admin@epg.com", "admin123"); router.push("/dashboard"); }, 50);
  };

  const approvedMembers = store.users.filter((u) => u.approvalStatus === "approved").length;
  const openReferrals = store.referrals.filter((r) => r.status === "open").length;
  const upcomingEvents = store.events.filter((e) => new Date(e.start) > new Date()).length;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #1a3d38 0%, #102624 50%, #1e1510 100%)",
        color: "#fff7ee",
      }}
    >
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,233,207,0.08)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #d79a52, #f0c48d)" }}
          >
            E
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">EPG</p>
            <p className="text-xs leading-none mt-0.5" style={{ color: "rgba(255,244,229,0.5)" }}>Executive Partners Group</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link href="/dashboard" className="btn-primary">Open Dashboard</Link>
          ) : (
            <>
              <Link href="/login" style={{ color: "rgba(255,244,229,0.6)", fontSize: "0.875rem", fontWeight: 500 }}>Sign In</Link>
              <Link
                href="/apply"
                className="rounded-xl px-4 py-2 text-sm font-semibold"
                style={{ background: "rgba(255,244,229,0.1)", border: "1px solid rgba(255,244,229,0.14)", color: "#fff7ee" }}
              >
                Apply for Access
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: "rgba(215,154,82,0.12)", border: "1px solid rgba(215,154,82,0.22)", color: "#ffe2bc" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Private member platform · All 50 states
        </div>

        <h1
          className="mb-4 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl"
          style={{ letterSpacing: "-0.03em", fontFamily: "var(--font-display)" }}
        >
          Built for the EPG network. Not another generic dashboard.
        </h1>

        <p className="mb-8 max-w-xl text-base leading-relaxed" style={{ color: "rgba(255,244,229,0.65)" }}>
          Referrals, introductions, events, and member intelligence — in one private platform with the polish your network deserves.
        </p>

        <div className="mb-12 flex flex-wrap items-center gap-3">
          <button onClick={enterDemo} className="btn-primary">Enter Demo</button>
          <Link
            href="/apply"
            className="rounded-full px-5 py-2.5 text-sm font-semibold"
            style={{ background: "rgba(255,244,229,0.08)", border: "1px solid rgba(255,244,229,0.14)", color: "#fff7ee" }}
          >
            Request Membership
          </Link>
          <Link href="/login" className="text-sm font-medium" style={{ color: "rgba(255,244,229,0.45)" }}>
            Member Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "States", value: "50" },
            { label: "Active members", value: approvedMembers > 0 ? `${approvedMembers}` : "25+" },
            { label: "Open referrals", value: openReferrals > 0 ? `${openReferrals}` : "10" },
            { label: "Upcoming events", value: upcomingEvents > 0 ? `${upcomingEvents}` : "6" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: "rgba(255,248,239,0.06)", border: "1px solid rgba(255,233,207,0.1)" }}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,244,229,0.5)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,244,229,0.4)" }}>What the platform unlocks</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="rounded-2xl p-4"
                style={{
                  background: i % 2 === 0 ? "rgba(255,248,239,0.06)" : "rgba(43,106,95,0.1)",
                  border: "1px solid rgba(255,233,207,0.08)",
                }}
              >
                <p className="text-sm font-semibold text-white mb-1">{f.label}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,244,229,0.55)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo controls */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,248,239,0.05)", border: "1px solid rgba(255,233,207,0.1)" }}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,244,229,0.35)" }}>Demo Controls</p>
          <p className="mb-4 text-sm" style={{ color: "rgba(255,244,229,0.55)" }}>
            Load 25 sample members, events, referrals, and resources. Sign in as{" "}
            <span className="font-mono" style={{ color: "rgba(255,244,229,0.8)" }}>admin@epg.com</span> / <span className="font-mono" style={{ color: "rgba(255,244,229,0.8)" }}>admin123</span>
          </p>
          <div className="flex gap-2">
            <button onClick={seedDemoData} className="btn-primary">Load Demo Data</button>
            <button
              onClick={resetStore}
              className="rounded-full px-4 py-2.5 text-sm font-medium"
              style={{ background: "rgba(255,244,229,0.06)", border: "1px solid rgba(255,244,229,0.1)", color: "rgba(255,244,229,0.5)" }}
            >
              Reset App
            </button>
          </div>
        </div>
      </main>

      <footer className="px-6 py-5 text-center text-xs" style={{ borderTop: "1px solid rgba(255,233,207,0.06)", color: "rgba(255,244,229,0.25)" }}>
        © 2026 Executive Partners Group · Private member platform
      </footer>
    </div>
  );
}
