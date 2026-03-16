"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./AppProvider";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, isHydrated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (currentUser.approvalStatus !== "approved") {
      router.replace("/login?status=" + currentUser.approvalStatus);
    }
  }, [currentUser, isHydrated, router]);

  if (!isHydrated) return null;
  if (!currentUser || currentUser.approvalStatus !== "approved") return null;

  return <>{children}</>;
}
