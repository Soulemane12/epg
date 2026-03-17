"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { getInitials, US_STATES, INDUSTRIES } from "@/lib/utils";

type SortMode = "newest" | "az" | "same_state";

export default function DirectoryPage() {
  const { store, currentUser } = useApp();
  const myProfile = store.profiles.find((p) => p.userId === currentUser?.id);

  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");

  const members = useMemo(() => {
    const approved = store.users.filter((u) => u.approvalStatus === "approved");

    const filtered = approved.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        const p = store.profiles.find((pr) => pr.userId === u.id);
        if (
          !u.fullName.toLowerCase().includes(q) &&
          !(p?.companyName?.toLowerCase().includes(q)) &&
          !p?.expertise?.some((e) => e.toLowerCase().includes(q))
        ) return false;
      }
      const p = store.profiles.find((pr) => pr.userId === u.id);
      if (filterState && p?.state !== filterState) return false;
      if (filterIndustry && p?.industry !== filterIndustry) return false;
      if (filterRole && u.role !== filterRole) return false;
      return true;
    });

    if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "az") {
      filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sort === "same_state") {
      // Same state first, then alphabetical within each bucket
      filtered.sort((a, b) => {
        const pa = store.profiles.find((p) => p.userId === a.id);
        const pb = store.profiles.find((p) => p.userId === b.id);
        const aMatch = pa?.state === myProfile?.state ? 0 : 1;
        const bMatch = pb?.state === myProfile?.state ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return a.fullName.localeCompare(b.fullName);
      });
    }

    return filtered;
  }, [store, search, filterState, filterIndustry, filterRole, sort, myProfile?.state]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, company, expertise…"
          className={inputCls + " flex-1 min-w-48"}
        />
        <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className={inputCls + " w-36"}>
          <option value="">All States</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className={inputCls + " w-44"}>
          <option value="">All Industries</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className={inputCls + " w-40"}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="executive">Executive</option>
          <option value="chapter_leader">Chapter Leader</option>
          <option value="member">Member</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className={inputCls + " w-40"}>
          <option value="newest">Newest First</option>
          <option value="az">A – Z</option>
          <option value="same_state">My State First</option>
        </select>
      </div>

      <p className="text-sm text-neutral-500 mb-4">{members.length} member{members.length !== 1 ? "s" : ""}</p>

      {members.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">No members match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((u) => {
            const p = store.profiles.find((pr) => pr.userId === u.id);
            return (
              <Link
                key={u.id}
                href={`/directory/${u.id}`}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {getInitials(u.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{u.fullName}</p>
                    <p className="text-xs text-neutral-500 truncate">{p?.title ?? "—"} · {p?.companyName ?? "—"}</p>
                  </div>
                </div>
                {p && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>📍</span> {p.state || "—"} · {p.industry || "—"}
                    </div>
                    {p.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.expertise.slice(0, 3).map((e) => (
                          <span key={e} className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">{e}</span>
                        ))}
                        {p.expertise.length > 3 && (
                          <span className="text-xs text-neutral-400">+{p.expertise.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputCls = "px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
