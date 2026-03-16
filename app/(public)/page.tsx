"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

export default function LandingPage() {
  const { seedDemoData, resetStore, login, currentUser, store } = useApp();
  const router = useRouter();

  const enterDemo = () => {
    // Seed if empty, then log in as admin
    if (store.users.length === 0) seedDemoData();
    // Give state a tick to settle, then log in
    setTimeout(() => {
      login("admin@epg.com", "admin123");
      router.push("/dashboard");
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5">
        <span className="text-2xl font-bold tracking-tight">EPG</span>
        <div className="flex items-center gap-3">
          {currentUser ? (
            <Link
              href="/dashboard"
              className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-blue-200 hover:text-white text-sm transition-colors">
                Sign In
              </Link>
              <Link
                href="/apply"
                className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                Apply for Access
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-600 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Connecting Executives Across All 50 States
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl">
          The Executive Partners Group Platform
        </h1>

        <p className="text-xl text-blue-200 max-w-2xl mb-10 leading-relaxed">
          A dedicated digital platform for EPG members to network, exchange referrals, collaborate on business, and grow together nationwide.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <button
            onClick={enterDemo}
            className="bg-green-500 hover:bg-green-400 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg"
          >
            ⚡ Enter Demo — No Sign Up
          </button>
          <Link
            href="/apply"
            className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
          >
            Apply for Membership
          </Link>
          <Link
            href="/login"
            className="border border-blue-400 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-blue-800 transition-colors"
          >
            Member Sign In
          </Link>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mb-20">
          {[
            { icon: "👥", label: "Member Directory" },
            { icon: "🤝", label: "Referral Exchange" },
            { icon: "📅", label: "Events Hub" },
            { icon: "💬", label: "Direct Messaging" },
            { icon: "📁", label: "Resource Center" },
            { icon: "📆", label: "1-on-1 Meetings" },
            { icon: "📰", label: "Professional Feed" },
            { icon: "⭐", label: "Leadership Team" },
          ].map((f) => (
            <div key={f.label} className="bg-blue-800/50 border border-blue-700 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-sm text-blue-100 font-medium">{f.label}</p>
            </div>
          ))}
        </div>

        {/* Demo controls */}
        <div className="bg-blue-900/60 border border-blue-700 rounded-2xl p-6 max-w-md w-full">
          <p className="text-sm text-blue-300 mb-4 font-medium">Demo Controls</p>
          <p className="text-xs text-blue-400 mb-4">
            Load sample data with 23 members, events, referrals, and more to explore the platform.
          </p>
          <div className="flex gap-3">
            <button
              onClick={seedDemoData}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              Load Demo Data
            </button>
            <button
              onClick={resetStore}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              Reset App
            </button>
          </div>
          <p className="text-xs text-blue-400 mt-3">
            After loading: sign in as <span className="font-mono text-blue-200">admin@epg.com</span> / <span className="font-mono text-blue-200">admin123</span>
          </p>
        </div>
      </main>

      <footer className="text-center py-6 text-blue-400 text-sm border-t border-blue-800">
        © 2026 Executive Partners Group. All rights reserved.
      </footer>
    </div>
  );
}
