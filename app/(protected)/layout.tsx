import { RouteGuard } from "@/components/providers/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <AppShell>{children}</AppShell>
    </RouteGuard>
  );
}
